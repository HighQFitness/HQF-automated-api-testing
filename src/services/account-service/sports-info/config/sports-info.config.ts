import { config } from '@config/appConfig';

/**
 * Sports Info Domain Configuration
 * 
 * Centralized configuration for Sports Info API endpoints and domain-specific settings.
 */
export const SportsInfoConfig = {
  /**
   * API Endpoints
   */
  endpoints: {
    sportsInfo: config.endpoints.sportsInfo,
  },
} as const;

