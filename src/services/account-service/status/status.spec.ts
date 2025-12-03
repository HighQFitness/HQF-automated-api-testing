import { HttpStatus } from '@shared/constants/http-status-codes';
import { expect, test } from '@shared/fixtures';
import { StatusConfig, validateServiceStatusResponse } from './index';

const apiStatusCheckEndpoint = StatusConfig.endpoints.statusCheck;

test.describe('Account Service - GET API Status check Information', () => {
  test('GET /status - Should return valid health information', async ({ apiClient }) => {
    const response = await apiClient.get(apiStatusCheckEndpoint);
    expect(response.status(), 'Expected 200 OK for valid token').toBe(HttpStatus.OK);

    const body: unknown = await response.json();
    validateServiceStatusResponse(body);
  });
});

