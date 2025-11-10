import { test, expect } from "@playwright/test";
import { ApiClient } from "../../../utils/apiClient";
import { validateSportsInfoResponse } from "../../../utils/schemaValidator";
import { SportsInfoResponse } from "../../../utils/types"
import dotenv from "dotenv";
import { validate as validateUUID } from "uuid";
import { SportsInfoDataFactory } from "../../../utils/sportsInfoFactory";

dotenv.config();

const baseURL = process.env.API_BASE_URL!;
const userHealthWeight = Number(process.env.API_HEALTH_WEIGHT!);
const userHealthHeight = Number(process.env.API_HEALTH_HEIGHT!);
const sportsInfoEndpoint = process.env.API_SPORTS_INFO_URL!;

test.describe("Account Service - GET Sports info", () => {
  let apiClient: ApiClient;

  test.beforeAll(async () => {
    apiClient = new ApiClient(baseURL);
    await apiClient.init();
  });

  test.afterAll(async () => {
    await apiClient.dispose();
  });

  test("GET /sports-info - Should return valid sports information", async () => {
  const response = await apiClient.get(sportsInfoEndpoint, true);
  expect(response.status(), "Expected 200 OK for valid token").toBe(200);

  const body: unknown = await response.json();
  validateSportsInfoResponse(body);

  const parsed = body as SportsInfoResponse;

  expect(parsed.statusCode).toBe(200);
  expect(parsed.message).toBe("Operation completed successfully");

  expect(Array.isArray(parsed.data.sportsInfos)).toBe(true);

  if (parsed.data.sportsInfos.length > 0) {
    const sport = parsed.data.sportsInfos[0];
    expect(typeof sport.id).toBe("string");
    expect(typeof sport.name).toBe("string");
  }
});

  test("GET /sports-info - Should return 401 Unauthorized with invalid token", async () => {
    (apiClient as any).token = "invalid-token-12345";
    const response = await apiClient.get(sportsInfoEndpoint, false);
    expect(response.status()).toBe(401);
  });

  test("GET /sports-info - Should throw error when no token is provided", async () => {
    (apiClient as any).token = null;
    await expect(apiClient.get(sportsInfoEndpoint, false)).rejects.toThrow(
      "Token is not set"
    );
  });
});

test.describe("Account Service - PATCH Sports Information", () => {
  let apiClient: ApiClient;

  test.beforeAll(async () => {
    apiClient = new ApiClient(baseURL);
    await apiClient.init();
  });

  test.afterAll(async () => {
    await apiClient.dispose();
  });

  test("PATCH /sports-info - Should update sport name successfully", async () => {
  const payload = { name: "CrossFit" };
  const response = await apiClient.patch("/account_service_v2/api/v1/sports-info", payload, true);

  expect(response.status(), "Expected 200 OK").toBe(200);

  const body: unknown = await response.json();

  const data = (body as any).data;

  const sport = Array.isArray(data.sportsInfos)
    ? data.sportsInfos[0]
    : data;

  expect(sport, "Expected sport object in response").toBeDefined();
  expect(validateUUID(sport.id)).toBe(true);
  expect(sport.name).toBe("CrossFit");
});

  test("PATCH /health-info - Should return 401 Unauthorized with invalid token", async () => {
    (apiClient as any).token = "invalid-token-12345";
    const payload = SportsInfoDataFactory.returnValidSportsInfo();

    const response = await apiClient.patch(sportsInfoEndpoint, payload, false);
    expect(response.status()).toBe(401);
  });

  test("PATCH /health-info - Should throw when no token is provided", async () => {
    (apiClient as any).token = null;
    const payload = SportsInfoDataFactory.returnValidSportsInfo();

    await expect(apiClient.patch(sportsInfoEndpoint,payload, false)).rejects.toThrow(
      "Token is not set"
    );
  });
});

// test.describe("Account Service - DELETE Health Information", () => {
//   let apiClient: ApiClient;

//   test.beforeAll(async () => {
//     apiClient = new ApiClient(baseURL);
//     await apiClient.init();
//     const payload = HealthInfoFactory.valid();

//     const response = await apiClient.patch(healthInfoEndpoint, payload, true);
//     expect(response.status(), "Expected 200 OK for valid token").toBe(200);
//   });

//   test.afterAll(async () => {
//     await apiClient.dispose();
//     const payload = HealthInfoFactory.valid();

//     const response = await apiClient.patch(healthInfoEndpoint, payload, true);
//     expect(response.status(), "Expected 200 OK for valid token").toBe(200);
//   });

//   test("DELETE /health-info - Should return valid updated health information", async () => {
//     const response = await apiClient.delete(healthInfoEndpoint, true);
//     expect(response.status(), "Expected 200 OK for valid token").toBe(200);
//   });

//   test("DELETE /health-info - Should return 401 Unauthorized with invalid token", async () => {
//     (apiClient as any).token = "invalid-token-12345";
//     const payload = HealthInfoFactory.valid();

//     const response = await apiClient.delete(healthInfoEndpoint, false);
//     expect(response.status()).toBe(401);
//   });

//   test("DELETE /health-info - Should throw when no token is provided", async () => {
//     (apiClient as any).token = null;
//     const payload = HealthInfoFactory.valid();

//     await expect(apiClient.delete(healthInfoEndpoint, false)).rejects.toThrow(
//       "Token is not set"
//     );
//   });
// });