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
export interface UsernameResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
  data: {
    username: string;
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
  };
}

export interface NotificationPreferencesResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
  data: {
    preferences: Array<{
      notificationCategory: string;
      notificationOption: string;
    }>;
  };
}
export interface SportInfo {
  id: string;
  name: string;
}

export interface SportsInfoData {
  sportsInfos: SportInfo[];
}

export interface SportsInfoResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
  data: SportsInfoData;
}
export interface PillsResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
  data: {
    pills: Pill[];
  };
}
export interface Pill {
  id: string;
  pillId: string;
  macaddress: number;
  position: number;
  macAddress: string;
  createdAt: string;
  updatedAt: string;
}
export interface CreatePillsBody {
  pills: Pill[];
}

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
    systemUsage: {
      rss: string;
      heapTotal: string;
      heapUsed: string;
      cpu: {
        user: string;
        system: string;
      };
    };
  };
}
