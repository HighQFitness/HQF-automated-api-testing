import { config } from '@config/appConfig';

/**
 * Pills Domain Configuration
 * 
 * Centralized configuration for Pills API endpoints and domain-specific settings.
 */
export const PillsConfig = {
  /**
   * API Endpoints
   */
  endpoints: {
    pills: config.endpoints.pills,
  },
} as const;

