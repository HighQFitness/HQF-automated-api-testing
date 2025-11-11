import { NotificationPreferencesResponse } from "../utils/types";

export class NotificationPreferencesFactory {
  static returnValidPreferences(): NotificationPreferencesResponse["data"] {
    return {
      preferences: [
        {
          notificationCategory: "account_updates",
          notificationOption: "email",
        },
        {
          notificationCategory: "critical_reminders",
          notificationOption: "email",
        },
        {
          notificationCategory: "feedback_requests",
          notificationOption: "email",
        },
        {
          notificationCategory: "news_and_announcements",
          notificationOption: "email",
        },
      ],
    };
  }

  static returnCustomPreferences(
    overrides: Partial<NotificationPreferencesResponse["data"]>
  ): NotificationPreferencesResponse["data"] {
    return {
      ...this.returnValidPreferences(),
      ...overrides,
    };
  }

  static returnEmptyPreferences(): NotificationPreferencesResponse["data"] {
    return { preferences: [] };
  }
}
