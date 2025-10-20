import { test, expect } from "@playwright/test";
import { ApiClient } from "../../../utils/apiClient";
import { validateWorkoutUnitsResponse } from "../../../utils/schemaValidator";
import { WorkoutUnitsResponse } from "../../../utils/types";
import { WorkoutUnitsFactory } from "../../../utils/dataFactory";
import dotenv from "dotenv";

dotenv.config();

const baseURL = process.env.API_BASE_URL!;
const workoutUnitsEndpoint = process.env.API_WORKOUTUNITS_URL!;

test.describe("Account Service - GET Workout Units", () => {
  let apiClient: ApiClient;

  test.beforeAll(async () => {
    apiClient = new ApiClient(baseURL);
    await apiClient.init();
  });

  test.afterAll(async () => {
    await apiClient.dispose();
  });

  test("GET /workout-units - Should return valid data with a valid token", async () => {
    const response = await apiClient.get(workoutUnitsEndpoint);
    expect(response.status(), "Expected 200 OK for valid token").toBe(200);

    const body: unknown = await response.json();
    validateWorkoutUnitsResponse(body);

    const workoutUnits = (body as WorkoutUnitsResponse).data.workout_units;
    expect(workoutUnits).toBeDefined();
  });

  test("GET /workout-units - Should return 401 Unauthorized with an invalid token", async () => {
    (apiClient as any).token = "invalid-token-12345";

    const response = await apiClient.get(workoutUnitsEndpoint, false);
    expect(response.status(), "Expected 401 for invalid token").toBe(401);
  });

  test("GET /workout-units - Should throw an error when no token is provided", async () => {
    (apiClient as any).token = null;

    await expect(async () => {
      await apiClient.get(workoutUnitsEndpoint);
    }).rejects.toThrow("Token is not set");
  });
});

test.describe("Account Service - POST Workout Units", () => {
  let apiClient: ApiClient;

  test.beforeAll(async () => {
    apiClient = new ApiClient(baseURL);
    await apiClient.init();
  });

  test.afterAll(async () => {
    await apiClient.dispose();
  });

  test("PATCH /workout-units - Should create valid record", async () => {
    const body = WorkoutUnitsFactory.valid();

    const response = await apiClient.patch(workoutUnitsEndpoint, body);
    expect(response.status(), "Expected 200 Created").toBe(200);

    const responseBody: WorkoutUnitsResponse = await response.json();

    validateWorkoutUnitsResponse(responseBody);
  });

  test("PATCH /workout-units - Should create valid record with missing field", async () => {
    const invalidBody = WorkoutUnitsFactory.invalidMissingField();

    const response = await apiClient.patch(workoutUnitsEndpoint, invalidBody);
    expect(response.status(), "Expected 200 upsert").toBe(200);
  });
});
