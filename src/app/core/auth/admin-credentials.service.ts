import { Injectable } from '@angular/core';

export interface AdminCredentials {
    username: string;
    password: string;
    role: 'admin' | 'super-admin';
    name: string;
}

@Injectable({ providedIn: 'root' })
export class AdminCredentialsService {
    
    // Sample admin credentials - perfect for development and testing
    private readonly adminCredentials: AdminCredentials[] = [
        {
            username: 'admin@geminia.com',
            password: 'admin123',
            role: 'admin',
            name: 'Admin User'
        },
        {
            username: 'test@admin.com',
            password: 'test123',
            role: 'admin', 
            name: 'Test Admin'
        }
    ];

    /**
     * Validate admin credentials
     */
    validateCredentials(username: string, password: string): AdminCredentials | null {
        const admin = this.adminCredentials.find(
            cred => cred.username === username && cred.password === password
        );
        return admin || null;
    }

    /**
     * Get all available admin credentials (for development reference)
     */
    getAvailableCredentials(): AdminCredentials[] {
        return [...this.adminCredentials];
    }

    /**
     * Check if user is admin based on email
     */
    isAdminEmail(email: string): boolean {
        return this.adminCredentials.some(cred => cred.username === email);
    }

    /**
     * Generate a proper JWT format token for admin sessions
     */
    generateAdminToken(admin: AdminCredentials): string {
        // JWT Header
        const header = {
            alg: 'HS256',
            typ: 'JWT'
        };
        
        // JWT Payload
        const payload = {
            username: admin.username,
            role: admin.role,
            name: admin.name,
            isAdmin: true,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours in seconds
        };
        
        // Create JWT parts (header.payload.signature)
        const replacer = (m: string): string => {
            const map: { [key: string]: string } = { '+': '-', '/': '_' };
            return map[m] || m;
        };
        const encodedHeader = btoa(JSON.stringify(header)).replace(/[+/]/g, replacer).replace(/=/g, '');
        const encodedPayload = btoa(JSON.stringify(payload)).replace(/[+/]/g, replacer).replace(/=/g, '');
        const signature = 'admin-dev-signature'; // Simple signature for development
        
        return `${encodedHeader}.${encodedPayload}.${signature}`;
    }

    /**
     * Decode admin token (JWT format)
     */
    decodeAdminToken(token: string): any {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) return null;
            
            // Decode the payload (second part)
            const payload = parts[1];
            // Add padding if needed
            const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
            const decodedPayload = paddedPayload.replace(/-/g, '+').replace(/_/g, '/');
            
            return JSON.parse(atob(decodedPayload));
        } catch {
            return null;
        }
    }

    /**
     * Check if admin token is valid
     */
    isValidAdminToken(token: string): boolean {
        const decoded = this.decodeAdminToken(token);
        if (!decoded || !decoded.isAdmin) return false;
        
        // Check expiration (exp is in seconds, Date.now() is in milliseconds)
        return decoded.exp > Math.floor(Date.now() / 1000);
    }
}
