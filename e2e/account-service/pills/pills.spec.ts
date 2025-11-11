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
    expect(response.status(), "Expected 200 OK for valid token").toBe(200);

    const body: unknown = await response.json();

    validatePillsResponse(body);

    const data = (body as PillsResponse).data;
    if (data.pills.length === 0) {
      expect(data.pills).toEqual([]);
    } else {
     const expected = PillsFactory.valid().pills[0];
      const actual = data.pills[0];

      expect(actual.id).toBe(expected.id);
      expect(actual.pillId).toBe(expected.pillId);
      expect(actual.macAddress).toBe(expected.macAddress);
      expect(typeof actual.position).toBe("number");
    }
  });

//   test("GET /health-info - Should return 401 Unauthorized with invalid token", async () => {
//     (apiClient as any).token = "invalid-token-12345";
//     const response = await apiClient.get(healthInfoEndpoint, false);
//     expect(response.status()).toBe(401);
//   });

//   test("GET /health-info - Should throw when no token is provided", async () => {
//     (apiClient as any).token = null;
//     await expect(apiClient.get(healthInfoEndpoint, false)).rejects.toThrow(
//       "Token is not set"
//     );
//   });
});
