import { config } from '@config/appConfig';
import { ApiClient } from '@shared/client/api-client';
import { HttpStatus } from '@shared/constants/http-status-codes';
import { expect, test } from '@shared/fixtures';
import {
  FeedbackConfig,
  FeedbackFactory,
  validateGeneratePresignedUrlResponse,
  validateInitiateUploadResponse
} from './index';
import {
  GeneratePresignedUrlResponse,
  InitiateUploadResponse
} from './types/feedback.types';

const initiateUploadEndpoint = FeedbackConfig.endpoints.initiateUpload;
const generatePresignedUrlEndpoint = FeedbackConfig.endpoints.generatePresignedUrl;
const completeUploadEndpoint = FeedbackConfig.endpoints.completeUpload;

test.describe('Account Service - Feedback Initiate Upload', () => {

  test('POST /feedback/initiate-upload - Should initiate upload successfully', async ({ apiClient }) => {
    const payload = FeedbackFactory.validInitiateUpload();

    const response = await apiClient.post(initiateUploadEndpoint, payload, true);
    expect(response.status(), 'Expected 200 OK for valid upload initiation').toBe(HttpStatus.OK);

    const body: unknown = await response.json();
    validateInitiateUploadResponse(body);

    const data = (body as InitiateUploadResponse).data;
    expect(data.uploadId).toBeDefined();
    expect(typeof data.uploadId).toBe('string');
  });

  test('POST /feedback/initiate-upload - Should return 401 Unauthorized with invalid token', async ({ apiClient }) => {
    (apiClient as any).token = 'invalid-token-12345';
    const payload = FeedbackFactory.validInitiateUpload();

    const response = await apiClient.post(initiateUploadEndpoint, payload, false);
    expect(response.status()).toBe(HttpStatus.UNAUTHORIZED);
  });

  test('POST /feedback/initiate-upload - Should throw error when no token is provided', async ({ apiClient }) => {
    (apiClient as any).token = null;
    const payload = FeedbackFactory.validInitiateUpload();

    await expect(apiClient.post(initiateUploadEndpoint, payload, false)).rejects.toThrow('Token is not set');
  });

  test('POST /feedback/initiate-upload - Should return 400 for invalid file name', async ({ apiClient }) => {
    const invalidPayload = FeedbackFactory.invalidInitiateUpload();

    const response = await apiClient.post(initiateUploadEndpoint, invalidPayload, true);
    expect(response.status()).toBe(HttpStatus.BAD_REQUEST);

    const body = await response.json();
    expect(body).toHaveProperty('errorId', 'FEEDBACK-400-1'); // Invalid file name
  });
});

test.describe('Account Service - Feedback Generate Presigned URL', () => {
  let uploadId: string;

  test.beforeAll(async () => {
    // Initiate an upload first to get uploadId for shared use in tests
    const setupClient = new ApiClient(config.api.baseUrl);
    await setupClient.init();
    try {
      const initiatePayload = FeedbackFactory.validInitiateUpload();
      const initiateResponse = await setupClient.post(initiateUploadEndpoint, initiatePayload, true);
      const initiateBody = (await initiateResponse.json()) as InitiateUploadResponse;
      uploadId = initiateBody.data.uploadId;
    } finally {
      await setupClient.dispose();
    }
  });

  test('POST /feedback/generate-presigned-url - Should generate presigned URL successfully', async ({ apiClient }) => {
    const payload = FeedbackFactory.validGeneratePresignedUrl(uploadId, 1);

    const response = await apiClient.post(generatePresignedUrlEndpoint, payload, true);
    expect(response.status(), 'Expected 200 OK for valid presigned URL generation').toBe(HttpStatus.OK);

    const body: unknown = await response.json();
    validateGeneratePresignedUrlResponse(body);

    const data = (body as GeneratePresignedUrlResponse).data;
    expect(data.presignedUrl).toBeDefined();
    expect(typeof data.presignedUrl).toBe('string');
    expect(data.presignedUrl).toContain('http');
  });

  test('POST /feedback/generate-presigned-url - Should return 401 Unauthorized with invalid token', async ({ apiClient }) => {
    (apiClient as any).token = 'invalid-token-12345';
    const payload = FeedbackFactory.validGeneratePresignedUrl(uploadId, 1);

    const response = await apiClient.post(generatePresignedUrlEndpoint, payload, false);
    expect(response.status()).toBe(HttpStatus.UNAUTHORIZED);
  });

  test('POST /feedback/generate-presigned-url - Should return 400 for invalid upload ID', async ({ apiClient }) => {
    const invalidPayload = FeedbackFactory.invalidGeneratePresignedUrl();

    const response = await apiClient.post(generatePresignedUrlEndpoint, invalidPayload, true);
    expect(response.status()).toBe(HttpStatus.BAD_REQUEST);

    const body = await response.json();
    expect(body).toHaveProperty('errorId', 'FEEDBACK-400-3'); // Invalid upload ID
  });
});

test.describe('Account Service - Feedback Complete Upload', () => {
  let uploadId: string;

  test.beforeAll(async () => {
    // Initiate an upload first to get uploadId for shared use in tests
    const setupClient = new ApiClient(config.api.baseUrl);
    await setupClient.init();
    try {
      const initiatePayload = FeedbackFactory.validInitiateUpload();
      const initiateResponse = await setupClient.post(initiateUploadEndpoint, initiatePayload, true);
      const initiateBody = (await initiateResponse.json()) as InitiateUploadResponse;
      uploadId = initiateBody.data.uploadId;
    } finally {
      await setupClient.dispose();
    }
  });

  test('POST /feedback/complete-upload - Should return 401 Unauthorized with invalid token', async ({ apiClient }) => {
    (apiClient as any).token = 'invalid-token-12345';
    const parts = [
      {
        etag: 'mock-etag-1',
        partNumber: 1,
      },
    ];
    const payload = FeedbackFactory.validCompleteUpload(uploadId, parts);

    const response = await apiClient.post(completeUploadEndpoint, payload, false);
    expect(response.status()).toBe(HttpStatus.UNAUTHORIZED);
  });

  test('POST /feedback/complete-upload - Should return 400 for invalid parts', async ({ apiClient }) => {
    const invalidPayload = FeedbackFactory.invalidCompleteUpload();

    const response = await apiClient.post(completeUploadEndpoint, invalidPayload, true);
    expect(response.status()).toBe(HttpStatus.BAD_REQUEST);

    const body = await response.json();
    expect(body).toHaveProperty('errorId', 'FEEDBACK-400-5'); // Invalid parts
  });
});

