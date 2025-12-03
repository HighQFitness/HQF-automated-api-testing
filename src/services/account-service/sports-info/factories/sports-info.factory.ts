import { SportsInfoResponse } from '../types/sports-info.types';

/**
 * Sports Info Factory
 * 
 * Generates test data for Sports Info domain tests.
 */
export class SportsInfoFactory {
  /**
   * Creates a valid sports info payload
   */
  static returnValidSportsInfo(): SportsInfoResponse['data'] {
    return {
      sportsInfo: [
        {
          id: 'test-id-001',
          name: 'CrossFit',
        },
      ],
    };
  }

  /**
   * Builds an update payload with optional name
   */
  static buildUpdatePayload(name = 'CrossFit'): { name: string } {
    return { name };
  }
}

