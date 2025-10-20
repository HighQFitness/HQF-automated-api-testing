import { test, expect } from "@playwright/test";
import { ApiClient } from "../../../utils/apiClient";
import { validateAccountResponse } from "../../../utils/schemaValidator";
import { AccountResponse } from "../../../utils/types";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const baseURL = process.env.API_BASE_URL!;
const email = process.env.API_EMAIL!;
const password = process.env.API_PASSWORD!;
const accountEndpoint = process.env.API_ACCOUNT_URL!;
const accountPhotoEndpoint = process.env.API_PHOTO_URL!;

test.describe("Account Service - GET Account Info", () => {
  let apiClient: ApiClient;

  test.beforeAll(async () => {
  apiClient = new ApiClient(baseURL);
  await apiClient.init();
});

  test.afterAll(async () => {
    await apiClient.dispose();
  });

  test("GET /account - Should return valid account information", async () => {
    const response = await apiClient.get(accountEndpoint);
    expect(response.status(), "Expected 200 OK for valid token").toBe(200);

    const body: unknown = await response.json();
    validateAccountResponse(body);

    const account = (body as AccountResponse).data.accountInfo;
    expect(account.email).toBe(email);
    expect(account.deviceUserId).toBeDefined();
  });

  test("GET /account - Should return 401 Unauthorized with invalid token", async () => {
    (apiClient as any).token = "invalid-token-12345";

    const response = await apiClient.get(accountEndpoint);
    expect(response.status(), "Expected 401 for invalid token").toBe(401);

  });

  test("GET /account - Should throw an error when no token is provided", async () => {
    (apiClient as any).token = null;

    await expect(async () => {
      await apiClient.get(accountEndpoint);
    }).rejects.toThrow("Token is not set");

  });
});


test.describe("Account service - Change account user photo", () => {
    let apiClient: ApiClient;

    test.beforeAll(async () => {
  apiClient = new ApiClient(baseURL);
  await apiClient.init();
});


    test.afterAll(async () => {
        await apiClient.dispose();
    });

    test("POST /account/photo - Should change photo correctly", async () => {

    const filePath = path.resolve(__dirname, "../../../assets/highQFitnessCopy.jpg");
    const response = await apiClient.postMultipart(accountPhotoEndpoint, {
    fieldName: "photo",
    filePath,
});


  expect(response.status(), "Expected 201 for successful photo upload").toBe(201);

  const json = await response.json();
  console.log("Response JSON:", json);
});

});