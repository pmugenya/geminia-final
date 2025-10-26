import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AdminCredentialsService } from '../core/auth/admin-credentials.service';

@Component({
    selector: 'app-admin-login-helper',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
    template: `
        <div class="admin-helper-container">
            <mat-card class="admin-credentials-card">
                <mat-card-header>
                    <mat-card-title>
                        <mat-icon>admin_panel_settings</mat-icon>
                        Admin Login Credentials
                    </mat-card-title>
                    <mat-card-subtitle>Sample credentials for testing</mat-card-subtitle>
                </mat-card-header>
                
                <mat-card-content>
                    <div class="credentials-list">
                        <div *ngFor="let cred of adminCredentials" class="credential-item">
                            <div class="credential-info">
                                <strong>{{cred.name}}</strong> ({{cred.role}})
                                <br>
                                <span class="email">{{cred.username}}</span>
                                <br>
                                <span class="password">Password: {{cred.password}}</span>
                            </div>
                            <button mat-raised-button color="primary" 
                                    (click)="copyCredentials(cred.username, cred.password)">
                                <mat-icon>content_copy</mat-icon>
                                Copy
                            </button>
                        </div>
                    </div>
                </mat-card-content>
                
                <mat-card-actions>
                    <p class="note">
                        <mat-icon>info</mat-icon>
                        Use these credentials on the login page to access the admin dashboard
                    </p>
                </mat-card-actions>
            </mat-card>
        </div>
    `,
    styles: [`
        .admin-helper-container {
            display: flex;
            justify-content: center;
            padding: 20px;
            background: #f5f5f5;
            min-height: 100vh;
        }
        
        .admin-credentials-card {
            max-width: 600px;
            width: 100%;
            margin: 20px;
        }
        
        .credentials-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        
        .credential-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            background: #fafafa;
        }
        
        .credential-info {
            flex: 1;
        }
        
        .email {
            color: #1976d2;
            font-family: monospace;
        }
        
        .password {
            color: #388e3c;
            font-family: monospace;
        }
        
        .note {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #666;
            font-style: italic;
            margin: 0;
        }
        
        mat-card-header {
            margin-bottom: 16px;
        }
        
        mat-card-title {
            display: flex;
            align-items: center;
            gap: 8px;
        }
    `]
})
export class AdminLoginHelperComponent {
    private adminCredentialsService = inject(AdminCredentialsService);
    
    adminCredentials = this.adminCredentialsService.getAvailableCredentials();
    
    copyCredentials(username: string, password: string): void {
        const text = `Username: ${username}\nPassword: ${password}`;
        navigator.clipboard.writeText(text).then(() => {
            console.log('✅ Credentials copied to clipboard');
        }).catch(() => {
            console.log('❌ Failed to copy credentials');
        });
    }
}
