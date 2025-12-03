import { HttpStatus } from '@shared/constants/http-status-codes';
import { expect, test } from '@shared/fixtures';
import {
  NotificationPreferencesConfig,
  NotificationPreferencesFactory,
  validateNotificationPreferencesResponse,
} from './index';
import { NotificationPreferencesResponse } from './types/notification-preferences.types';

const notificationPreferencesEndpoint = NotificationPreferencesConfig.endpoints.notificationPreferences;

test.describe('Account Service - GET Notifications preferences', () => {
  test('GET /notification-preferences - Should return valid notification preferences', async ({ apiClient }) => {
    const response = await apiClient.get(notificationPreferencesEndpoint);
    expect(response.status(), 'Expected 200 OK for valid token').toBe(HttpStatus.OK);

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
      expect(actualSorted[index].notificationCategory).toBe(pref.notificationCategory);
      expect(actualSorted[index].notificationOption).toBe(pref.notificationOption);
    });
  });

  test('GET /notification-preferences - Should return 401 Unauthorized with invalid token', async ({ apiClient }) => {
    (apiClient as any).token = 'invalid-token-12345';
    const response = await apiClient.get(notificationPreferencesEndpoint, false);
    expect(response.status()).toBe(HttpStatus.UNAUTHORIZED);
  });

  test('GET /notification-preferences - Should throw error when no token is provided', async ({ apiClient }) => {
    (apiClient as any).token = null;
    await expect(apiClient.get(notificationPreferencesEndpoint, false)).rejects.toThrow('Token is not set');
  });
});

test.describe('Account Service - PATCH Notification Preferences', () => {
  test('PATCH /notification-preferences - Should return valid updated notification preferences', async ({ apiClient }) => {
    const payload = NotificationPreferencesFactory.returnValidPreferences();

    const response = await apiClient.patch(notificationPreferencesEndpoint, payload, true);
    expect(response.status(), 'Expected 200 OK for valid token').toBe(HttpStatus.OK);

    const body: unknown = await response.json();
    const notificationPreferences = (body as NotificationPreferencesResponse).data.preferences;

    payload.preferences.forEach((pref) => {
      const actual = notificationPreferences.find(
        (p) => p.notificationCategory === pref.notificationCategory
      );

      expect(actual).toBeDefined();
      expect(actual!.notificationOption).toBe(pref.notificationOption);
    });
  });

  test('PATCH /notification-preferences - Should return 401 Unauthorized with invalid token', async ({ apiClient }) => {
    (apiClient as any).token = 'invalid-token-12345';
    const payload = NotificationPreferencesFactory.returnValidPreferences();

    const response = await apiClient.patch(notificationPreferencesEndpoint, payload, false);
    expect(response.status()).toBe(HttpStatus.UNAUTHORIZED);
  });

  test('PATCH /notification-preferences - Should throw when no token is provided', async ({ apiClient }) => {
    (apiClient as any).token = null;
    const payload = NotificationPreferencesFactory.returnValidPreferences();

    await expect(apiClient.patch(notificationPreferencesEndpoint, payload, false)).rejects.toThrow(
      'Token is not set'
    );
  });
});

