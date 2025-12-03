import { expect } from '@playwright/test';
import { HttpStatus } from '@shared/constants/http-status-codes';
import {
  CompleteUploadResponse,
  GeneratePresignedUrlResponse,
  InitiateUploadResponse,
} from '../types/feedback.types';

/**
 * Feedback Validators
 * 
 * Schema validation functions for Feedback domain responses.
 */

/**
 * Validates Initiate Upload response
 */
export function validateInitiateUploadResponse(
  body: unknown
): asserts body is InitiateUploadResponse {
  expect(typeof body).toBe('object');
  expect(body).toHaveProperty('statusCode', HttpStatus.OK);
  expect(body).toHaveProperty('message');
  expect(body).toHaveProperty('timestamp');
  expect(body).toHaveProperty('path');
  expect(body).toHaveProperty('data');

  const data = (body as InitiateUploadResponse).data;
  expect(data).toHaveProperty('uploadId');
  expect(typeof data.uploadId).toBe('string');
  expect(data.uploadId.length).toBeGreaterThan(0);
}

/**
 * Validates Generate Presigned URL response
 */
export function validateGeneratePresignedUrlResponse(
  body: unknown
): asserts body is GeneratePresignedUrlResponse {
  expect(typeof body).toBe('object');
  expect(body).toHaveProperty('statusCode', HttpStatus.OK);
  expect(body).toHaveProperty('message');
  expect(body).toHaveProperty('timestamp');
  expect(body).toHaveProperty('path');
  expect(body).toHaveProperty('data');

  const data = (body as GeneratePresignedUrlResponse).data;
  expect(data).toHaveProperty('presignedUrl');
  expect(typeof data.presignedUrl).toBe('string');
  expect(data.presignedUrl.length).toBeGreaterThan(0);
}

/**
 * Validates Complete Upload response
 */
export function validateCompleteUploadResponse(
  body: unknown
): asserts body is CompleteUploadResponse {
  expect(typeof body).toBe('object');
  expect(body).toHaveProperty('statusCode', HttpStatus.OK);
  expect(body).toHaveProperty('message');
  expect(body).toHaveProperty('timestamp');
  expect(body).toHaveProperty('path');
  expect(body).toHaveProperty('data');

  const data = (body as CompleteUploadResponse).data;
  expect(data).toHaveProperty('fileUrl');
  expect(typeof data.fileUrl).toBe('string');
}

