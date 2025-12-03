import { expect } from '@playwright/test';
import { HttpStatus } from '@shared/constants/http-status-codes';
import { HealthInfoResponse } from '../types/health-info.types';

/**
 * Health Info Validators
 * 
 * Schema validation functions for Health Info domain responses.
 */

/**
 * Validates Health Info response
 */
export function validateHealthInfoResponse(body: unknown): asserts body is HealthInfoResponse {
  const data = (body as HealthInfoResponse).data;

  expect(body).toHaveProperty('statusCode', HttpStatus.OK);
  expect(body).toHaveProperty('message');
  expect(body).toHaveProperty('timestamp');
  expect(body).toHaveProperty('path');
  expect(body).toHaveProperty('data');

  expect(data).toHaveProperty('id');
  expect(data).toHaveProperty('height');
  expect(data).toHaveProperty('weight');
  expect(data).toHaveProperty('createdAt');

  expect(typeof data.id).toBe('string');
  expect(typeof data.createdAt).toBe('string');
  expect(typeof data.biologicalSex).toBe('string');
  expect(typeof data.height).toBe('object');
  expect(typeof data.weight).toBe('object');
}

