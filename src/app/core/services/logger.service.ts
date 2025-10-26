import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * Log levels for the application
 */
export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    NONE = 4
}

/**
 * Logger Service
 * 
 * Production-ready logging service that:
 * - Only logs in development mode
 * - Supports different log levels
 * - Can be extended to send logs to external services
 * - Provides structured logging
 */
@Injectable({
    providedIn: 'root'
})
export class LoggerService {
    private logLevel: LogLevel = environment.production ? LogLevel.ERROR : LogLevel.DEBUG;
    private enableConsoleLogging: boolean = !environment.production;

    /**
     * Log debug message (only in development)
     */
    debug(message: string, ...args: any[]): void {
        if (this.shouldLog(LogLevel.DEBUG)) {
            console.log(`[DEBUG] ${this.getTimestamp()} - ${message}`, ...args);
        }
    }

    /**
     * Log info message
     */
    info(message: string, ...args: any[]): void {
        if (this.shouldLog(LogLevel.INFO)) {
            console.info(`[INFO] ${this.getTimestamp()} - ${message}`, ...args);
        }
    }

    /**
     * Log warning message
     */
    warn(message: string, ...args: any[]): void {
        if (this.shouldLog(LogLevel.WARN)) {
            console.warn(`[WARN] ${this.getTimestamp()} - ${message}`, ...args);
        }
    }

    /**
     * Log error message
     */
    error(message: string, error?: any, ...args: any[]): void {
        if (this.shouldLog(LogLevel.ERROR)) {
            console.error(`[ERROR] ${this.getTimestamp()} - ${message}`, error, ...args);
            
            // In production, you could send errors to external service
            if (environment.production) {
                this.sendToExternalService(message, error);
            }
        }
    }

    /**
     * Log API request
     */
    logApiRequest(method: string, url: string, body?: any): void {
        if (this.shouldLog(LogLevel.DEBUG)) {
            console.log(`[API REQUEST] ${method} ${url}`, body || '');
        }
    }

    /**
     * Log API response
     */
    logApiResponse(method: string, url: string, status: number, response?: any): void {
        if (this.shouldLog(LogLevel.DEBUG)) {
            console.log(`[API RESPONSE] ${method} ${url} - Status: ${status}`, response || '');
        }
    }

    /**
     * Log API error
     */
    logApiError(method: string, url: string, error: any): void {
        if (this.shouldLog(LogLevel.ERROR)) {
            console.error(`[API ERROR] ${method} ${url}`, error);
        }
    }

    /**
     * Log user action
     */
    logUserAction(action: string, data?: any): void {
        if (this.shouldLog(LogLevel.INFO)) {
            console.log(`[USER ACTION] ${action}`, data || '');
        }
    }

    /**
     * Log performance metric
     */
    logPerformance(metric: string, value: number, unit: string = 'ms'): void {
        if (this.shouldLog(LogLevel.DEBUG)) {
            console.log(`[PERFORMANCE] ${metric}: ${value}${unit}`);
        }
    }

    /**
     * Set log level dynamically
     */
    setLogLevel(level: LogLevel): void {
        this.logLevel = level;
    }

    /**
     * Enable or disable console logging
     */
    setConsoleLogging(enabled: boolean): void {
        this.enableConsoleLogging = enabled;
    }

    /**
     * Check if should log based on level
     */
    private shouldLog(level: LogLevel): boolean {
        return this.enableConsoleLogging && level >= this.logLevel;
    }

    /**
     * Get formatted timestamp
     */
    private getTimestamp(): string {
        return new Date().toISOString();
    }

    /**
     * Send error to external logging service (placeholder)
     * In production, implement integration with services like:
     * - Sentry
     * - LogRocket
     * - Application Insights
     * - CloudWatch
     */
    private sendToExternalService(message: string, error?: any): void {
        // TODO: Implement external logging service integration
        // Example: Sentry.captureException(error);
    }

    /**
     * Create structured log entry
     */
    createLogEntry(level: string, message: string, data?: any): any {
        return {
            timestamp: this.getTimestamp(),
            level,
            message,
            data,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
    }
}
