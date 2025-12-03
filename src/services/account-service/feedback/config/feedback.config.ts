import { config } from '@config/appConfig';

/**
 * Feedback Domain Configuration
 * 
 * Centralized configuration for Feedback API endpoints and domain-specific settings.
 */
export const FeedbackConfig = {
  /**
   * API Endpoints
   */
  endpoints: {
    initiateUpload: config.endpoints.feedbackInitiateUpload,
    generatePresignedUrl: config.endpoints.feedbackGeneratePresignedUrl,
    completeUpload: config.endpoints.feedbackCompleteUpload,
  },
} as const;

