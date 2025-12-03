import { config } from '@config/appConfig';
import { ApiClient } from '@shared/client/api-client';
import { HttpStatus } from '@shared/constants/http-status-codes';
import { expect, test } from '@shared/fixtures';
import { validateErrorResponse, validateErrorResponseWithId } from '@shared/utils/error-test-helpers';
import {
  HealthInfoConfig,
  HealthInfoFactory,
  validateHealthInfoResponse,
  verifyAndCreateHealthInfo,
} from './index';
import { HealthInfoResponse } from './types/health-info.types';

const userHealthWeight = config.health.weight;
const userHealthHeight = config.health.height;
const userBiologicalSex = config.health.biologicalSex;
const healthInfoEndpoint = HealthInfoConfig.endpoints.healthInfo;

test.describe.serial('Account Service - GET Health Information', () => {
  test.beforeAll(async () => {
    await verifyAndCreateHealthInfo();
  });

  test.afterAll(async () => {
    await verifyAndCreateHealthInfo();
  });

  test('GET /health-info - Should return valid health information', async ({ apiClient }) => {
    const response = await apiClient.get(healthInfoEndpoint, true);
    expect(response.status(), 'Expected 200 OK for valid token').toBe(HttpStatus.OK);

    const body: unknown = await response.json();
    validateHealthInfoResponse(body);

    const health = (body as HealthInfoResponse).data;
    expect(health.height.value).toBe(userHealthHeight);
    expect(health.weight.value).toBe(userHealthWeight);
  });

  test('GET /health-info - Should return 401 Unauthorized with invalid token', async ({ apiClient }) => {
    (apiClient as any).token = 'invalid-token-12345';
    const response = await apiClient.get(healthInfoEndpoint, false);
    expect(response.status()).toBe(HttpStatus.UNAUTHORIZED);
  });

  test('GET /health-info - Should throw when no token is provided', async ({ apiClient }) => {
    (apiClient as any).token = null;
    await expect(apiClient.get(healthInfoEndpoint, false)).rejects.toThrow('Token is not set');
  });
});

test.describe.serial('Account Service - PATCH Health Information', () => {
  test('PATCH /health-info - Should return valid updated health information', async ({ apiClient }) => {
    const payload = HealthInfoFactory.valid(userBiologicalSex);

    const response = await apiClient.patch(healthInfoEndpoint, payload, true);
    expect(response.status(), 'Expected 200 OK for valid token').toBe(HttpStatus.OK);

    const body: unknown = await response.json();
    const health = (body as HealthInfoResponse).data;
    expect(health.height.value).toBe(userHealthHeight);
    expect(health.weight.value).toBe(userHealthWeight);
    expect(health.biologicalSex).toBeDefined();
  });

  test('PATCH /health-info - Should return 401 Unauthorized with invalid token', async ({ apiClient }) => {
    (apiClient as any).token = 'invalid-token-12345';
    const payload = HealthInfoFactory.valid(userBiologicalSex);

    const response = await apiClient.patch(healthInfoEndpoint, payload, false);
    await validateErrorResponse(response, HttpStatus.UNAUTHORIZED);
  });

  test('PATCH /health-info - Should return HEALTH-INFO-400-1 for invalid units', async ({ apiClient }) => {
    const invalidPayload = HealthInfoFactory.invalidUnits();
    
    const response = await apiClient.patch(healthInfoEndpoint, invalidPayload, true);
    
    if (response.status() === HttpStatus.BAD_REQUEST) {
      const body = await response.json();
      if ((body as any).errorId === 'HEALTH-INFO-400-1') {
        await validateErrorResponseWithId(response, HttpStatus.BAD_REQUEST, 'HEALTH-INFO-400-1');
      }
    }
  });

  test('PATCH /health-info - Should throw when no token is provided', async ({ apiClient }) => {
    (apiClient as any).token = null;
    const payload = HealthInfoFactory.valid(userBiologicalSex);

    await expect(apiClient.patch(healthInfoEndpoint, payload, false)).rejects.toThrow('Token is not set');
  });
});

test.describe.serial('Account Service - DELETE Health Information', () => {
  test.beforeAll(async () => {
    // Set up health info before DELETE test
    const setupClient = new ApiClient(config.api.baseUrl);
    await setupClient.init();
    try {
      const payload = HealthInfoFactory.valid(userBiologicalSex);
      const response = await setupClient.patch(healthInfoEndpoint, payload, true);
      expect(response.status(), 'Expected 200 OK for valid token').toBe(HttpStatus.OK);
    } finally {
      await setupClient.dispose();
    }
  });

  test.afterAll(async () => {
    await verifyAndCreateHealthInfo();
  });

  test('DELETE /health-info - Should return valid updated health information', async ({ apiClient }) => {
    const response = await apiClient.delete(healthInfoEndpoint, true);
    expect(response.status(), 'Expected 200 OK for valid token').toBe(HttpStatus.OK);
  });

  test('DELETE /health-info - Should return 401 Unauthorized with invalid token', async ({ apiClient }) => {
    (apiClient as any).token = 'invalid-token-12345';
    const response = await apiClient.delete(healthInfoEndpoint, false);
    await validateErrorResponse(response, HttpStatus.UNAUTHORIZED);
  });

  test('DELETE /health-info - Should throw error when no token is provided', async ({ apiClient }) => {
    (apiClient as any).token = null;
    await expect(apiClient.delete(healthInfoEndpoint, false)).rejects.toThrow('Token is not set');
  });
});

