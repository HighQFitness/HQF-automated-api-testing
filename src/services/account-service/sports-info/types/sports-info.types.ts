/**
 * Sports Info Domain Types
 * 
 * TypeScript interfaces and types specific to the Sports Info API domain.
 */

/**
 * Sport Info
 */
export interface SportInfo {
  id: string;
  name: string;
}

/**
 * Sports Info Data
 */
export interface SportsInfoData {
  sportsInfo: SportInfo[];
}

/**
 * Sports Info Response
 */
export interface SportsInfoResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
  data: SportsInfoData;
}

/**
 * Create/Update Sports Info Request
 */
export interface UpdateSportsInfoRequest {
  name: string;
}

