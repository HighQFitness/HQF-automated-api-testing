/**
 * Performance Tracker
 * 
 * Tracks API response times and provides performance monitoring capabilities.
 */

import { Logger } from './logger';

interface PerformanceMetric {
  endpoint: string;
  method: string;
  duration: number;
  status: number;
  timestamp: number;
}

export class PerformanceTracker {
  private metrics: PerformanceMetric[] = [];
  private thresholds: Map<string, number> = new Map();

  /**
   * Sets a performance threshold for an endpoint
   */
  setThreshold(endpoint: string, thresholdMs: number): void {
    this.thresholds.set(endpoint, thresholdMs);
  }

  /**
   * Records a performance metric
   */
  record(endpoint: string, method: string, duration: number, status: number): void {
    const metric: PerformanceMetric = {
      endpoint,
      method,
      duration,
      status,
      timestamp: Date.now(),
    };

    this.metrics.push(metric);

    // Check threshold
    const threshold = this.thresholds.get(endpoint);
    if (threshold && duration > threshold) {
      Logger.warn(`Slow API response: ${method} ${endpoint} took ${duration}ms (threshold: ${threshold}ms)`);
    }
  }

  /**
   * Gets average response time for an endpoint
   */
  getAverageResponseTime(endpoint: string): number {
    const endpointMetrics = this.metrics.filter((m) => m.endpoint === endpoint);
    if (endpointMetrics.length === 0) return 0;

    const sum = endpointMetrics.reduce((acc, m) => acc + m.duration, 0);
    return Math.round(sum / endpointMetrics.length);
  }

  /**
   * Gets all metrics for an endpoint
   */
  getMetrics(endpoint: string): PerformanceMetric[] {
    return this.metrics.filter((m) => m.endpoint === endpoint);
  }

  /**
   * Gets all metrics
   */
  getAllMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Clears all metrics
   */
  clear(): void {
    this.metrics = [];
  }

  /**
   * Gets performance summary
   */
  getSummary(): {
    totalRequests: number;
    averageResponseTime: number;
    slowEndpoints: Array<{ endpoint: string; averageTime: number }>;
  } {
    if (this.metrics.length === 0) {
      return {
        totalRequests: 0,
        averageResponseTime: 0,
        slowEndpoints: [],
      };
    }

    const totalDuration = this.metrics.reduce((acc, m) => acc + m.duration, 0);
    const averageResponseTime = Math.round(totalDuration / this.metrics.length);

    // Group by endpoint and calculate averages
    const endpointGroups = new Map<string, number[]>();
    this.metrics.forEach((m) => {
      const times = endpointGroups.get(m.endpoint) || [];
      times.push(m.duration);
      endpointGroups.set(m.endpoint, times);
    });

    const slowEndpoints = Array.from(endpointGroups.entries())
      .map(([endpoint, times]) => ({
        endpoint,
        averageTime: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
      }))
      .filter((e) => e.averageTime > averageResponseTime)
      .sort((a, b) => b.averageTime - a.averageTime);

    return {
      totalRequests: this.metrics.length,
      averageResponseTime,
      slowEndpoints,
    };
  }
}

/**
 * Global performance tracker instance
 */
export const performanceTracker = new PerformanceTracker();

