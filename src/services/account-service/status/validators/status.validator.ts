import { expect } from '@playwright/test';
import { HttpStatus } from '@shared/constants/http-status-codes';
import { StatusConfig } from '../config/status.config';
import { ServiceStatusResponse } from '../types/status.types';

/**
 * Status Validators
 * 
 * Schema validation functions for Status domain responses.
 */

/**
 * Validates Service Status response
 */
export function validateServiceStatusResponse(
  body: unknown
): asserts body is ServiceStatusResponse {
  expect(typeof body).toBe('object');
  expect(body).toHaveProperty('statusCode', HttpStatus.OK);
  expect(body).toHaveProperty('message');
  expect(body).toHaveProperty('timestamp');
  expect(body).toHaveProperty('path', StatusConfig.paths.status);
  expect(body).toHaveProperty('data');

  const data = (body as ServiceStatusResponse).data;
  expect(typeof data).toBe('object');

  expect(typeof data.running).toBe('boolean');
  expect(typeof data.apiName).toBe('string');
  expect(typeof data.environment).toBe('string');
  expect(typeof data.apiUrl).toBe('string');
  expect(typeof data.timestamp).toBe('string');
  expect(typeof data.uptime).toBe('string');

  expect(typeof data.systemUsage).toBe('object');
  expect(data.systemUsage).toHaveProperty('rss');
  expect(data.systemUsage).toHaveProperty('heapTotal');
  expect(data.systemUsage).toHaveProperty('heapUsed');
  expect(data.systemUsage).toHaveProperty('cpu');

  expect(typeof data.systemUsage.rss).toBe('string');
  expect(typeof data.systemUsage.heapTotal).toBe('string');
  expect(typeof data.systemUsage.heapUsed).toBe('string');

  const cpu = data.systemUsage.cpu;
  expect(typeof cpu).toBe('object');
  expect(cpu).toHaveProperty('user');
  expect(cpu).toHaveProperty('system');
  expect(typeof cpu.user).toBe('string');
  expect(typeof cpu.system).toBe('string');
}

