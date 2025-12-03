import { FullConfig } from '@playwright/test';

/**
 * Global Teardown
 * 
 * Runs once after all tests complete. Use this for cleanup tasks
 * that should happen after all tests finish.
 */

async function globalTeardown(_config: FullConfig) {
  console.log('\n🧹 Running global teardown...');

  // Add any global cleanup tasks here
  // Examples:
  // - Clean up test data created during test runs
  // - Close database connections
  // - Release shared resources
  // - Generate final reports

  console.log('✅ Global teardown completed');
}

export default globalTeardown;

