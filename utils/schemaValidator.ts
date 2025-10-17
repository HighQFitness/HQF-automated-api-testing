import { expect } from "@playwright/test";
import { WorkoutUnitsResponse } from "./types";

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
