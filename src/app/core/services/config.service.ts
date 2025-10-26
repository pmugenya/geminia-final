import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { APP_CONSTANTS, ENVIRONMENT_CONSTANTS } from '../constants/app.constants';
import { AppConfig } from '../interfaces';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    private config: AppConfig;

    constructor() {
        this.config = this.initializeConfig();
    }

    /**
     * Initialize configuration based on environment
     */
    private initializeConfig(): AppConfig {
        return {
            apiBaseUrl: environment.apiUrl,
            enableLogging: environment.enableLogging,
            enableDebug: environment.enableDebug,
            defaultLanguage: environment.defaultLanguage,
            supportedLanguages: environment.supportedLanguages,
            defaultCurrency: environment.defaultCurrency,
            supportedCurrencies: environment.supportedCurrencies,
            maxFileSize: environment.maxFileSize,
            allowedFileTypes: environment.allowedFileTypes,
        };
    }

    /**
     * Get configuration value
     */
    get<K extends keyof AppConfig>(key: K): AppConfig[K] {
        return this.config[key];
    }

    /**
     * Get all configuration
     */
    getAll(): AppConfig {
        return { ...this.config };
    }

    /**
     * Update configuration value
     */
    set<K extends keyof AppConfig>(key: K, value: AppConfig[K]): void {
        this.config[key] = value;
    }

    /**
     * Check if running in production
     */
    isProduction(): boolean {
        return !this.isDevelopment() && !this.isStaging();
    }

    /**
     * Check if running in development
     */
    isDevelopment(): boolean {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.hostname.includes('dev');
    }

    /**
     * Check if running in staging
     */
    isStaging(): boolean {
        return window.location.hostname.includes('staging') ||
               window.location.hostname.includes('test');
    }

    /**
     * Get API base URL
     */
    getApiBaseUrl(): string {
        return this.config.apiBaseUrl;
    }

    /**
     * Get supported currencies
     */
    getSupportedCurrencies(): string[] {
        return this.config.supportedCurrencies;
    }

    /**
     * Get supported languages
     */
    getSupportedLanguages(): string[] {
        return this.config.supportedLanguages;
    }

    /**
     * Check if logging is enabled
     */
    isLoggingEnabled(): boolean {
        return this.config.enableLogging;
    }

    /**
     * Check if debug mode is enabled
     */
    isDebugEnabled(): boolean {
        return this.config.enableDebug;
    }

    /**
     * Get maximum file size
     */
    getMaxFileSize(): number {
        return this.config.maxFileSize;
    }

    /**
     * Get allowed file types
     */
    getAllowedFileTypes(): string[] {
        return this.config.allowedFileTypes;
    }

    /**
     * Get app constants
     */
    getConstants() {
        return APP_CONSTANTS;
    }

    /**
     * Get pagination configuration
     */
    getPaginationConfig() {
        return APP_CONSTANTS.PAGINATION;
    }

    /**
     * Get validation configuration
     */
    getValidationConfig() {
        return APP_CONSTANTS.VALIDATION;
    }

    /**
     * Get UI configuration
     */
    getUIConfig() {
        return APP_CONSTANTS.UI;
    }

    /**
     * Get date formats
     */
    getDateFormats() {
        return APP_CONSTANTS.DATE_FORMATS;
    }

    /**
     * Get error messages
     */
    getErrorMessages() {
        return APP_CONSTANTS.ERROR_MESSAGES;
    }

    /**
     * Get success messages
     */
    getSuccessMessages() {
        return APP_CONSTANTS.SUCCESS_MESSAGES;
    }

    /**
     * Get routes configuration
     */
    getRoutes() {
        return APP_CONSTANTS.ROUTES;
    }

    /**
     * Get regex patterns
     */
    getRegexPatterns() {
        return APP_CONSTANTS.REGEX;
    }
}
