import { TestUserData } from '@constants/testData';

/**
 * Shared Test Helpers
 * 
 * Common utility functions used across multiple domains.
 */

/**
 * Returns a valid phone number for testing
 */
export function getValidPhoneNumber(): string {
  return TestUserData.PHONE_NUMBER;
}

/**
 * Returns an alternate phone number for testing
 */
export function getAlternatePhoneNumber(): string {
  return TestUserData.PHONE_NUMBER_ALTERNATE;
}

/**
 * Returns a valid user name for testing
 */
export function getUserName(): string {
  return TestUserData.NAME;
}

