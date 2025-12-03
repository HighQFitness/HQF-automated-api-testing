/**
 * Logger Utility
 * 
 * Provides structured logging for test execution with support for different log levels
 * and JSON output for log aggregation.
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  [key: string]: unknown;
}

export class Logger {
  /**
   * Logs a message with the specified level
   */
  static log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...context,
    };

    if (process.env.LOG_FORMAT === 'json') {
      console.log(JSON.stringify(logEntry));
    } else {
      const prefix = `[${level.toUpperCase()}]`;
      if (context && Object.keys(context).length > 0) {
        console[level === 'debug' ? 'log' : level](`${prefix} ${message}`, context);
      } else {
        console[level === 'debug' ? 'log' : level](`${prefix} ${message}`);
      }
    }
  }

  /**
   * Logs an API request with timing information
   */
  static apiRequest(
    method: string,
    endpoint: string,
    status: number,
    duration: number
  ): void {
    this.log(LogLevel.INFO, `API ${method} ${endpoint}`, {
      type: 'api_request',
      method,
      endpoint,
      status,
      duration: `${duration}ms`,
    });
  }

  /**
   * Logs a debug message
   */
  static debug(message: string, context?: Record<string, unknown>): void {
    if (process.env.LOG_LEVEL !== 'error' && process.env.LOG_LEVEL !== 'warn') {
      this.log(LogLevel.DEBUG, message, context);
    }
  }

  /**
   * Logs an info message
   */
  static info(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Logs a warning message
   */
  static warn(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Logs an error message
   */
  static error(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, context);
  }
}

