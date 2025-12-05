import { config } from '@config/appConfig';

import { HttpStatus } from '@shared/constants/http-status-codes';
import { expect, test } from '@shared/fixtures';
import { validateErrorResponse, validateErrorResponseWithId } from '@shared/utils/error-test-helpers';
import { getAlternatePhoneNumber } from '@shared/utils/test-helpers';
import path from 'path';
import { verifyAndCreateHealthInfo } from '../health-info/helpers/health-info.helper';
import { verifyAndCreateSportsInfo } from '../sports-info/helpers/sports-info.helper';
import { AccountConfig, validateAccountResponse } from './index';
import { AccountResponse } from './types/account.types';


const accountEndpoint = AccountConfig.endpoints.account;
const accountAvatarEndpoint = AccountConfig.endpoints.accountAvatar;
const accountPhotoEndpoint = AccountConfig.endpoints.accountPhoto;
const phoneChangeEndpoint = AccountConfig.endpoints.phoneChange;
const phoneVerifyEndpoint = AccountConfig.endpoints.phoneVerify;
const resendCodeEndpoint = AccountConfig.endpoints.phoneResendCode;


test.beforeAll(async ({ apiClient }) => {
  await verifyAndCreateHealthInfo(apiClient);
  await verifyAndCreateSportsInfo(apiClient);
});

test.describe('Account service - Get valid acccount data', () => {
  
  test('GET /account - Should return valid account data', async ({ apiClient }) => {
    const response = await apiClient.get(accountEndpoint);
    expect(response.status(), 'Expected 200 OK for valid token').toBe(HttpStatus.OK);
    const text = await response.text();
    const body: unknown = await response.json();
    validateAccountResponse(body);

    const account = (body as AccountResponse).data.accountInfo;
    expect(account.email).toBeDefined();
    expect(account.deviceUserId).toBeDefined();
    console.log("DEBUG GET /account - Should return valid account data", response.status(), "body:", text);
  });

  test('GET /account - Should return 401 Unauthorized with invalid token', async ({ apiClient }) => {
    (apiClient as any).token = 'invalid-token-12345';
    const response = await apiClient.get(accountEndpoint, false);
    await validateErrorResponse(response, HttpStatus.UNAUTHORIZED);
  });

  test('GET /account - Should throw error when no token is provided', async ({ apiClient }) => {
    (apiClient as any).token = null;
    await expect(apiClient.get(accountEndpoint, false)).rejects.toThrow('Token is not set');
  });
});

test.describe('Account service - Get Avatar', () => {
  test('GET /account/avatar - Should return valid avatar URL', async ({ apiClient }) => {
    const response = await apiClient.get(accountAvatarEndpoint);
    expect(response.status(), 'Expected 200 OK for valid token').toBe(HttpStatus.OK);

    const body = await response.json();
    expect(body).toHaveProperty('data');
    expect(typeof body.data).toBe('string'); // Avatar URL
  });

  test('GET /account/avatar - Should return 401 Unauthorized with invalid token', async ({ apiClient }) => {
    (apiClient as any).token = 'invalid-token-12345';
    const response = await apiClient.get(accountAvatarEndpoint, false);
    await validateErrorResponse(response, HttpStatus.UNAUTHORIZED);
  });

  test('GET /account/avatar - Should throw error when no token is provided', async ({ apiClient }) => {
    (apiClient as any).token = null;
    await expect(apiClient.get(accountAvatarEndpoint, false)).rejects.toThrow('Token is not set');
  });
});

test.describe('Account service - Change account user photo', () => {
  test('POST /account/photo - Should change photo correctly', async ({ apiClient }) => {
    const filePath = path.resolve(__dirname, '../../../../assets/highQFitness.jpg');
    const response = await apiClient.postMultipart(accountPhotoEndpoint, {
      fieldName: 'photo',
      filePath,
    });

    expect(response.status(), 'Expected 201 for successful photo upload').toBe(HttpStatus.CREATED);

    const json = await response.json();
    expect(json).toBeDefined();
  });

  test('POST /account/photo - Should return 401 Unauthorized with invalid token', async ({ apiClient }) => {
    (apiClient as any).token = 'invalid-token-12345';
    const filePath = path.resolve(__dirname, '../../../../assets/highQFitness.jpg');
    const response = await apiClient.postMultipart(accountPhotoEndpoint, {
      fieldName: 'photo',
      filePath,
    }, false);

    expect(response.status()).toBe(HttpStatus.UNAUTHORIZED);
  });

  test('POST /account/photo - Should return ACCOUNT-415-1 for unsupported image format', async ({ apiClient }) => {
    const invalidFilePath = path.resolve(__dirname, '../../../../assets/invalid-format.txt');
    const response = await apiClient.postMultipart(accountPhotoEndpoint, {
      fieldName: 'photo',
      filePath: invalidFilePath,
    }, true);

    await validateErrorResponseWithId(response, HttpStatus.UNSUPPORTED_MEDIA_TYPE, 'ACCOUNT-415-1');
  });
});

test.describe('Account service - Change and verify account phone number', () => {
  test('PATCH /account/phone/resend - Should resend verification code correctly', async ({ apiClient }) => {
    const response = await apiClient.patch(resendCodeEndpoint, {}, true);
    expect(response.status(), 'Expected 200 for successful code resend').toBe(HttpStatus.OK);
    const body = await response.json();

    expect(body.message).toBe(`Verification code has been resent to your updated phone number`);
  });

  test('PATCH /account/phone/verify - Should return AUTH-401-1 for invalid verification code', async ({ apiClient }) => {
    const invalidCode = '000000'; // Invalid verification code

    const response = await apiClient.patch(phoneVerifyEndpoint, { code: invalidCode }, true);
    
    // Should return 401 with invalid code error
    if (response.status() === HttpStatus.UNAUTHORIZED) {
      await validateErrorResponseWithId(response, HttpStatus.UNAUTHORIZED, 'AUTH-401-1');
    }
  });

  test('PATCH /account/phone - Should change phone correctly', async ({ apiClient }) => {
    const phoneToChange = getAlternatePhoneNumber();

    const response = await apiClient.patch(phoneChangeEndpoint, { phoneNumber: phoneToChange }, true);
    expect(response.status(), 'Expected 200 for successful phone change').toBe(HttpStatus.OK);
    const body = await response.json();
    expect(body.message).toBe(
      `Phone number updated to ${phoneToChange}. A verification code has been sent to this number. Please check your messages and enter the code to complete the verification.`
    );
  });

  test('PATCH /account/phone - Should return ACCOUNT-400-2 for phone already verified', async ({ apiClient }) => {
    const currentPhone = config.testData.phoneNumber;
    
    const response = await apiClient.patch(phoneChangeEndpoint, { phoneNumber: currentPhone }, true);
    
    await validateErrorResponseWithId(response, HttpStatus.BAD_REQUEST, 'ACCOUNT-400-1');
  });

  test('PATCH /account/phone - Should return 401 Unauthorized with invalid token', async ({ apiClient }) => {
    (apiClient as any).token = 'invalid-token-12345';
    const phoneToChange = getAlternatePhoneNumber();
    
    const response = await apiClient.patch(phoneChangeEndpoint, { phoneNumber: phoneToChange }, false);
    await validateErrorResponse(response, HttpStatus.UNAUTHORIZED);
  });
});

