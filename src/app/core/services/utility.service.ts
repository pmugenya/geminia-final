import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UtilityService {

    /**
     * Generate a unique ID
     */
    generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }

    /**
     * Deep clone an object
     */
    deepClone<T>(obj: T): T {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        
        if (obj instanceof Date) {
            return new Date(obj.getTime()) as any;
        }
        
        if (obj instanceof Array) {
            return obj.map(item => this.deepClone(item)) as any;
        }
        
        if (typeof obj === 'object') {
            const clonedObj = {} as any;
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    clonedObj[key] = this.deepClone(obj[key]);
                }
            }
            return clonedObj;
        }
        
        return obj;
    }

    /**
     * Debounce function
     */
    debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
        let timeoutId: ReturnType<typeof setTimeout>;
        return (...args: Parameters<T>) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    /**
     * Throttle function
     */
    throttle<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
        let lastCall = 0;
        return (...args: Parameters<T>) => {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                func.apply(this, args);
            }
        };
    }

    /**
     * Format currency
     */
    formatCurrency(amount: number, currency: string = 'USD', locale: string = 'en-US'): string {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    /**
     * Format number with thousands separator
     */
    formatNumber(num: number, locale: string = 'en-US'): string {
        return new Intl.NumberFormat(locale).format(num);
    }

    /**
     * Truncate text
     */
    truncateText(text: string, maxLength: number, suffix: string = '...'): string {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength - suffix.length) + suffix;
    }

    /**
     * Capitalize first letter
     */
    capitalizeFirst(text: string): string {
        if (!text) return text;
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }

    /**
     * Convert to title case
     */
    toTitleCase(text: string): string {
        return text.replace(/\w\S*/g, (txt) => 
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    }

    /**
     * Remove HTML tags
     */
    stripHtml(html: string): string {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    /**
     * Check if object is empty
     */
    isEmpty(obj: any): boolean {
        if (obj == null) return true;
        if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
        return Object.keys(obj).length === 0;
    }

    /**
     * Get file extension
     */
    getFileExtension(filename: string): string {
        return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
    }

    /**
     * Convert bytes to human readable format
     */
    formatBytes(bytes: number, decimals: number = 2): string {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    /**
     * Generate random color
     */
    generateRandomColor(): string {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }

    /**
     * Check if date is today
     */
    isToday(date: Date): boolean {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    }

    /**
     * Get days between two dates
     */
    getDaysBetween(date1: Date, date2: Date): number {
        const oneDay = 24 * 60 * 60 * 1000;
        return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
    }
}
