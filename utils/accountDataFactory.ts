import { AccountInfoResponse } from "./types";

export class AccountInfoFactory {

  static valid(): Partial<AccountInfoResponse["data"]> {
    return {
      name: "Jimena Alejandra Nemiña",
      email: "jimena@highqfitness.com",
      address: {
        address1: "White Castle Avenue, 1000",
        address2: "Number 123",
        googlePlaceId: "ChIJgUbEo8NZzpQR8y7eC3Aev18",
        latitude: -23.5617,
        longitude: -46.6559,
        zipCode: "01310-100",
        state: "GO",
        city: "Goiania",
      },
    };
  }

 
  static invalidMissingField(): Partial<AccountInfoResponse["data"]> {
    const body = this.valid();
    delete (body as any).email;
    return body;
  }

  static updated(overrides?: Partial<AccountInfoResponse["data"]>): Partial<AccountInfoResponse["data"]> {
    return {
      ...this.valid(),
      ...overrides,
    };
  }

  static newName(): string {
    return "Jimena A. Nemiña Updated";
  }

  static newEmail(): string {
    return "jimena.updated@highqfitness.com";
  }
}
