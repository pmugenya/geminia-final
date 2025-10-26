import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmationDialogData {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'warning' | 'danger' | 'info';
}

@Component({
    selector: 'app-confirmation-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
    template: `
        <div class="confirmation-dialog">
            <div class="dialog-header" [ngClass]="'type-' + data.type">
                <mat-icon class="dialog-icon">
                    {{ getIcon() }}
                </mat-icon>
                <h2 mat-dialog-title>{{ data.title }}</h2>
            </div>
            
            <div mat-dialog-content class="dialog-content">
                <p>{{ data.message }}</p>
            </div>
            
            <div mat-dialog-actions class="dialog-actions">
                <button 
                    mat-button 
                    (click)="onCancel()"
                    class="cancel-button">
                    {{ data.cancelText || 'Cancel' }}
                </button>
                <button 
                    mat-raised-button 
                    [color]="getButtonColor()"
                    (click)="onConfirm()"
                    class="confirm-button">
                    {{ data.confirmText || 'Confirm' }}
                </button>
            </div>
        </div>
    `,
    styles: [`
        .confirmation-dialog {
            min-width: 300px;
            max-width: 500px;
        }
        
        .dialog-header {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
            padding: 16px 0;
        }
        
        .dialog-icon {
            margin-right: 12px;
            font-size: 24px;
            width: 24px;
            height: 24px;
        }
        
        .type-warning .dialog-icon {
            color: #ff9800;
        }
        
        .type-danger .dialog-icon {
            color: #f44336;
        }
        
        .type-info .dialog-icon {
            color: #2196f3;
        }
        
        .dialog-content {
            margin-bottom: 24px;
        }
        
        .dialog-actions {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
        }
        
        .cancel-button {
            margin-right: 8px;
        }
    `]
})
export class ConfirmationDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
    ) {
        // Set default type if not provided
        if (!this.data.type) {
            this.data.type = 'info';
        }
    }

    onConfirm(): void {
        this.dialogRef.close(true);
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }

    getIcon(): string {
        switch (this.data.type) {
            case 'warning':
                return 'warning';
            case 'danger':
                return 'error';
            case 'info':
            default:
                return 'info';
        }
    }

    getButtonColor(): 'primary' | 'accent' | 'warn' {
        switch (this.data.type) {
            case 'danger':
                return 'warn';
            case 'warning':
                return 'accent';
            case 'info':
            default:
                return 'primary';
        }
    }
}
