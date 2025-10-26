import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Secure Form Validators
 * Implements OWASP input validation best practices
 * 
 * OWASP Guidelines:
 * - Validate all input on the client side
 * - Use whitelist validation (allow known good)
 * - Reject known bad patterns
 * - Validate data type, length, format, and range
 */
export class SecureFormValidators {
    /**
     * Validate email format (RFC 5322 compliant)
     * 
     * @example
     * email: ['', [Validators.required, SecureFormValidators.email()]]
     */
    static email(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }

            const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            
            if (!emailRegex.test(control.value)) {
                return { email: { value: control.value } };
            }

            return null;
        };
    }

    /**
     * Validate strong password
     * Requirements:
     * - At least 8 characters
     * - At least one uppercase letter
     * - At least one lowercase letter
     * - At least one number
     * - At least one special character
     * 
     * @example
     * password: ['', [Validators.required, SecureFormValidators.strongPassword()]]
     */
    static strongPassword(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }

            const password = control.value;
            const errors: any = {};

            if (password.length < 8) {
                errors.minLength = true;
            }

            if (!/[A-Z]/.test(password)) {
                errors.uppercase = true;
            }

            if (!/[a-z]/.test(password)) {
                errors.lowercase = true;
            }

            if (!/\d/.test(password)) {
                errors.number = true;
            }

            if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
                errors.specialChar = true;
            }

            return Object.keys(errors).length > 0 ? { strongPassword: errors } : null;
        };
    }

    /**
     * Validate phone number (international format)
     * 
     * @example
     * phone: ['', [SecureFormValidators.phoneNumber()]]
     */
    static phoneNumber(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }

            // International phone format: +[country code][number]
            const phoneRegex = /^\+?[1-9]\d{1,14}$/;
            
            if (!phoneRegex.test(control.value.replace(/[\s-()]/g, ''))) {
                return { phoneNumber: { value: control.value } };
            }

            return null;
        };
    }

    /**
     * Validate URL format
     * Only allows http and https protocols
     * 
     * @example
     * website: ['', [SecureFormValidators.url()]]
     */
    static url(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }

            try {
                const url = new URL(control.value);
                if (!['http:', 'https:'].includes(url.protocol)) {
                    return { url: { value: control.value, reason: 'Only HTTP and HTTPS protocols allowed' } };
                }
                return null;
            } catch {
                return { url: { value: control.value, reason: 'Invalid URL format' } };
            }
        };
    }

    /**
     * Validate alphanumeric input only
     * Prevents special characters that could be used in attacks
     * 
     * @example
     * username: ['', [SecureFormValidators.alphanumeric()]]
     */
    static alphanumeric(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }

            const alphanumericRegex = /^[a-zA-Z0-9]+$/;
            
            if (!alphanumericRegex.test(control.value)) {
                return { alphanumeric: { value: control.value } };
            }

            return null;
        };
    }

    /**
     * Validate no SQL injection patterns
     * Blocks common SQL injection attempts
     * 
     * @example
     * searchTerm: ['', [SecureFormValidators.noSqlInjection()]]
     */
    static noSqlInjection(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }

            const sqlPatterns = [
                /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|DECLARE)\b)/gi,
                /(--|\*|;|'|")/g,
                /(\bOR\b.*=.*)/gi,
                /(\bAND\b.*=.*)/gi,
            ];

            const hasSqlPattern = sqlPatterns.some(pattern => pattern.test(control.value));

            if (hasSqlPattern) {
                return { sqlInjection: { value: control.value } };
            }

            return null;
        };
    }

    /**
     * Validate no XSS patterns
     * Blocks common XSS attack patterns
     * 
     * @example
     * comment: ['', [SecureFormValidators.noXss()]]
     */
    static noXss(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }

            const xssPatterns = [
                /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
                /javascript:/gi,
                /on\w+\s*=/gi,
                /<iframe/gi,
                /<object/gi,
                /<embed/gi,
                /eval\(/gi,
            ];

            const hasXssPattern = xssPatterns.some(pattern => pattern.test(control.value));

            if (hasXssPattern) {
                return { xss: { value: control.value } };
            }

            return null;
        };
    }

    /**
     * Validate file name
     * Prevents directory traversal and dangerous characters
     * 
     * @example
     * fileName: ['', [SecureFormValidators.safeFileName()]]
     */
    static safeFileName(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }

            const fileName = control.value;

            // Check for directory traversal
            if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
                return { unsafeFileName: { value: fileName, reason: 'Directory traversal detected' } };
            }

            // Check for dangerous characters
            const dangerousChars = /[<>:"|?*]/;
            if (dangerousChars.test(fileName)) {
                return { unsafeFileName: { value: fileName, reason: 'Contains dangerous characters' } };
            }

            return null;
        };
    }

    /**
     * Validate credit card number (Luhn algorithm)
     * 
     * @example
     * cardNumber: ['', [SecureFormValidators.creditCard()]]
     */
    static creditCard(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }

            const cardNumber = control.value.replace(/\s/g, '');

            // Check if it's all digits
            if (!/^\d+$/.test(cardNumber)) {
                return { creditCard: { value: control.value } };
            }

            // Luhn algorithm
            let sum = 0;
            let isEven = false;

            for (let i = cardNumber.length - 1; i >= 0; i--) {
                let digit = parseInt(cardNumber.charAt(i), 10);

                if (isEven) {
                    digit *= 2;
                    if (digit > 9) {
                        digit -= 9;
                    }
                }

                sum += digit;
                isEven = !isEven;
            }

            if (sum % 10 !== 0) {
                return { creditCard: { value: control.value } };
            }

            return null;
        };
    }

    /**
     * Validate date range
     * Ensures date is within acceptable range
     * 
     * @example
     * birthDate: ['', [SecureFormValidators.dateRange(minDate, maxDate)]]
     */
    static dateRange(minDate: Date, maxDate: Date): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }

            const date = new Date(control.value);

            if (date < minDate || date > maxDate) {
                return { 
                    dateRange: { 
                        value: control.value,
                        min: minDate,
                        max: maxDate
                    } 
                };
            }

            return null;
        };
    }

    /**
     * Validate numeric range
     * 
     * @example
     * age: ['', [SecureFormValidators.numericRange(18, 100)]]
     */
    static numericRange(min: number, max: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value && control.value !== 0) {
                return null;
            }

            const value = Number(control.value);

            if (isNaN(value)) {
                return { numericRange: { value: control.value, reason: 'Not a number' } };
            }

            if (value < min || value > max) {
                return { 
                    numericRange: { 
                        value: control.value,
                        min,
                        max
                    } 
                };
            }

            return null;
        };
    }

    /**
     * Validate string length
     * 
     * @example
     * description: ['', [SecureFormValidators.stringLength(10, 500)]]
     */
    static stringLength(minLength: number, maxLength: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }

            const length = control.value.length;

            if (length < minLength || length > maxLength) {
                return { 
                    stringLength: { 
                        value: control.value,
                        currentLength: length,
                        minLength,
                        maxLength
                    } 
                };
            }

            return null;
        };
    }

    /**
     * Validate whitelist of allowed values
     * 
     * @example
     * country: ['', [SecureFormValidators.whitelist(['US', 'UK', 'CA'])]]
     */
    static whitelist(allowedValues: string[]): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }

            if (!allowedValues.includes(control.value)) {
                return { 
                    whitelist: { 
                        value: control.value,
                        allowedValues
                    } 
                };
            }

            return null;
        };
    }

    /**
     * Validate no HTML tags
     * Ensures plain text input only
     * 
     * @example
     * name: ['', [SecureFormValidators.noHtml()]]
     */
    static noHtml(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }

            const htmlRegex = /<[^>]*>/g;

            if (htmlRegex.test(control.value)) {
                return { noHtml: { value: control.value } };
            }

            return null;
        };
    }

    /**
     * Custom regex validator
     * 
     * @example
     * code: ['', [SecureFormValidators.pattern(/^[A-Z]{3}\d{3}$/, 'Format: ABC123')]]
     */
    static pattern(regex: RegExp, errorMessage?: string): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }

            if (!regex.test(control.value)) {
                return { 
                    pattern: { 
                        value: control.value,
                        requiredPattern: regex.toString(),
                        message: errorMessage
                    } 
                };
            }

            return null;
        };
    }
}
