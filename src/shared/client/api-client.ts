import { config } from "@config/appConfig";
import { APIRequestContext, APIResponse, Browser, BrowserContext, chromium } from "@playwright/test";
import * as fs from "fs";
import * as http from "http";
import * as https from "https";
import { URL } from "url";
import { Logger } from "../utils/logger";
import { performanceTracker } from "../utils/performance-tracker";

interface RefreshResponse {
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken?: string;
  };
}

/**
 * API Client
 * 
 * Shared HTTP client for all API tests with authentication and token refresh.
 */
export class ApiClient {
  private apiContext!: APIRequestContext;
  private browser!: Browser;
  private browserContext!: BrowserContext;
  private token: string | null = null;
  private refreshToken: string | null = null;
  private baseURL: string;
  private refreshURL: string;
  private enablePerformanceTracking: boolean;
  
  constructor(baseURL: string, options?: { enablePerformanceTracking?: boolean }) {
    this.baseURL = baseURL;
    this.refreshURL = config.endpoints.refreshToken;
    this.enablePerformanceTracking = options?.enablePerformanceTracking ?? true;
  }

  async init(): Promise<void> {
    // Launch Chromium browser and create a browser context
    // This ensures requests come from a real browser instance
    this.browser = await chromium.launch({
      headless: true, // Run in headless mode for API testing
    });

    // Create a browser context - this shares cookies and session data
    this.browserContext = await this.browser.newContext({
      baseURL: this.baseURL,
    });

    // Use the browser context's request property for API calls
    // This makes requests look like they're coming from a real browser
    this.apiContext = this.browserContext.request;
  
    // Use phone-based signin (hack: returns token without code verification)
    if (process.env.API_ACCESS_TOKEN) {
      // Use access token directly if provided
      this.token = process.env.API_ACCESS_TOKEN;
    } else {
      await this.loginWithPhone(config.auth.phone);
    }
  }  
  
  setToken(token: string): void {
    this.token = token;
  }

  private getHeaders(contentType = "application/json"): Record<string, string> {
    if (!this.token) throw new Error("Token is not set");
    return {
      Authorization: `Bearer ${this.token}`,
      Accept: "application/json",
      ...(contentType ? { "Content-Type": contentType } : {}),
    };
  }

  private async handleAuth(
    method: "get" | "post" | "patch" | "delete",
    endpoint: string,
    options: any = {},
    allowRefresh = true
  ): Promise<APIResponse> {
    const startTime = Date.now();
    let response: APIResponse;

    // Make the request directly - no retries
    if (!this.token) {
      Logger.error(`No token available for ${method.toUpperCase()} ${endpoint}`);
      throw new Error("Token is not set");
    }
    
    // Ensure Authorization header is always included and takes precedence
    // Format: Authorization: "Bearer $token"
    const authHeaders = this.getHeaders(options.contentType);
    const headers = {
      ...(options.headers || {}),
      ...authHeaders, // Authorization header takes precedence
    };
    
    // Verify Authorization header format
    if (!headers.Authorization || !headers.Authorization.startsWith('Bearer ')) {
      Logger.error('Authorization header is missing or incorrectly formatted', { 
        hasAuth: !!headers.Authorization,
        format: headers.Authorization 
      });
      throw new Error('Authorization header must be in format: "Bearer $token"');
    }
    
    Logger.info(`Making ${method.toUpperCase()} request with Authorization header`, {
      endpoint,
      hasToken: !!this.token,
      tokenLength: this.token?.length || 0,
    });
    
    try {
      response = await (this.apiContext as any)[method](endpoint, {
        ...options,
        headers,
      });
    } catch (err) {
      throw new Error(`Request failed: ${err}`);
    }

    // Track performance if enabled
    if (this.enablePerformanceTracking) {
      const duration = Date.now() - startTime;
      const status = response.status();
      performanceTracker.record(endpoint, method.toUpperCase(), duration, status);
      Logger.apiRequest(method.toUpperCase(), endpoint, status, duration);
    }

    if (!allowRefresh) {
      return response;
    }

    if (response.status() === 401 && this.refreshToken) {
      Logger.warn("🔁 Token expired, attempting refresh...");
      try {
        await this.refreshAccessToken();
      } catch (err) {
        Logger.error("Token refresh failed", { error: err instanceof Error ? err.message : String(err) });
        return response;
      }

      return this.handleAuth(method, endpoint, options, false);
    }

    return response;
  }

