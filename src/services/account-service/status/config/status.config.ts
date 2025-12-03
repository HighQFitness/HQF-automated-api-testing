import { config } from '@config/appConfig';
import { ApiPaths } from '@constants/testData';

/**
 * Status Domain Configuration
 * 
 * Centralized configuration for Status API endpoints and domain-specific settings.
 */
export const StatusConfig = {
  /**
   * API Endpoints
   */
  endpoints: {
    statusCheck: config.endpoints.statusCheck,
  },

  /**
   * Expected API paths for validation
   */
  paths: {
    status: ApiPaths.STATUS,
  },
} as const;

