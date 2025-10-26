/**
 * Formatting Service
 * Centralized formatting for dates, currency, numbers
 * Eliminates duplicated formatting logic across components
 */

import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FormattingService {
    private readonly defaultCurrency = environment.defaultCurrency;
    private readonly defaultLanguage = environment.defaultLanguage;

    constructor(@Inject(LOCALE_ID) private locale: string) {}

    /**
     * Format amount as currency
     * @param amount - Amount to format
     * @param currency - Currency code (default: KES)
     * @returns Formatted currency string
     * @example formatCurrency(1000, 'KES') => 'KES 1,000.00'
     */
    formatCurrency(amount: number, currency?: string): string {
        const curr = currency || this.defaultCurrency;
        return new Intl.NumberFormat(this.locale, {
            style: 'currency',
            currency: curr,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    /**
     * Format date with specified style
     * @param date - Date to format
     * @param format - Date style (short, medium, long, full)
     * @returns Formatted date string
     * @example formatDate(new Date(), 'medium') => 'Jan 15, 2024'
     */
    formatDate(date: Date | string, format: 'short' | 'medium' | 'long' | 'full' = 'medium'): string {
        const d = typeof date === 'string' ? new Date(date) : date;
        return new Intl.DateTimeFormat(this.locale, {
            dateStyle: format
        }).format(d);
    }

    /**
     * Format date and time
     * @param date - Date to format
     * @returns Formatted date and time string
     * @example formatDateTime(new Date()) => 'Jan 15, 2024, 3:30 PM'
     */
    formatDateTime(date: Date | string): string {
        const d = typeof date === 'string' ? new Date(date) : date;
        return new Intl.DateTimeFormat(this.locale, {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(d);
    }

    /**
     * Format number with specified decimal places
     * @param value - Number to format
     * @param decimals - Number of decimal places
     * @returns Formatted number string
     * @example formatNumber(1234.567, 2) => '1,234.57'
     */
    formatNumber(value: number, decimals: number = 2): string {
        return new Intl.NumberFormat(this.locale, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(value);
    }

    /**
     * Format value as percentage
     * @param value - Value to format (0-100)
     * @returns Formatted percentage string
     * @example formatPercentage(75.5) => '75.50%'
     */
    formatPercentage(value: number): string {
        return new Intl.NumberFormat(this.locale, {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value / 100);
    }

    /**
     * Format phone number
     * @param phone - Phone number to format
     * @returns Formatted phone number
     * @example formatPhoneNumber('254712345678') => '+254 712 345 678'
     */
    formatPhoneNumber(phone: string): string {
        const cleaned = phone.replace(/\D/g, '');
        
        if (cleaned.startsWith('254')) {
            // Kenya format
            return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
        }
        
        // Default format
        return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }

    /**
     * Format file size
     * @param bytes - File size in bytes
     * @returns Formatted file size string
     * @example formatFileSize(1048576) => '1.00 MB'
     */
    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    }

    /**
     * Format relative time
     * @param date - Date to format
     * @returns Relative time string
     * @example formatRelativeTime(yesterday) => '1 day ago'
     */
    formatRelativeTime(date: Date | string): string {
        const d = typeof date === 'string' ? new Date(date) : date;
        const now = new Date();
        const diffMs = now.getTime() - d.getTime();
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffSecs < 60) return 'just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        
        return this.formatDate(d, 'short');
    }

    /**
     * Format duration in milliseconds
     * @param ms - Duration in milliseconds
     * @returns Formatted duration string
     * @example formatDuration(90000) => '1m 30s'
     */
    formatDuration(ms: number): string {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ${hours % 24}h`;
        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    }

    /**
     * Truncate text with ellipsis
     * @param text - Text to truncate
     * @param maxLength - Maximum length
     * @returns Truncated text
     * @example truncateText('Long text here', 10) => 'Long te...'
     */
    truncateText(text: string, maxLength: number): string {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    }

    /**
     * Capitalize first letter of each word
     * @param text - Text to capitalize
     * @returns Capitalized text
     * @example capitalizeWords('hello world') => 'Hello World'
     */
    capitalizeWords(text: string): string {
        return text.replace(/\b\w/g, char => char.toUpperCase());
    }
}