  async loginWithPhone(phone: string): Promise<void> {
    const signInEndpoint = config.endpoints.signin;
    
    if (!phone || phone.trim() === '') {
      throw new Error('Phone number is required for signin but was empty or undefined');
    }
    
    Logger.info(`Attempting phone signin with phone: ${phone.substring(0, 4)}***`);
    
    const payload = { phoneNumber: phone };
    const fullUrl = `${this.baseURL}${signInEndpoint}`;
    Logger.info(`Signin request: POST ${fullUrl}`, { payload });
    
    // Use Node.js https module directly since Playwright's APIRequestContext gets 403
    // This matches the working curl/Postman requests
    const body = await this.makeDirectHttpRequest(fullUrl, payload);
  
    if (!body.data?.accessToken) {
      Logger.error('Phone signin succeeded but no access token in response', { response: body });
      throw new Error('Phone signin succeeded but response missing accessToken');
    }
  
    this.token = body.data.accessToken;
    this.refreshToken = body.data.refreshToken;
  
    Logger.info("Logged in successfully via phone and tokens stored", {
      tokenLength: this.token?.length || 0,
      hasRefreshToken: !!this.refreshToken,
    });
    
    // Immediately refresh the token using Playwright to get a fresh access token
    if (this.refreshToken) {
      Logger.info("Refreshing token immediately after signin using Playwright...");
      try {
        await this.refreshAccessToken();
        Logger.info("Token refreshed successfully after signin via Playwright");
      } catch (error) {
        Logger.warn("Failed to refresh token after signin, using original token", {
          error: error instanceof Error ? error.message : String(error)
        });
        // Continue with original token if refresh fails
      }
    }
  }

  /**
   * Makes a direct HTTP request using Node.js https module
   * This bypasses Playwright's APIRequestContext which gets blocked by the API
   */
  private async makeDirectHttpRequest(url: string, payload: Record<string, unknown>): Promise<any> {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const payloadString = JSON.stringify(payload);
      
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
        path: urlObj.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Content-Length': Buffer.byteLength(payloadString),
        },
      };

      const client = urlObj.protocol === 'https:' ? https : http;
      
      const req = client.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const json = JSON.parse(data);
              resolve(json);
            } catch (error) {
              reject(new Error(`Failed to parse response: ${error}`));
            }
          } else {
            const errorText = data || `HTTP ${res.statusCode}`;
            Logger.error(`Phone signin failed: ${res.statusCode}`, { 
              error: errorText, 
              status: res.statusCode
            });
            reject(new Error(`Phone signin failed: ${res.statusCode} - ${errorText}`));
          }
        });
      });

      req.on('error', (error) => {
        Logger.error('Phone signin request error', { error: error.message });
        reject(new Error(`Phone signin request failed: ${error.message}`));
      });

      req.write(payloadString);
      req.end();
    });
  }
  
  async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) throw new Error("No refresh token available");

    const cleanToken = this.refreshToken.replace(/^Bearer\s+/, "");
    const refreshEndpoint = this.refreshURL;

    Logger.info(`Refreshing token via Playwright: POST ${this.baseURL}${refreshEndpoint}`);

    const response = await this.apiContext.post(refreshEndpoint, {
      data: { refreshToken: cleanToken },
      headers: {
        "Content-Type": "application/json",
        // Accept header already set in context extraHTTPHeaders (browser-like)
      },
    });

    if (!response.ok()) {
      const text = await response.text();
      Logger.error(`Token refresh failed: ${response.status()}`, { error: text });
      throw new Error(`Refresh token failed: ${response.status()} - ${text}`);
    }

    const body: RefreshResponse = await response.json();
    
    if (!body.data?.accessToken) {
      Logger.error('Token refresh succeeded but no access token in response', { response: body });
      throw new Error('Token refresh succeeded but response missing accessToken');
    }
    
    this.token = body.data.accessToken;
    if (body.data.refreshToken) {
      this.refreshToken = body.data.refreshToken;
    }

    Logger.info("Access token refreshed successfully via Playwright", {
      tokenLength: this.token?.length || 0,
      hasNewRefreshToken: !!body.data.refreshToken,
    });
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
    const startTime = Date.now();
    
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

    // Track performance for multipart uploads
    if (this.enablePerformanceTracking) {
      const duration = Date.now() - startTime;
      performanceTracker.record(endpoint, 'POST', response.status(), duration);
      Logger.apiRequest('POST', endpoint, response.status(), duration);
    }

    if (response.status() === 401 && allowRefresh && this.refreshToken) {
      Logger.warn("Skipping token refresh for multipart uploads.");
      return response;
    }

    return response;
  }

  async dispose(): Promise<void> {
    // Close browser context first
    if (this.browserContext) {
      await this.browserContext.close();
    }
    // Then close the browser
    if (this.browser) {
      await this.browser.close();
    }
  }
}

