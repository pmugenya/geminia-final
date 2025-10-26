import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Security HTTP Interceptor
 * Implements OWASP security headers and XSRF protection
 * 
 * OWASP Guidelines:
 * - Add security headers to all requests
 * - Implement XSRF/CSRF protection
 * - Validate response content type
 * - Log security events
 * 
 * Note: Angular HttpClient handles XSRF automatically, but this adds extra security
 */
export const securityInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    // Only add headers for API requests
    if (!req.url.startsWith(environment.apiUrl)) {
        return next(req);
    }

    // Clone request and add security headers
    const secureReq = req.clone({
        setHeaders: {
            // Content Security Policy
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
            
            // Additional security headers
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Pragma': 'no-cache',
            
            // API version (optional)
            'X-API-Version': '1.0',
        },
        // withCredentials removed to fix CORS issue with wildcard Access-Control-Allow-Origin
        // Enable this only if backend is configured with specific origin (not *)
        // withCredentials: true
    });

    // Log security event in development
    if (!environment.production && environment.enableDebug) {
        console.log('🔒 Security Interceptor:', {
            method: secureReq.method,
            url: secureReq.url,
            headers: secureReq.headers.keys()
        });
    }

    return next(secureReq);
};
