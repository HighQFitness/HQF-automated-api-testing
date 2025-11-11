import { PillsResponse } from "../utils/types";

export class PillsFactory {
  static valid(): PillsResponse["data"] {
    return {
      pills: [
        {
            id: "3e2587ea-5ec7-4085-bb8f-3a8f3296781a",
            pillId: "FD:77:B3:90:1F:76",
            position: 6,
            macAddress: "FD:77:B3:90:1F:76",
            createdAt: "2025-11-09T18:15:04.888Z",
            updatedAt: "2025-11-09T18:15:04.888Z",
            macaddress: 0
        },
      ],
    };
  }

  static empty(): PillsResponse["data"] {
    return { pills: [] };
  }
}
