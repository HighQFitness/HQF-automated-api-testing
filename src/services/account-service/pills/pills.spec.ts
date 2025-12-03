import { HttpStatus } from '@shared/constants/http-status-codes';
import { expect, test } from '@shared/fixtures';
import { PillsConfig, PillsFactory, validatePillsResponse } from './index';
import { PillsResponse } from './types/pills.types';

const pillsEndpoint = PillsConfig.endpoints.pills;

test.describe('Account Service - GET pills', () => {
  test('GET /pills - Should return valid pills information', async ({ apiClient }) => {
    const response = await apiClient.get(pillsEndpoint);
    const body = await response.json();
    validatePillsResponse(body);

    const data = (body as PillsResponse).data;

    if (data.pills.length === 0) {
      expect(data.pills).toEqual([]);
    } else {
      const actual = data.pills[0];
      expect(typeof actual.id).toBe('string');
      expect(actual.id).toMatch(/^[0-9a-fA-F-]{36}$/);
      expect(actual.macAddress).toMatch(/^([0-9A-F]{2}:){5}[0-9A-F]{2}$/);
    }
  });

  test('GET /pills - Should return 401 Unauthorized with invalid token', async ({ apiClient }) => {
    (apiClient as any).token = 'invalid-token-12345';
    const response = await apiClient.get(pillsEndpoint, false);
    expect(response.status()).toBe(HttpStatus.UNAUTHORIZED);
  });

  test('GET /pills - Should throw error when no token is provided', async ({ apiClient }) => {
    (apiClient as any).token = null;
    await expect(apiClient.get(pillsEndpoint, false)).rejects.toThrow('Token is not set');
  });
});

test.describe('Account Service - POST pills', () => {
  test('POST /pills - Should create valid pills entity', async ({ apiClient }) => {
    const payload = PillsFactory.createValidBody();

    const response = await apiClient.post(pillsEndpoint, payload);
    expect(response.status(), 'Expected 200 OK for pills creation').toBe(HttpStatus.OK);

    const body: unknown = await response.json();
    validatePillsResponse(body);

    const data = (body as PillsResponse).data;

    expect(Array.isArray(data.pills)).toBe(true);
    expect(data.pills.length).toBeGreaterThan(0);

    for (const pill of data.pills) {
      expect(pill.pillId).toMatch(/0000[A-Z]{4}-0000-1000-8000-00805F9B34FB/);
      expect(pill.macAddress).toMatch(/^([0-9A-F]{2}:){5}[0-9A-F]{2}$/);
      expect(typeof pill.position).toBe('number');
    }
  });

  test('POST /pills - Should return 401 Unauthorized with invalid token', async ({ apiClient }) => {
    const payload = PillsFactory.createValidBody();
    (apiClient as any).token = 'invalid-token-12345';
    const response = await apiClient.post(pillsEndpoint, payload, false);
    expect(response.status()).toBe(HttpStatus.UNAUTHORIZED);
  });

  test('POST /pills - Should throw error when no token is provided', async ({ apiClient }) => {
    const payload = PillsFactory.createValidBody();
    (apiClient as any).token = null;
    await expect(apiClient.post(pillsEndpoint, payload, false)).rejects.toThrow('Token is not set');
  });
});

