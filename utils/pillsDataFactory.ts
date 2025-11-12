import { CreatePillsBody, PillsResponse } from "../utils/types";

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

  static createValidBody(): CreatePillsBody {
    return {
      pills: [
        {
          pillId: "0000XXXX-0000-1000-8000-00805F9B34FB",
          position: 0,
          macAddress: "00:1A:2B:3C:4D:5E",
          id: "",
          macaddress: 0,
          createdAt: "",
          updatedAt: ""
        },
        {
          pillId: "0000YYYY-0000-1000-8000-00805F9B34FB",
          position: 1,
          macAddress: "00:1A:2B:3C:4D:5F",
          id: "",
          macaddress: 0,
          createdAt: "",
          updatedAt: ""
        },
        {
          pillId: "0000ZZZZ-0000-1000-8000-00805F9B34FB",
          position: 2,
          macAddress: "00:1A:2B:3C:4D:60",
          id: "",
          macaddress: 0,
          createdAt: "",
          updatedAt: ""
        },
      ],
    };
  }
}
