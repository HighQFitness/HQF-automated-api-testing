import { TestHealthData } from '@constants/testData';
import { HealthInfoResponse } from '../types/health-info.types';

/**
 * Health Info Factory
 * 
 * Generates test data for Health Info domain tests.
 */
export class HealthInfoFactory {
  /**
   * Creates a valid health info payload
   */
  static valid(userBiologicalSex?: string): Partial<HealthInfoResponse['data']> {
    return {
      height: {
        value: TestHealthData.HEIGHT.VALUE,
        unit: TestHealthData.HEIGHT.UNIT,
      },
      weight: {
        value: TestHealthData.WEIGHT.VALUE,
        unit: TestHealthData.WEIGHT.UNIT,
      },
      birthDay: TestHealthData.BIRTHDAY,
      gender: TestHealthData.GENDER,
      biologicalSex: userBiologicalSex || TestHealthData.BIOLOGICAL_SEX,
    };
  }

  /**
   * Creates an invalid health info payload with invalid units
   */
  static invalidUnits(): Partial<HealthInfoResponse['data']> {
    return {
      height: {
        value: 170,
        unit: 'invalid-unit', // Invalid unit
      },
      weight: {
        value: 70,
        unit: 'invalid-unit', // Invalid unit
      },
    };
  }
}

