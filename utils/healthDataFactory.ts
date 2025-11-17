import { HealthInfoResponse } from "./types";

export class HealthInfoFactory {

  static valid(): Partial<HealthInfoResponse["data"]> {
    return {
      height: {
        value: 160,
        unit: "cm"
      },
      weight: {
        value: 62,
        unit: "kg"
      },
        birthDay: "1988-05-18",
        gender: "female",
        biologicalSex: "female",
    };
  }
}
