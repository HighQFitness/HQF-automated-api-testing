/**
 * Health Info Domain Types
 * 
 * TypeScript interfaces and types specific to the Health Info API domain.
 */

/**
 * Health Info Response
 */
export interface HealthInfoResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
  data: {
    healthInfoResponse: any;
    id: string;
    height: Record<string, unknown>;
    weight: Record<string, unknown>;
    createdAt: string;
    birthDay: string;
    gender: string;
    biologicalSex: string;
  };
}

/**
 * Health Info Update Request
 */
export interface UpdateHealthInfoRequest {
  height?: {
    value: number;
    unit: string;
  };
  weight?: {
    value: number;
    unit: string;
  };
  birthDay?: string;
  gender?: string;
  biologicalSex?: string;
}

