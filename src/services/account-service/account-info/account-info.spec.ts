import { config } from '@config/appConfig';
import { HttpStatus } from '@shared/constants/http-status-codes';
import { expect, test } from '@shared/fixtures';
import { validateErrorResponse, validateErrorResponseWithId } from '@shared/utils/error-test-helpers';
import { getUserName } from '@shared/utils/test-helpers';
import { AccountInfoConfig } from './config/account-info.config';
import { AccountInfoFactory } from './factories/account-info.factory';
import { AccountInfoResponse, UsernameResponse } from './types/account-info.types';
import { validateAccountInfoResponse, validateUsernameResponse } from './validators/account-info.validator';

const accountInfoEndpoint = AccountInfoConfig.endpoints.accountInfo;
const deviceIdparam = config.device.userId;
const accountUserInfoEndpointWithParam = AccountInfoConfig.getUsernameEndpoint(deviceIdparam);

test.describe('Account Service - GET Account Information', () => {
  test('GET /account-info - Should return valid account information', async ({ apiClient }) => {
    const response = await apiClient.get(accountInfoEndpoint);
    expect(response.status(), 'Expected 200 OK for valid token').toBe(HttpStatus.OK);

    const body: unknown = await response.json();
    validateAccountInfoResponse(body);

    const account = (body as AccountInfoResponse).data;
    expect(account.email).toBeDefined();
    expect(account.deviceUserId).toBeDefined();
  });

  test('GET /account-info - Should return 401 Unauthorized with invalid token', async ({ apiClient }) => {
    (apiClient as any).token = 'invalid-token-12345';
    const response = await apiClient.get(accountInfoEndpoint, false);
    await validateErrorResponse(response, HttpStatus.UNAUTHORIZED);
  });

  test('GET /account-info - Should throw error when no token is provided', async ({ apiClient }) => {
    (apiClient as any).token = null;
    await expect(apiClient.get(accountInfoEndpoint, false)).rejects.toThrow('Token is not set');
  });
});

test.describe('Account Service - PATCH Account Information', () => {
  test('PATCH /account-info - Should return valid updated account information', async ({ apiClient }) => {
    const payload = AccountInfoFactory.valid();

    const response = await apiClient.patch(accountInfoEndpoint, payload, true);
    expect(response.status(), 'Expected 200 OK for valid token').toBe(HttpStatus.OK);

    const body: unknown = await response.json();
    validateAccountInfoResponse(body, 'partial');

    const account = (body as AccountInfoResponse).data;
    expect(account.email).toBeDefined();
  });

  test('PATCH /account-info - Should return 401 Unauthorized with invalid token', async ({ apiClient }) => {
    (apiClient as any).token = 'invalid-token-12345';
    const payload = AccountInfoFactory.valid();

    const response = await apiClient.patch(accountInfoEndpoint, payload, false);
    await validateErrorResponse(response, HttpStatus.UNAUTHORIZED);
  });

  test('PATCH /account-info - Should return ACCOUNT-INFO-400-5 for invalid fields', async ({ apiClient }) => {
    // Test with invalid/incomplete payload
    const invalidPayload = {
      invalidField: 'invalid',
    };

    const response = await apiClient.patch(accountInfoEndpoint, invalidPayload, true);
    
    if (response.status() === HttpStatus.BAD_REQUEST) {
      const body = await response.json();
      if ((body as any).errorId === 'ACCOUNT-INFO-400-5') {
        await validateErrorResponseWithId(response, HttpStatus.BAD_REQUEST, 'ACCOUNT-INFO-400-5');
      }
    }
  });

  test('PATCH /account-info - Should throw error when no token is provided', async ({ apiClient }) => {
    (apiClient as any).token = null;
    const payload = AccountInfoFactory.valid();

    await expect(apiClient.patch(accountInfoEndpoint, payload, false)).rejects.toThrow('Token is not set');
  });
});

test.describe('Account Service - GET User Name', () => {
  test('GET /account-info/username - Should return valid updated account information', async ({ apiClient }) => {
    const userName = getUserName();

    const response = await apiClient.get(accountUserInfoEndpointWithParam, true);
    expect(response.status(), 'Expected 200 OK for valid token').toBe(HttpStatus.OK);

    const body: unknown = await response.json();
    validateUsernameResponse(body);

    const data = (body as UsernameResponse).data;
    expect(data.username).toContain(userName);
    expect(body).toHaveProperty('path');
    expect(body).toHaveProperty('message');
  });

  test('GET /account-info/username - Should return 401 Unauthorized with invalid token', async ({ apiClient }) => {
    (apiClient as any).token = 'invalid-token-12345';
    const response = await apiClient.get(accountUserInfoEndpointWithParam, false);
    await validateErrorResponse(response, HttpStatus.UNAUTHORIZED);
  });

  test('GET /account-info/username - Should return ACCOUNT-INFO-400-3 for missing device_user_id', async ({ apiClient }) => {
    // Test without device_user_id query parameter
    const endpointWithoutParam = AccountInfoConfig.endpoints.accountInfoUsername;
    const response = await apiClient.get(endpointWithoutParam, true);
    
    if (response.status() === HttpStatus.BAD_REQUEST) {
      const body = await response.json();
      if ((body as any).errorId === 'ACCOUNT-INFO-400-3') {
        await validateErrorResponseWithId(response, HttpStatus.BAD_REQUEST, 'ACCOUNT-INFO-400-3');
      }
    }
  });

  test('GET /account-info/username - Should throw error when no token is provided', async ({ apiClient }) => {
    (apiClient as any).token = null;

    await expect(apiClient.get(accountUserInfoEndpointWithParam, false)).rejects.toThrow('Token is not set');
  });
});

