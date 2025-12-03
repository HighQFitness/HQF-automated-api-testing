/**
 * Status Domain Types
 * 
 * TypeScript interfaces and types specific to the API Status Check domain.
 */

/**
 * System Usage CPU
 */
export interface SystemUsageCpu {
  user: string;
  system: string;
}

/**
 * System Usage
 */
export interface SystemUsage {
  rss: string;
  heapTotal: string;
  heapUsed: string;
  cpu: SystemUsageCpu;
}

/**
 * Service Status Response
 */
export interface ServiceStatusResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
  data: {
    running: boolean;
    apiName: string;
    environment: string;
    apiUrl: string;
    timestamp: string;
    uptime: string;
    systemUsage: SystemUsage;
  };
}

