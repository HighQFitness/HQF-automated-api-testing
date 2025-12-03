/**
 * Feedback Domain Types
 * 
 * TypeScript interfaces and types specific to the Feedback API domain.
 */

/**
 * Initiate Upload Request
 */
export interface InitiateUploadRequest {
  fileName: string;
  contentType: string;
}

/**
 * Initiate Upload Response
 */
export interface InitiateUploadResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
  data: {
    uploadId: string;
    [key: string]: unknown;
  };
}

/**
 * Generate Presigned URL Request
 */
export interface GeneratePresignedUrlRequest {
  uploadId: string;
  partNumber: number;
}

/**
 * Generate Presigned URL Response
 */
export interface GeneratePresignedUrlResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
  data: {
    presignedUrl: string;
    [key: string]: unknown;
  };
}

/**
 * Upload Part
 */
export interface UploadPart {
  etag: string;
  partNumber: number;
}

/**
 * Complete Upload Request
 */
export interface CompleteUploadRequest {
  uploadId: string;
  parts: UploadPart[];
}

/**
 * Complete Upload Response
 */
export interface CompleteUploadResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
  data: {
    fileUrl: string;
    [key: string]: unknown;
  };
}

