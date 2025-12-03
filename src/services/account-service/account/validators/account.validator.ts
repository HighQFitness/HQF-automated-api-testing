import { ApiPaths } from '@constants/testData';
import { expect } from '@playwright/test';
import { HttpStatus } from '@shared/constants/http-status-codes';
import { AccountResponse } from '../types/account.types';

/**
 * Account Validators
 * 
 * Schema validation functions for Account domain responses.
 */

/**
 * Validates Account response
 */
export function validateAccountResponse(body: unknown): asserts body is AccountResponse {
  expect(typeof body).toBe('object');
  expect(body).toHaveProperty('statusCode', HttpStatus.OK);
  expect(body).toHaveProperty('message');
  expect(body).toHaveProperty('timestamp');
  expect(body).toHaveProperty('path', ApiPaths.ACCOUNT);
  expect(body).toHaveProperty('data');

  const data = (body as AccountResponse).data;

  // Always expected
  expect(data.accountInfo).toHaveProperty('email');
  expect(data.accountInfo).toHaveProperty('deviceUserId');
  expect(data.healthInfo).toHaveProperty('height');
  expect(data.healthInfo).toHaveProperty('weight');
  expect(Array.isArray(data.workoutUnitsInfos)).toBe(true);
  expect(Array.isArray(data.workoutPlaceInfos)).toBe(true);

  if ('sportsInfo' in data && data.sportsInfo != null) {
    expect(Array.isArray(data.sportsInfo)).toBe(true);
  }
}

