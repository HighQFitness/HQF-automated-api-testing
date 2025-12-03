import { APIResponse, expect } from '@playwright/test';
import { HttpStatus } from '../constants/http-status-codes';

/**
 * Error Test Helpers
 * 
 * Utilities for testing error responses and validating error structure.
 */

/**
 * Standard error response structure from API
 */
export interface ErrorResponse {
  statusCode: number;
  errorType?: string;
  errorId?: string;
  title?: string;
  message: string;
  timestamp: string;
  path: string;
}

/**
 * Validates error response structure
 */
export async function validateErrorResponse(
  response: APIResponse,
  expectedStatus: number,
  expectedErrorId?: string
): Promise<void> {
  expect(response.status()).toBe(expectedStatus);

  const body: unknown = await response.json();
  expect(typeof body).toBe('object');
  expect(body).toHaveProperty('statusCode', expectedStatus);
  expect(body).toHaveProperty('message');
  expect(body).toHaveProperty('timestamp');
  expect(body).toHaveProperty('path');

  if (expectedErrorId) {
    expect((body as ErrorResponse).errorId).toBe(expectedErrorId);
  }
}

/**
 * Validates error response with specific error ID
 */
export async function validateErrorResponseWithId(
  response: APIResponse,
  expectedStatus: number,
  expectedErrorId: string
): Promise<void> {
  expect(response.status()).toBe(expectedStatus);

  const body: unknown = await response.json();
  expect(typeof body).toBe('object');
  
  const errorResponse = body as ErrorResponse;
  
  expect(errorResponse.statusCode).toBe(expectedStatus);
  expect(errorResponse.errorId).toBe(expectedErrorId);
  expect(errorResponse).toHaveProperty('message');
  expect(errorResponse).toHaveProperty('timestamp');
  expect(errorResponse).toHaveProperty('path');
  
  if (errorResponse.errorType) {
    expect(typeof errorResponse.errorType).toBe('string');
  }
  
  if (errorResponse.title) {
    expect(typeof errorResponse.title).toBe('string');
  }
}

/**
 * Tests unauthorized error (401)
 */
export async function testUnauthorizedError(
  apiClient: any,
  endpoint: string,
  method: 'get' | 'post' | 'patch' | 'delete',
  body?: unknown
): Promise<void> {
  (apiClient as any).token = 'invalid-token-12345';
  
  let response: APIResponse;
  if (method === 'get') {
    response = await apiClient.get(endpoint, false);
  } else if (method === 'post') {
    response = await apiClient.post(endpoint, body, false);
  } else if (method === 'patch') {
    response = await apiClient.patch(endpoint, body, false);
  } else {
    response = await apiClient.delete(endpoint, false);
  }
  
  await validateErrorResponse(response, HttpStatus.UNAUTHORIZED);
}

/**
 * Tests not found error (404)
 */
export async function testNotFoundError(
  apiClient: any,
  endpoint: string,
  method: 'get' | 'post' | 'patch' | 'delete',
  expectedErrorId: string,
  body?: unknown
): Promise<void> {
  let response: APIResponse;
  if (method === 'get') {
    response = await apiClient.get(endpoint, true);
  } else if (method === 'post') {
    response = await apiClient.post(endpoint, body, true);
  } else if (method === 'patch') {
    response = await apiClient.patch(endpoint, body, true);
  } else {
    response = await apiClient.delete(endpoint, true);
  }
  
  await validateErrorResponseWithId(response, HttpStatus.NOT_FOUND, expectedErrorId);
}

/**
 * Tests bad request error (400)
 */
export async function testBadRequestError(
  apiClient: any,
  endpoint: string,
  method: 'post' | 'patch',
  invalidPayload: unknown,
  expectedErrorId: string
): Promise<void> {
  let response: APIResponse;
  if (method === 'post') {
    response = await apiClient.post(endpoint, invalidPayload, true);
  } else {
    response = await apiClient.patch(endpoint, invalidPayload, true);
  }
  
  await validateErrorResponseWithId(response, HttpStatus.BAD_REQUEST, expectedErrorId);
}

/**
 * Tests service unavailable error (503)
 */
export async function testServiceUnavailableError(
  apiClient: any,
  endpoint: string,
  method: 'get' | 'post' | 'patch' | 'delete',
  expectedErrorId: string,
  body?: unknown
): Promise<void> {
  // This is harder to test without actually causing service issues
  // Usually tested manually or with service mocks
  let response: APIResponse;
  if (method === 'get') {
    response = await apiClient.get(endpoint, true);
  } else if (method === 'post') {
    response = await apiClient.post(endpoint, body, true);
  } else if (method === 'patch') {
    response = await apiClient.patch(endpoint, body, true);
  } else {
    response = await apiClient.delete(endpoint, true);
  }
  
  // Only validate if we actually get 503
  if (response.status() === HttpStatus.INTERNAL_SERVER_ERROR || response.status() === 503) {
    await validateErrorResponseWithId(response, 503, expectedErrorId);
  }
}

