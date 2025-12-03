import { APIRequestContext, request, APIResponse } from "@playwright/test";
import dotenv from "dotenv";
import * as fs from "fs";

dotenv.config();

interface ChangePhoneRequest {
  phone: string;
};
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
    this.refreshURL = process.env.API_REFRESH_URL || "/api/v1/auth/refresh";
    console.log("BASE URL:", this.baseURL);
  }

  async init(): Promise<void> {
    this.apiContext = await request.newContext({
      baseURL: this.baseURL,
      extraHTTPHeaders: { Accept: "application/json" },
    });
  
    const email = process.env.API_EMAIL;
    const password = process.env.API_PASSWORD;
  
    if (!email || !password) {
      throw new Error("Missing API_EMAIL or API_PASSWORD in environment variables");
    }
  
    await this.loginWithEmailPassword(email, password);
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

  private async handleAuth(
    method: "get" | "post" | "patch" | "delete",
    endpoint: string,
    options: any = {},
    allowRefresh = true
  ): Promise<APIResponse> {
    let response: APIResponse;

    try {
      response = await (this.apiContext as any)[method](, {
        ...options,
        headers: {
          ...this.getHeaders(options.contentType),
          ...(options.headers || {}),
        },
      });
    } catch (err) {
      throw new Error(`Request failed: ${err}`);
    }

    if (!allowRefresh) {
      return response;
    }

    if (response.status() === 401 && this.refreshToken) {
      console.warn("🔁 Token expired, attempting refresh...");
      try {
        await this.refreshAccessToken();
      } catch (err) {
        console.error("Token refresh failed:", err);
        return response;
      }

      return this.handleAuth(method, endpoint, options, false);
    }

    return response;
  }

  async loginWithEmailPassword(email: string, password: string): Promise<void> {
    const signInEndpoint = process.env.API_SIGNIN_URL!;
    const response = await this.apiContext.post(signInEndpoint, {
      data: { email, password },
      headers: { "Content-Type": "application/json" },
    });
  
    if (!response.ok()) {
      throw new Error(`Login failed: ${response.status()} - ${await response.text()}`);
    }
  
    const body = await response.json();
  
    this.token = body.data.accessToken;
    this.refreshToken = body.data.refreshToken;
  
    console.log("Logged in successfully and tokens stored");
  }
  
  async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) throw new Error("No refresh token available");

    const cleanToken = this.refreshToken.replace(/^Bearer\s+/, "");

    const response = await this.apiContext.post(this.refreshURL, {
      data: { refreshToken: cleanToken },
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok()) {
      const text = await response.text();
      throw new Error(`Refresh token failed: ${response.status()} - ${text}`);
    }

    const body: RefreshResponse = await response.json();
    this.token = body.data.accessToken;
    if (body.data.refreshToken) this.refreshToken = body.data.refreshToken;

    console.log("Access token refreshed successfully");
  }

  async get(endpoint: string, allowRefresh = true): Promise<APIResponse> {
  console.log("THIS IS GET ENDPOINT:", endpoint);
  return this.handleAuth("get", endpoint, {}, allowRefresh);
}

  async delete(endpoint: string, allowRefresh = true): Promise<APIResponse> {
    return this.handleAuth("delete", endpoint, {}, allowRefresh);
  }

  async post(
    endpoint: string,
    body?: object,
    allowRefresh = true
  ): Promise<APIResponse> {
    return this.handleAuth("post", endpoint, { data: body }, allowRefresh);
  }

  async patch(
    endpoint: string,
    body: unknown,
    allowRefresh = true
  ): Promise<APIResponse> {
    return this.handleAuth("patch", endpoint, { data: body }, allowRefresh);
  }

  async postMultipart(
    endpoint: string,
    { fieldName, filePath }: { fieldName: string; filePath: string },
    allowRefresh = true
  ): Promise<APIResponse> {
    if (!this.token) throw new Error("Token is not set");
    if (!fs.existsSync(filePath))
      throw new Error(`File not found: ${filePath}`);

    const fileBuffer = fs.readFileSync(filePath);
    const fileName = filePath.split("/").pop() || "upload.jpg";

    let response: APIResponse;

    try {
      response = await this.apiContext.post(endpoint, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        multipart: {
          [fieldName]: {
            name: fileName,
            mimeType: "image/jpeg",
            buffer: fileBuffer,
          },
        },
      });
    } catch (err) {
      throw new Error(`Multipart request failed: ${err}`);
    }

    if (response.status() === 401 && allowRefresh && this.refreshToken) {
      console.warn("Skipping token refresh for multipart uploads.");
      return response;
    }

    return response;
  }

  async dispose(): Promise<void> {
    await this.apiContext.dispose();
  }
  
}
