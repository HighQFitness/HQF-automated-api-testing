/**
 * Notification Preferences Domain Types
 * 
 * TypeScript interfaces and types specific to the Notification Preferences API domain.
 */

/**
 * Notification Preference
 */
export interface NotificationPreference {
  notificationCategory: string;
  notificationOption: string;
}

/**
 * Notification Preferences Response
 */
export interface NotificationPreferencesResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
  data: {
    preferences: NotificationPreference[];
  };
}

/**
 * Update Notification Preferences Request
 */
export interface UpdateNotificationPreferencesRequest {
  preferences: NotificationPreference[];
}

