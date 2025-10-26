import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandlerFn,
    HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

/**
 * Intercept
 *
 * @param req
 * @param next
 */
export const authInterceptor = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const authService = inject(AuthService);
    const router = inject(Router);
    // Clone the request object
    const publicApiUrls = [
        '/api/v1/login',
        '/api/v1/login/validate',
        // Also include local assets to prevent them from being processed
        '/assets/',
        '/i18n/'
    ];

    // URLs that should not trigger logout on 401 errors (optional endpoints with backend issues)
    const noLogoutOn401Urls = [
        '/api/v1/ports'
    ];

    // Check if the request is for a public API endpoint or a local asset
    const isPublicUrl = publicApiUrls.some(url => req.url.includes(url));

    // Check if this URL should not trigger logout on 401
    const shouldNotLogoutOn401 = noLogoutOn401Urls.some(url => req.url.includes(url));

    // --- Logic for PUBLIC API calls (Login, OTP) and local assets ---
    if (isPublicUrl) {
        console.log(`Interceptor: Bypassing token logic for public URL: ${req.url}`);
        // Only add the TenantId header for these requests
        const publicReq = req.clone({
            headers: req.headers.set('Fineract-Platform-TenantId', 'default'),
        });
        // Pass it through WITHOUT the 401 catchError logic. The component will handle errors.
        return next(publicReq);
    }

    // --- Logic for all other SECURE API calls ---
    let secureReq = req.clone({
        headers: req.headers.set('Fineract-Platform-TenantId', 'default'),
    });

    // Restore the check for a valid, non-expired accessToken
    if (authService.accessToken && !AuthUtils.isTokenExpired(authService.accessToken)) {
        secureReq = secureReq.clone({
            headers: secureReq.headers.set('Authorization', 'Bearer ' + authService.accessToken),
        });
    }

    // Apply the 401 catchError logic ONLY for secure routes to handle session timeouts.
    return next(secureReq).pipe(
        catchError((error) => {
            console.log('Interceptor caught an error on a secure route:', error);

            // Handle network errors (status 0 means network failure)
            if (error instanceof HttpErrorResponse && error.status === 0) {
                console.log('🌐 Network error detected - connection failed');
                // Don't logout on network errors, just pass the error through
                // The component or global error handler will show appropriate message
                return throwError(() => error);
            }

            // Handle 401 Unauthorized errors
            if (error instanceof HttpErrorResponse && error.status === 401) {
                // Check if this is an admin session - don't logout admin users on API 401s
                const isAdminSession = authService.isAdmin();

                if (isAdminSession) {
                    console.log('🔧 Admin session detected - ignoring 401 error from backend API:', req.url);
                    // Don't logout admin users, just pass the error through
                }  else if (!shouldNotLogoutOn401) {
                    console.log(error);
                    // Check if the backend error looks like a real auth failure
                    const message = (error.error?.message || '').toLowerCase();
                    const isAuthFailure =
                        message.includes('invalid token') ||
                        message.includes('expired token') ||
                        message.includes('unauthorized') ||
                        message.includes('session expired');

                    if (isAuthFailure) {
                        console.log('🔒 Real authentication error detected - logging out user');
                        authService.signOut();
                    } else {
                        console.warn('⚠️ 401 received but not an auth failure. Backend issue:', req.url);
                        // Don't logout, just surface the error
                    }
                }
            }
            return throwError(() => error);
        })
    );
};
    // --- KEY FIX: The whitelist MUST contain the API paths for the multi-step login process ---
    // These are "public" to the interceptor because they do not require a final Authorization Bearer token.

