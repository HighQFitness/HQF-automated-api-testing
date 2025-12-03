/**
 * Pills Domain Types
 * 
 * TypeScript interfaces and types specific to the Pills API domain.
 */

/**
 * Pill
 */
export interface Pill {
  id: string;
  pillId: string;
  macaddress: number;
  position: number;
  macAddress: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Pills Response
 */
export interface PillsResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
  data: {
    pills: Pill[];
  };
}

/**
 * Create Pills Body
 */
export interface CreatePillsBody {
  pills: Pill[];
}

