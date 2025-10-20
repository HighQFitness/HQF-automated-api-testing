import { APIRequestContext, request, APIResponse } from "@playwright/test";
import dotenv from "dotenv";
import * as fs from "fs";
import FormData from "form-data";

dotenv.config();

interface RefreshResponse {
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken?: string;
  };
}

export class ApiClient {
  private apiContext!: APIRequestContext;
  private token: string | null = null;
  private refreshToken: string | null = null;
  private baseURL: string;
  private refreshURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.refreshURL =
      process.env.API_REFRESH_URL || "/api/v1/auth/refresh";
  }

  async init(): Promise<void> {
    this.apiContext = await request.newContext({
      baseURL: this.baseURL,
      extraHTTPHeaders: {
        Accept: "application/json",
      },
    });

    this.token = process.env.API_ACCESS_TOKEN || null;
    this.refreshToken = process.env.API_REFRESH_TOKEN || null;
  }

  setToken(token: string): void {
    this.token = token;
  }

  private getHeaders(contentType = "application/json"): Record<string, string> {
    if (!this.token) throw new Error("Token is not set");
    return {
      Authorization: `Bearer ${this.token}`,
      ...(contentType ? { "Content-Type": contentType } : {}),
    };
  }

  // --- CORE METHOD WRAPPER ---
  private async handleAuth<T>(
    method: "get" | "post" | "patch",
    endpoint: string,
    options: any = {}
  ): Promise<APIResponse> {
    let response: APIResponse;

    try {
      response = await (this.apiContext as any)[method](endpoint, {
        ...options,
        headers: {
          ...this.getHeaders(options.contentType),
          ...(options.headers || {}),
        },
      });
    } catch (err) {
      throw new Error(`Request failed: ${err}`);
    }

    if (response.status() === 401 && this.refreshToken) {
      console.warn("🔁 Token expired, refreshing...");
      await this.refreshAccessToken();

      // Retry once with new token
      response = await (this.apiContext as any)[method](endpoint, {
        ...options,
        headers: {
          ...this.getHeaders(options.contentType),
          ...(options.headers || {}),
        },
      });
    }

    return response;
  }

  async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) throw new Error("No refresh token available");

    const response = await this.apiContext.post(this.refreshURL, {
      data: { refreshToken: this.refreshToken },
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok()) {
      throw new Error(`Refresh token failed: ${response.status()}`);
    }

    const body: RefreshResponse = await response.json();
    this.token = body.data.accessToken;

    if (body.data.refreshToken) {
      this.refreshToken = body.data.refreshToken;
    }

    console.log("✅ Access token refreshed successfully");
  }

  async get(endpoint: string): Promise<APIResponse> {
    return this.handleAuth("get", endpoint);
  }

  async post(endpoint: string, body?: object): Promise<APIResponse> {
    return this.handleAuth("post", endpoint, { data: body });
  }

  async patch(endpoint: string, body: unknown): Promise<APIResponse> {
    return this.handleAuth("patch", endpoint, { data: body });
  }

  async postMultipart(
    endpoint: string,
    { fieldName, filePath }: { fieldName: string; filePath: string }
  ): Promise<APIResponse> {
    if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`);

    const form = new FormData();
    form.append(fieldName, fs.createReadStream(filePath));

    const headers = { Authorization: `Bearer ${this.token}` };
    return this.handleAuth("post", endpoint, { headers, multipart: form });
  }

  async dispose(): Promise<void> {
    await this.apiContext.dispose();
  }
}
