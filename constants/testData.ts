import { config } from '@config/appConfig';

/**
 * Test Data Constants
 * 
 * Provides access to test data through the centralized configuration.
 * All values come from the app configuration (which reads from env vars with defaults).
 * 
 * This layer provides a clean interface for test data without direct environment variable access.
 */

/**
 * User account test data
 */
export const TestUserData = {
  NAME: config.testData.userName,
  EMAIL: config.testData.email,
  PHONE_NUMBER: config.testData.phoneNumber,
  PHONE_NUMBER_ALTERNATE: config.testData.phoneNumberAlternate,
  
  // Address test data
  ADDRESS: {
    ADDRESS_LINE_1: config.testData.address.line1,
    ADDRESS_LINE_2: config.testData.address.line2,
    CITY: config.testData.address.city,
    STATE: config.testData.address.state,
    ZIP_CODE: config.testData.address.zipCode,
    GOOGLE_PLACE_ID: config.testData.address.googlePlaceId,
    LATITUDE: config.testData.address.latitude,
    LONGITUDE: config.testData.address.longitude,
  },
  
  // Device user ID
  DEVICE_USER_ID: config.device.userId,
} as const;

/**
 * Health information test data
 */
export const TestHealthData = {
  HEIGHT: {
    VALUE: config.health.height,
    UNIT: 'cm' as const,
  },
  WEIGHT: {
    VALUE: config.health.weight,
    UNIT: 'kg' as const,
  },
  BIRTHDAY: config.testData.birthday,
  BIOLOGICAL_SEX: config.health.biologicalSex,
  GENDER: config.testData.gender,
} as const;

/**
 * Workout units test data
 * Default units for different workout types
 */
export const TestWorkoutUnits = {
  BARS_AND_PLATES_LOAD: 'kg',
  KETTLEBELLS_LOAD: 'lbs',
  RUN_BIKE_SHORT: 'm',
  RUN_BIKE_LONG: 'km',
  ASSAULT_ECHO_BIKE_SHORT: 'cal',
  ASSAULT_ECHO_BIKE_LONG: 'cal',
  ROW_SKI_ERG_SHORT: 'm',
  ROW_SKI_ERG_LONG: 'm',
  BOX_JUMPS_HEIGHT_LENGTH: 'in',
} as const;

/**
 * Notification preferences test data
 */
export const TestNotificationPreferences = {
  CATEGORIES: {
    ACCOUNT_UPDATES: 'account_updates',
    CRITICAL_REMINDERS: 'critical_reminders',
    FEEDBACK_REQUESTS: 'feedback_requests',
    NEWS_AND_ANNOUNCEMENTS: 'news_and_announcements',
  } as const,
  
  OPTIONS: {
    EMAIL: 'email',
    SMS: 'sms',
    PUSH: 'push',
    NONE: 'none',
  } as const,
} as const;

/**
 * Sports info test data
 */
export const TestSportsInfo = {
  DEFAULT_SPORT_NAME: 'CrossFit',
  SPORT_NAME_PREFIX: 'CrossFit',
} as const;

/**
 * Pills/IoT device test data
 */
export const TestPillsData = {
  DEFAULT_MAC_ADDRESS_PATTERN: /^([0-9A-F]{2}:){5}[0-9A-F]{2}$/,
  DEFAULT_PILL_ID_PATTERN: /0000[A-Z]{4}-0000-1000-8000-00805F9B34FB/,
  UUID_PATTERN: /^[0-9a-fA-F-]{36}$/,
} as const;

/**
 * API Path constants for validation
 */
export const ApiPaths = {
  ACCOUNT: '/api/v1/account',
  STATUS: '/api/v1/status',
} as const;

