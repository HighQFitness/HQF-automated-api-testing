/**
 * Retry Utility
 * 
 * Provides retry mechanisms with exponential backoff for handling transient failures.
 */

import { Logger } from './logger';

/**
 * Retries a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries: number;
    backoffMs: number;
    retryableErrors?: number[];
    onRetry?: (attempt: number, error: Error) => void;
  }
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < options.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check if error has a status code that's retryable
      if (
        (error as any).response &&
        options.retryableErrors &&
        !options.retryableErrors.includes((error as any).response.status())
      ) {
        throw error;
      }

      // If this was the last attempt, throw
      if (attempt === options.maxRetries - 1) {
        throw lastError;
      }

      // Call onRetry callback if provided
      if (options.onRetry) {
        options.onRetry(attempt + 1, lastError);
      }

      // Wait before retrying with exponential backoff
      const waitTime = options.backoffMs * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  throw lastError || new Error('Retry failed');
}

/**
 * Default retryable HTTP status codes for transient failures
 */
export const DEFAULT_RETRYABLE_STATUS_CODES = [429, 502, 503, 504] as const;

/**
 * Retries an API call with default retryable status codes
 */
export async function retryApiCall<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  backoffMs = 1000
): Promise<T> {
  return retryWithBackoff(fn, {
    maxRetries,
    backoffMs,
    retryableErrors: [...DEFAULT_RETRYABLE_STATUS_CODES],
    onRetry: (attempt, error) => {
      Logger.warn(`Retry attempt ${attempt}/${maxRetries}`, { error: error.message });
    },
  });
}

