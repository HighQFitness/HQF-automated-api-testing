import { expect } from "@playwright/test";
import { NotificationPreferencesResponse, WorkoutUnitsResponse, SportsInfoResponse, PillsResponse, ServiceStatusResponse } from "./types";

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
export function validateUsernameResponse(
  body: unknown
): asserts body is UsernameResponse {
  expect(typeof body).toBe("object");
  if (!body || typeof body !== "object") throw new Error("Invalid body object");

  const res = body as UsernameResponse;

  expect(res).toHaveProperty("statusCode");
  expect(res).toHaveProperty("message");
  expect(res).toHaveProperty("timestamp");
  expect(res).toHaveProperty("path");
  expect(res).toHaveProperty("data");

  expect(typeof res.statusCode).toBe("number");
  expect(typeof res.message).toBe("string");
  expect(typeof res.timestamp).toBe("string");
  expect(typeof res.path).toBe("string");

  expect(res.data).toHaveProperty("username");
  expect(typeof res.data.username).toBe("string");
  expect(res.data.username.length).toBeGreaterThan(0);
}

export function validateHealthInfoResponse(
  body: unknown) {
  const data = (body as any).data;

  expect(body).toHaveProperty("statusCode", 200);
  expect(body).toHaveProperty("message");
  expect(body).toHaveProperty("timestamp");
  expect(body).toHaveProperty("path");
  expect(body).toHaveProperty("data");

  expect(data).toHaveProperty("id");
  expect(data).toHaveProperty("height");
  expect(data).toHaveProperty("weight");
  expect(data).toHaveProperty("createdAt");

  expect(typeof data.id).toBe("string");
  expect(typeof data.createdAt).toBe("string");
  expect(typeof data.biologicalSex).toBe("object");
  expect(typeof data.height).toBe("object");
  expect(typeof data.weight).toBe("object");
}

export function validateNotificationPreferencesResponse(
  body: unknown
) {
  const data = (body as NotificationPreferencesResponse).data;

  expect(body).toHaveProperty("statusCode", 200);
  expect(body).toHaveProperty("message");
  expect(body).toHaveProperty("timestamp");
  expect(body).toHaveProperty("path");
  expect(body).toHaveProperty("data");

  expect(Array.isArray(data.preferences)).toBe(true);
  expect(data.preferences.length).toBeGreaterThan(0);

  for (const pref of data.preferences) {
    expect(pref).toHaveProperty("notificationCategory");
    expect(pref).toHaveProperty("notificationOption");

    expect(typeof pref.notificationCategory).toBe("string");
    expect(typeof pref.notificationOption).toBe("string");
  }
}

export function validateSportsInfoResponse(body: unknown): asserts body is SportsInfoResponse {
  if (typeof body !== "object" || body === null) {
    throw new Error("Invalid response: not an object");
  }

  const res = body as any;

  if (typeof res.statusCode !== "number") throw new Error("Invalid statusCode");
  if (typeof res.message !== "string") throw new Error("Invalid message");
  if (typeof res.timestamp !== "string") throw new Error("Invalid timestamp");
  if (typeof res.path !== "string") throw new Error("Invalid path");

  if (!res.data || typeof res.data !== "object")
    throw new Error("Invalid data: missing or malformed");

  const sportsInfos = res.data.sportsInfos;
  if (!Array.isArray(sportsInfos))
    throw new Error("Invalid data: sportsInfos should be an array");

  for (const sport of sportsInfos) {
    if (typeof sport.id !== "string") throw new Error("Invalid sport id");
    if (typeof sport.name !== "string") throw new Error("Invalid sport name");
  }
}

export function validatePillsResponse(body: unknown): asserts body is PillsResponse {
  expect(typeof body).toBe("object");
  expect(body).toHaveProperty("statusCode", 200);
  expect(body).toHaveProperty("message");
  expect(body).toHaveProperty("timestamp");
  expect(body).toHaveProperty("path");
  expect(body).toHaveProperty("data");

  const data = (body as PillsResponse).data;
  expect(Array.isArray(data.pills)).toBe(true);

  for (const pill of data.pills) {
    expect(pill).toHaveProperty("id");
    expect(pill).toHaveProperty("pillId");
    expect(pill).toHaveProperty("position");
    expect(pill).toHaveProperty("macAddress");
    expect(pill).toHaveProperty("createdAt");
    expect(pill).toHaveProperty("updatedAt");

    expect(typeof pill.id).toBe("string");
    expect(typeof pill.pillId).toBe("string");
    expect(typeof pill.position).toBe("number");
    expect(typeof pill.macAddress).toBe("string");
    expect(typeof pill.createdAt).toBe("string");
    expect(typeof pill.updatedAt).toBe("string");

    expect(pill.macAddress).toMatch(/^([0-9A-F]{2}:){5}[0-9A-F]{2}$/);
  }
}

export function validateServiceStatusResponse(
  body: unknown
): asserts body is ServiceStatusResponse {
  expect(typeof body).toBe("object");
  expect(body).toHaveProperty("statusCode", 200);
  expect(body).toHaveProperty("message");
  expect(body).toHaveProperty("timestamp");
  expect(body).toHaveProperty("path", "/api/v1/status");
  expect(body).toHaveProperty("data");

  const data = (body as ServiceStatusResponse).data;
  expect(typeof data).toBe("object");

  expect(typeof data.running).toBe("boolean");
  expect(typeof data.apiName).toBe("string");
  expect(typeof data.environment).toBe("string");
  expect(typeof data.apiUrl).toBe("string");
  expect(typeof data.timestamp).toBe("string");
  expect(typeof data.uptime).toBe("string");

  expect(typeof data.systemUsage).toBe("object");
  expect(data.systemUsage).toHaveProperty("rss");
  expect(data.systemUsage).toHaveProperty("heapTotal");
  expect(data.systemUsage).toHaveProperty("heapUsed");
  expect(data.systemUsage).toHaveProperty("cpu");

  expect(typeof data.systemUsage.rss).toBe("string");
  expect(typeof data.systemUsage.heapTotal).toBe("string");
  expect(typeof data.systemUsage.heapUsed).toBe("string");

  const cpu = data.systemUsage.cpu;
  expect(typeof cpu).toBe("object");
  expect(cpu).toHaveProperty("user");
  expect(cpu).toHaveProperty("system");
  expect(typeof cpu.user).toBe("string");
  expect(typeof cpu.system).toBe("string");
}
