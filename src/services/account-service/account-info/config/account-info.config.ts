import { config } from '@config/appConfig';

/**
 * Account Info Domain Configuration
 * 
 * Centralized configuration for Account Info API endpoints and domain-specific settings.
 */
export const AccountInfoConfig = {
  /**
   * API Endpoints
   */
  endpoints: {
    accountInfo: config.endpoints.accountInfo,
    accountInfoUsername: config.endpoints.accountInfoUsername,
    accountPhoto: config.endpoints.accountPhoto,
  },

  /**
   * Helper function to build username endpoint with device user ID
   */
  getUsernameEndpoint(deviceUserId: string | number): string {
    return `${this.endpoints.accountInfoUsername}?device_user_id=${deviceUserId}`;
  },
} as const;

