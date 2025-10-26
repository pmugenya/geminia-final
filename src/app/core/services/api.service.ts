import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private readonly baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    /**
     * Generic GET request
     */
    get<T>(endpoint: string, params?: HttpParams): Observable<ApiResponse<T>> {
        const options = params ? { params } : {};
        return this.http.get<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, options)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    /**
     * Generic POST request
     */
    post<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
        return this.http.post<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, data, {
            headers: this.getHeaders()
        }).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Generic PUT request
     */
    put<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
        return this.http.put<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, data, {
            headers: this.getHeaders()
        }).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Generic DELETE request
     */
    delete<T>(endpoint: string): Observable<ApiResponse<T>> {
        return this.http.delete<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`)
            .pipe(
                catchError(this.handleError)
            );
    }

    /**
     * Get common headers
     */
    private getHeaders(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
    }

    /**
     * Handle HTTP errors
     */
    private handleError(error: unknown): Observable<never> {
        let errorMessage = 'An unknown error occurred';
        
        if (this.isHttpErrorResponse(error)) {
            if (error.error instanceof ErrorEvent) {
                // Client-side error
                errorMessage = error.error.message;
            } else {
                // Server-side error
                errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
            }
        } else if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        }
        
        console.error('API Error:', errorMessage);
        return throwError(() => new Error(errorMessage));
    }

    /**
     * Type guard to check if error is HttpErrorResponse
     */
    private isHttpErrorResponse(error: unknown): error is { 
        error?: { message?: string } | ErrorEvent; 
        status?: number; 
        message?: string; 
    } {
        return typeof error === 'object' && error !== null && 'status' in error;
    }
}
