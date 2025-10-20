import { APIRequestContext, request, APIResponse } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";
import * as fs from "fs";

dotenv.config();

interface AuthResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
  data: {
    accessToken: string;
    refreshToken: string;
    idToken: string;
    expiresIn: number;
    email: string;
    userId: string;
  };
}

export class ApiClient {
  private apiContext!: APIRequestContext;
  private token: string | null = null;
  private baseURL: string;
  private signinURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.signinURL =
      process.env.API_SIGNIN_URL || "/account_service_v2/api/v1/auth/signin";
  }

  async init(): Promise<void> {
    this.apiContext = await request.newContext({
      baseURL: this.baseURL,
      extraHTTPHeaders: {
        Accept: "application/json",
      },
    });
  }

  async authenticate(email: string, password: string): Promise<void> {
    const response: APIResponse = await this.apiContext.post(this.signinURL, {
      data: { email, password },
    });

    const textBody = await response.text();

    if (!response.ok()) {
      throw new Error(
        `Auth failed: ${response.status()} ${response.statusText()}`
      );
    }

    const body: AuthResponse = JSON.parse(textBody);

    this.token = body.data.accessToken;
    if (!this.token)
      throw new Error("Auth failed: no access token found in response");
  }
  
  private getHeaders(contentType = "application/json"): Record<string, string> {
    if (!this.token) throw new Error("Token is not set");

    return {
      Authorization: `Bearer ${this.token}`,
      ...(contentType ? { "Content-Type": contentType } : {}),
    };
  }

  async get(endpoint: string): Promise<APIResponse> {
    if (!this.token) {
      throw new Error("Token is not set.");
    }

    return this.apiContext.get(endpoint, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
  }

  async dispose(): Promise<void> {
    await this.apiContext.dispose();
  }

  async patch<T>(endpoint: string, body: unknown): Promise<APIResponse> {
    if (!this.token) {
      throw new Error("Token is not set. Please authenticate first.");
    }

    const response = await this.apiContext.patch(endpoint, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      data: body,
    });

    return response;
  }

  async post(endpoint: string, body?: object): Promise<Response> {
    return fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
  }

async postMultipart(
  endpoint: string,
  { fieldName, filePath }: { fieldName: string; filePath: string }
): Promise<APIResponse> {
  if (!this.token) throw new Error("Token is not set");
  if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`);

  const fileBuffer = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);

  const response = await this.apiContext.post(endpoint, {
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

  if (!response.ok()) {
    console.error(
      `Upload failed: ${response.status()} ${response.statusText()}`
    );
    console.log(await response.text());
  } else {
    console.log("Photo uploaded successfully!");
  }

  return response;
}

}
