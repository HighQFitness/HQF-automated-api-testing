import { test, expect } from "@playwright/test";
import { ApiClient } from "../../../utils/apiClient";
import { validateAccountInfoResponse } from "../../../utils/schemaValidator";
import { AccountInfoFactory } from "../../../utils/accountDataFactory";
import { AccountInfoResponse } from "../../../utils/types";
import dotenv from "dotenv";

dotenv.config();

const baseURL = process.env.API_BASE_URL!;
const email = process.env.API_EMAIL!;
const accountInfoEndpoint = process.env.API_ACCOUNT_INFO_URL!;

test.describe("Account Service - GET Account Information", () => {
  let apiClient: ApiClient;

  test.beforeAll(async () => {
    apiClient = new ApiClient(baseURL);
    await apiClient.init();
  });

  test.afterAll(async () => {
    await apiClient.dispose();
  });

  test("GET /account-info - Should return valid account information", async () => {
    const response = await apiClient.get(accountInfoEndpoint);
    expect(response.status(), "Expected 200 OK for valid token").toBe(200);

    const body: unknown = await response.json();
    validateAccountInfoResponse(body);

    const account = (body as AccountInfoResponse).data;
    expect(account.email).toBe(email);
    expect(account.deviceUserId).toBeDefined();
  });

  test("GET /account-info - Should return 401 Unauthorized with invalid token", async () => {
    (apiClient as any).token = "invalid-token-12345";
    const response = await apiClient.get(accountInfoEndpoint, false);
    expect(response.status()).toBe(401);
  });

  test("GET /account-info - Should throw when no token is provided", async () => {
    (apiClient as any).token = null;
    await expect(apiClient.get(accountInfoEndpoint, false)).rejects.toThrow(
      "Token is not set"
    );
  });
});

test.describe("Account Service - PATCH Account Information", () => {
  let apiClient: ApiClient;

  test.beforeAll(async () => {
    apiClient = new ApiClient(baseURL);
    await apiClient.init();
  });

  test.afterAll(async () => {
    await apiClient.dispose();
  });

  test("PATCH /account-info - Should return valid updated account information", async () => {
      const payload = AccountInfoFactory.valid();

    const response = await apiClient.patch(accountInfoEndpoint, payload, true);
    expect(response.status(), "Expected 200 OK for valid token").toBe(200);

    const body: unknown = await response.json();
    validateAccountInfoResponse(body, "partial");

    const account = (body as AccountInfoResponse).data;
    expect(account.email).toBe(email);
  });

  test("GET /account-info - Should return 401 Unauthorized with invalid token", async () => {
    (apiClient as any).token = "invalid-token-12345";
    const payload = AccountInfoFactory.valid();

    const response = await apiClient.patch(accountInfoEndpoint, payload, false);
    expect(response.status()).toBe(401);
  });

  test("GET /account-info - Should throw when no token is provided", async () => {
    (apiClient as any).token = null;
    const payload = AccountInfoFactory.valid();

    await expect(apiClient.patch(accountInfoEndpoint,payload, false)).rejects.toThrow(
      "Token is not set"
    );
  });
});
