import { TestNotificationPreferences } from '@constants/testData';
import { NotificationPreferencesResponse } from '../types/notification-preferences.types';

/**
 * Notification Preferences Factory
 * 
 * Generates test data for Notification Preferences domain tests.
 */
export class NotificationPreferencesFactory {
  /**
   * Creates valid notification preferences
   */
  static returnValidPreferences(): NotificationPreferencesResponse['data'] {
    return {
      preferences: [
        {
          notificationCategory: TestNotificationPreferences.CATEGORIES.ACCOUNT_UPDATES,
          notificationOption: TestNotificationPreferences.OPTIONS.EMAIL,
        },
        {
          notificationCategory: TestNotificationPreferences.CATEGORIES.CRITICAL_REMINDERS,
          notificationOption: TestNotificationPreferences.OPTIONS.EMAIL,
        },
        {
          notificationCategory: TestNotificationPreferences.CATEGORIES.FEEDBACK_REQUESTS,
          notificationOption: TestNotificationPreferences.OPTIONS.EMAIL,
        },
        {
          notificationCategory: TestNotificationPreferences.CATEGORIES.NEWS_AND_ANNOUNCEMENTS,
          notificationOption: TestNotificationPreferences.OPTIONS.EMAIL,
        },
      ],
    };
  }

  /**
   * Creates custom preferences with overrides
   */
  static returnCustomPreferences(
    overrides: Partial<NotificationPreferencesResponse['data']>
  ): NotificationPreferencesResponse['data'] {
    return {
      ...this.returnValidPreferences(),
      ...overrides,
    };
  }

  /**
   * Creates empty preferences
   */
  static returnEmptyPreferences(): NotificationPreferencesResponse['data'] {
    return { preferences: [] };
  }
}

