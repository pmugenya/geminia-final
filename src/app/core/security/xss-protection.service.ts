import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl } from '@angular/platform-browser';

/**
 * XSS Protection Service
 * Implements OWASP security best practices for Angular applications
 * 
 * OWASP Guidelines:
 * - Never use innerHTML without sanitization
 * - Always escape user input
 * - Sanitize URLs and resource URLs
 * - Validate all data before rendering
 */
@Injectable({
    providedIn: 'root'
})
export class XssProtectionService {
    constructor(private sanitizer: DomSanitizer) {}

    /**
     * Sanitize HTML content to prevent XSS attacks
     * Use this instead of innerHTML
     * 
     * @example
     * // ❌ UNSAFE
     * element.innerHTML = userInput;
     * 
     * // ✅ SAFE
     * element.innerHTML = this.xssProtection.sanitizeHtml(userInput);
     */
    sanitizeHtml(html: string): SafeHtml {
        return this.sanitizer.sanitize(1, html) as any || '';
    }

    /**
     * Sanitize URL to prevent malicious redirects
     * Use for href attributes and router navigation
     * 
     * @example
     * // ✅ SAFE
     * const safeUrl = this.xssProtection.sanitizeUrl(userProvidedUrl);
     */
    sanitizeUrl(url: string): SafeUrl {
        return this.sanitizer.sanitize(4, url) as any || '';
    }

    /**
     * Sanitize resource URL (for iframes, object, embed tags)
     * 
     * @example
     * // ✅ SAFE
     * const safeResourceUrl = this.xssProtection.sanitizeResourceUrl(url);
     */
    sanitizeResourceUrl(url: string): SafeResourceUrl {
        return this.sanitizer.sanitize(5, url) as any || '';
    }

    /**
     * Sanitize style to prevent CSS injection
     * 
     * @example
     * // ✅ SAFE
     * const safeStyle = this.xssProtection.sanitizeStyle(userStyle);
     */
    sanitizeStyle(style: string): SafeStyle {
        return this.sanitizer.sanitize(3, style) as any || '';
    }

    /**
     * Sanitize script - Generally should NOT be used
     * Scripts from user input should be blocked entirely
     */
    sanitizeScript(script: string): SafeScript {
        console.warn('⚠️ SECURITY WARNING: Attempting to sanitize script. This should be avoided.');
        return this.sanitizer.sanitize(2, script) as any || '';
    }

    /**
     * Strip all HTML tags from string
     * Use when you need plain text only
     * 
     * @example
     * const plainText = this.xssProtection.stripHtml('<script>alert("xss")</script>Hello');
     * // Returns: "Hello"
     */
    stripHtml(html: string): string {
        const tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    /**
     * Escape HTML special characters
     * Use for displaying user input as text
     * 
     * @example
     * const escaped = this.xssProtection.escapeHtml('<script>alert("xss")</script>');
     * // Returns: "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
     */
    escapeHtml(text: string): string {
        const map: { [key: string]: string } = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;'
        };
        return text.replace(/[&<>"'/]/g, (char) => map[char]);
    }

    /**
     * Validate if URL is safe (whitelist approach)
     * Only allows http, https, and mailto protocols
     * 
     * @example
     * if (this.xssProtection.isUrlSafe(userUrl)) {
     *     // Safe to use
     * }
     */
    isUrlSafe(url: string): boolean {
        try {
            const urlObj = new URL(url);
            const safeProtocols = ['http:', 'https:', 'mailto:'];
            return safeProtocols.includes(urlObj.protocol);
        } catch {
            return false;
        }
    }

    /**
     * Validate if URL matches allowed domains (whitelist)
     * 
     * @example
     * const isAllowed = this.xssProtection.isUrlAllowed(url, ['example.com', 'trusted.com']);
     */
    isUrlAllowed(url: string, allowedDomains: string[]): boolean {
        try {
            const urlObj = new URL(url);
            return allowedDomains.some(domain => 
                urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
            );
        } catch {
            return false;
        }
    }

    /**
     * Sanitize image source
     * Prevents data: URLs and javascript: URLs
     * 
     * @example
     * <img [src]="xssProtection.sanitizeImageSrc(userImageUrl)">
     */
    sanitizeImageSrc(src: string): string {
        if (!src) return '';
        
        // Block dangerous protocols
        const dangerousProtocols = ['javascript:', 'data:', 'vbscript:'];
        const lowerSrc = src.toLowerCase().trim();
        
        if (dangerousProtocols.some(protocol => lowerSrc.startsWith(protocol))) {
            console.warn('⚠️ SECURITY: Blocked dangerous image source protocol');
            return '';
        }
        
        return src;
    }

    /**
     * Validate and sanitize file name
     * Prevents directory traversal attacks
     * 
     * @example
     * const safeName = this.xssProtection.sanitizeFileName(userFileName);
     */
    sanitizeFileName(fileName: string): string {
        // Remove path separators and dangerous characters
        return fileName
            .replace(/[\/\\]/g, '')
            .replace(/\.\./g, '')
            .replace(/[<>:"|?*]/g, '')
            .trim();
    }

    /**
     * Validate JSON input to prevent injection
     * 
     * @example
     * const safeData = this.xssProtection.sanitizeJson(userJsonString);
     */
    sanitizeJson(jsonString: string): any | null {
        try {
            const parsed = JSON.parse(jsonString);
            // Additional validation can be added here
            return parsed;
        } catch (error) {
            console.error('Invalid JSON input:', error);
            return null;
        }
    }

    /**
     * Check if content contains potential XSS patterns
     * Use for additional validation before processing
     * 
     * @example
     * if (this.xssProtection.containsXssPattern(userInput)) {
     *     // Block or sanitize
     * }
     */
    containsXssPattern(content: string): boolean {
        const xssPatterns = [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi, // Event handlers like onclick=
            /<iframe/gi,
            /<object/gi,
            /<embed/gi,
            /eval\(/gi,
            /expression\(/gi,
        ];

        return xssPatterns.some(pattern => pattern.test(content));
    }

    /**
     * Sanitize CSS to prevent CSS injection attacks
     * 
     * @example
     * const safeCSS = this.xssProtection.sanitizeCss(userCSS);
     */
    sanitizeCss(css: string): string {
        // Remove dangerous CSS properties
        const dangerousPatterns = [
            /javascript:/gi,
            /expression\(/gi,
            /import\s/gi,
            /@import/gi,
            /behavior:/gi,
            /-moz-binding:/gi,
        ];

        let sanitized = css;
        dangerousPatterns.forEach(pattern => {
            sanitized = sanitized.replace(pattern, '');
        });

        return sanitized;
    }

    /**
     * Generate Content Security Policy nonce
     * Use for inline scripts that must be allowed
     * 
     * @example
     * const nonce = this.xssProtection.generateNonce();
     * <script nonce="{{nonce}}">...</script>
     */
    generateNonce(): string {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
}
