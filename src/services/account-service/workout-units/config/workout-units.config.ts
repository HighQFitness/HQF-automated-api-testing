import { config } from '@config/appConfig';

/**
 * Workout Units Domain Configuration
 * 
 * Centralized configuration for Workout Units API endpoints and domain-specific settings.
 */
export const WorkoutUnitsConfig = {
  /**
   * API Endpoints
   */
  endpoints: {
    workoutUnits: config.endpoints.workoutUnits,
  },
} as const;

