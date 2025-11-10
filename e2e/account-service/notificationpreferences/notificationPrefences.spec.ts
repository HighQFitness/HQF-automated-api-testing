import { test, expect } from "@playwright/test";
import { ApiClient } from "../../../utils/apiClient";
import { validateNotificationPreferencesResponse } from "../../../utils/schemaValidator";
import { NotificationPreferencesResponse,
} from "../../../utils/types";
import dotenv from "dotenv";
import { NotificationPreferencesFactory } from "../../../utils/notificationPreferenceDataFactory";

dotenv.config();

const baseURL = process.env.API_BASE_URL!;
const notificationPreferencesEndpoint =
  process.env.API_NOTIFICATION_PREFERENCES_URL!;

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

    const sortByCategory = (a: any, b: any) =>
      a.notificationCategory.localeCompare(b.notificationCategory);

    const expectedSorted = [...expected.preferences].sort(sortByCategory);
    const actualSorted = [...actual.preferences].sort(sortByCategory);

    expect(expectedSorted.length).toBe(actualSorted.length);

    expectedSorted.forEach((pref, index) => {
      expect(actualSorted[index].notificationCategory).toBe(
        pref.notificationCategory
      );
      expect(actualSorted[index].notificationOption).toBe(
        pref.notificationOption
      );
    });
  });

  test("GET /notification-preferences - Should return 401 Unauthorized with invalid token", async () => {
    (apiClient as any).token = "invalid-token-12345";
    const response = await apiClient.get(
      notificationPreferencesEndpoint,
      false
    );
    expect(response.status()).toBe(401);
  });

  test("GET /notification-preferences - Should throw error when no token is provided", async () => {
    (apiClient as any).token = null;
    await expect(
      apiClient.get(notificationPreferencesEndpoint, false)
    ).rejects.toThrow("Token is not set");
  });
});

test.describe("Account Service - PATCH Notification Preferences", () => {
  let apiClient: ApiClient;

  test.beforeAll(async () => {
    apiClient = new ApiClient(baseURL);
    await apiClient.init();
  });

  test.afterAll(async () => {
    await apiClient.dispose();
  });

  test("PATCH /notification-preferences - Should return valid updated notification preferences", async () => {
  const payload = NotificationPreferencesFactory.returnValidPreferences();

  const response = await apiClient.patch(notificationPreferencesEndpoint, payload, true);
  expect(response.status(), "Expected 200 OK for valid token").toBe(200);

  const body: unknown = await response.json();
  const notificationPreferences = (body as NotificationPreferencesResponse).data.preferences;

  payload.preferences.forEach(pref => {
    const actual = notificationPreferences.find(
      (p) => p.notificationCategory === pref.notificationCategory
    );

    expect(actual).toBeDefined();
    expect(actual!.notificationOption).toBe(pref.notificationOption);
  });
});


  test("PATCH /notification-preferences - Should return 401 Unauthorized with invalid token", async () => {
    (apiClient as any).token = "invalid-token-12345";
    const payload = NotificationPreferencesFactory.returnValidPreferences();

    const response = await apiClient.patch(
      notificationPreferencesEndpoint,
      payload,
      false
    );
    expect(response.status()).toBe(401);
  });

  test("PATCH /notification-preferences - Should throw when no token is provided", async () => {
    (apiClient as any).token = null;
    const payload = NotificationPreferencesFactory.returnValidPreferences();

    await expect(
      apiClient.patch(notificationPreferencesEndpoint, payload, false)
    ).rejects.toThrow("Token is not set");
  });
});
