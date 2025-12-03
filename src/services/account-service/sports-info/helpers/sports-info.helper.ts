import { config } from '@config/appConfig';
import { TestSportsInfo } from '@constants/testData';
import { ApiClient } from '@shared/client/api-client';
import { HttpStatus, SuccessStatusCodes } from '@shared/constants/http-status-codes';
import { Logger } from '@shared/utils/logger';
import { SportsInfoConfig } from '../config/sports-info.config';
import { SportsInfoResponse } from '../types/sports-info.types';

/**
 * Sports Info Helper
 * 
 * Helper functions for Sports Info domain setup and teardown.
 */

/**
 * Verifies and creates sports info if needed
 */
export async function verifyAndCreateSportsInfo(): Promise<SportsInfoResponse | null> {
  const baseURL = config.api.baseUrl;
  const sportsInfoEndpoint = SportsInfoConfig.endpoints.sportsInfo;

  const apiClient = new ApiClient(baseURL);
  
  try {
    await apiClient.init();

    const getResponse = await apiClient.get(sportsInfoEndpoint, true);
    if (getResponse.status() === HttpStatus.OK) {
      const body = (await getResponse.json()) as SportsInfoResponse;
      if (body.data?.sportsInfo?.length > 0) {
        return body;
      }
    }

    Logger.warn(`No sports info found. Attempting to create '${TestSportsInfo.DEFAULT_SPORT_NAME}' via POST...`);
    const payload = { 
      name: `${TestSportsInfo.SPORT_NAME_PREFIX}-${Math.random().toString(36).substring(2, 8)}` 
    };

    let createResponse = await apiClient.post(sportsInfoEndpoint, payload, true);

    if (SuccessStatusCodes.includes(createResponse.status() as any)) {
      Logger.info(`Created '${TestSportsInfo.DEFAULT_SPORT_NAME}' via POST successfully.`);
      return (await createResponse.json()) as SportsInfoResponse;
    }

    if ([HttpStatus.BAD_REQUEST, HttpStatus.NOT_FOUND].includes(createResponse.status() as 400 | 404)) {
      Logger.warn(`POST failed (${createResponse.status()}), retrying with PATCH...`);
      createResponse = await apiClient.patch(sportsInfoEndpoint, payload, true);

      if (SuccessStatusCodes.includes(createResponse.status() as any)) {
        Logger.info(`Created '${TestSportsInfo.DEFAULT_SPORT_NAME}' via PATCH successfully.`);
        return (await createResponse.json()) as SportsInfoResponse;
      }
    }

    const errText = await createResponse.text();
    Logger.error(`Failed to create sports info: ${createResponse.status()} - ${errText}`);
    return null;
  } catch (error) {
    Logger.error('Error in verifyAndCreateSportsInfo', { error: error instanceof Error ? error.message : String(error) });
    throw error;
  } finally {
    await apiClient.dispose();
  }
}

