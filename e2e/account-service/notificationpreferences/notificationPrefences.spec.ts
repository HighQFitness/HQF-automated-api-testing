import { test, expect } from "@playwright/test";
import { ApiClient } from "../../../utils/apiClient";
import { validateNotificationPreferencesResponse } from "../../../utils/schemaValidator";
import { HealthInfoResponse, NotificationPreferencesResponse } from "../../../utils/types";
import dotenv from "dotenv";
import { NotificationPreferencesFactory } from "../../../utils/notificationPreferenceDataFactory";

dotenv.config();

const baseURL = process.env.API_BASE_URL!;
const notificationPreferencesEndpoint = process.env.API_NOTIFICATION_PREFERENCES_URL!;

test.describe("Account Service - GET Notifications preferences", () => {
  let apiClient: ApiClient;

  test.beforeAll(async () => {
    apiClient = new ApiClient(baseURL);
    await apiClient.init();
  });

  test.afterAll(async () => {
    await apiClient.dispose();
  });

  test("GET /notification-preferences - Should return valid notification preferences", async () => {
    const response = await apiClient.get(notificationPreferencesEndpoint);
    expect(response.status(), "Expected 200 OK for valid token").toBe(200);

    const body: unknown = await response.json();
    validateNotificationPreferencesResponse(body);

    const expected = NotificationPreferencesFactory.returnValidPreferences();
    const actual = (body as NotificationPreferencesResponse).data;

    expected.preferences.forEach(
    (pref: { notificationCategory: unknown; notificationOption: unknown }, index: number) => {
      expect(actual.preferences[index].notificationCategory).toBe(pref.notificationCategory);
      expect(actual.preferences[index].notificationOption).toBe(pref.notificationOption);
    }
  );
});
});
  // test("GET /notification-preferences - Should return 401 Unauthorized with invalid token", async () => {
  //   (apiClient as any).token = "invalid-token-12345";
  //   const response = await apiClient.get(notificationPreferencesEndpoint, false);
  //   expect(response.status()).toBe(401);
  // });

  // test("GET /notification-preferences - Should throw when no token is provided", async () => {
  //   (apiClient as any).token = null;
  //   await expect(apiClient.get(notificationPreferencesEndpoint, false)).rejects.toThrow(
  //     "Token is not set"
  //   );
  // });
//});

// test.describe("Account Service - PATCH Health Information", () => {
//   let apiClient: ApiClient;

//   test.beforeAll(async () => {
//     apiClient = new ApiClient(baseURL);
//     await apiClient.init();
//   });

//   test.afterAll(async () => {
//     await apiClient.dispose();
//   });

//   test("PATCH /health-info - Should return valid updated health information", async () => {
//       const payload = HealthInfoFactory.valid();

//     const response = await apiClient.patch(healthInfoEndpoint, payload, true);
//     expect(response.status(), "Expected 200 OK for valid token").toBe(200);

//     const body: unknown = await response.json();
//     const health = (body as HealthInfoResponse).data;
//     expect(health.height.value).toBe(userHealthHeight);
//     expect(health.weight.value).toBe(userHealthWeight);
//   });

//   test("PATCH /health-info - Should return 401 Unauthorized with invalid token", async () => {
//     (apiClient as any).token = "invalid-token-12345";
//     const payload = HealthInfoFactory.valid();

//     const response = await apiClient.patch(healthInfoEndpoint, payload, false);
//     expect(response.status()).toBe(401);
//   });

//   test("PATCH /health-info - Should throw when no token is provided", async () => {
//     (apiClient as any).token = null;
//     const payload = HealthInfoFactory.valid();

//     await expect(apiClient.patch(healthInfoEndpoint,payload, false)).rejects.toThrow(
//       "Token is not set"
//     );
//   });
// });

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