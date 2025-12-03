import { HttpStatus } from '@shared/constants/http-status-codes';
import { expect, test } from '@shared/fixtures';
import { WorkoutUnitsConfig, WorkoutUnitsFactory, validateWorkoutUnitsResponse } from './index';
import { WorkoutUnitsResponse } from './types/workout-units.types';

const workoutUnitsEndpoint = WorkoutUnitsConfig.endpoints.workoutUnits;

test.describe('Account Service - GET Workout Units', () => {
  test('GET /workout-units - Should return valid data with a valid token', async ({ apiClient }) => {
    const response = await apiClient.get(workoutUnitsEndpoint);
    expect(response.status(), 'Expected 200 OK for valid token').toBe(HttpStatus.OK);

    const body: unknown = await response.json();
    validateWorkoutUnitsResponse(body);

    const workoutUnits = (body as WorkoutUnitsResponse).data.workout_units;
    expect(workoutUnits).toBeDefined();
  });

  test('GET /workout-units - Should return 401 Unauthorized with an invalid token', async ({ apiClient }) => {
    (apiClient as any).token = 'invalid-token-12345';

    const response = await apiClient.get(workoutUnitsEndpoint, false);
    expect(response.status(), 'Expected 401 for invalid token').toBe(HttpStatus.UNAUTHORIZED);
  });

  test('GET /workout-units - Should throw an error when no token is provided', async ({ apiClient }) => {
    (apiClient as any).token = null;

    await expect(async () => {
      await apiClient.get(workoutUnitsEndpoint);
    }).rejects.toThrow('Token is not set');
  });
});

test.describe('Account Service - POST Workout Units', () => {
  test('PATCH /workout-units - Should create valid record', async ({ apiClient }) => {
    const body = WorkoutUnitsFactory.valid();

    const response = await apiClient.patch(workoutUnitsEndpoint, body);
    expect(response.status(), 'Expected 200 Created').toBe(HttpStatus.OK);

    const responseBody: WorkoutUnitsResponse = await response.json();

    validateWorkoutUnitsResponse(responseBody);
  });

  test('PATCH /workout-units - Should create valid record with missing field', async ({ apiClient }) => {
    const invalidBody = WorkoutUnitsFactory.invalidMissingField();

    const response = await apiClient.patch(workoutUnitsEndpoint, invalidBody);
    expect(response.status(), 'Expected 200 upsert').toBe(HttpStatus.OK);
  });
});

