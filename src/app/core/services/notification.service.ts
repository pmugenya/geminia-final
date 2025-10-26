import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private defaultConfig: MatSnackBarConfig = {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
    };

    constructor(private snackBar: MatSnackBar) {}

    /**
     * Show success notification
     */
    success(message: string, config?: MatSnackBarConfig): void {
        this.show(message, 'success', config);
    }

    /**
     * Show error notification
     */
    error(message: string, config?: MatSnackBarConfig): void {
        this.show(message, 'error', { ...config, duration: 0 }); // Error messages don't auto-dismiss
    }

    /**
     * Show warning notification
     */
    warning(message: string, config?: MatSnackBarConfig): void {
        this.show(message, 'warning', config);
    }

    /**
     * Show info notification
     */
    info(message: string, config?: MatSnackBarConfig): void {
        this.show(message, 'info', config);
    }

    /**
     * Show notification with custom type
     */
    private show(message: string, type: NotificationType, config?: MatSnackBarConfig): void {
        const finalConfig = {
            ...this.defaultConfig,
            ...config,
            panelClass: [`notification-${type}`]
        };

        this.snackBar.open(message, 'Close', finalConfig);
    }

    /**
     * Dismiss all notifications
     */
    dismiss(): void {
        this.snackBar.dismiss();
    }
}
