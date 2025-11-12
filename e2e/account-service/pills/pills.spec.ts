import { test, expect } from "@playwright/test";
import { ApiClient } from "../../../utils/apiClient";
import { validatePillsResponse } from "../../../utils/schemaValidator";
import { PillsResponse } from "../../../utils/types";
import { PillsFactory } from "../../../utils/pillsDataFactory";
import dotenv from "dotenv";

dotenv.config();

const baseURL = process.env.API_BASE_URL!;
const pillsEndpoint = process.env.API_PILLS_URL!;

test.describe("Account Service - GET pills", () => {
  let apiClient: ApiClient;

  test.beforeAll(async () => {
    apiClient = new ApiClient(baseURL);
    await apiClient.init();
  });

  test.afterAll(async () => {
    await apiClient.dispose();
  });

  test("GET /pills - Should return valid pills information", async () => {
    const response = await apiClient.get(pillsEndpoint);
    const body = await response.json();
    validatePillsResponse(body);

    const data = (body as PillsResponse).data;

    if (data.pills.length === 0) {
      expect(data.pills).toEqual([]);
    } else {
      const actual = data.pills[0];
      expect(typeof actual.id).toBe("string");
      expect(actual.id).toMatch(/^[0-9a-fA-F-]{36}$/);
      expect(actual.macAddress).toMatch(/^([0-9A-F]{2}:){5}[0-9A-F]{2}$/);
    }
  });

  test("GET /pills - Should return 401 Unauthorized with invalid token", async () => {
    (apiClient as any).token = "invalid-token-12345";
    const response = await apiClient.get(pillsEndpoint, false);
    expect(response.status()).toBe(401);
  });

  test("GET /pills - Should throw error when no token is provided", async () => {
    (apiClient as any).token = null;
    await expect(apiClient.get(pillsEndpoint, false)).rejects.toThrow(
      "Token is not set"
    );
  });
});

test.describe("Account Service - POST pills", () => {
  let apiClient: ApiClient;

  test.beforeAll(async () => {
    apiClient = new ApiClient(baseURL);
    await apiClient.init();
  });

  test.afterAll(async () => {
    await apiClient.dispose();
  });

  test("POST /pills - Should create valid pills entity", async () => {
    const payload = PillsFactory.createValidBody();

    const response = await apiClient.post(pillsEndpoint, payload);
    expect(response.status(), "Expected 200 OK for pills creation").toBe(200);

    const body: unknown = await response.json();
    validatePillsResponse(body);

    const data = (body as PillsResponse).data;

    expect(Array.isArray(data.pills)).toBe(true);
    expect(data.pills.length).toBeGreaterThan(0);

    for (const pill of data.pills) {
      expect(pill.pillId).toMatch(/0000[A-Z]{4}-0000-1000-8000-00805F9B34FB/);
      expect(pill.macAddress).toMatch(/^([0-9A-F]{2}:){5}[0-9A-F]{2}$/);
      expect(typeof pill.position).toBe("number");
    }
  });

  test("POST /pills - Should return 401 Unauthorized with invalid token", async () => {
    const payload = PillsFactory.createValidBody();
    (apiClient as any).token = "invalid-token-12345";
    const response = await apiClient.post(pillsEndpoint, payload, false);
    expect(response.status()).toBe(401);
  });

  test("POST /pills - Should throw error when no token is provided", async () => {
    const payload = PillsFactory.createValidBody();
    (apiClient as any).token = null;
    await expect(apiClient.post(pillsEndpoint, payload, false)).rejects.toThrow(
      "Token is not set"
    );
  });
});
