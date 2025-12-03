/**
 * Account Domain Types
 * 
 * TypeScript interfaces and types specific to the Account API domain.
 */

/**
 * Account Response
 */
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
    sportsInfo: unknown[];
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

/**
 * Change Phone Number Request
 */
export interface ChangePhoneNumberRequest {
  phoneNumber: string;
}

