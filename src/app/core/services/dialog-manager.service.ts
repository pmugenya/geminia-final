import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

/**
 * Dialog Manager Service
 * 
 * Centralized service for managing Material Dialog instances.
 * Handles closing dialogs on errors, network issues, and session timeouts.
 */
@Injectable({
    providedIn: 'root'
})
export class DialogManagerService {
    constructor(private dialog: MatDialog) {}

    /**
     * Close all open dialogs
     */
    closeAll(): void {
        console.log('🔒 Closing all open dialogs');
        this.dialog.closeAll();
    }

    /**
     * Handle network error by closing all dialogs
     */
    handleNetworkError(): void {
        console.log('🌐 Network error detected - closing all dialogs');
        this.closeAll();
    }

    /**
     * Handle authentication error by closing all dialogs
     */
    handleAuthError(): void {
        console.log('🔐 Authentication error - closing all dialogs');
        this.closeAll();
    }

    /**
     * Get count of open dialogs
     */
    getOpenDialogCount(): number {
        return this.dialog.openDialogs.length;
    }

    /**
     * Check if any dialogs are open
     */
    hasOpenDialogs(): boolean {
        return this.dialog.openDialogs.length > 0;
    }
}
