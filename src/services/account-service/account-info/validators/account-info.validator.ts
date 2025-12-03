import { expect } from '@playwright/test';
import { AccountInfoResponse, UsernameResponse } from '../types/account-info.types';

/**
 * Account Info Validators
 * 
 * Schema validation functions for Account Info domain responses.
 */

/**
 * Validates Account Info response
 */
export function validateAccountInfoResponse(
  body: unknown,
  mode: 'full' | 'partial' = 'full'
): asserts body is AccountInfoResponse {
  const data = (body as AccountInfoResponse).data;

  expect(data).toHaveProperty('name');
  expect(data).toHaveProperty('email');
  expect(data).toHaveProperty('phoneNumber');
  expect(data).toHaveProperty('address');

  if (mode === 'full') {
    expect(data).toHaveProperty('deviceUserId');
    expect(data).toHaveProperty('avatar');
  }

  expect(typeof data.address).toBe('object');
  expect(data.address).toHaveProperty('address1');
  expect(data.address).toHaveProperty('city');
}

/**
 * Validates Username response
 */
export function validateUsernameResponse(body: unknown): asserts body is UsernameResponse {
  expect(typeof body).toBe('object');
  if (!body || typeof body !== 'object') throw new Error('Invalid body object');

  const res = body as UsernameResponse;

  expect(res).toHaveProperty('statusCode');
  expect(res).toHaveProperty('message');
  expect(res).toHaveProperty('timestamp');
  expect(res).toHaveProperty('path');
  expect(res).toHaveProperty('data');

  expect(typeof res.statusCode).toBe('number');
  expect(typeof res.message).toBe('string');
  expect(typeof res.timestamp).toBe('string');
  expect(typeof res.path).toBe('string');

  expect(res.data).toHaveProperty('username');
  expect(typeof res.data.username).toBe('string');
  expect(res.data.username.length).toBeGreaterThan(0);
}

