/**
 * Test Data Cleanup Utility
 * 
 * Provides centralized cleanup strategies for test data to prevent test pollution.
 */

import { config } from '@config/appConfig';
import { ApiClient } from '../client/api-client';
import { Logger } from './logger';

/**
 * Cleanup strategies for different domains
 */
export class TestCleanup {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Resets health info to default state
   */
  async resetHealthInfo(): Promise<void> {
    try {
      const { HealthInfoFactory } = await import(
        '../../services/account-service/health-info/factories/health-info.factory'
      );
      const { HealthInfoConfig } = await import(
        '../../services/account-service/health-info/config/health-info.config'
      );

      const payload = HealthInfoFactory.valid(config.health.biologicalSex);
      await this.apiClient.patch(HealthInfoConfig.endpoints.healthInfo, payload, true);
    } catch (error) {
      Logger.warn('Failed to reset health info', { error: error instanceof Error ? error.message : String(error) });
    }
  }

  /**
   * Resets sports info to default state
   */
  async resetSportsInfo(): Promise<void> {
    try {
      const { SportsInfoConfig } = await import(
        '../../services/account-service/sports-info/config/sports-info.config'
      );
      const { TestSportsInfo } = await import('@constants/testData');

      const payload = {
        name: `${TestSportsInfo.SPORT_NAME_PREFIX}-${Math.random().toString(36).substring(2, 8)}`,
      };

      const response = await this.apiClient.patch(SportsInfoConfig.endpoints.sportsInfo, payload, true);
      if (!response.ok()) {
        await this.apiClient.post(SportsInfoConfig.endpoints.sportsInfo, payload, true);
      }
    } catch (error) {
      Logger.warn('Failed to reset sports info', { error: error instanceof Error ? error.message : String(error) });
    }
  }

  /**
   * Cleans up pills data (deletes created pills)
   */
  async cleanupPills(): Promise<void> {
    try {
      // Note: This assumes there's a way to delete pills
      // If not available, this can be skipped or implemented differently
      Logger.info('Pills cleanup: Implement based on API capabilities');
    } catch (error) {
      Logger.warn('Failed to cleanup pills', { error: error instanceof Error ? error.message : String(error) });
    }
  }

  /**
   * Resets notification preferences to defaults
   */
  async resetNotificationPreferences(): Promise<void> {
    try {
      const { NotificationPreferencesConfig } = await import(
        '../../services/account-service/notification-preferences/config/notification-preferences.config'
      );
      const { NotificationPreferencesFactory } = await import(
        '../../services/account-service/notification-preferences/factories/notification-preferences.factory'
      );

      const payload = NotificationPreferencesFactory.returnValidPreferences();
      await this.apiClient.patch(
        NotificationPreferencesConfig.endpoints.notificationPreferences,
        payload,
        true
      );
    } catch (error) {
      Logger.warn('Failed to reset notification preferences', { error: error instanceof Error ? error.message : String(error) });
    }
  }

  /**
   * Performs comprehensive cleanup of all test data
   */
  async cleanupAll(): Promise<void> {
    const cleanupTasks = [
      () => this.resetHealthInfo(),
      () => this.resetSportsInfo(),
      () => this.resetNotificationPreferences(),
    ];

    for (const task of cleanupTasks) {
      try {
        await task();
      } catch (error) {
        Logger.warn('Cleanup task failed', { error: error instanceof Error ? error.message : String(error) });
      }
    }
  }
}

/**
 * Creates a cleanup instance with a new ApiClient
 */
export async function createCleanupInstance(): Promise<TestCleanup> {
  const apiClient = new ApiClient(config.api.baseUrl);
  await apiClient.init();
  return new TestCleanup(apiClient);
}

