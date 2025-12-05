import dotenv from 'dotenv';

// Load environment variables once at the top level
dotenv.config();

/**
 * Application Configuration
 * 
 * Single source of truth for all application configuration.
 * This file:
 * - Loads environment variables once
 * - Validates required variables
 * - Provides type-safe access to all configuration
 * - Centralizes default values
 * - Separates configuration concerns
 */

/**
 * Configuration interface - defines the shape of our config
 */
export interface AppConfig {
  // Base configuration
  api: {
    baseUrl: string;
  };
  
  // Authentication
  auth: {
    phone: string;
  };
  
  // API Endpoints
  endpoints: {
    signin: string;
    refreshToken: string;
    account: string;
    accountInfo: string;
    accountInfoUsername: string;
    accountAvatar: string;
    accountPhoto: string;
    accountPhoneChange: string;
    accountPhoneResendCode: string;
    accountPhoneVerify: string;
    healthInfo: string;
    workoutUnits: string;
    sportsInfo: string;
    pills: string;
    notificationPreferences: string;
    statusCheck: string;
    feedbackInitiateUpload: string;
    feedbackGeneratePresignedUrl: string;
    feedbackCompleteUpload: string;
    workoutPlaceInfo: string;
  };
  
  // Health information configuration
  health: {
    height: number;
    weight: number;
    biologicalSex: string;
  };
  
  // Device configuration
  device: {
    userId: string;
  };
  
  // Test data (optional overrides)
  testData: {
    email: string;
    userName: string;
    phoneNumber: string;
    phoneNumberAlternate: string;
    address: {
      line1: string;
      line2: string;
      city: string;
      state: string;
      zipCode: string;
      googlePlaceId: string;
      latitude: number;
      longitude: number;
    };
    birthday: string;
    gender: string;
  };
}

/**
 * Default values for optional configuration
 */
const DEFAULT_ENDPOINTS = {
  signin: '/api/v1/auth/signin',
  refreshToken: '/api/v1/auth/refresh',
  account: '/api/v1/account',
  accountInfo: '/api/v1/account-info',
  accountInfoUsername: '/api/v1/account-info/username',
  accountAvatar: '/api/v1/account/avatar',
  accountPhoto: '/api/v1/account/photo',
  accountPhoneChange: '/api/v1/account/phone',
  accountPhoneVerify: '/api/v1/account/phone/verify',
  accountPhoneResendCode: '/api/v1/account/phone/resend',
  healthInfo: '/api/v1/health-info',
  workoutUnits: '/api/v1/workout-units',
  sportsInfo: '/api/v1/sports-info',
  pills: '/api/v1/pills',
  notificationPreferences: '/api/v1/notification-preferences',
  statusCheck: '/api/v1/status',
  feedbackInitiateUpload: '/api/v1/feedback/initiate-upload',
  feedbackGeneratePresignedUrl: '/api/v1/feedback/generate-presigned-url',
  feedbackCompleteUpload: '/api/v1/feedback/complete-upload',
  workoutPlaceInfo: '/api/v1/workout-place-info',
} as const;

const DEFAULT_TEST_DATA = {
  email: 'jimena@highqfitness.com',
  userName: 'Test User',
  phoneNumber: '+5491156062207',
  phoneNumberAlternate: '+1234567891',
  address: {
    line1: '123 Test Street',
    line2: 'Apt 456',
    city: 'Test City',
    state: 'TS',
    zipCode: '12345',
    googlePlaceId: 'test-place-id',
    latitude: 0.0,
    longitude: 0.0,
  },
  birthday: '1990-01-01',
  gender: 'male',
} as const;

/**
 * Required environment variables
 */
const REQUIRED_VARS = [
  'API_BASE_URL',
] as const;

/**
 * Validates that all required environment variables are set
 * @throws Error with detailed message if any required variable is missing
 */
function validateRequiredEnvVars(): void {
  const missing: string[] = [];
  
  // Check required variables
  for (const varName of REQUIRED_VARS) {
    if (!process.env[varName] || process.env[varName]?.trim() === '') {
      missing.push(varName);
    }
  }
  
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file or environment configuration.\n' +
      'See .env.example for required variables.'
    );
  }
}


/**
 * Builds the application configuration from environment variables
 */
function buildConfig(): AppConfig {
  // Validate required variables first
  validateRequiredEnvVars();
  
  return {
    api: {
      baseUrl: process.env.API_BASE_URL!,
    },
    
    auth: {
      phone: process.env.API_USER_PHONE || DEFAULT_TEST_DATA.phoneNumber,
    },
    
    endpoints: DEFAULT_ENDPOINTS,
    
    health: {
      height: 170,
      weight: 70,
      biologicalSex: 'male',
    },
    
    device: {
      userId: '',
    },
    
    testData: {
      ...DEFAULT_TEST_DATA,
      email: process.env.API_USER_EMAIL || DEFAULT_TEST_DATA.email,
    },
  };
}

/**
 * Singleton configuration instance
 * Loaded once when this module is imported
 */
let configInstance: AppConfig | null = null;

/**
 * Gets the application configuration
 * 
 * Configuration is loaded once and cached. If validation fails,
 * an error is thrown at module load time.
 * 
 * @returns The application configuration
 */
export function getConfig(): AppConfig {
  if (configInstance === null) {
    configInstance = buildConfig();
  }
  return configInstance;
}

/**
 * Exported configuration instance for direct access
 * Use this for convenience, but prefer getConfig() for explicit access
 */
export const config: AppConfig = getConfig();

/**
 * Helper function to get endpoint with query parameters
 */
export function buildEndpointWithQuery(baseEndpoint: string, params: Record<string, string | number>): string {
  const queryString = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  
  return `${baseEndpoint}?${queryString}`;
}

/**
 * Helper function to get username endpoint with device user ID
 */
export function getUsernameEndpoint(deviceUserId: string | number): string {
  return buildEndpointWithQuery(config.endpoints.accountInfoUsername, {
    device_user_id: deviceUserId,
  });
}
