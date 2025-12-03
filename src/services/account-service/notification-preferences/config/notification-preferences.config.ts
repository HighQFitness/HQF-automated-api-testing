import { config } from '@config/appConfig';

/**
 * Notification Preferences Domain Configuration
 * 
 * Centralized configuration for Notification Preferences API endpoints and domain-specific settings.
 */
export const NotificationPreferencesConfig = {
  /**
   * API Endpoints
   */
  endpoints: {
    notificationPreferences: config.endpoints.notificationPreferences,
  },
} as const;

