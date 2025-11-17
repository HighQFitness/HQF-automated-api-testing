import { CreateWorkoutUnitsBody } from "./types";

export class WorkoutUnitsFactory {
  static valid(): CreateWorkoutUnitsBody {
    return {
      barsAndPlatesLoad: "kg",
      kettlebellsLoad: "lbs",
      runBikeShort: "m",
      runBikeLong: "km",
      assaultEchoBikeShort: "cal",
      assaultEchoBikeLong: "cal",
      rowSkiErgShort: "m",
      rowSkiErgLong: "m",
      boxJumpsHeightLength: "in",
    };
  }

  static invalidMissingField(): Partial<CreateWorkoutUnitsBody> {
    const body = this.valid();
    delete (body as any).barsAndPlatesLoad;
    return body;
  }

  static returnValidPhoneNumber(): string{
    return '+5491156062207'
  }

  static returnChangePhoneNumber(): string{
    return '+5491156062206'
  }
  static returnUserName(): string{
    return 'Jimena Alejandra Nemiña'
  }
}
