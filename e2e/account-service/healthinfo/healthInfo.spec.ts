import { test, expect } from "@playwright/test";
import { ApiClient } from "../../../utils/apiClient";
import { validateHealthInfoResponse } from "../../../utils/schemaValidator";
import { HealthInfoResponse } from "../../../utils/types";
import dotenv from "dotenv";
import { HealthInfoFactory } from "../../../utils/healthDataFactory";

dotenv.config();

const baseURL = process.env.API_BASE_URL!;
const userHealthWeight = Number(process.env.API_HEALTH_WEIGHT!);
const userHealthHeight = Number(process.env.API_HEALTH_HEIGHT!);
const healthInfoEndpoint = process.env.API_HEALTH_INFO_URL!;

test.describe("Account Service - GET Health Information", () => {
  let apiClient: ApiClient;

  test.beforeAll(async () => {
    apiClient = new ApiClient(baseURL);
    await apiClient.init();
  });

  test.afterAll(async () => {
    await apiClient.dispose();
  });

  test("GET /health-info - Should return valid health information", async () => {
    const response = await apiClient.get(healthInfoEndpoint);
    expect(response.status(), "Expected 200 OK for valid token").toBe(200);

    const body: unknown = await response.json();
    validateHealthInfoResponse(body);

    const health = (body as HealthInfoResponse).data;
    expect(health.height.value).toBe(userHealthHeight);
    expect(health.weight.value).toBe(userHealthWeight);
  });

  test("GET /health-info - Should return 401 Unauthorized with invalid token", async () => {
    (apiClient as any).token = "invalid-token-12345";
    const response = await apiClient.get(healthInfoEndpoint, false);
    expect(response.status()).toBe(401);
  });

  test("GET /health-info - Should throw when no token is provided", async () => {
    (apiClient as any).token = null;
    await expect(apiClient.get(healthInfoEndpoint, false)).rejects.toThrow(
      "Token is not set"
    );
  });
});

test.describe("Account Service - PATCH Health Information", () => {
  let apiClient: ApiClient;

  test.beforeAll(async () => {
    apiClient = new ApiClient(baseURL);
    await apiClient.init();
  });

  test.afterAll(async () => {
    await apiClient.dispose();
  });

  test("PATCH /health-info - Should return valid updated health information", async () => {
    const payload = HealthInfoFactory.valid();

    const response = await apiClient.patch(healthInfoEndpoint, payload, true);
    expect(response.status(), "Expected 200 OK for valid token").toBe(200);

    const body: unknown = await response.json();
    const health = (body as HealthInfoResponse).data;
    expect(health.height.value).toBe(userHealthHeight);
    expect(health.weight.value).toBe(userHealthWeight);
  });

  test("PATCH /health-info - Should return 401 Unauthorized with invalid token", async () => {
    (apiClient as any).token = "invalid-token-12345";
    const payload = HealthInfoFactory.valid();

    const response = await apiClient.patch(healthInfoEndpoint, payload, false);
    expect(response.status()).toBe(401);
  });

  test("PATCH /health-info - Should throw when no token is provided", async () => {
    (apiClient as any).token = null;
    const payload = HealthInfoFactory.valid();

    await expect(
      apiClient.patch(healthInfoEndpoint, payload, false)
    ).rejects.toThrow("Token is not set");
  });
});

test.describe("Account Service - DELETE Health Information", () => {
  let apiClient: ApiClient;

  test.beforeAll(async () => {
    apiClient = new ApiClient(baseURL);
    await apiClient.init();
    const payload = HealthInfoFactory.valid();

    const response = await apiClient.patch(healthInfoEndpoint, payload, true);
    expect(response.status(), "Expected 200 OK for valid token").toBe(200);
  });

  test.afterAll(async () => {
    const payload = HealthInfoFactory.valid();
  });

  test("DELETE /health-info - Should return valid updated health information", async () => {
    const response = await apiClient.delete(healthInfoEndpoint, true);
    expect(response.status(), "Expected 200 OK for valid token").toBe(200);
  });

  test("DELETE /health-info - Should return 401 Unauthorized with invalid token", async () => {
    (apiClient as any).token = "invalid-token-12345";
    const payload = HealthInfoFactory.valid();

    const response = await apiClient.delete(healthInfoEndpoint, false);
    expect(response.status()).toBe(401);
  });

  test("DELETE /health-info - Should throw when no token is provided", async () => {
    (apiClient as any).token = null;
    const payload = HealthInfoFactory.valid();

    await expect(apiClient.delete(healthInfoEndpoint, false)).rejects.toThrow(
      "Token is not set"
    );
  });
});
