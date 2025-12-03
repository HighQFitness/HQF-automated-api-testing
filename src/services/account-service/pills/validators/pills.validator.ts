import { expect } from '@playwright/test';
import { HttpStatus } from '@shared/constants/http-status-codes';
import { PillsResponse } from '../types/pills.types';

/**
 * Pills Validators
 * 
 * Schema validation functions for Pills domain responses.
 */

/**
 * Validates Pills response
 */
export function validatePillsResponse(body: unknown): asserts body is PillsResponse {
  expect(typeof body).toBe('object');
  expect(body).toHaveProperty('statusCode', HttpStatus.OK);
  expect(body).toHaveProperty('message');
  expect(body).toHaveProperty('timestamp');
  expect(body).toHaveProperty('path');
  expect(body).toHaveProperty('data');

  const data = (body as PillsResponse).data;
  expect(Array.isArray(data.pills)).toBe(true);

  for (const pill of data.pills) {
    expect(pill).toHaveProperty('id');
    expect(pill).toHaveProperty('pillId');
    expect(pill).toHaveProperty('position');
    expect(pill).toHaveProperty('macAddress');
    expect(pill).toHaveProperty('createdAt');
    expect(pill).toHaveProperty('updatedAt');

    expect(typeof pill.id).toBe('string');
    expect(typeof pill.pillId).toBe('string');
    expect(typeof pill.position).toBe('number');
    expect(typeof pill.macAddress).toBe('string');
    expect(typeof pill.createdAt).toBe('string');
    expect(typeof pill.updatedAt).toBe('string');

    expect(pill.macAddress).toMatch(/^([0-9A-F]{2}:){5}[0-9A-F]{2}$/);
  }
}

