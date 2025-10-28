import { test, expect } from "@playwright/test";
import { ApiClient } from "../../../utils/apiClient";
import { validateAccountInfoResponse } from "../../../utils/schemaValidator";
import { AccountInfoResponse } from "../../../utils/types";
import dotenv from "dotenv";

dotenv.config();

const baseURL = process.env.API_BASE_URL!;
const email = process.env.API_EMAIL!;
const accountInfoEndpoint = process.env.API_ACCOUNT_INFO_URL!;
// const accountPhotoEndpoint = process.env.API_PHOTO_URL!;
// const phoneChangeEndpoint = process.env.API_PHONE_CHANGE_URL!;
// const resendCodeEndpoint = process.env.API_RESEND_URL!;


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

// test.describe("Account service - Change account user photo", () => {
//   let apiClient: ApiClient;

//   test.beforeAll(async () => {
//     apiClient = new ApiClient(baseURL);
//     await apiClient.init();
//   });

//   test.afterAll(async () => {
//     await apiClient.dispose();
//   });

//   test("POST /account/photo - Should change photo correctly", async () => {
//     const filePath = path.resolve(
//       __dirname,
//       "../../../assets/highQFitness.jpg"
//     );
//     const response = await apiClient.postMultipart(accountPhotoEndpoint, {
//       fieldName: "photo",
//       filePath,
//     });

//     expect(response.status(), "Expected 201 for successful photo upload").toBe(
//       201
//     );

//     const json = await response.json();
//     console.log("Response JSON:", json);
//   });
// });

// test.describe("Account service - Change and verify account phone number", () => {
//   let apiClient: ApiClient;

//   test.beforeAll(async () => {
//     apiClient = new ApiClient(baseURL);
//     await apiClient.init();
//   });

//   test("PATCH /account/phone/verify - Should re send verification code correctly", async () => {
//     const response = await apiClient.patch(resendCodeEndpoint, {}, true);
//     expect(response.status(), "Expected 200 for successful code resend").toBe(
//       200
//     );
//     const body = await response.json();

//     expect(body.message).toBe(
//       `Verification code has been resent to your updated phone number`
//     );
//   });

//   test("PATCH /account/phone - Should change phone correctly", async () => {
//     const phoneToChange = WorkoutUnitsFactory.returnChangePhoneNumber();

//     const response = await apiClient.patch(
//       phoneChangeEndpoint,
//       { phoneNumber: phoneToChange },
//       true
//     );
//     expect(response.status(), "Expected 200 for successful phone change").toBe(
//       200
//     );
//     const body = await response.json();
//     expect(body.message).toBe(
//       `Phone number updated to ${phoneToChange}. A verification code has been sent to this number. Please check your messages and enter the code to complete the verification.`
//     );
//   });
// });
