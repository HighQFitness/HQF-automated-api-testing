import { validateAccountInfoResponse } from "./schemaValidator";

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
export interface AccountResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
  data: {
    accountInfo: {
      sub: string;
      name: string;
      email: string;
      phoneNumber: string;
      deviceUserId: number;
    };
    healthInfo: {
      id: string;
      height: number;
      weight: number;
      birthDay: string | null;
      biologicalSex: string;
      gender: string;
      heightUnit: string | null;
      weightUnit: string | null;
      createdAt: string;
      updatedAt: string;
      accountId: string | null;
    };
    sportsInfos: unknown[];
    workoutUnitsInfos: {
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
      updatedAt: string;
      accountId: string;
    }[];
    workoutPlaceInfos: unknown[];
  };
}
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
export interface HealthInfoResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
  data: {
    id: string;
    height: Record<string, unknown>;
    weight: Record<string, unknown>;
    createdAt: string;
    birth_day: string;
    gender: string;
    biological_sex: string;
  };
}
