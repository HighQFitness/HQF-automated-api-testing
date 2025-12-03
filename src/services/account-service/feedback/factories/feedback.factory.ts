import { CompleteUploadRequest, GeneratePresignedUrlRequest, InitiateUploadRequest, UploadPart } from '../types/feedback.types';

/**
 * Feedback Factory
 * 
 * Generates test data for Feedback domain tests.
 */
export class FeedbackFactory {
  /**
   * Creates a valid initiate upload payload
   */
  static validInitiateUpload(): InitiateUploadRequest {
    return {
      fileName: `test-feedback-${Date.now()}.jpg`,
      contentType: 'image/jpeg',
    };
  }

  /**
   * Creates an invalid initiate upload payload (missing fileName)
   */
  static invalidInitiateUpload(): Partial<InitiateUploadRequest> {
    return {
      contentType: 'image/jpeg',
    };
  }

  /**
   * Creates a valid generate presigned URL payload
   */
  static validGeneratePresignedUrl(uploadId: string, partNumber = 1): GeneratePresignedUrlRequest {
    return {
      uploadId,
      partNumber,
    };
  }

  /**
   * Creates an invalid generate presigned URL payload
   */
  static invalidGeneratePresignedUrl(): Partial<GeneratePresignedUrlRequest> {
    return {
      uploadId: '',
    };
  }

  /**
   * Creates a valid complete upload payload
   */
  static validCompleteUpload(uploadId: string, parts: UploadPart[]): CompleteUploadRequest {
    return {
      uploadId,
      parts,
    };
  }

  /**
   * Creates an invalid complete upload payload
   */
  static invalidCompleteUpload(): Partial<CompleteUploadRequest> {
    return {
      uploadId: '',
      parts: [],
    };
  }
}

