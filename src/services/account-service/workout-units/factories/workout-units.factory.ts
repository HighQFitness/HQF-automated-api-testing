import { TestWorkoutUnits } from '@constants/testData';
import { CreateWorkoutUnitsBody } from '../types/workout-units.types';

/**
 * Workout Units Factory
 * 
 * Generates test data for Workout Units domain tests.
 */
export class WorkoutUnitsFactory {
  /**
   * Creates a valid workout units payload
   */
  static valid(): CreateWorkoutUnitsBody {
    return {
      barsAndPlatesLoad: TestWorkoutUnits.BARS_AND_PLATES_LOAD,
      kettlebellsLoad: TestWorkoutUnits.KETTLEBELLS_LOAD,
      runBikeShort: TestWorkoutUnits.RUN_BIKE_SHORT,
      runBikeLong: TestWorkoutUnits.RUN_BIKE_LONG,
      assaultEchoBikeShort: TestWorkoutUnits.ASSAULT_ECHO_BIKE_SHORT,
      assaultEchoBikeLong: TestWorkoutUnits.ASSAULT_ECHO_BIKE_LONG,
      rowSkiErgShort: TestWorkoutUnits.ROW_SKI_ERG_SHORT,
      rowSkiErgLong: TestWorkoutUnits.ROW_SKI_ERG_LONG,
      boxJumpsHeightLength: TestWorkoutUnits.BOX_JUMPS_HEIGHT_LENGTH,
    };
  }

  /**
   * Creates an invalid workout units payload (missing required field)
   */
  static invalidMissingField(): Partial<CreateWorkoutUnitsBody> {
    const body = this.valid();
    delete (body as any).barsAndPlatesLoad;
    return body;
  }
}

