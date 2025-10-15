// utils/schemaValidator.ts
import { expect } from '@playwright/test';
import { WorkoutUnitsResponse } from './types';

export function validateWorkoutUnitsResponse(body: unknown): asserts body is WorkoutUnitsResponse {
  expect(typeof body).toBe('object');
  expect(body).toHaveProperty('statusCode', 200);
  expect(body).toHaveProperty('message');
  expect(body).toHaveProperty('data.workout_units');

  const workoutUnits = (body as WorkoutUnitsResponse).data.workout_units;

  const requiredFields = [
    'id',
    'barsAndPlatesLoad',
    'kettlebellsLoad',
    'runBikeShort',
    'runBikeLong',
    'assaultEchoBikeShort',
    'assaultEchoBikeLong',
    'rowSkiErgShort',
    'rowSkiErgLong',
    'boxJumpsHeightLength',
    'createdAt',
  ];

  for (const field of requiredFields) {
    expect(workoutUnits).toHaveProperty(field);
    expect(typeof (workoutUnits as Record<string, unknown>)[field]).toBe('string');
  }
}
