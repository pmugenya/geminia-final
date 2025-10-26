import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { ConfigService } from '../services/config.service';
import { DialogManagerService } from '../services/dialog-manager.service';

export interface ErrorInfo {
    message: string;
    stack?: string;
    url?: string;
    timestamp: Date;
    userAgent?: string;
    userId?: string;
}

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(
        private notificationService: NotificationService,
        private configService: ConfigService,
        private ngZone: NgZone,
        private dialogManager: DialogManagerService
    ) {}

    handleError(error: any): void {
        // Log error details if logging is enabled
        if (this.configService.isLoggingEnabled()) {
            console.error('Global Error Handler:', error);
        }

        // Create error info object
        const errorInfo: ErrorInfo = {
            message: this.getErrorMessage(error),
            stack: error?.stack,
            url: window.location.href,
            timestamp: new Date(),
            userAgent: navigator.userAgent,
        };

        // Log structured error information
        this.logError(errorInfo);

        // Show user-friendly notification
        this.showUserNotification(error);

        // In production, you might want to send errors to a logging service
        if (this.configService.isProduction()) {
            this.sendErrorToLoggingService(errorInfo);
        }
    }

    private getErrorMessage(error: any): string {
        if (error?.message) {
            return error.message;
        }
        
        if (typeof error === 'string') {
            return error;
        }
        
        if (error?.error?.message) {
            return error.error.message;
        }
        
        return 'An unexpected error occurred';
    }

    private logError(errorInfo: ErrorInfo): void {
        if (this.configService.isDebugEnabled()) {
            console.group('🚨 Global Error Details');
            console.error('Message:', errorInfo.message);
            console.error('Timestamp:', errorInfo.timestamp);
            console.error('URL:', errorInfo.url);
            console.error('User Agent:', errorInfo.userAgent);
            if (errorInfo.stack) {
                console.error('Stack Trace:', errorInfo.stack);
            }
            console.groupEnd();
        }
    }

    private showUserNotification(error: any): void {
        // Run notification in Angular zone to ensure change detection
        this.ngZone.run(() => {
            const isNetworkError = this.isNetworkError(error);
            const isValidationError = this.isValidationError(error);
            
            if (isNetworkError) {
                // Close all open modals on network error
                if (this.dialogManager.hasOpenDialogs()) {
                    console.log('🔒 Closing dialogs due to network error');
                    this.dialogManager.handleNetworkError();
                }
                
                this.notificationService.error(
                    'Network connection problem. Please check your internet connection and try again.'
                );
            } else if (isValidationError) {
                // Extract specific error message from API response
                const specificMessage = this.extractErrorMessage(error);
                this.notificationService.warning(specificMessage);
            } else {
                // Extract specific error message or use generic fallback
                const specificMessage = this.extractErrorMessage(error);
                this.notificationService.error(specificMessage);
            }
        });
    }

    /**
     * Extract specific error message from error object
     */
    private extractErrorMessage(error: any): string {
        // Try to get error message from various possible locations
        if (error?.error?.errors?.[0]?.developerMessage) {
            return error.error.errors[0].developerMessage;
        }
        
        if (error?.error?.errors?.[0]?.defaultUserMessage) {
            return error.error.errors[0].defaultUserMessage;
        }
        
        if (error?.error?.message) {
            return error.error.message;
        }
        
        if (error?.message) {
            return error.message;
        }
        
        if (error?.error?.defaultUserMessage) {
            return error.error.defaultUserMessage;
        }
        
        // Check for validation errors
        if (error?.status >= 400 && error?.status < 500) {
            return 'Please check your input and try again.';
        }
        
        // Fallback to generic message
        return 'Something went wrong. Please try again or contact support if the problem persists.';
    }

    private isNetworkError(error: any): boolean {
        return error?.status === 0 || 
               error?.name === 'NetworkError' ||
               error?.message?.includes('Network') ||
               error?.message?.includes('fetch');
    }

    private isValidationError(error: any): boolean {
        return error?.status >= 400 && error?.status < 500;
    }

    private sendErrorToLoggingService(errorInfo: ErrorInfo): void {
        // Implement your error tracking service integration here
        // Examples: Sentry, LogRocket, Bugsnag, etc.
        
        try {
            // Example implementation (replace with your actual service)
            if (typeof window !== 'undefined' && (window as any).errorTracker) {
                (window as any).errorTracker.captureException(errorInfo);
            }
        } catch (loggingError) {
            // Don't let logging errors crash the app
            console.error('Failed to send error to logging service:', loggingError);
        }
    }
}

/**
 * Factory function to create GlobalErrorHandler
 * This ensures proper dependency injection
 */
export function createGlobalErrorHandler(
    notificationService: NotificationService,
    configService: ConfigService,
    ngZone: NgZone,
    dialogManager: DialogManagerService
): GlobalErrorHandler {
    return new GlobalErrorHandler(notificationService, configService, ngZone, dialogManager);
}

/**
 * Provider configuration for GlobalErrorHandler
 */
export const GLOBAL_ERROR_HANDLER_PROVIDER = {
    provide: ErrorHandler,
    useFactory: createGlobalErrorHandler,
    deps: [NotificationService, ConfigService, NgZone, DialogManagerService]
};
