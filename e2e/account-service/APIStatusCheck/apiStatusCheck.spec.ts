import { test, expect } from "@playwright/test";
import { ApiClient } from "../../../utils/apiClient";
import { validateServiceStatusResponse } from "../../../utils/schemaValidator";
import { HealthInfoResponse } from "../../../utils/types";
import dotenv from "dotenv";

dotenv.config();

const baseURL = process.env.API_BASE_URL!;
const apiStatusCheckEndpoint = process.env.API_STATUS_CHECK_URL!;

test.describe("Account Service - GET API Status check Information", () => {
  let apiClient: ApiClient;

  test.beforeAll(async () => {
    apiClient = new ApiClient(baseURL);
    await apiClient.init();
  });

  test.afterAll(async () => {
    await apiClient.dispose();
  });

  test("GET /status - Should return valid health information", async () => {
    const response = await apiClient.get(apiStatusCheckEndpoint);
    expect(response.status(), "Expected 200 OK for valid token").toBe(200);

    const body: unknown = await response.json();
    validateServiceStatusResponse(body);
  });
});