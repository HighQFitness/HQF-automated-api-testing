/**
 * Custom API Test Reporter
 * 
 * Provides API-specific test reporting with metrics and insights.
 */

import {
  Reporter,
  TestCase,
  TestResult
} from '@playwright/test/reporter';
import { performanceTracker } from '../utils/performance-tracker';

interface ApiTestMetrics {
  endpoint: string;
  method: string;
  totalTests: number;
  passed: number;
  failed: number;
  averageResponseTime: number;
  slowestResponseTime: number;
}

class ApiTestReporter implements Reporter {
  private testMetrics: Map<string, ApiTestMetrics> = new Map();
  private failedTests: Array<{
    title: string;
    endpoint?: string;
    error?: string;
  }> = [];

  onTestEnd(test: TestCase, result: TestResult) {
    const endpoint = this.extractEndpoint(test.title);
    const method = this.extractMethod(test.title);

    if (endpoint) {
      const key = `${method}:${endpoint}`;
      const existing = this.testMetrics.get(key) || {
        endpoint,
        method,
        totalTests: 0,
        passed: 0,
        failed: 0,
        averageResponseTime: 0,
        slowestResponseTime: 0,
      };

      existing.totalTests++;
      if (result.status === 'passed') {
        existing.passed++;
      } else if (result.status === 'failed') {
        existing.failed++;
        this.failedTests.push({
          title: test.title,
          endpoint,
          error: result.error?.message,
        });
      }

      // Update response times from performance tracker
      const metrics = performanceTracker.getMetrics(endpoint);
      if (metrics.length > 0) {
        const times = metrics.map((m) => m.duration);
        existing.averageResponseTime = Math.round(
          times.reduce((a, b) => a + b, 0) / times.length
        );
        existing.slowestResponseTime = Math.max(...times);
      }

      this.testMetrics.set(key, existing);
    }
  }

  onEnd() {
    console.log('\n📊 API Test Performance Summary:\n');
    this.printMetrics();
    this.printFailedTests();
    this.printPerformanceSummary();
  }

  private printMetrics() {
    if (this.testMetrics.size === 0) {
      console.log('  No API metrics collected.\n');
      return;
    }

    console.log('  Endpoint Statistics:');
    console.log('  ' + '='.repeat(80));

    const sortedMetrics = Array.from(this.testMetrics.values()).sort(
      (a, b) => b.failed - a.failed || b.totalTests - a.totalTests
    );

    for (const metric of sortedMetrics) {
      const status = metric.failed > 0 ? '❌' : '✅';
      console.log(
        `  ${status} ${metric.method} ${metric.endpoint}`
      );
      console.log(
        `      Tests: ${metric.passed}/${metric.totalTests} passed | Avg: ${metric.averageResponseTime}ms | Max: ${metric.slowestResponseTime}ms`
      );
    }
    console.log('');
  }

  private printFailedTests() {
    if (this.failedTests.length === 0) {
      return;
    }

    console.log('  ❌ Failed API Tests:');
    console.log('  ' + '='.repeat(80));
    for (const test of this.failedTests) {
      console.log(`    • ${test.title}`);
      if (test.endpoint) {
        console.log(`      Endpoint: ${test.endpoint}`);
      }
      if (test.error) {
        console.log(`      Error: ${test.error.substring(0, 100)}...`);
      }
    }
    console.log('');
  }

  private printPerformanceSummary() {
    const summary = performanceTracker.getSummary();
    if (summary.totalRequests === 0) {
      return;
    }

    console.log('  ⚡ Performance Summary:');
    console.log('  ' + '='.repeat(80));
    console.log(
      `    Total Requests: ${summary.totalRequests} | Average Response Time: ${summary.averageResponseTime}ms`
    );

    if (summary.slowEndpoints.length > 0) {
      console.log('    Slowest Endpoints:');
      for (const endpoint of summary.slowEndpoints.slice(0, 5)) {
        console.log(`      • ${endpoint.endpoint}: ${endpoint.averageTime}ms`);
      }
    }
    console.log('');
  }

  private extractEndpoint(title: string): string | undefined {
    // Try to extract endpoint from test title
    // Patterns: "GET /api/v1/account", "POST /account/photo", etc.
    const match = title.match(
      /(?:GET|POST|PATCH|PUT|DELETE)\s+([\/\w-]+(?:\?[^\s]*)?)/
    );
    return match ? match[1] : undefined;
  }

  private extractMethod(title: string): string {
    // Extract HTTP method from test title
    const match = title.match(/(GET|POST|PATCH|PUT|DELETE)/);
    return match ? match[1] : 'UNKNOWN';
  }
}

// Export as default for Playwright reporter configuration
export default ApiTestReporter;

// Also export as named export for other uses
export { ApiTestReporter };

