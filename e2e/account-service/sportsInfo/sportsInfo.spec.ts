import { test, expect } from "@playwright/test";
import { ApiClient } from "../../../utils/apiClient";
import { validateSportsInfoResponse } from "../../../utils/schemaValidator";
import { SportsInfoResponse } from "../../../utils/types";
import dotenv from "dotenv";
import { validate as validateUUID } from "uuid";
import { SportsInfoDataFactory } from "../../../utils/sportsInfoFactory";
import { verifyAndCreateSportsInfo } from "../../../helpers/sportsInfoHelpers";

dotenv.config();

const baseURL = process.env.API_BASE_URL!;
const sportsInfoEndpoint = process.env.API_SPORTS_INFO_URL!;

test.describe.serial("Account Service - GET /sports-info", () => {
  let apiClient: ApiClient;

  test.beforeAll(async () => {
    apiClient = new ApiClient(baseURL);
    await apiClient.init();
    await verifyAndCreateSportsInfo();
  });

  test.afterAll(async () => {
    await apiClient.dispose();
  });

  test("GET /sports-info - Should return valid sports information (valid token)", async () => {
    const response = await apiClient.get(sportsInfoEndpoint, true);
    expect(response.status()).toBe(200);

    const body: unknown = await response.json();
    validateSportsInfoResponse(body);

    const parsed = body as SportsInfoResponse;
    expect(parsed.statusCode).toBe(200);
    expect(Array.isArray(parsed.data.sportsInfo)).toBe(true);

    if (parsed.data.sportsInfo.length > 0) {
      const sport = parsed.data.sportsInfo[0];
      expect(validateUUID(sport.id)).toBe(true);
      expect(typeof sport.name).toBe("string");
    }
  });

  test("GET /sports-info - Should return 401 with invalid token", async () => {
    const invalidClient = new ApiClient(baseURL);
    await invalidClient.init();
    (invalidClient as any).token = "invalid-token-123";

    const response = await invalidClient.get(sportsInfoEndpoint, false);
    expect(response.status()).toBe(401);
  });

  test("GET /sports-info - Should throw when no token is provided", async () => {
    const noTokenClient = new ApiClient(baseURL);
    await noTokenClient.init();
    (noTokenClient as any).token = null;

    await expect(noTokenClient.get(sportsInfoEndpoint, false)).rejects.toThrow(
      "Token is not set"
    );
  });
});

test.describe.serial("Account Service - PATCH /sports-info", () => {
  let apiClient: ApiClient;

  test.beforeAll(async () => {
    apiClient = new ApiClient(baseURL);
    await apiClient.init();
    await verifyAndCreateSportsInfo();
  });

  test.afterAll(async () => {
    await apiClient.dispose();
  });

  test("PATCH /sports-info - Should update existing sport successfully (valid token)", async () => {
    let response = await apiClient.patch(
      sportsInfoEndpoint,
      { name: `CrossFit-${Date.now()}` },
      true
    );

    if (response.status() === 404) {
      console.warn(
        "No sports info found. Creating default one before retrying PATCH..."
      );
      await verifyAndCreateSportsInfo();
      response = await apiClient.patch(
        sportsInfoEndpoint,
        { name: `CrossFit-${Date.now()}` },
        true
      );
    }

    expect([200, 201]).toContain(response.status());

    const body: unknown = await response.json();
    const data = (body as any).data;
    const sport = Array.isArray(data.sportsInfo) ? data.sportsInfo[0] : data;

    expect(sport).toBeDefined();
    expect(validateUUID(sport.id)).toBe(true);
    expect(sport.name).toContain("CrossFit");
  });

  test("PATCH /sports-info - Should return 401 Unauthorized with invalid token", async () => {
    const invalidClient = new ApiClient(baseURL);
    await invalidClient.init();
    (invalidClient as any).token = "invalid-token-123";

    const payload = SportsInfoDataFactory.returnValidSportsInfo();
    const response = await invalidClient.patch(
      sportsInfoEndpoint,
      payload,
      false
    );
    expect(response.status()).toBe(401);
  });

  test("PATCH /sports-info - Should throw when no token is provided", async () => {
    const noTokenClient = new ApiClient(baseURL);
    await noTokenClient.init();
    (noTokenClient as any).token = null;

    const payload = SportsInfoDataFactory.returnValidSportsInfo();
    await expect(
      noTokenClient.patch(sportsInfoEndpoint, payload, false)
    ).rejects.toThrow("Token is not set");
  });
});

test.describe.serial("Account Service - DELETE /sports-info", () => {
  let apiClient: ApiClient;

  test.beforeAll(async () => {
    apiClient = new ApiClient(baseURL);
    await apiClient.init();
    await verifyAndCreateSportsInfo();
  });

  test.afterAll(async () => {
    await verifyAndCreateSportsInfo();
    await apiClient.dispose();
  });

  test("DELETE /sports-info - Should delete existing sports information (valid token)", async () => {
    let response = await apiClient.delete(sportsInfoEndpoint, true);

    if (response.status() === 404) {
      console.warn(
        "⚠️ DELETE returned 404. Creating sports info before retrying..."
      );
      await verifyAndCreateSportsInfo();
      response = await apiClient.delete(sportsInfoEndpoint, true);
    }

    expect([200, 204]).toContain(response.status());
    console.log(`DELETE completed with status ${response.status()}`);
  });

  test("DELETE /sports-info - Should return 401 Unauthorized with invalid token", async () => {
    const invalidClient = new ApiClient(baseURL);
    await invalidClient.init();
    (invalidClient as any).token = "invalid-token-123";

    const response = await invalidClient.delete(sportsInfoEndpoint, false);
    expect(response.status()).toBe(401);
  });

  test("DELETE /sports-info - Should throw when no token is provided", async () => {
    const noTokenClient = new ApiClient(baseURL);
    await noTokenClient.init();
    (noTokenClient as any).token = null;

    await expect(
      noTokenClient.delete(sportsInfoEndpoint, false)
    ).rejects.toThrow("Token is not set");
  });
});
