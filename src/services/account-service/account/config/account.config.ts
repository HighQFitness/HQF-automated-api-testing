import { config } from '@config/appConfig';

/**
 * Account Domain Configuration
 * 
 * Centralized configuration for Account API endpoints and domain-specific settings.
 */
export const AccountConfig = {
  /**
   * API Endpoints
   */
  endpoints: {
    account: config.endpoints.account,
    accountAvatar: config.endpoints.accountAvatar,
    accountPhoto: config.endpoints.accountPhoto,
    phoneChange: config.endpoints.accountPhoneChange,
    phoneVerify: config.endpoints.accountPhoneVerify,
    phoneResendCode: config.endpoints.accountPhoneResendCode,
  },
} as const;

