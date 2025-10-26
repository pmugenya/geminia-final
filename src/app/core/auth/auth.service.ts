import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { JwtService } from '../../modules/auth/shared/services/jwt.service';
import { AuthenticationService } from '../../modules/auth/shared/services/auth.service';
import { User } from '../user/user.types';
import { Router } from '@angular/router';
import { AdminCredentialsService } from './admin-credentials.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _authenticated: boolean = false;
    private _httpClient = inject(HttpClient);
    private _userService = inject(UserService);
    private baseUrl = environment.apiUrl;
    private router = inject(Router);

    private jwtService: JwtService = inject(JwtService);
    private authenticationService: AuthenticationService = inject(AuthenticationService);
    private adminCredentialsService: AdminCredentialsService = inject(AdminCredentialsService);
    private readonly STORAGE_KEYS = {
        USER_DATA: 'geminia_user_data'
    };

    // Keys for localStorage
    private readonly ACCESS_TOKEN_KEY = 'accessToken';
    private readonly TEMP_TOKEN_KEY = 'temp_auth_token';

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
<<<<<<< HEAD
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        sessionStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return sessionStorage.getItem('accessToken') ?? '';
    }

    // set accessToken(token: string) {
    //     if (token) {
    //         localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    //     } else {
    //         localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    //     }
    // }
    //
    // get accessToken(): string {
    //     return localStorage.getItem(this.ACCESS_TOKEN_KEY) ?? '';
    // }

    /**
     * Temporary token (before OTP)
     */
    set tempToken(token: string) {
        if (token) {
            localStorage.setItem(this.TEMP_TOKEN_KEY, token);
        } else {
            this.clearTempToken();
        }
    }

    get tempToken(): string {
        return localStorage.getItem(this.TEMP_TOKEN_KEY) ?? '';
    }

    clearTempToken(): void {
        localStorage.removeItem(this.TEMP_TOKEN_KEY);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
<<<<<<< HEAD
     * Forgot password
     *
     * @param email
     */
    forgotPassword(password: string): Observable<any> {
        const credentials = { "email": password }
        return this._httpClient.post(`${this.baseUrl}/self/resetpass`, credentials);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string, confirmPassword: string, userId: number,tempToken: string): Observable<any> {
        const credentials = {"userid": userId, "tempToken": tempToken,"password":password,"passwordConfirm":confirmPassword }
        return this._httpClient.post(`${this.baseUrl}/self/updatepass`, credentials);
    }

    /**
     * verify password
     *
     * @param password
     */
    verifyUser(userId: number,tempToken: string, code: string): Observable<any> {
        const credentials = {"userid": userId, "tempToken": tempToken,"code":code }
        return this._httpClient.post(`${this.baseUrl}/self/verifuser`, credentials);
    }



    signIn(credentials: { username: string; password: string }): Observable<any> {
        console.log('🔐 Login attempt:', {
            url: `${this.baseUrl}/login`,
            username: credentials.username,
            timestamp: new Date().toISOString()
        });

        // Check if this is an admin login attempt
        const adminUser = this.adminCredentialsService.validateCredentials(
            credentials.username,
            credentials.password
        );

        if (adminUser) {
            console.log('✅ Admin login detected for:', adminUser.name);
            // Handle admin authentication locally
            return this.handleAdminLogin(adminUser);
        }

        // Regular user authentication via API
        console.log('📡 Calling API endpoint:', `${this.baseUrl}/login`);
        return this._httpClient.post(`${this.baseUrl}/login`, credentials).pipe(
            tap(response => {
                console.log('✅ Login API response received:', response);
            }),
            catchError(error => {
                console.error('❌ Login API error:', {
                    status: error.status,
                    statusText: error.statusText,
                    message: error.message,
                    url: error.url,
                    error: error.error
                });
                return throwError(() => error);
            })
        );
    }

    /**
     * Handle admin login with sample credentials
     */
    private handleAdminLogin(adminUser: any): Observable<any> {
        return of({
            isAdmin: true,
            adminUser: adminUser,
            accessToken: this.adminCredentialsService.generateAdminToken(adminUser),
            message: 'Admin login successful'
        }).pipe(
            tap((response) => {
                // Set admin session
                this.accessToken = response.accessToken;
                sessionStorage.setItem('isAdmin', 'true');
                sessionStorage.setItem('adminUser', JSON.stringify(adminUser));
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('userType', 'admin');

                // Set user data for admin
                this._userService.user = {
                    username: adminUser.username,
                    name: adminUser.name,
                    email: adminUser.username,
                    userType: 'A', // 'A' for Admin
                    loginTime: Date.now(),
                    phoneNumber: 'N/A'
                };

                console.log('✅ Admin login successful:', adminUser.name);
            })
        );
    }

    /**
     * Verify OTP (Step 2)
     */
    verifyOtp(payload: { tempToken: string; otp: string }): Observable<any> {
        console.log('🔐 Verifying OTP...');
        const validationUrl = `${this.baseUrl}/login/validate`;

        return this._httpClient.post<any>(validationUrl, payload).pipe(
            tap((response: any) => {
                console.log('✅ OTP verification successful:', response);

                // Save final JWT from the correct property in the response
                this.accessToken = response.base64EncodedAuthenticationKey || response.token || '';

                // Set user data properly
                const userData = {
                    username: response.username || response.email || payload.tempToken,
                    name: response.name || response.fullName || 'User',
                    email: response.email || response.username || '',
                    userType: response.userType || 'C',
                    loginTime: Date.now(),
                    phoneNumber: response.phoneNumber || response.phone || ''
                };

                console.log('👤 Setting user data:', userData);

                // Set in both services
                this.authenticationService.setCurrentUser(userData, this.accessToken);
                this._userService.user = userData;

                // Set session flags
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('userType', userData.userType);

                console.log('✅ User session established');

                // Clean up the temporary token now that it has been used
                this.clearTempToken();
            }),
            catchError((error) => {
                console.error('❌ OTP verification failed:', error);
                // Also clear the temp token on failure
                const devMessage = error?.error?.errors?.[0]?.developerMessage;
                return throwError(() => new Error(devMessage || 'Invalid OTP. Please try again.'));
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): void {
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('userType');
        sessionStorage.removeItem(this.STORAGE_KEYS.USER_DATA);
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');
        // Return the observable
        localStorage.removeItem(this.ACCESS_TOKEN_KEY);
        this.clearTempToken();
        this._authenticated = false;
        this.router.navigate(['/sign-in']);
    }

    /**
<<<<<<< HEAD
     * Sign up
     *
     * @param user
     */
    signUp(user: {
        name: string;
        email: string;
        password: string;
        company: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: {
        email: string;
        password: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check if current user is admin
     */
    isAdmin(): boolean {
        const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
        const adminToken = this.accessToken;

        if (isAdmin && adminToken) {
            return this.adminCredentialsService.isValidAdminToken(adminToken);
        }

        return false;
    }

    /**
     * Get current admin user data
     */
    getAdminUser(): any {
        const adminUserData = sessionStorage.getItem('adminUser');
        return adminUserData ? JSON.parse(adminUserData) : null;
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if this is an admin session
        if (this.isAdmin()) {
            console.log('✅ Admin session active');
            return of(true);
        }

        // Check if the user is logged in
        // if (this._authenticated) {
        //     return of(true);
        // }

        // Check the access token availability
        if (!this.accessToken) {
            console.log('invalid token...');
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            console.log('expired token...');
            return of(false);
        }

        // If the access token exists, and it didn't expire, sign in using it
        return of(true);
    }
}

