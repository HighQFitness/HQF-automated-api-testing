import { config } from '@config/appConfig';
import { ApiClient } from '@shared/client/api-client';
import { HttpStatus, SuccessStatusCodes } from '@shared/constants/http-status-codes';

export async function verifyAndCreateSportsInfo(apiClient: ApiClient): Promise<void> {
  const endpoint = config.endpoints.sportsInfo;

  if (!endpoint) {
    throw new Error(`SportsInfo endpoint missing in config`);
  }

  // Try fetch existing
  const getResponse = await apiClient.get(endpoint);
  const status = getResponse.status();

  if (status === HttpStatus.OK) {
    return; // data already exists
  }

  // Create minimal entity
  const payload = { name: `Sport-${Date.now()}` };

  const createResponse = await apiClient.post(endpoint, payload);

  const createStatus = createResponse.status();
  if (!SuccessStatusCodes.includes(createStatus as any)) {
    throw new Error(
      `Failed to create sports info: status=${createStatus}, body=${await createResponse.text()}`
    );
  }
}
