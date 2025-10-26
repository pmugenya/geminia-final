import { ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Core services
import { ApiService } from '../core/services/api.service';
import { NotificationService } from '../core/services/notification.service';
import { StorageService } from '../core/services/storage.service';
import { ConfigService } from '../core/services/config.service';
import { ValidationService } from '../core/services/validation.service';
import { UtilityService } from '../core/services/utility.service';

/**
 * Common testing utilities and helpers
 */
export class TestUtils {
    /**
     * Create a spy object for ApiService
     */
    static createMockApiService(): jasmine.SpyObj<ApiService> {
        return jasmine.createSpyObj('ApiService', [
            'get',
            'post',
            'put',
            'delete'
        ]);
    }

    /**
     * Create a spy object for NotificationService
     */
    static createMockNotificationService(): jasmine.SpyObj<NotificationService> {
        return jasmine.createSpyObj('NotificationService', [
            'success',
            'error',
            'warning',
            'info',
            'dismiss'
        ]);
    }

    /**
     * Create a spy object for StorageService
     */
    static createMockStorageService(): jasmine.SpyObj<StorageService> {
        return jasmine.createSpyObj('StorageService', [
            'setItem',
            'getItem',
            'removeItem',
            'clear',
            'hasItem',
            'setSessionItem',
            'getSessionItem',
            'removeSessionItem'
        ]);
    }

    /**
     * Create a spy object for ConfigService
     */
    static createMockConfigService(): jasmine.SpyObj<ConfigService> {
        const spy = jasmine.createSpyObj('ConfigService', [
            'get',
            'getAll',
            'set',
            'isProduction',
            'isDevelopment',
            'isStaging',
            'getApiBaseUrl',
            'getSupportedCurrencies',
            'getSupportedLanguages',
            'isLoggingEnabled',
            'isDebugEnabled',
            'getMaxFileSize',
            'getAllowedFileTypes'
        ]);

        // Set default return values
        spy.isLoggingEnabled.and.returnValue(true);
        spy.isDebugEnabled.and.returnValue(true);
        spy.isProduction.and.returnValue(false);
        spy.isDevelopment.and.returnValue(true);
        spy.getApiBaseUrl.and.returnValue('http://localhost:3000/api');

        return spy;
    }

    /**
     * Create a spy object for ValidationService
     */
    static createMockValidationService(): jasmine.SpyObj<ValidationService> {
        return jasmine.createSpyObj('ValidationService', []);
    }

    /**
     * Create a spy object for UtilityService
     */
    static createMockUtilityService(): jasmine.SpyObj<UtilityService> {
        return jasmine.createSpyObj('UtilityService', [
            'generateId',
            'deepClone',
            'debounce',
            'throttle',
            'formatCurrency',
            'formatNumber',
            'truncateText',
            'capitalizeFirst',
            'toTitleCase',
            'stripHtml',
            'isEmpty',
            'getFileExtension',
            'formatBytes',
            'generateRandomColor',
            'isToday',
            'getDaysBetween'
        ]);
    }

    /**
     * Get common testing modules for component testing
     */
    static getCommonTestingModules() {
        return [
            HttpClientTestingModule,
            RouterTestingModule,
            NoopAnimationsModule,
            MatSnackBarModule,
        ];
    }

    /**
     * Get common mock providers for testing
     */
    static getCommonMockProviders() {
        return [
            { provide: ApiService, useValue: TestUtils.createMockApiService() },
            { provide: NotificationService, useValue: TestUtils.createMockNotificationService() },
            { provide: StorageService, useValue: TestUtils.createMockStorageService() },
            { provide: ConfigService, useValue: TestUtils.createMockConfigService() },
            { provide: ValidationService, useValue: TestUtils.createMockValidationService() },
            { provide: UtilityService, useValue: TestUtils.createMockUtilityService() },
        ];
    }

    /**
     * Find element by test id
     */
    static findByTestId<T>(fixture: ComponentFixture<T>, testId: string): DebugElement | null {
        return fixture.debugElement.query(By.css(`[data-testid="${testId}"]`));
    }

    /**
     * Find all elements by test id
     */
    static findAllByTestId<T>(fixture: ComponentFixture<T>, testId: string): DebugElement[] {
        return fixture.debugElement.queryAll(By.css(`[data-testid="${testId}"]`));
    }

    /**
     * Get element text content
     */
    static getTextContent<T>(fixture: ComponentFixture<T>, selector: string): string {
        const element = fixture.debugElement.query(By.css(selector));
        return element ? element.nativeElement.textContent.trim() : '';
    }

    /**
     * Click element by selector
     */
    static clickElement<T>(fixture: ComponentFixture<T>, selector: string): void {
        const element = fixture.debugElement.query(By.css(selector));
        if (element) {
            element.nativeElement.click();
            fixture.detectChanges();
        }
    }

    /**
     * Set input value
     */
    static setInputValue<T>(fixture: ComponentFixture<T>, selector: string, value: string): void {
        const input = fixture.debugElement.query(By.css(selector));
        if (input) {
            input.nativeElement.value = value;
            input.nativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
        }
    }

    /**
     * Wait for async operations to complete
     */
    static async waitForAsync(): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, 0));
    }

    /**
     * Create mock user data for testing
     */
    static createMockUser(overrides: Partial<any> = {}) {
        return {
            id: '1',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            role: 'user',
            isActive: true,
            ...overrides
        };
    }

    /**
     * Create mock API response
     */
    static createMockApiResponse<T>(data: T, success: boolean = true) {
        return {
            success,
            data,
            message: success ? 'Success' : 'Error',
            error: success ? undefined : 'Test error'
        };
    }

    /**
     * Trigger window resize event for responsive testing
     */
    static triggerResize(width: number, height: number): void {
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: width,
        });
        Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: height,
        });
        window.dispatchEvent(new Event('resize'));
    }

    /**
     * Mock localStorage for testing
     */
    static mockLocalStorage(): Storage {
        let store: { [key: string]: string } = {};

        return {
            getItem: (key: string): string | null => {
                return store[key] || null;
            },
            setItem: (key: string, value: string): void => {
                store[key] = value.toString();
            },
            removeItem: (key: string): void => {
                delete store[key];
            },
            clear: (): void => {
                store = {};
            },
            key: (index: number): string | null => {
                const keys = Object.keys(store);
                return keys[index] || null;
            },
            get length(): number {
                return Object.keys(store).length;
            }
        };
    }
}
