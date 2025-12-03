import { config } from '@config/appConfig';
import { FullConfig } from '@playwright/test';

/**
 * Global Setup
 * 
 * Runs once before all tests. Validates environment configuration
 * and ensures the test environment is ready.
 */

async function globalSetup(_configParam: FullConfig) {
  console.log('🔧 Running global setup...');

  // Validate required environment variables through config
  try {
    // Access config to trigger validation (config throws if validation fails)
    const apiBaseUrl = config.api.baseUrl;

    if (!apiBaseUrl) {
      throw new Error('Missing required environment variable: API_BASE_URL');
    }

    console.log(`✅ Configuration validated`);
    console.log(`   API Base URL: ${apiBaseUrl}`);

    // Validate API is accessible using the status endpoint (health check)
    try {
      const statusEndpoint = config.endpoints.statusCheck;
      const healthResponse = await fetch(`${apiBaseUrl}${statusEndpoint}`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      
      if (!healthResponse.ok) {
        console.warn(`⚠️  API health check returned ${healthResponse.status} (continuing anyway)`);
      } else {
        console.log('✅ API health check passed');
      }
    } catch (error) {
      // Health check is optional, so we warn but don't fail
      console.warn(`⚠️  API health check failed (continuing anyway): ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    console.log('✅ Global setup completed successfully\n');
  } catch (error) {
    console.error('❌ Global setup failed:');
    console.error(error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
}

export default globalSetup;

