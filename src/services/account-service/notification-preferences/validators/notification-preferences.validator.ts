import { expect } from '@playwright/test';
import { HttpStatus } from '@shared/constants/http-status-codes';
import { NotificationPreferencesResponse } from '../types/notification-preferences.types';

/**
 * Notification Preferences Validators
 * 
 * Schema validation functions for Notification Preferences domain responses.
 */

/**
 * Validates Notification Preferences response
 */
export function validateNotificationPreferencesResponse(
  body: unknown
): asserts body is NotificationPreferencesResponse {
  const data = (body as NotificationPreferencesResponse).data;

  expect(body).toHaveProperty('statusCode', HttpStatus.OK);
  expect(body).toHaveProperty('message');
  expect(body).toHaveProperty('timestamp');
  expect(body).toHaveProperty('path');
  expect(body).toHaveProperty('data');

  expect(Array.isArray(data.preferences)).toBe(true);
  expect(data.preferences.length).toBeGreaterThan(0);

  for (const pref of data.preferences) {
    expect(pref).toHaveProperty('notificationCategory');
    expect(pref).toHaveProperty('notificationOption');

    expect(typeof pref.notificationCategory).toBe('string');
    expect(typeof pref.notificationOption).toBe('string');
  }
}

