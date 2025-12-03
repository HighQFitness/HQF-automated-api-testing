/**
 * Account Info Domain Types
 * 
 * TypeScript interfaces and types specific to the Account Info API domain.
 */

/**
 * Account Info Response
 */
export interface AccountInfoResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
  data: {
    name: string;
    email: string;
    phoneNumber: string;
    address: {
      address1: string;
      address2: string;
      zipCode: string;
      googlePlaceId: string;
      latitude: number;
      longitude: number;
      state: string;
      city: string;
    };
    deviceUserId: string;
    avatar: string;
  };
}

/**
 * Username Response
 */
export interface UsernameResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
  data: {
    username: string;
  };
}

/**
 * Account Info Update Request
 */
export interface UpdateAccountInfoRequest {
  name?: string;
  email?: string;
  address?: {
    address1?: string;
    address2?: string;
    zipCode?: string;
    googlePlaceId?: string;
    latitude?: number;
    longitude?: number;
    state?: string;
    city?: string;
  };
}

