import { test, expect } from "@playwright/test";
import { ApiClient } from "../../../utils/apiClient";
import { validateAccountInfoResponse } from "../../../utils/schemaValidator";
import { validateUsernameResponse } from "../../../utils/schemaValidator";
import { AccountInfoFactory } from "../../../utils/accountDataFactory";
import { AccountInfoResponse } from "../../../utils/types";
import { UsernameResponse } from "../../../utils/types";

import dotenv from "dotenv";

dotenv.config();

const baseURL = process.env.API_BASE_URL!;
const email = process.env.API_EMAIL!;
const accountInfoEndpoint = process.env.API_ACCOUNT_INFO_URL!;
const accountInfoUsernameEndpoint = process.env.API_ACCOUNT_INFO_USERNAME_URL!;
const deviceIdparam = process.env.API_DEVICE_USER_ID!;
const accountUserInfoEndpointWithParam = accountInfoUsernameEndpoint + "?device_user_id="+ deviceIdparam;

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

  test("GET /account-info - Should throw error when no token is provided", async () => {
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

  test("GET /account-info - Should throw error when no token is provided", async () => {
    (apiClient as any).token = null;
    const payload = AccountInfoFactory.valid();

    await expect(apiClient.patch(accountInfoEndpoint,payload, false)).rejects.toThrow(
      "Token is not set"
    );
  });
});

test.describe("Account Service - GET User Name", () => {
  let apiClient: ApiClient;

  test.beforeAll(async () => {
    apiClient = new ApiClient(baseURL);
    await apiClient.init();
  });

  test.afterAll(async () => {
    await apiClient.dispose();
  });

  test("GET /account-info/username - Should return valid updated account information", async () => {
    const response = await apiClient.get(accountUserInfoEndpointWithParam, true);
    expect(response.status(), "Expected 200 OK for valid token").toBe(200);

    const body: unknown = await response.json();
    validateUsernameResponse(body);

    const data = (body as UsernameResponse).data;
    expect(data.username).toContain("user_");
    expect(body).toHaveProperty("path");
    expect(body).toHaveProperty("message");
  });

  test("GET /account-info/username - Should return 401 Unauthorized with invalid token", async () => {
    (apiClient as any).token = "invalid-token-12345";
    const response = await apiClient.get(accountUserInfoEndpointWithParam, false);
    expect(response.status()).toBe(401);
  });

  test("GET /account-info/username - Should throw error when no token is provided", async () => {
    (apiClient as any).token = null;
    const payload = AccountInfoFactory.valid();

    await expect(apiClient.patch(accountUserInfoEndpointWithParam, false)).rejects.toThrow(
      "Token is not set"
    );
  });
});

test.describe("Account Service - DELETE User Account", () => {
  let apiClient: ApiClient;

  test.beforeAll(async () => {
    apiClient = new ApiClient(baseURL);
    await apiClient.init();
  });

  test.afterAll(async () => {
    await apiClient.dispose();
  });

  test("DELETE /account-info/username - Should return valid updated account information", async () => {
    const response = await apiClient.delete(accountInfoEndpoint, true);
    expect(response.status(), "Expected 200 OK for valid token").toBe(200);

    const body: unknown = await response.json();
    validateUsernameResponse(body);

    const data = (body as UsernameResponse).data;
    expect(data.username).toContain("user_");
    expect(body).toHaveProperty("path");
    expect(body).toHaveProperty("message");
  });

  test("GET /account-info/username - Should return 401 Unauthorized with invalid token", async () => {
    (apiClient as any).token = "invalid-token-12345";
    const response = await apiClient.get(accountUserInfoEndpointWithParam, false);
    expect(response.status()).toBe(401);
  });

  test("GET /account-info/username - Should throw error when no token is provided", async () => {
    (apiClient as any).token = null;
    const payload = AccountInfoFactory.valid();

    await expect(apiClient.patch(accountUserInfoEndpointWithParam, false)).rejects.toThrow(
      "Token is not set"
    );
  });
});