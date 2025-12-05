import { config } from '@config/appConfig';
import { ApiClient } from '@shared/client/api-client';
import { HttpStatus, SuccessStatusCodes } from '@shared/constants/http-status-codes';

export async function verifyAndCreateHealthInfo(apiClient: ApiClient): Promise<void> {
  const endpoint = config.endpoints.healthInfo;

  if (!endpoint) {
    throw new Error(`HealthInfo endpoint missing in config`);
  }

  // Try fetch
  const getResponse = await apiClient.get(endpoint);
  const status = getResponse.status();

  if (status === HttpStatus.OK) {
    return; // exists
  }

  // Create minimal entry
  const payload = {
    height: { value: 170, unit: "cm" },
    weight: { value: 70, unit: "kg" },
    birthDay: "1990-01-01",
    gender: "male",
    biologicalSex: "male",
  };

  const createResponse = await apiClient.patch(endpoint, payload);
  const createStatus = createResponse.status();

  if (!SuccessStatusCodes.includes(createStatus as any)) {
    throw new Error(
      `Failed to create health info: status=${createStatus}, body=${await createResponse.text()}`
    );
  }
}
