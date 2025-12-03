import { config } from '@config/appConfig';

/**
 * Health Info Domain Configuration
 * 
 * Centralized configuration for Health Info API endpoints and domain-specific settings.
 */
export const HealthInfoConfig = {
  /**
   * API Endpoints
   */
  endpoints: {
    healthInfo: config.endpoints.healthInfo,
  },

  /**
   * Health data from config
   */
  health: {
    height: config.health.height,
    weight: config.health.weight,
    biologicalSex: config.health.biologicalSex,
  },
} as const;

