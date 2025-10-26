/**
 * Form Base Component
 * Base class for all form components to eliminate duplicated logic
 * Provides common form handling, validation, and error display
 */

import { Directive, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs';

@Directive()
export abstract class FormBaseComponent implements OnInit, OnDestroy {
    protected destroy$ = new Subject<void>();
    protected form!: FormGroup;
    protected isSubmitting = false;
    protected showValidationErrors = false;

    constructor(protected fb: FormBuilder) {}

    ngOnInit(): void {
        this.initForm();
    }

    /**
     * Initialize form - must be implemented by child class
     */
    abstract initForm(): void;

    /**
     * Mark all form controls as touched to show validation errors
     * @param formGroup - Form group to mark
     */
    protected markFormGroupTouched(formGroup: FormGroup = this.form): void {
        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.get(key);
            control?.markAsTouched();
            
            if (control instanceof FormGroup) {
                this.markFormGroupTouched(control);
            }
        });
    }

    /**
     * Get error message for a form control
     * @param controlName - Name of the control
     * @returns Error message string
     */
    protected getErrorMessage(controlName: string): string {
        const control = this.form.get(controlName);
        if (!control?.errors || !control.touched) return '';

        const errors = control.errors;
        
        if (errors['required']) return 'This field is required';
        if (errors['email']) return 'Invalid email format';
        if (errors['minlength']) {
            return `Minimum ${errors['minlength'].requiredLength} characters required`;
        }
        if (errors['maxlength']) {
            return `Maximum ${errors['maxlength'].requiredLength} characters allowed`;
        }
        if (errors['min']) return `Minimum value is ${errors['min'].min}`;
        if (errors['max']) return `Maximum value is ${errors['max'].max}`;
        if (errors['pattern']) return 'Invalid format';
        if (errors['passwordMismatch']) return 'Passwords do not match';
        if (errors['strongPassword']) return 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
        if (errors['noXss']) return 'Invalid characters detected';
        if (errors['noSqlInjection']) return 'Invalid input detected';
        
        return 'Invalid value';
    }

    /**
     * Check if a form control has an error and is touched
     * @param controlName - Name of the control
     * @returns True if control has error and is touched
     */
    protected hasError(controlName: string): boolean {
        const control = this.form.get(controlName);
        return !!(control?.invalid && control?.touched);
    }

    /**
     * Check if form is valid and ready to submit
     * @returns True if form is valid
     */
    protected isFormValid(): boolean {
        if (this.form.invalid) {
            this.markFormGroupTouched();
            this.showValidationErrors = true;
            return false;
        }
        return true;
    }

    /**
     * Reset form to initial state
     */
    protected resetForm(): void {
        this.form.reset();
        this.showValidationErrors = false;
        this.isSubmitting = false;
    }

    /**
     * Get form value with type safety
     * @returns Form value
     */
    protected getFormValue<T>(): T {
        return this.form.getRawValue() as T;
    }

    /**
     * Patch form value
     * @param value - Value to patch
     */
    protected patchFormValue(value: Partial<any>): void {
        this.form.patchValue(value);
    }

    /**
     * Disable form
     */
    protected disableForm(): void {
        this.form.disable();
        this.isSubmitting = true;
    }

    /**
     * Enable form
     */
    protected enableForm(): void {
        this.form.enable();
        this.isSubmitting = false;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
