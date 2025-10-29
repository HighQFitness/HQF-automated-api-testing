import { expect } from "@playwright/test";
import { WorkoutUnitsResponse } from "./types";
import { DeleteAccountResponse } from "./types";

export function validateWorkoutUnitsResponse(
  body: unknown
): asserts body is WorkoutUnitsResponse {
  expect(typeof body).toBe("object");
  expect(body).toHaveProperty("statusCode", 200);
  expect(body).toHaveProperty("message");
  expect(body).toHaveProperty("timestamp");
  expect(body).toHaveProperty("path");
  expect(body).toHaveProperty("data");

  const topLevelData = (body as any).data;

  const data =
    typeof topLevelData.workout_units === "object"
      ? topLevelData.workout_units
      : topLevelData;

  expect(typeof data).toBe("object");

  const requiredFields = [
    "id",
    "barsAndPlatesLoad",
    "kettlebellsLoad",
    "runBikeShort",
    "runBikeLong",
    "assaultEchoBikeShort",
    "assaultEchoBikeLong",
    "rowSkiErgShort",
    "rowSkiErgLong",
    "boxJumpsHeightLength",
    "createdAt",
  ];

  for (const field of requiredFields) {
    expect(data).toHaveProperty(field);
    expect(typeof (data as Record<string, unknown>)[field]).toBe("string");
  }
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


export function validateAccountResponse(body: unknown): asserts body is AccountResponse {
  expect(typeof body).toBe("object");
  expect(body).toHaveProperty("statusCode", 200);
  expect(body).toHaveProperty("message");
  expect(body).toHaveProperty("timestamp");
  expect(body).toHaveProperty("path", "/api/v1/account");
  expect(body).toHaveProperty("data");

  const data = (body as AccountResponse).data;
  expect(data.accountInfo).toHaveProperty("email");
  expect(data.accountInfo).toHaveProperty("deviceUserId");
  expect(data.healthInfo).toHaveProperty("height");
  expect(data.healthInfo).toHaveProperty("weight");
  expect(Array.isArray(data.workoutUnitsInfos)).toBe(true);
  expect(Array.isArray(data.sportsInfos)).toBe(true);
  expect(Array.isArray(data.workoutPlaceInfos)).toBe(true);
}

 export function validateAccountInfoResponse(body: unknown, mode: "full" | "partial" = "full") {
  const data = (body as AccountInfoResponse).data;

  expect(data).toHaveProperty("name");
  expect(data).toHaveProperty("email");
  expect(data).toHaveProperty("phoneNumber");
  expect(data).toHaveProperty("address");

  if (mode === "full") {
    expect(data).toHaveProperty("deviceUserId");
    expect(data).toHaveProperty("avatar");
  }

  expect(typeof data.address).toBe("object");
  expect(data.address).toHaveProperty("address1");
  expect(data.address).toHaveProperty("city");
}

export function validateUsernameResponse(body: unknown): asserts body is UsernameResponse {
  expect(body).toHaveProperty("statusCode");
  expect(body).toHaveProperty("message");
  expect(body).toHaveProperty("timestamp");
  expect(body).toHaveProperty("path");
  expect(body).toHaveProperty("data");

  const data = (body as UsernameResponse).data;

  expect(data).toHaveProperty("username");
  expect(typeof data.username).toBe("string");

  const res = body as UsernameResponse;
  expect(typeof res.statusCode).toBe("number");
  expect(typeof res.message).toBe("string");
  expect(typeof res.timestamp).toBe("string");
  expect(typeof res.path).toBe("string");
}

export function validateDeleteAccountResponse(body: unknown): asserts body is DeleteAccountResponse {
  // Ensure top-level structure exists
  expect(body).toHaveProperty("statusCode");
  expect(body).toHaveProperty("message");
  expect(body).toHaveProperty("timestamp");
  expect(body).toHaveProperty("path");
  expect(body).toHaveProperty("data");

  const res = body as DeleteAccountResponse;

  expect(typeof res.statusCode).toBe("number");
  expect(typeof res.message).toBe("string");
  expect(typeof res.timestamp).toBe("string");
  expect(typeof res.path).toBe("string");

  expect(typeof res.data).toBe("object");
  expect(Object.keys(res.data).length).toBe(0);
}
