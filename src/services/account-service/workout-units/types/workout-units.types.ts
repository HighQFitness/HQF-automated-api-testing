/**
 * Workout Units Domain Types
 * 
 * TypeScript interfaces and types specific to the Workout Units API domain.
 */

/**
 * Workout Units Response
 */
export interface WorkoutUnitsResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
  data: {
    workout_units: {
      id: string;
      barsAndPlatesLoad: string;
      kettlebellsLoad: string;
      runBikeShort: string;
      runBikeLong: string;
      assaultEchoBikeShort: string;
      assaultEchoBikeLong: string;
      rowSkiErgShort: string;
      rowSkiErgLong: string;
      boxJumpsHeightLength: string;
      createdAt: string;
    };
  };
}

/**
 * Create Workout Units Body
 */
export interface CreateWorkoutUnitsBody {
  barsAndPlatesLoad: string;
  kettlebellsLoad: string;
  runBikeShort: string;
  runBikeLong: string;
  assaultEchoBikeShort: string;
  assaultEchoBikeLong: string;
  rowSkiErgShort: string;
  rowSkiErgLong: string;
  boxJumpsHeightLength: string;
}

