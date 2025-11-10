import { SportsInfoResponse } from "../utils/types";

export class SportsInfoDataFactory {
  data: any;
  static returnValidSportsInfo(): SportsInfoResponse["data"] {
    return {
      sportsInfos: [
        {
          id: "test-id-001",
          name: "CrossFit",
        },
      ],
    };
  }
  static buildUpdatePayload(name = "CrossFit") {
    return { name };
  }
}
