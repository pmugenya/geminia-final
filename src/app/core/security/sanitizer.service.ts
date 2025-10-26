import { Injectable, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

/**
 * Security service for input sanitization and XSS prevention
 * Implements OWASP security best practices
 */
@Injectable({
    providedIn: 'root'
})
export class SanitizerService {
    constructor(private domSanitizer: DomSanitizer) {}

    /**
     * Sanitize HTML content to prevent XSS attacks
     */
    sanitizeHtml(value: string): SafeHtml {
        const sanitized = this.domSanitizer.sanitize(SecurityContext.HTML, value);
        return this.domSanitizer.bypassSecurityTrustHtml(sanitized || '');
    }

    /**
     * Sanitize URL to prevent malicious redirects
     */
    sanitizeUrl(value: string): SafeUrl {
        const sanitized = this.domSanitizer.sanitize(SecurityContext.URL, value);
        return this.domSanitizer.bypassSecurityTrustUrl(sanitized || '');
    }

    /**
     * Sanitize resource URL (for iframes, etc.)
     */
    sanitizeResourceUrl(value: string): SafeResourceUrl {
        const sanitized = this.domSanitizer.sanitize(SecurityContext.RESOURCE_URL, value);
        return this.domSanitizer.bypassSecurityTrustResourceUrl(sanitized || '');
    }

    /**
     * Remove all HTML tags from string
     */
    stripHtml(value: string): string {
        const div = document.createElement('div');
        div.innerHTML = value;
        return div.textContent || div.innerText || '';
    }

    /**
     * Escape special HTML characters
     */
    escapeHtml(value: string): string {
        const map: { [key: string]: string } = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;'
        };
        return value.replace(/[&<>"'/]/g, (char) => map[char]);
    }

    /**
     * Validate and sanitize email address
     */
    sanitizeEmail(email: string): string {
        // Remove any HTML tags
        const stripped = this.stripHtml(email);
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(stripped) ? stripped.toLowerCase().trim() : '';
    }

    /**
     * Sanitize phone number (remove non-numeric characters except +)
     */
    sanitizePhoneNumber(phone: string): string {
        return phone.replace(/[^\d+]/g, '');
    }

    /**
     * Validate and sanitize numeric input
     */
    sanitizeNumber(value: string | number): number | null {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return !isNaN(num) && isFinite(num) ? num : null;
    }

    /**
     * Sanitize file name to prevent directory traversal
     */
    sanitizeFileName(fileName: string): string {
        // Remove path separators and special characters
        return fileName
            .replace(/[\/\\]/g, '')
            .replace(/[^\w\s.-]/g, '')
            .trim();
    }

    /**
     * Check if URL is safe (whitelist approach)
     */
    isSafeUrl(url: string, allowedDomains: string[] = []): boolean {
        try {
            const urlObj = new URL(url);
            const protocol = urlObj.protocol;
            
            // Only allow http and https protocols
            if (protocol !== 'http:' && protocol !== 'https:') {
                return false;
            }
            
            // If whitelist provided, check domain
            if (allowedDomains.length > 0) {
                return allowedDomains.some(domain => 
                    urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
                );
            }
            
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Sanitize SQL-like input to prevent injection
     */
    sanitizeSqlInput(value: string): string {
        // Remove SQL keywords and special characters
        const sqlKeywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE', 'ALTER', 'EXEC', 'UNION'];
        let sanitized = value;
        
        sqlKeywords.forEach(keyword => {
            const regex = new RegExp(keyword, 'gi');
            sanitized = sanitized.replace(regex, '');
        });
        
        // Remove special SQL characters
        return sanitized.replace(/['";\\]/g, '');
    }

    /**
     * Validate and sanitize JSON input
     */
    sanitizeJson(value: string): any | null {
        try {
            return JSON.parse(value);
        } catch {
            return null;
        }
    }

    /**
     * Generate Content Security Policy nonce
     */
    generateNonce(): string {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Validate password strength
     */
    validatePasswordStrength(password: string): {
        isValid: boolean;
        strength: 'weak' | 'medium' | 'strong';
        issues: string[];
    } {
        const issues: string[] = [];
        let strength: 'weak' | 'medium' | 'strong' = 'weak';

        if (password.length < 8) {
            issues.push('Password must be at least 8 characters long');
        }
        if (!/[a-z]/.test(password)) {
            issues.push('Password must contain lowercase letters');
        }
        if (!/[A-Z]/.test(password)) {
            issues.push('Password must contain uppercase letters');
        }
        if (!/\d/.test(password)) {
            issues.push('Password must contain numbers');
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            issues.push('Password must contain special characters');
        }

        const isValid = issues.length === 0;
        
        if (isValid) {
            strength = password.length >= 12 ? 'strong' : 'medium';
        }

        return { isValid, strength, issues };
    }
}
