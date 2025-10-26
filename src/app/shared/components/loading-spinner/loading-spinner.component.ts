import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-loading-spinner',
    standalone: true,
    imports: [CommonModule, MatProgressSpinnerModule],
    template: `
        <div class="loading-container" [class.overlay]="overlay">
            <mat-spinner 
                [diameter]="diameter" 
                [strokeWidth]="strokeWidth"
                [color]="color">
            </mat-spinner>
            <p *ngIf="message" class="loading-message">{{ message }}</p>
        </div>
    `,
    styles: [`
        .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .loading-container.overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.8);
            z-index: 9999;
        }
        
        .loading-message {
            margin-top: 16px;
            font-size: 14px;
            color: #666;
            text-align: center;
        }
    `]
})
export class LoadingSpinnerComponent {
    @Input() diameter: number = 40;
    @Input() strokeWidth: number = 4;
    @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
    @Input() message: string = '';
    @Input() overlay: boolean = false;
}
