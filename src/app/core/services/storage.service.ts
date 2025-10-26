import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    
    /**
     * Set item in localStorage
     */
    setItem(key: string, value: any): void {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    /**
     * Get item from localStorage
     */
    getItem<T>(key: string): T | null {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    }

    /**
     * Remove item from localStorage
     */
    removeItem(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    }

    /**
     * Clear all localStorage
     */
    clear(): void {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    }

    /**
     * Check if key exists in localStorage
     */
    hasItem(key: string): boolean {
        return localStorage.getItem(key) !== null;
    }

    /**
     * Set item in sessionStorage
     */
    setSessionItem(key: string, value: any): void {
        try {
            const serializedValue = JSON.stringify(value);
            sessionStorage.setItem(key, serializedValue);
        } catch (error) {
            console.error('Error saving to sessionStorage:', error);
        }
    }

    /**
     * Get item from sessionStorage
     */
    getSessionItem<T>(key: string): T | null {
        try {
            const item = sessionStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from sessionStorage:', error);
            return null;
        }
    }

    /**
     * Remove item from sessionStorage
     */
    removeSessionItem(key: string): void {
        try {
            sessionStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from sessionStorage:', error);
        }
    }
}
