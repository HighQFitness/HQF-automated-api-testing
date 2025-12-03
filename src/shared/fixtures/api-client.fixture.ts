import { config } from '@config/appConfig';
import { test as base } from '@playwright/test';
import { ApiClient } from '../client/api-client';

/**
 * ApiClient Fixture
 * 
 * Provides a configured ApiClient instance for each test with automatic cleanup.
 * The client is initialized before each test and disposed after, ensuring test isolation.
 */

type ApiClientFixture = {
  apiClient: ApiClient;
};

export const test = base.extend<ApiClientFixture>({
  apiClient: async ({}, use) => {
    const client = new ApiClient(config.api.baseUrl);
    
    try {
      await client.init();
      await use(client);
    } finally {
      await client.dispose();
    }
  },
});

export { expect } from '@playwright/test';

