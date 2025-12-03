import { HttpStatus, SuccessStatusCodes } from '@shared/constants/http-status-codes';
import { expect, test } from '@shared/fixtures';
import { validate as validateUUID } from 'uuid';
import {
  SportsInfoConfig,
  SportsInfoFactory,
  validateSportsInfoResponse,
  verifyAndCreateSportsInfo,
} from './index';
import { SportsInfoResponse } from './types/sports-info.types';

const sportsInfoEndpoint = SportsInfoConfig.endpoints.sportsInfo;

test.describe.serial('Account Service - GET /sports-info', () => {
  test.beforeAll(async () => {
    await verifyAndCreateSportsInfo();
  });

  test('GET /sports-info - Should return valid sports information (valid token)', async ({ apiClient }) => {
    const response = await apiClient.get(sportsInfoEndpoint, true);
    expect(response.status()).toBe(HttpStatus.OK);

    const body: unknown = await response.json();
    validateSportsInfoResponse(body);

    const parsed = body as SportsInfoResponse;
    expect(parsed.statusCode).toBe(HttpStatus.OK);
    expect(Array.isArray(parsed.data.sportsInfo)).toBe(true);

    if (parsed.data.sportsInfo.length > 0) {
      const sport = parsed.data.sportsInfo[0];
      expect(validateUUID(sport.id)).toBe(true);
      expect(typeof sport.name).toBe('string');
    }
  });

  test('GET /sports-info - Should return 401 with invalid token', async ({ apiClient }) => {
    (apiClient as any).token = 'invalid-token-123';
    const response = await apiClient.get(sportsInfoEndpoint, false);
    expect(response.status()).toBe(HttpStatus.UNAUTHORIZED);
  });

  test('GET /sports-info - Should throw when no token is provided', async ({ apiClient }) => {
    (apiClient as any).token = null;
    await expect(apiClient.get(sportsInfoEndpoint, false)).rejects.toThrow('Token is not set');
  });
});

test.describe.serial('Account Service - PATCH /sports-info', () => {
  test.beforeAll(async () => {
    await verifyAndCreateSportsInfo();
  });

  test('PATCH /sports-info - Should update existing sport successfully (valid token)', async ({ apiClient }) => {
    let response = await apiClient.patch(sportsInfoEndpoint, { name: `CrossFit-${Date.now()}` }, true);

    if (response.status() === HttpStatus.NOT_FOUND) {
      await verifyAndCreateSportsInfo();
      response = await apiClient.patch(sportsInfoEndpoint, { name: `CrossFit-${Date.now()}` }, true);
    }

    expect(SuccessStatusCodes.includes(response.status() as any)).toBe(true);

    const body: unknown = await response.json();
    const data = (body as any).data;
    const sport = Array.isArray(data.sportsInfo) ? data.sportsInfo[0] : data;

    expect(sport).toBeDefined();
    expect(validateUUID(sport.id)).toBe(true);
    expect(sport.name).toContain('CrossFit');
  });

  test('PATCH /sports-info - Should return 401 Unauthorized with invalid token', async ({ apiClient }) => {
    (apiClient as any).token = 'invalid-token-123';
    const payload = SportsInfoFactory.returnValidSportsInfo();
    const response = await apiClient.patch(sportsInfoEndpoint, payload, false);
    expect(response.status()).toBe(HttpStatus.UNAUTHORIZED);
  });

  test('PATCH /sports-info - Should throw when no token is provided', async ({ apiClient }) => {
    (apiClient as any).token = null;
    const payload = SportsInfoFactory.returnValidSportsInfo();
    await expect(apiClient.patch(sportsInfoEndpoint, payload, false)).rejects.toThrow('Token is not set');
  });
});

test.describe.serial('Account Service - DELETE /sports-info', () => {
  test.beforeAll(async () => {
    await verifyAndCreateSportsInfo();
  });

  test.afterAll(async () => {
    await verifyAndCreateSportsInfo();
  });

  test('DELETE /sports-info - Should delete existing sports information (valid token)', async ({ apiClient }) => {
    let response = await apiClient.delete(sportsInfoEndpoint, true);

    if (response.status() === HttpStatus.NOT_FOUND) {
      await verifyAndCreateSportsInfo();
      response = await apiClient.delete(sportsInfoEndpoint, true);
    }

    expect([HttpStatus.OK, HttpStatus.NO_CONTENT]).toContain(response.status());
  });

  test('DELETE /sports-info - Should return 401 Unauthorized with invalid token', async ({ apiClient }) => {
    (apiClient as any).token = 'invalid-token-123';
    const response = await apiClient.delete(sportsInfoEndpoint, false);
    expect(response.status()).toBe(HttpStatus.UNAUTHORIZED);
  });

  test('DELETE /sports-info - Should throw when no token is provided', async ({ apiClient }) => {
    (apiClient as any).token = null;
    await expect(apiClient.delete(sportsInfoEndpoint, false)).rejects.toThrow('Token is not set');
  });
});

