import { APIRequestContext, request, APIResponse } from "@playwright/test";
import dotenv from "dotenv";
import * as fs from "fs";
import { config } from "../../../config/appConfig";
import { Logger } from "@shared/utils/logger";

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
  }

  async init(): Promise<void> {
    this.apiContext = await request.newContext({
      baseURL: this.baseURL,
      extraHTTPHeaders: {
        Accept: "application/json",
      },
    });
  
    // -----------------------------------
    // OPTION 1: Environment-provided token
    // -----------------------------------
    if (process.env.API_ACCESS_TOKEN) {
      this.token = process.env.API_ACCESS_TOKEN;
      Logger.info("Using API_ACCESS_TOKEN from environment");
      return;
    }
  
    // -----------------------------------
    // OPTION 2: Phone-based login (new flow)
    // -----------------------------------
    if (config.auth?.phone) {
      Logger.info("Attempting phone-based login...");
      await this.loginWithPhone(config.auth.phone);
      return;
    }
  
    // -----------------------------------
    // OPTION 3: Fallback to email/password
    // -----------------------------------
    const email = process.env.API_EMAIL;
    const password = process.env.API_PASSWORD;
  
    if (email && password) {
      Logger.info("Attempting email/password login...");
      await this.loginWithEmailPassword(email, password);
      return;
    }
  
    // -----------------------------------
    // No authentication method available
    // -----------------------------------
    throw new Error(
      "No authentication method available. Provide API_ACCESS_TOKEN, config.auth.phone, or API_EMAIL/API_PASSWORD."
    );
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
    if (!this.apiContext) throw new Error("API Context not initialized");
  
    const url = this.buildUrl(endpoint);
  
    const requestOptions = {
      ...options,
      headers: {
        ...(options.headers || {}),
        "Content-Type": "application/json",
        ...this.buildAuthHeaders(),
      },
    };
  
    try {
      const response = await (this.apiContext as any)[method](url, requestOptions);
  
      if (!allowRefresh || response.status() !== 401) {
        return response;
      }
  
      console.warn("Token expired, refreshing...");
  
      await this.refreshAccessToken();
  
      // retry request ONCE
      return await (this.apiContext as any)[method](url, requestOptions);
  
    } catch (err: any) {
      throw new Error(`Request failed: ${err}`);
    }
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
  
  private buildUrl(endpoint: string): string {
    if (!endpoint) {
      throw new Error(`Endpoint is invalid: "${endpoint}"`);
    }
  
    if (endpoint.startsWith("http")) {
      return endpoint;
    }
  
    if (!this.baseURL) {
      throw new Error("Base URL is not defined");
    }
  
    return `${this.baseURL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
  }
  
  private buildAuthHeaders(): Record<string, string> {
    if (!this.token) {
      throw new Error("Token is not set");
    }
  
    return {
      Authorization: `Bearer ${this.token}`,
    };
  }
  
  public async loginWithPhone(phone: string): Promise<void> {
    Logger.info("Attempting phone-based login...");
  
    const url = `${this.baseURL}${config.endpoints.signin}`;
    const payload = { phoneNumber: phone };
  
    const response = await this.makeDirectHttpRequest(url, payload);
  
    // FIX: Access nested token
    const accessToken = response?.data?.data?.accessToken;
    const refreshToken = response?.data?.data?.refreshToken;
  
    if (!accessToken) {
      Logger.error("Phone signin failed, no accessToken returned", { body: response });
      throw new Error("Phone signin succeeded but response missing accessToken");
    }
  
    this.token = accessToken;
    this.refreshToken = refreshToken;
  
    Logger.info("Phone signin success, token stored.");
    console.log("BASE_URL:", this.baseURL);
    console.log("FULL:", url);

  }
  
  
  private async makeDirectHttpRequest(
    url: string,
    payload?: Record<string, unknown>,
    headers: Record<string, string> = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const urlObj = new URL(url.trim());
        const isHttps = urlObj.protocol === "https:";
  
        const dataString = payload ? JSON.stringify(payload) : "";
  
        // Final headers MUST be string values only
        const finalHeaders: Record<string, string> = {
          Accept: "application/json",
          ...headers,
        };
  
        if (payload) {
          finalHeaders["Content-Type"] = "application/json";
          finalHeaders["Content-Length"] = Buffer.byteLength(dataString).toString();
        }
  
        const options: any = {
          hostname: urlObj.hostname,
          port: urlObj.port || (isHttps ? 443 : 80),
          path: urlObj.pathname + urlObj.search,
          method: payload ? "POST" : "GET",
          headers: finalHeaders,
        };
  
        const client = isHttps ? require("https") : require("http");
  
        const req = client.request(options, (res: any) => {
          let raw = "";
  
          res.on("data", (chunk: any) => {
            raw += chunk;
          });
  
          res.on("end", () => {
            let parsed;
  
            // Try parse JSON
            try {
              parsed = raw ? JSON.parse(raw) : {};
            } catch (err: any) {
              Logger.error("Failed to parse JSON response", {
                error: err.message,
                raw,
              });
              return reject(
                new Error(`Failed to parse JSON: ${err.message}, Response: ${raw}`)
              );
            }
  
            // // Log HTTP response
            // Logger.info(`HTTP ${options.method} ${url} → ${res.statusCode}`, {
            //   request: payload,
            //   response: parsed,
            // });
  
            // Resolve ANY response (success or not)
            resolve({
              status: res.statusCode,
              data: parsed,
            });
          });
        });
  
        req.on("error", (error: any) => {
          Logger.error("Raw HTTP request error", {
            error: error.message,
            url,
          });
          reject(new Error(error.message));
        });
  
        if (payload) {
          Logger.info(`HTTP ${options.method} ${url}`, {
            headers: finalHeaders,
            payload,
          });
  
          req.write(dataString);
        }
  
        req.end();
      } catch (err: any) {
        reject(new Error(`makeDirectHttpRequest failed: ${err.message}`));
      }
    });
  }  
  
}