import { config } from '@config/appConfig';
import { ApiClient } from '@shared/client/api-client';
import { Logger } from '@shared/utils/logger';
import { HealthInfoConfig } from '../config/health-info.config';
import { HealthInfoFactory } from '../factories/health-info.factory';

/**
 * Health Info Helper
 * 
 * Helper functions for Health Info domain setup and teardown.
 */

/**
 * Verifies and creates health info if needed
 */
export const verifyAndCreateHealthInfo = async (): Promise<void> => {
  const api = new ApiClient(config.api.baseUrl);
  
  try {
    await api.init();
    const payload = HealthInfoFactory.valid(config.health.biologicalSex);
    const response = await api.patch(HealthInfoConfig.endpoints.healthInfo, payload, true);
    
    if (!response.ok()) {
      const errorText = await response.text();
      Logger.warn(`Health info patch returned ${response.status()}: ${errorText}`);
    }
  } catch (error) {
    Logger.error('Error in verifyAndCreateHealthInfo', { error: error instanceof Error ? error.message : String(error) });
    throw error;
  } finally {
    await api.dispose();
  }
};

