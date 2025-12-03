import { TestUserData } from '@constants/testData';
import { AccountInfoResponse } from '../types/account-info.types';

/**
 * Account Info Factory
 * 
 * Generates test data for Account Info domain tests.
 */
export class AccountInfoFactory {
  /**
   * Creates a valid account info payload
   */
  static valid(): Partial<AccountInfoResponse['data']> {
    return {
      name: TestUserData.NAME,
      email: TestUserData.EMAIL,
      address: {
        address1: TestUserData.ADDRESS.ADDRESS_LINE_1,
        address2: TestUserData.ADDRESS.ADDRESS_LINE_2,
        googlePlaceId: TestUserData.ADDRESS.GOOGLE_PLACE_ID,
        latitude: TestUserData.ADDRESS.LATITUDE,
        longitude: TestUserData.ADDRESS.LONGITUDE,
        zipCode: TestUserData.ADDRESS.ZIP_CODE,
        state: TestUserData.ADDRESS.STATE,
        city: TestUserData.ADDRESS.CITY,
      },
    };
  }

  /**
   * Creates an invalid account info payload (missing required field)
   */
  static invalidMissingField(): Partial<AccountInfoResponse['data']> {
    const body = this.valid();
    delete (body as any).email;
    return body;
  }

  /**
   * Creates an updated account info payload with optional overrides
   */
  static updated(overrides?: Partial<AccountInfoResponse['data']>): Partial<AccountInfoResponse['data']> {
    return {
      ...this.valid(),
      ...overrides,
    };
  }

  /**
   * Generates an updated name
   */
  static newName(): string {
    return `${TestUserData.NAME} Updated`;
  }

  /**
   * Generates a test email for updates
   */
  static newEmail(): string {
    const emailParts = TestUserData.EMAIL.split('@');
    return `${emailParts[0]}.updated@${emailParts[1] || 'example.com'}`;
  }
}

