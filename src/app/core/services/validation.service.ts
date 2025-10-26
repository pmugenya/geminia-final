import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class ValidationService {

    /**
     * Email validation
     */
    static emailValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return emailRegex.test(control.value) ? null : { invalidEmail: true };
        };
    }

    /**
     * Phone number validation
     */
    static phoneValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            return phoneRegex.test(control.value) ? null : { invalidPhone: true };
        };
    }

    /**
     * Password strength validation
     */
    static passwordStrengthValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }
            
            const value = control.value;
            const hasNumber = /[0-9]/.test(value);
            const hasUpper = /[A-Z]/.test(value);
            const hasLower = /[a-z]/.test(value);
            const hasSpecial = /[#?!@$%^&*-]/.test(value);
            const isValidLength = value.length >= 8;
            
            const passwordValid = hasNumber && hasUpper && hasLower && hasSpecial && isValidLength;
            
            if (!passwordValid) {
                return {
                    passwordStrength: {
                        hasNumber,
                        hasUpper,
                        hasLower,
                        hasSpecial,
                        isValidLength
                    }
                };
            }
            
            return null;
        };
    }

    /**
     * Confirm password validation
     */
    static confirmPasswordValidator(passwordControlName: string): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.parent) {
                return null;
            }
            
            const password = control.parent.get(passwordControlName);
            const confirmPassword = control;
            
            if (!password || !confirmPassword) {
                return null;
            }
            
            return password.value === confirmPassword.value ? null : { passwordMismatch: true };
        };
    }

    /**
     * Whitespace validation
     */
    static noWhitespaceValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }
            
            const isWhitespace = (control.value || '').trim().length === 0;
            return isWhitespace ? { whitespace: true } : null;
        };
    }

    /**
     * URL validation
     */
    static urlValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }
            
            try {
                new URL(control.value);
                return null;
            } catch {
                return { invalidUrl: true };
            }
        };
    }

    /**
     * Number range validation
     */
    static rangeValidator(min: number, max: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }
            
            const numValue = parseFloat(control.value);
            if (isNaN(numValue)) {
                return { invalidNumber: true };
            }
            
            if (numValue < min || numValue > max) {
                return { range: { min, max, actual: numValue } };
            }
            
            return null;
        };
    }

    /**
     * Get validation error message
     */
    static getValidationErrorMessage(validatorName: string, validatorValue?: any): string {
        const config: { [key: string]: string } = {
            required: 'This field is required',
            invalidEmail: 'Please enter a valid email address',
            invalidPhone: 'Please enter a valid phone number',
            passwordMismatch: 'Passwords do not match',
            whitespace: 'This field cannot be empty or contain only spaces',
            invalidUrl: 'Please enter a valid URL',
            invalidNumber: 'Please enter a valid number',
            minlength: `Minimum length is ${validatorValue?.requiredLength}`,
            maxlength: `Maximum length is ${validatorValue?.requiredLength}`,
            min: `Minimum value is ${validatorValue?.min}`,
            max: `Maximum value is ${validatorValue?.max}`,
            range: `Value must be between ${validatorValue?.min} and ${validatorValue?.max}`,
        };

        if (validatorName === 'passwordStrength') {
            const requirements = [];
            if (!validatorValue.hasNumber) requirements.push('at least one number');
            if (!validatorValue.hasUpper) requirements.push('at least one uppercase letter');
            if (!validatorValue.hasLower) requirements.push('at least one lowercase letter');
            if (!validatorValue.hasSpecial) requirements.push('at least one special character');
            if (!validatorValue.isValidLength) requirements.push('at least 8 characters');
            
            return `Password must contain ${requirements.join(', ')}`;
        }

        return config[validatorName] || 'Invalid input';
    }
}
