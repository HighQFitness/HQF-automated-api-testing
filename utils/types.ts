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
  