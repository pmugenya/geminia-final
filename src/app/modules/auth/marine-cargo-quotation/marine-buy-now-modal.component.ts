import {
    Component,
    OnInit,
    OnDestroy,
    Inject,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    AfterViewInit,
    ViewChild,
    NgZone,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {
    Subject,
    ReplaySubject,
    EMPTY,
    of,
    fromEvent,
    throttleTime,
    Subscription,
    interval,
    takeWhile,
    catchError, throwError,
} from 'rxjs';
import { take, takeUntil, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { UserService } from 'app/core/user/user.service';
import { QuoteService } from '../shared/services/quote.service';
import { ThousandsSeparatorValueAccessor } from '../directives/thousands-separator-value-accessor';
import { Country, Port, QuotesData } from '../../../core/user/user.types';
import { countries } from '../../../mock-api/apps/contacts/data';
import { Router } from '@angular/router';

// Custom Validators
export class CustomValidators {
    // IDF Number: 2 digits + NBOIM + 9 digits (e.g. 24NBOIM000002014)
    static idfNumber(control: AbstractControl): ValidationErrors | null {
        if (!control.value) return null;
        const idfPattern = /^\d{2}NBOIM\d{9}$/;
        return idfPattern.test(control.value) ? null : {
            idfNumber: {
                message: 'IDF Number must be 2 digits + NBOIM + 9 digits (e.g., 24NBOIM000002014)'
            }
        };
    }

    // ID Number: 8-9 digits
    static idNumber(control: AbstractControl): ValidationErrors | null {
        if (!control.value) return null;
        const idPattern = /^\d{8,9}$/;
        return idPattern.test(control.value) ? null : {
            idNumber: {
                message: 'ID Number must be 8-9 digits (e.g., 28184318)'
            }
        };
    }

    // KRA PIN: 1 capital letter + 9 digits + 1 capital letter (e.g. A123456789B)
    static kraPin(control: AbstractControl): ValidationErrors | null {
        if (!control.value) return null;
        const kraPinPattern = /^[A-Z]\d{9}[A-Z]$/;
        return kraPinPattern.test(control.value) ? null : {
            kraPin: {
                message: 'KRA PIN must be 1 letter + 9 digits + 1 letter (e.g., A123456789B)'
            }
        };
    }

    // First Name: at least 3 letters
    static firstName(control: AbstractControl): ValidationErrors | null {
        if (!control.value) return null;
        const namePattern = /^[A-Za-z]{3,}$/;
        return namePattern.test(control.value) ? null : {
            firstName: {
                message: 'First Name must be at least 3 letters'
            }
        };
    }

    // Last Name: at least 3 letters
    static lastName(control: AbstractControl): ValidationErrors | null {
        if (!control.value) return null;
        const namePattern = /^[A-Za-z]{3,}$/;
        return namePattern.test(control.value) ? null : {
            lastName: {
                message: 'Last Name must be at least 3 letters'
            }
        };
    }

    // Email: standard email validation
    static email(control: AbstractControl): ValidationErrors | null {
        if (!control.value) return null;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(control.value) ? null : {
            email: {
                message: 'Please enter a valid email address'
            }
        };
    }

    // Phone Number: exactly 10 digits
    static phoneNumber(control: AbstractControl): ValidationErrors | null {
        if (!control.value) return null;
        const phonePattern = /^\d{10}$/;
        return phonePattern.test(control.value) ? null : {
            phoneNumber: {
                message: 'Phone Number must be exactly 10 digits'
            }
        };
    }

    // M-Pesa Number: must start with 07 or 011, exactly 10 digits
    static mpesaNumber(control: AbstractControl): ValidationErrors | null {
        if (!control.value) return null;
        const mpesaPattern = /^(07\d{8}|011\d{6})$/;
        return mpesaPattern.test(control.value) ? null : {
            mpesaNumber: {
                message: 'M-Pesa Number must start with 07 (10 digits) or 011 (9 digits)'
            }
        };
    }

    // Vessel Name: at least 3 characters (letters, numbers, and spaces)
    static vesselName(control: AbstractControl): ValidationErrors | null {
        if (!control.value) return null;
        const namePattern = /^[A-Za-z0-9\s]{3,}$/;
        return namePattern.test(control.value) ? null : {
            vesselName: {
                message: 'Vessel Name must be at least 3 characters (letters, numbers, and spaces)'
            }
        };
    }
}

export interface MarineBuyNowData {
    quoteId: string;
}

@Component({
    selector: 'app-marine-buy-now-modal',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatSnackBarModule,
        MatSelectModule,
        MatRadioModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatAutocompleteModule,
        MatTooltipModule,
        NgxMatSelectSearchModule,
        ThousandsSeparatorValueAccessor,
    ],
    providers: [DatePipe],
    templateUrl: './marine-buy-now-modal.component.html',
    styles: [`
        :host {
            --primary-color: #21275c; /* Pantone 2758 C */
            --secondary-color: #04b2e1; /* Pantone 306 C */
            --accent-color: #f36f21; /* Pantone 158 C */
            --text-primary: #333;
            --text-secondary: #666;
            --bg-light: #f8f9fa;
            --border-color: #e9ecef;
        }

        .modal-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          overflow: hidden;
          position: relative;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px 24px;
          background-color: var(--primary-color);
          color: white;
          position: relative;
          flex-shrink: 0;
          width: 100%;
        }

        .modal-title {
          color: white;
          font-size: 20px;
          font-weight: 600;
          margin: 0;
          text-align: center;
        }

        .close-button {
          position: absolute;
          top: 8px;
          right: 8px;
          color: white;
        }

        .modal-content {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        /* Ensure content starts from the top */
        .modal-content > div {
          display: flex;
          flex-direction: column;
        }

        /* Grid container should not restrict height on desktop */
        .max-w-full.mx-auto.h-full {
          height: auto !important;
          min-height: 100%;
        }

        /* Main grid should allow content to flow naturally */
        .grid.grid-cols-1.lg\\:grid-cols-12 {
          height: auto !important;
          min-height: 100%;
        }

        /* Form section should scroll independently */
        .lg\\:col-span-2.overflow-y-auto {
          max-height: calc(93vh - 100px);
          overflow-y: auto;
        }

        /* Payment section should have proper height on desktop */
        @media (min-width: 1024px) {
          /* Payment section - no scrollbar, show all content */
          .lg\\:col-span-5 .bg-white.rounded-lg.shadow-sm {
            height: auto !important;
            max-height: none !important;
            overflow-y: visible !important;
          }

          /* Ensure form section starts from top */
          .lg\\:col-span-7.overflow-y-auto {
            align-self: flex-start;
          }

          .lg\\:col-span-5 {
            align-self: flex-start;
          }

          /* Compact payment section spacing */
          .lg\\:col-span-5 .bg-white.rounded-lg.shadow-sm {
            padding: 0.5rem !important;
          }

          .lg\\:col-span-5 h2 {
            font-size: 1rem !important;
            margin-bottom: 0.5rem !important;
          }

          .lg\\:col-span-5 .mb-2 {
            margin-bottom: 0.5rem !important;
          }

          .lg\\:col-span-5 .pb-2 {
            padding-bottom: 0.5rem !important;
          }

          .lg\\:col-span-5 .space-y-1 > * + * {
            margin-top: 0.25rem !important;
          }

          /* Reduce M-Pesa logo size */
          .lg\\:col-span-5 img {
            height: 1.5rem !important;
          }

          .lg\\:col-span-5 .border-gray-200.rounded-xl {
            padding: 0.25rem 0.75rem !important;
          }

          /* Make payment section sticky so it stays visible while scrolling form */
          .lg\\:col-span-5 {
            position: sticky;
            top: 0;
          }
        }

        /* Smooth scrolling */
        .overflow-y-auto {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }

        /* Custom scrollbar for better UX */
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        /* Compact form fields with proper spacing for validation messages */
        ::ng-deep .mat-mdc-form-field {
            margin-bottom: 1rem !important;
        }

        ::ng-deep .mat-mdc-text-field-wrapper {
          padding-bottom: 0 !important;
        }

        ::ng-deep .mdc-text-field {
          padding: 4px 8px !important;
        }

        ::ng-deep .mat-mdc-form-field-infix {
          min-height: 32px !important;
          padding-top: 4px !important;
          padding-bottom: 4px !important;
        }

        ::ng-deep .mat-mdc-floating-label {
          top: 16px !important;
        }

        /* Additional compact styles */
        .recalculation-notice {
            background-color: #eef2ff;
            color: #4338ca;
            padding: 6px 10px;
            border-radius: 6px;
            margin-bottom: 0.5rem;
            font-size: 0.7rem;
            display: flex;
            align-items: center;
        }

        .recalculation-notice mat-icon {
            margin-right: 4px;
            font-size: 16px;
            width: 16px;
            height: 16px;
        }

        /* Compact section headers */
        h2 {
            font-size: 0.875rem !important;
            margin-bottom: 0.75rem !important;
            margin-top: 0 !important;
            padding-top: 0.5rem;
            border-top: 1px solid #e5e7eb;
        }

        h2:first-of-type {
            border-top: none;
            padding-top: 0;
        }

        /* Compact file upload areas */
        .border-dashed {
            padding: 8px !important;
        }

        /* Compact radio buttons */
        ::ng-deep .mat-mdc-radio-button {
            margin-right: 12px !important;
        }

        ::ng-deep .mat-mdc-form-field-hint-wrapper,
        ::ng-deep .mat-mdc-form-field-error-wrapper {
          padding: 4px 0 !important;
          margin-top: 4px !important;
        }

        /* Ensure error messages have proper spacing */
        ::ng-deep .mat-mdc-form-field-error {
          font-size: 12px !important;
          line-height: 1.3 !important;
          margin-top: 2px !important;
        }

        .disabled-section {
            position: relative;
            pointer-events: none;
            opacity: 0.5;
        }

        /* Section spacing */
        .mb-3 {
            margin-bottom: 1rem !important;
        }

        .mt-4 {
            margin-top: 1.5rem !important;
        }

        /* Mobile Responsive Styles */
        @media (max-width: 1023px) {
            .modal-content {
                overflow-y: auto !important;
            }

            .grid {
                display: flex !important;
                flex-direction: column !important;
            }

            .order-1 {
                order: 1 !important;
            }

            .order-2 {
                order: 2 !important;
                margin-top: 1rem !important;
            }

            .overflow-y-auto {
                overflow-y: visible !important;
                max-height: none !important;
            }

            /* Ensure payment section is not sticky on mobile */
            .lg\\:h-full {
                height: auto !important;
            }

            /* Adjust modal header for mobile */
            .modal-title {
                font-size: 18px !important;
            }

            /* Adjust padding for mobile */
            .modal-content {
                padding: 0.5rem !important;
            }

            .bg-white.rounded-lg.shadow-sm {
                padding: 1rem !important;
            }

            /* Make form fields stack properly on mobile */
            .grid.grid-cols-1.md\\:grid-cols-2 {
                display: grid !important;
                grid-template-columns: 1fr !important;
            }

            /* Adjust recalculation notice for mobile */
            .recalculation-notice {
                font-size: 0.65rem !important;
                padding: 8px !important;
            }

            .recalculation-notice mat-icon {
                font-size: 14px !important;
                width: 14px !important;
                height: 14px !important;
            }
        }

        /* Tablet Responsive Styles */
        @media (min-width: 768px) and (max-width: 1023px) {
            .grid.grid-cols-1.md\\:grid-cols-2 {
                grid-template-columns: repeat(2, 1fr) !important;
            }
        }

        /* Small Mobile Devices */
        @media (max-width: 640px) {
            .modal-header {
                padding: 12px 16px !important;
            }

            .modal-title {
                font-size: 16px !important;
            }

            h2 {
                font-size: 0.8rem !important;
            }

            /* Adjust file upload areas for small screens */
            .border-dashed {
                padding: 6px !important;
            }

            .border-dashed button {
                font-size: 0.75rem !important;
            }

            .border-dashed p {
                font-size: 0.65rem !important;
            }

            /* Adjust form field sizes */
            ::ng-deep .mat-mdc-form-field {
                font-size: 0.875rem !important;
            }

            /* Adjust payment section spacing */
            .space-y-2 > * + * {
                margin-top: 0.5rem !important;
            }

            /* Make buttons more touch-friendly */
            button {
                min-height: 44px !important;
            }

            /* Adjust checkbox and radio button sizes */
            ::ng-deep .mat-mdc-checkbox,
            ::ng-deep .mat-mdc-radio-button {
                font-size: 0.875rem !important;
            }

            /* Improve disabled overlay on mobile */
            .disabled-overlay {
                padding: 16px !important;
                max-width: 90% !important;
            }

            .disabled-overlay mat-icon {
                font-size: 36px !important;
                width: 36px !important;
                height: 36px !important;
            }

            .disabled-overlay p {
                font-size: 12px !important;
            }
        }

        /* Landscape mobile orientation */
        @media (max-width: 1023px) and (orientation: landscape) {
            .modal-container {
                height: auto !important;
            }

            .modal-content {
                max-height: none !important;
            }
        }

        .disabled-overlay {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(255, 255, 255, 0.95);
            padding: 24px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            text-align: center;
            z-index: 10;
            pointer-events: auto;
            max-width: 400px;
        }

        .disabled-overlay mat-icon {
            font-size: 48px;
            width: 48px;
            height: 48px;
            color: #9ca3af;
            margin-bottom: 12px;
        }

        .disabled-overlay p {
            color: #6b7280;
            font-size: 14px;
            margin: 0;
            line-height: 1.5;
        }

        /* Date Picker Styling */
        ::ng-deep .mat-datepicker-toggle {
            color: var(--secondary-color) !important;
        }

        ::ng-deep .mat-datepicker-toggle-active {
            color: var(--primary-color) !important;
        }

        ::ng-deep .mat-datepicker-toggle button {
            width: 40px !important;
            height: 40px !important;
        }

        ::ng-deep .mat-datepicker-toggle mat-icon {
            font-size: 24px !important;
            width: 24px !important;
            height: 24px !important;
        }

        /* Calendar Panel Styling */
        ::ng-deep .mat-datepicker-content {
            box-shadow: 0 10px 25px rgba(33, 39, 92, 0.15) !important;
            border-radius: 12px !important;
            overflow: hidden;
        }

        ::ng-deep .mat-calendar {
            font-family: inherit;
        }

        /* Calendar Header */
        ::ng-deep .mat-calendar-header {
            background-color: var(--primary-color) !important;
            color: white !important;
            padding: 16px !important;
        }

        ::ng-deep .mat-calendar-controls {
            margin: 0 !important;
        }

        ::ng-deep .mat-calendar-period-button {
            color: white !important;
            font-weight: 600 !important;
        }

        ::ng-deep .mat-calendar-arrow {
            fill: white !important;
        }

        ::ng-deep .mat-calendar-previous-button,
        ::ng-deep .mat-calendar-next-button {
            color: white !important;
        }

        /* Calendar Body */
        ::ng-deep .mat-calendar-body-label {
            color: var(--primary-color) !important;
            font-weight: 600 !important;
            opacity: 0.7;
        }

        ::ng-deep .mat-calendar-body-cell-content {
            border-radius: 8px !important;
            transition: all 0.2s ease !important;
        }

        /* Today's date */
        ::ng-deep .mat-calendar-body-today:not(.mat-calendar-body-selected) {
            border-color: var(--secondary-color) !important;
            background-color: rgba(4, 178, 225, 0.1) !important;
        }

        /* Selected date */
        ::ng-deep .mat-calendar-body-selected {
            background-color: var(--secondary-color) !important;
            color: white !important;
            font-weight: 600 !important;
        }

        /* Hover effect */
        ::ng-deep .mat-calendar-body-cell:not(.mat-calendar-body-disabled):hover > .mat-calendar-body-cell-content:not(.mat-calendar-body-selected) {
            background-color: rgba(4, 178, 225, 0.2) !important;
        }

        /* Active/focused date */
        ::ng-deep .mat-calendar-body-active > .mat-calendar-body-cell-content:not(.mat-calendar-body-selected) {
            background-color: rgba(33, 39, 92, 0.1) !important;
        }

        /* Disabled dates */
        ::ng-deep .mat-calendar-body-disabled {
            opacity: 0.3 !important;
        }

        /* Date input field styling */
        ::ng-deep .mat-mdc-form-field.mat-focused .mat-mdc-form-field-focus-overlay {
            opacity: 0 !important;
        }

        ::ng-deep .mat-mdc-form-field.mat-focused .mdc-notched-outline__leading,
        ::ng-deep .mat-mdc-form-field.mat-focused .mdc-notched-outline__notch,
        ::ng-deep .mat-mdc-form-field.mat-focused .mdc-notched-outline__trailing {
            border-color: var(--secondary-color) !important;
        }

        /* Prevent calendar icon overlap with placeholder */
        ::ng-deep .mat-mdc-form-field-has-icon-suffix .mat-mdc-text-field-wrapper {
            padding-right: 0 !important;
        }

        ::ng-deep .mat-mdc-form-field-has-icon-suffix .mat-mdc-form-field-infix {
            padding-right: 48px !important;
        }

        ::ng-deep .mat-datepicker-toggle {
            position: absolute !important;
            right: 0 !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
        }

        ::ng-deep .mat-mdc-form-field-icon-suffix {
            padding-left: 8px !important;
        }

        /* Ensure input text doesn't overlap with icon */
        ::ng-deep .mat-mdc-input-element {
            padding-right: 8px !important;
        }

        /* Month/Year view styling */
        ::ng-deep .mat-calendar-body-cell-content.mat-focus-indicator {
            border-radius: 8px !important;
        }

        ::ng-deep .mat-calendar-body-cell:not(.mat-calendar-body-disabled):hover > .mat-calendar-body-cell-content.mat-calendar-body-selected {
            background-color: var(--primary-color) !important;
        }

        /* Error Snackbar Styling */
        ::ng-deep .error-snackbar {
            background-color: #dc2626 !important;
            color: white !important;
        }

        ::ng-deep .error-snackbar .mat-mdc-snack-bar-label {
            color: white !important;
        }

        ::ng-deep .error-snackbar .mat-mdc-button {
            color: white !important;
        }

        /* Cargo Protection Card Styles */
        .cargo-protection-card {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 12px 16px;
            transition: all 0.2s ease;
        }

        .cargo-protection-card:hover {
            border-color: #04b2e1;
            box-shadow: 0 2px 8px rgba(4, 178, 225, 0.1);
        }

        .protection-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }

        .protection-title {
            color: #6c757d;
            font-size: 12px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .info-icon {
            color: #04b2e1;
            font-size: 16px;
            width: 16px;
            height: 16px;
            cursor: pointer;
            transition: color 0.2s ease;
        }

        .info-icon:hover {
            color: #21275c;
        }

        .protection-content {
            display: flex;
            align-items: center;
        }

        .protection-value {
            color: #212529;
            font-size: 14px;
            font-weight: 600;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        /* Pay Now Button Hover Effect */
        .pay-now-button {
            background-color: #04b2e1 !important;
            color: white !important;
            font-weight: 600 !important;
            border-radius: 8px !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 4px 12px rgba(4, 178, 225, 0.3) !important;
            position: relative !important;
            overflow: hidden !important;
        }

        .pay-now-button:hover:not([disabled]) {
            background-color: #21275c !important;
            box-shadow: 0 6px 20px rgba(33, 39, 92, 0.4) !important;
            transform: translateY(-2px) !important;
        }

        .pay-now-button:active:not([disabled]) {
            transform: translateY(0) !important;
            box-shadow: 0 2px 8px rgba(33, 39, 92, 0.3) !important;
        }

        .pay-now-button[disabled] {
            opacity: 0.6 !important;
            cursor: not-allowed !important;
        }

        /* Enhanced button animation */
        .pay-now-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
        }

        .pay-now-button:hover:not([disabled])::before {
            left: 100%;
        }

        /* Responsive Design for Cargo Protection Card */
        @media (max-width: 640px) {
            .cargo-protection-card {
                padding: 10px 12px;
                margin-bottom: 16px;
            }

            .protection-title {
                font-size: 11px;
            }

            .protection-value {
                font-size: 13px;
            }

            .info-icon {
                font-size: 14px;
                width: 14px;
                height: 14px;
            }
        }

        @media (min-width: 641px) and (max-width: 1023px) {
            .cargo-protection-card {
                padding: 11px 14px;
            }

            .protection-title {
                font-size: 11.5px;
            }

            .protection-value {
                font-size: 13.5px;
            }

            .info-icon {
                font-size: 15px;
                width: 15px;
                height: 15px;
            }
        }

        /* Custom Tooltip Styles for Format Pop-ups */
        ::ng-deep .format-tooltip {
            background-color: #21275c !important;
            color: white !important;
            font-size: 12px !important;
            padding: 12px 16px !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
            max-width: 280px !important;
            line-height: 1.4 !important;
        }

        ::ng-deep .format-tooltip .mat-mdc-tooltip-surface {
            background-color: #21275c !important;
            color: white !important;
        }

        /* Format example styling within tooltip */
        .format-example {
            color: #04b2e1;
            font-weight: 600;
            font-family: 'Courier New', monospace;
            background-color: rgba(255, 255, 255, 0.1);
            padding: 2px 6px;
            border-radius: 4px;
            margin-top: 4px;
            display: inline-block;
        }

        /* Info icon styling */
        .format-info-icon {
            color: #04b2e1;
            font-size: 16px;
            width: 16px;
            height: 16px;
            cursor: help;
            margin-left: 8px;
            vertical-align: middle;
        }

        .format-info-icon:hover {
            color: #21275c;
        }

        .search-container {
            display: flex;
            align-items: center;
            padding: 8px 12px;
            position: sticky;
            top: 0;
            background: white;
            z-index: 1;
            border-bottom: 1px solid #eee;

            mat-icon {
                margin-right: 8px;
                color: gray;
            }

            input {
                flex: 1;
                border: none;
                outline: none;
                background: transparent;
            }
        }

        /* Red border for invalid Material form fields */
        ::ng-deep .mat-form-field-invalid .mat-mdc-form-field-outline {
            color: #dc2626 !important;
        }

        ::ng-deep .mat-form-field-invalid .mat-mdc-form-field-outline-thick {
            color: #dc2626 !important;
        }

        ::ng-deep .mat-form-field-invalid .mat-mdc-select-arrow {
            color: #dc2626 !important;
        }

        ::ng-deep .mat-form-field-invalid .mat-mdc-form-field-outline-start,
        ::ng-deep .mat-form-field-invalid .mat-mdc-form-field-outline-end,
        ::ng-deep .mat-form-field-invalid .mat-mdc-form-field-outline-gap {
            border-color: #dc2626 !important;
            border-width: 2px !important;
        }

        /* Additional red border styles for better visibility */
        ::ng-deep .mat-form-field-invalid .mat-mdc-form-field-focus-overlay {
            background-color: rgba(220, 38, 38, 0.1) !important;
        }

        ::ng-deep .mat-form-field-invalid .mat-mdc-form-field-outline-notch {
            border-color: #dc2626 !important;
        }

        ::ng-deep .mat-form-field-invalid .mat-mdc-text-field-wrapper {
            border-color: #dc2626 !important;
        }

        /* Ensure focus rings are blue */
        input:focus {
            outline: none !important;
            box-shadow: 0 0 0 2px #3b82f6 !important;
            border-color: #3b82f6 !important;
        }

        /* Pay Now button styling */
        .pay-now-button {
            margin-bottom: 8px !important;
        }

        /* Reduce bottom padding of modal */
        .modal-content {
            padding-bottom: 16px !important;
        }

        /* Custom Calendar Styling */
        ::ng-deep .mat-datepicker-popup {
            border-radius: 12px !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
            border: 1px solid #e5e7eb !important;
        }

        ::ng-deep .mat-calendar {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
        }

        /* Calendar header styling */
        ::ng-deep .mat-calendar-header {
            background-color: #f8fafc !important;
            border-bottom: 1px solid #e5e7eb !important;
            padding: 16px !important;
        }

        ::ng-deep .mat-calendar-header .mat-calendar-controls {
            margin: 0 !important;
        }

        ::ng-deep .mat-calendar-period-button {
            font-weight: 600 !important;
            color: #1f2937 !important;
            font-size: 16px !important;
        }

        ::ng-deep .mat-calendar-previous-button,
        ::ng-deep .mat-calendar-next-button {
            color: #6b7280 !important;
            width: 32px !important;
            height: 32px !important;
            border-radius: 8px !important;
        }

        ::ng-deep .mat-calendar-previous-button:hover,
        ::ng-deep .mat-calendar-next-button:hover {
            background-color: #f3f4f6 !important;
            color: #374151 !important;
        }

        /* Calendar table styling */
        ::ng-deep .mat-calendar-table {
            border-spacing: 4px !important;
            padding: 16px !important;
        }

        ::ng-deep .mat-calendar-table-header th {
            color: #6b7280 !important;
            font-weight: 500 !important;
            font-size: 12px !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
            padding: 8px 0 !important;
        }

        /* Calendar cells */
        ::ng-deep .mat-calendar-body-cell {
            border-radius: 8px !important;
            margin: 2px !important;
            position: relative !important;
        }

        ::ng-deep .mat-calendar-body-cell-content {
            width: 36px !important;
            height: 36px !important;
            border-radius: 8px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-weight: 500 !important;
            font-size: 14px !important;
            color: #374151 !important;
            transition: all 0.2s ease !important;
        }

        /* Today's date styling */
        ::ng-deep .mat-calendar-body-today:not(.mat-calendar-body-selected) .mat-calendar-body-cell-content {
            background-color: #3b82f6 !important;
            color: white !important;
            font-weight: 600 !important;
        }

        /* Selected date styling */
        ::ng-deep .mat-calendar-body-selected .mat-calendar-body-cell-content {
            background-color: #1d4ed8 !important;
            color: white !important;
            font-weight: 600 !important;
        }

        /* Hover effects */
        ::ng-deep .mat-calendar-body-cell:not(.mat-calendar-body-disabled):hover .mat-calendar-body-cell-content {
            background-color: #dbeafe !important;
            color: #1d4ed8 !important;
        }

        /* Disabled dates */
        ::ng-deep .mat-calendar-body-disabled .mat-calendar-body-cell-content {
            color: #d1d5db !important;
        }

        /* Date picker input focus */
        ::ng-deep .mat-form-field.mat-focused .mat-form-field-outline-thick {
            color: #3b82f6 !important;
        }

        ::ng-deep .mat-form-field.mat-focused .mat-form-field-label {
            color: #3b82f6 !important;
        }

        /* Date picker toggle button */
        ::ng-deep .mat-datepicker-toggle {
            color: #6b7280 !important;
        }

        ::ng-deep .mat-datepicker-toggle:hover {
            color: #3b82f6 !important;
        }

        /* Month/Year view styling */
        ::ng-deep .mat-calendar-body-cell.mat-calendar-body-active .mat-calendar-body-cell-content {
            background-color: #3b82f6 !important;
            color: white !important;
        }

        /* Remove default Material Design ripple effects for cleaner look */
        ::ng-deep .mat-calendar-body-cell .mat-ripple-element {
            display: none !important;
        }

        /* Blue Scrollbar Styling */
        :host ::ng-deep .modal-content::-webkit-scrollbar {
            width: 8px;
        }

        :host ::ng-deep .modal-content::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 4px;
        }

        :host ::ng-deep .modal-content::-webkit-scrollbar-thumb {
            background: #3b82f6;
            border-radius: 4px;
        }

        :host ::ng-deep .modal-content::-webkit-scrollbar-thumb:hover {
            background: #1d4ed8;
        }

        /* Firefox scrollbar */
        :host ::ng-deep .modal-content {
            scrollbar-width: thin;
            scrollbar-color: #3b82f6 #f1f5f9;
        }

        /* Mobile Responsiveness - Aggressive Override */
        @media (max-width: 768px) {
            /* Override ALL Material Dialog styles */
            :host ::ng-deep .mat-dialog-container,
            :host ::ng-deep .mat-mdc-dialog-container {
                margin: 0 !important;
                padding: 0 !important;
                max-height: 100vh !important;
                max-width: 100vw !important;
                width: 100vw !important;
                height: 100vh !important;
                border-radius: 0 !important;
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                overflow: hidden !important;
                display: flex !important;
                flex-direction: column !important;
                transform: none !important;
                box-shadow: none !important;
            }

            /* Force overlay to full screen */
            :host ::ng-deep .cdk-overlay-backdrop {
                background: rgba(0, 0, 0, 0.5) !important;
            }

            /* Ensure modal backdrop doesn't interfere */
            :host ::ng-deep .cdk-overlay-pane {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                max-width: 100vw !important;
                max-height: 100vh !important;
            }

            /* Fix modal container structure */
            .modal-container {
                height: 100% !important;
                display: flex !important;
                flex-direction: column !important;
                overflow: hidden !important;
            }

            .modal-header {
                flex-shrink: 0 !important;
                position: sticky !important;
                top: 0 !important;
                z-index: 10 !important;
            }

            .modal-content {
                flex: 1 !important;
                overflow-y: scroll !important;
                overflow-x: hidden !important;
                padding: 8px !important;
                -webkit-overflow-scrolling: touch !important;
                overscroll-behavior: contain !important;
                min-height: 0 !important;
                height: 0 !important;
                position: relative !important;
                background: #f9fafb !important;
            }

            /* Force scrollable behavior */
            .modal-content::-webkit-scrollbar {
                width: 6px !important;
                display: block !important;
            }

            .modal-content::-webkit-scrollbar-track {
                background: #f1f5f9 !important;
            }

            .modal-content::-webkit-scrollbar-thumb {
                background: #3b82f6 !important;
                border-radius: 3px !important;
            }

            /* Ensure the main content area is scrollable */
            .modal-content .max-w-full {
                height: auto !important;
                min-height: 100% !important;
            }

            /* Fix the grid container */
            .modal-content .grid.lg\\:grid-cols-12 {
                height: auto !important;
                min-height: 100% !important;
            }

            /* Fix main form section scrolling */
            .lg\\:col-span-7 {
                overflow-y: auto !important;
                max-height: none !important;
                height: auto !important;
            }

            /* Ensure grid doesn't interfere with scrolling */
            .grid.lg\\:grid-cols-12 {
                display: block !important;
                height: auto !important;
            }

            /* Adjust grid layouts for mobile */
            .grid.grid-cols-1.md\\:grid-cols-2 {
                grid-template-columns: 1fr !important;
                gap: 12px !important;
            }

            /* Adjust form field spacing */
            .mb-3 {
                margin-bottom: 16px !important;
            }

            /* Adjust padding for sections */
            .p-4 {
                padding: 16px !important;
            }

            /* Make buttons more touch-friendly */
            button {
                min-height: 44px !important;
                font-size: 16px !important;
            }

            /* Adjust input fields for mobile */
            input, select {
                font-size: 16px !important;
                min-height: 44px !important;
            }

            /* Fix Material form fields on mobile */
            ::ng-deep .mat-form-field {
                width: 100% !important;
                min-height: 60px !important;
            }

            /* Adjust payment summary for mobile */
            .payment-breakdown {
                margin-bottom: 16px !important;
                padding: 16px !important;
            }

            /* Ensure proper touch targets */
            .mat-checkbox {
                margin-right: 12px !important;
            }

            /* Fix file upload areas for mobile */
            .border-2.border-dashed {
                padding: 20px 16px !important;
                min-height: 80px !important;
            }
        }

        @media (max-width: 480px) {
            :host ::ng-deep .mat-dialog-container {
                margin: 0 !important;
                max-height: 100vh !important;
                max-width: 100vw !important;
                width: 100vw !important;
                height: 100vh !important;
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                overflow: hidden !important;
                display: flex !important;
                flex-direction: column !important;
                border-radius: 0 !important;
            }

            :host ::ng-deep .cdk-overlay-pane {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                max-width: 100vw !important;
                max-height: 100vh !important;
            }

            .modal-container {
                height: 100% !important;
                display: flex !important;
                flex-direction: column !important;
                overflow: hidden !important;
            }

            .modal-content {
                flex: 1 !important;
                overflow-y: auto !important;
                overflow-x: hidden !important;
                padding: 12px !important;
                -webkit-overflow-scrolling: touch !important;
                overscroll-behavior: contain !important;
            }

            /* Smaller text on very small screens */
            .text-base {
                font-size: 14px !important;
            }

            .text-sm {
                font-size: 12px !important;
            }

            /* Adjust section padding */
            .p-4 {
                padding: 12px !important;
            }
        }

        /* Smooth scrolling */
        .modal-content {
            scroll-behavior: smooth;
        }

        /* Fix iOS scroll bounce */
        .modal-content {
            -webkit-overflow-scrolling: touch;
            overscroll-behavior: contain;
        }

        /* Prevent body scroll when modal is open on mobile */
        :host ::ng-deep body.mobile-modal-open {
            overflow: hidden !important;
            position: fixed !important;
            width: 100% !important;
            height: 100% !important;
        }

        /* Additional mobile scroll fixes */
        @media (max-width: 768px) {
            :host ::ng-deep .cdk-overlay-container {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                z-index: 1000 !important;
            }

            /* Ensure content can scroll properly */
            .modal-content * {
                box-sizing: border-box !important;
            }

            /* Fix any potential height issues */
            .bg-white.rounded-lg.shadow-sm {
                min-height: auto !important;
                height: auto !important;
            }

            /* Force scrollable content */
            .modal-content > * {
                flex-shrink: 0 !important;
            }

            /* Ensure form sections don't have fixed heights */
            .mb-3, .p-4, .border-2 {
                height: auto !important;
                min-height: auto !important;
            }

            /* Make sure the document upload section is scrollable */
            .border-blue-200 {
                height: auto !important;
                overflow: visible !important;
            }

            /* Restore normal scrollbar styling */
            .modal-content {
                scrollbar-width: thin !important;
                scrollbar-color: #3b82f6 #f1f5f9 !important;
            }

            .modal-content::-webkit-scrollbar {
                width: 8px !important;
                background: #f1f5f9 !important;
            }

            .modal-content::-webkit-scrollbar-thumb {
                background: #3b82f6 !important;
                border-radius: 4px !important;
            }

            .modal-content::-webkit-scrollbar-thumb:hover {
                background: #1d4ed8 !important;
            }

            .paybill-details {
                padding: 12px !important;
                margin-bottom: 16px !important;

                .detail-item {
                    font-size: 14px !important;
                    padding: 8px 0 !important;

                    .value {
                        font-size: 13px !important;
                    }

                    .account-number {
                        font-size: 12px !important;
                        padding: 2px 6px !important;
                    }
                }
            }
        }

    `]

})
export class MarineBuyNowModalComponent implements OnInit, AfterViewInit {
    @ViewChild('countrySelect') countrySelect!: MatSelect;
    @ViewChild('portSelect') portSelect!: MatSelect;
    private scrollSubscription?: Subscription;
    shipmentForm!: FormGroup;
    isSubmitting = false;
    isProcessPayment = false;
    isLoading = true;
    premiumRate = 0;
    premium = 0;
    tax = 0;
    total = 0;
    isMakePaymentNow = false;
    paymentRefNo: string ='';

    // Track duplicate file errors
    duplicateFileErrors: { [key: string]: string } = {};

    // Today's date for min date validation
    today = new Date();

    // Data sources for searchable dropdowns
    countries: Country[] = [];
    loadingPorts: Port[] = [];
    dischargePorts: any[] = [];
    categories: any[] = [];
    counties: any[] = [];
    cargoTypes: any[] = [];
    marineProducts: any[] = [];



    // Search controls for dropdowns
    countryFilterCtrl: FormControl = new FormControl();
    loadingPortSearchCtrl: FormControl = new FormControl();
    dischargePortSearchCtrl: FormControl = new FormControl();
    categorySearchCtrl: FormControl = new FormControl();
    countySearchCtrl: FormControl = new FormControl();
    cargoTypeSearchCtrl: FormControl = new FormControl();

    loading = false;
    offset = 0;
    limit = 20;
    hasMore = true;
    currentSearchTerm = '';

    portLoading = false;
    portOffset = 0;
    portHasMore = true;
    portCurrentSearchTerm = '';

    // Observable streams for filtered data
    // filteredCountries: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    filteredDischargePorts: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    filteredCategories: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    filteredCounties: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    filteredCargoTypes: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    // Helper method to get port display name - handles both objects and strings
    public getPortDisplayName(port: any): string {
        if (typeof port === 'string') {
            return port; // Manual entry
        }
        if (typeof port === 'object' && port) {
            return port.portname || port.pname || port.name || port.portName || 'Unknown Port';
        }
        return '';
    }

    // Helper method to get port ID - handles both objects and strings
    public getPortId(port: any): any {
        if (typeof port === 'string') {
            return port; // Manual entry
        }
        if (typeof port === 'object' && port) {
            return port.id || port.portId || port.portid;
        }
        return port;
    }

    // Pagination properties (server-side only)
    countryPage = 0;
    countyPage = 0;
    loadingPortPage = 0;
    dischargePortPage = 0;
    pageSize = 50;
    quoteData: Partial<QuotesData> = {};

    // Loading states
    isLoadingCountries = false;
    isLoadingCounties = false;
    isLoadingLoadingPorts = false;
    isLoadingDischargePorts = false;
    isLoadingCategories = false;
    isLoadingCargoTypes = false;

    private _onDestroy = new Subject<void>();
    isProcessingStk = false;
    paymentSuccess?: boolean;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<MarineBuyNowModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: MarineBuyNowData,
        private quoteService: QuoteService,
        private userService: UserService,
        private snackBar: MatSnackBar,
        private datePipe: DatePipe,
        private cdr: ChangeDetectorRef,
        private dialog: MatDialog,
        private router: Router,
        private ngZone: NgZone
    ) {}

    ngOnInit(): void {
        // Initialize loading state
        this.isLoading = true;

        this.shipmentForm = this.fb.group({
            // Document Uploads
            idfDocument: [null, Validators.required],
            invoice: [null, Validators.required],
            kraPinCertificate: [null, Validators.required],
            nationalId: [null, Validators.required],
            agreeToTerms: [false, Validators.requiredTrue],

            // Personal Details & KYC
            firstName: ['', [Validators.required, CustomValidators.firstName]],
            lastName: ['', [Validators.required, CustomValidators.lastName]],
            emailAddress: ['', [Validators.required, CustomValidators.email]],
            phoneNumber: ['', [Validators.required, CustomValidators.phoneNumber]],
            kraPin: ['', [Validators.required, CustomValidators.kraPin]],
            idNumber: ['', [Validators.required, CustomValidators.idNumber]],
            streetAddress: ['', Validators.required],
            postalCode: ['', Validators.required],

            // Shipment Details
            modeOfShipment: ['', Validators.required], // 1 = Sea, 2 = Air
            tradeType: ['Marine Cargo Import'], // Readonly field - always Marine Cargo Import
            product: ['Marine Cargo Import'], // Readonly field
            // cargoProtection: ['', Validators.required], // Marine Product ID (ICC A, B, or C)
            commodityType: ['1', Validators.required], // 1 = Containerized, 2 = Non-Containerized
            selectCategory: ['', Validators.required], // Category ID
            salesCategory: ['', Validators.required], // Cargo Type ID
            countryOfOrigin: ['', Validators.required],
            gcrNumber: ['', [Validators.required, CustomValidators.idfNumber]],
            loadingPort: ['', Validators.required],
            portOfDischarge: ['', Validators.required],
            vesselName: ['', CustomValidators.vesselName],
            finalDestination: ['', Validators.required],
            dateOfDispatch: ['', Validators.required],
            estimatedArrival: ['', Validators.required],
            sumInsured: ['', [Validators.required, Validators.min(1)]],
            goodsDescription: ['', Validators.required],
            mpesaNumber: ['', [ CustomValidators.mpesaNumber]],

            // Payment
            paymentMethod: ['mpesa', Validators.required]
        });

        // Add date validation
        this.setupDateValidation();

        // Initially disable Importer Details and Shipment Details sections
        this.disableFormSections();

        // Listen for terms agreement changes
        this.shipmentForm.get('agreeToTerms')?.valueChanges.subscribe((agreed) => {
            if (agreed) {
                this.enableFormSections();
            } else {
                this.disableFormSections();
            }
        });

        this.fetchQuoteDetails();
        // Enable client-side premium calculation when sum insured changes
        this.listenForSumInsuredChanges();
        this.setupSearchableDropdowns();

        // Validate data integrity after initialization
        setTimeout(() => {
            this.validateAndRefreshIfNeeded();
        }, 2000); // Allow time for API calls to complete

        // Trigger initial search to populate dropdowns
        setTimeout(() => {
            this.triggerInitialSearch();
        }, 500);

        // Set loading to false after initialization
        setTimeout(() => {
            this.isLoading = false;
        }, 300);

        this.quoteService.getQuoteById(this.data.quoteId).subscribe({
            next: (res) => {
                console.log(res);
                this.quoteData = res;
                this.shipmentForm.get('idNumber')?.setValue(res.idNumber);
                this.shipmentForm.get('streetAddress')?.setValue(res.postalAddress);
                this.shipmentForm.get('postalCode')?.setValue(res.postalCode);
                this.shipmentForm.get('firstName')?.setValue(res.firstName);
                this.shipmentForm.get('lastName')?.setValue(res.lastName);
                this.shipmentForm.get('emailAddress')?.setValue(res.email);
                this.shipmentForm.get('phoneNumber')?.setValue(res.phoneNo);
                this.shipmentForm.get('kraPin')?.setValue(res.pinNumber);
                this.shipmentForm.get('idNumber')?.setValue(res.idNumber);
                this.shipmentForm.get('selectCategory')?.setValue(res.catId);
                this.shipmentForm.get('agreeToTerms')?.setValue(true, { emitEvent: false });
                this.enableFormSections();
                this.onDropdownOpen('categories');
                this.shipmentForm.get('salesCategory')?.setValue(res.cargotypeId);
                this.shipmentForm.get('modeOfShipment')?.setValue(''+res.shippingmodeId);
                // Remove automatic terms agreement - user must manually agree
                if (!this.countries.some(c => c.id ===  Number(res.originCountry))) {

                    this.userService.getCountryById(Number(res.originCountry), String(res.shippingmodeId)).subscribe({
                        next: (country) => {
                            // Add it to the list
                            console.log(country);
                            this.countries = [country, ...this.countries];
                            this.shipmentForm.get('countryOfOrigin')?.setValue(Number(res.originCountry));
                        },
                        error: (err) => {
                            console.error('Error fetching country by ID:', err);
                            this.snackBar.open('Failed to load country details.', 'Close', { duration: 3000 });
                        }
                    });
                }
                else{
                    console.log(Number(res.originCountry));
                    this.shipmentForm.get('countryOfOrigin')?.setValue(Number(res.originCountry));
                    // this.onDropdownOpen('countries');
                }


            },
            error: (err) => {
                console.error('Error getting quote data:', err);
            }
        });
    }

    ngAfterViewInit(): void {
        // Handle mobile viewport and scrolling
        this.handleMobileViewport();
        this.forceEnableScrolling();
    }

    private forceEnableScrolling(): void {
        // Force enable scrolling after a short delay
        setTimeout(() => {
            if (window.innerWidth <= 768) {
                const modalContent = document.querySelector('.modal-content') as HTMLElement;
                if (modalContent) {
                    modalContent.style.overflowY = 'scroll';
                    (modalContent.style as any).webkitOverflowScrolling = 'touch';
                    modalContent.style.height = '0';
                    modalContent.style.flex = '1';
                    modalContent.style.minHeight = '0';

                    // Force a reflow
                    modalContent.offsetHeight;

                    console.log('Mobile scrolling forced enabled', {
                        scrollHeight: modalContent.scrollHeight,
                        clientHeight: modalContent.clientHeight,
                        overflowY: modalContent.style.overflowY
                    });
                }

                // Also check the dialog container
                const dialogContainer = document.querySelector('.mat-dialog-container, .mat-mdc-dialog-container') as HTMLElement;
                if (dialogContainer) {
                    dialogContainer.style.display = 'flex';
                    dialogContainer.style.flexDirection = 'column';
                    dialogContainer.style.height = '100vh';
                    dialogContainer.style.overflow = 'hidden';

                    console.log('Dialog container configured for mobile');
                }
            }
        }, 100);
    }

    private setLoadingState(loading: boolean): void {
        this.isLoading = loading;
    }

    private handleMobileViewport(): void {
        // Force mobile viewport handling
        if (window.innerWidth <= 768) {
            // Add mobile class to body for additional styling if needed
            document.body.classList.add('mobile-modal-open');

            // Ensure proper viewport meta tag
            const viewport = document.querySelector('meta[name=viewport]');
            if (viewport) {
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
            }

            // Prevent body scroll on mobile
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.height = '100%';
        }
    }

    closeDialog(): void {
        // Clean up mobile viewport changes
        if (window.innerWidth <= 768) {
            document.body.classList.remove('mobile-modal-open');
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.height = '';
        }

        this.dialogRef.close();
    }

    listenForSumInsuredChanges(): void {
        this.shipmentForm.get('sumInsured')?.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            takeUntil(this._onDestroy)
        ).subscribe((sumInsured) => {
            if (sumInsured && sumInsured > 0) {
                const formValue = this.shipmentForm.getRawValue();
                const modeOfShipment =  formValue.modeOfShipment;
                const  marineCargoType = formValue.salesCategory;
                if(marineCargoType && modeOfShipment) {
                    this.quoteService.computePremium(sumInsured, marineCargoType, modeOfShipment).subscribe({
                        next: (res) => {
                            this.quoteData.premium = res.premium;
                            this.quoteData.traininglevy = res.tl;
                            this.quoteData.phcf = res.phcf;
                            this.quoteData.sd = res.sd;
                            this.quoteData.netprem = res.netprem;
                        },
                        error: (err) => {
                            console.error('Error computing premium:', err);
                        }
                    });
                }
                // Calculate premium based on rate
                // this.premium = sumInsured * this.premiumRate;
                //
                // // Calculate taxes and levies
                // const phcf = this.premium * 0.0025; // 0.25%
                // const trainingLevy = this.premium * 0.002; // 0.2%
                // const stampDuty = this.premium * 0.0005; // 0.05%
                //
                // this.tax = phcf + trainingLevy + stampDuty;
                // this.total = this.premium + this.tax;
            }
        });
    }

    onFileSelected(event: Event, controlName: string): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];

        if (file) {
            // Clear any existing error for this field
            delete this.duplicateFileErrors[controlName];

            // Validate file type
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                this.duplicateFileErrors[controlName] = 'Only PDF, JPG, and PNG files are allowed';
                input.value = '';
                this.shipmentForm.get(controlName)?.setValue(null);
                return;
            }

            // Validate file size (500KB = 500 * 1024 bytes)
            const maxSize = 500 * 1024; // 500KB in bytes
            if (file.size > maxSize) {
                this.duplicateFileErrors[controlName] = 'File size must be less than 500KB';
                input.value = '';
                this.shipmentForm.get(controlName)?.setValue(null);
                return;
            }

            // Check if this file is already uploaded in another field
            const documentFields = ['idfDocument', 'invoice', 'kraPinCertificate', 'nationalId'];
            const fieldNames: { [key: string]: string } = {
                'idfDocument': 'IDF Document',
                'invoice': 'Invoice',
                'kraPinCertificate': 'KRA PIN Certificate',
                'nationalId': 'National ID'
            };

            let duplicateFieldName = '';
            const isDuplicate = documentFields.some((fieldName: string) => {
                if (fieldName === controlName) return false; // Skip current field
                const existingFile = this.shipmentForm.get(fieldName)?.value;
                if (!existingFile) return false;

                // Compare file name, size, and last modified date
                const isDupe = existingFile.name === file.name &&
                       existingFile.size === file.size &&
                       existingFile.lastModified === file.lastModified;

                if (isDupe) {
                    duplicateFieldName = fieldNames[fieldName];
                }
                return isDupe;
            });

            if (isDuplicate) {
                // Set shorter, more specific error message
                this.duplicateFileErrors[controlName] = `The file is already uploaded as "${duplicateFieldName}"`;

                // Clear the input
                input.value = '';

                // Clear the form control value
                this.shipmentForm.get(controlName)?.setValue(null);
                return;
            }

            // Set the file if no duplicate found
            this.shipmentForm.get(controlName)?.setValue(file);
        }
    }

    onSubmit(): void {
        // if (this.shipmentForm.invalid) {
        //     // Mark all fields as touched to show validation errors
        //     this.shipmentForm.markAllAsTouched();
        //
        //     const invalidFields = Object.keys(this.shipmentForm.controls)
        //         .filter(key => this.shipmentForm.get(key)?.invalid)
        //         .map(key => ({
        //             field: key,
        //             errors: this.shipmentForm.get(key)?.errors
        //         }));
        //
        //     console.warn('❌ Invalid form fields:', invalidFields);
        //
        //
        //     this.snackBar.open('Please fill in all required fields correctly', 'Close', {
        //         duration: 5000,
        //         panelClass: ['error-snackbar']
        //     });
        //     return;
        // }

        this.isSubmitting = true;
        const kycFormValue = this.shipmentForm.getRawValue(); // Use getRawValue to include disabled fields


        // First, create the shipping application
        const formData = new FormData();
        const kycDocs = this.shipmentForm.value;
        formData.append('kraPinUpload', kycDocs.kraPinCertificate);
        formData.append('nationalIdUpload', kycDocs.nationalId);
        formData.append('invoiceUpload', kycDocs.invoice);
        formData.append('idfUpload', kycDocs.idfDocument);

        const updatedMetadata = {
            quoteId: this.data.quoteId,
            suminsured: kycFormValue.sumInsured,
            kraPin: kycFormValue.kraPin,
            firstName: kycFormValue.firstName,
            lastName: kycFormValue.lastName,
            phoneNumber: kycFormValue.phoneNumber,
            emailAddress: kycFormValue.emailAddress,
            idNumber: kycFormValue.idNumber,
            postalAddress: kycFormValue.streetAddress,
            postalCode: kycFormValue.postalCode,
            ucrnumber: kycFormValue.ucrNumber,
            idfnumber: kycFormValue.gcrNumber,
            selectCategory: kycFormValue.selectCategory,
            salesCategory: kycFormValue.salesCategory,
            modeOfShipment: kycFormValue.modeOfShipment,
            tradeType: kycFormValue.tradeType,
            vesselname: kycFormValue.vesselName,
            loadingPort: kycFormValue.loadingPort,
            portOfDischarge: kycFormValue.portOfDischarge,
            finalDestinationCounty: kycFormValue.finalDestination,
            dateOfDispatch: this.datePipe.transform(kycFormValue.dateOfDispatch, 'dd MMM yyyy'),
            estimatedArrivalDate: this.datePipe.transform(kycFormValue.estimatedArrival, 'dd MMM yyyy'),
            description: kycFormValue.goodsDescription,
            // shippingItems: kycFormValue.shippingItems,
            dateFormat: 'dd MMM yyyy',
            locale: 'en_US',
        };
        formData.append('metadata', JSON.stringify(updatedMetadata));
        console.log('Creating shipping application...');

        // Create the shipping application first
        this.quoteService.createApplication(formData).pipe(
            takeUntil(this._onDestroy)
        ).subscribe({
            next: (applicationResponse) => {
                console.log('Shipping application created successfully:', applicationResponse);

                // Generate reference number for M-Pesa payment
                const refNo = applicationResponse?.transactionId;
                this.isMakePaymentNow = true;
                this.paymentRefNo = refNo;
               // this.router.navigate(['/dashboard']);

                // Now initiate M-Pesa payment
                // this.quoteService.stkPush(kycFormValue.mpesaNumber, this.total, refNo).pipe(
                //     takeUntil(this._onDestroy)
                // ).subscribe({
                //     next: (res) => {
                //         console.log('STK Push response', res);
                //
                //         const checkOutRequestId = res.checkOutRequestId;
                //         const merchantRequestId = res.merchantRequestId;
                //
                //         interval(5000).pipe(
                //             switchMap(() =>
                //                 this.quoteService.validatePayment(merchantRequestId, checkOutRequestId)
                //             ),
                //             // stop polling once success or failure is reached
                //             takeWhile(
                //                 (statusRes) =>
                //                     statusRes.resultCode === 0 && !statusRes.mpesaCode, // keep polling while still pending
                //                 true // emit the last value that breaks the condition
                //             ),
                //             catchError((err) => {
                //                 this.isProcessingStk = false;
                //                 return throwError(() => err);
                //             })
                //         ).subscribe({
                //             next: (statusRes) => {
                //
                //                 if (statusRes.resultCode === 0 && statusRes.mpesaCode) {
                //                     // success
                //                     this.isProcessingStk = false;
                //                     this.paymentSuccess = true;
                //                     setTimeout(() => {
                //                         this.dialogRef.close({
                //                             success: true,
                //                             method: 'stk',
                //                             reference:refNo,
                //                             mpesaReceipt: statusRes.mpesaCode
                //                         });
                //                         this.router.navigate(['/dashboard']);
                //                     }, 1000);
                //
                //
                //                 } else if (statusRes.resultCode !== 0) {
                //                     // user cancelled or failed
                //                     this.isProcessingStk = false;
                //                     this.paymentSuccess = false;
                //
                //                 }
                //                 // If still pending (resultCode===0 but no mpesaCode), the loop continues until it changes
                //             },
                //             error: (err) => {
                //                 console.error('Polling error or timeout', err);
                //                 this.isProcessingStk = false;
                //             }
                //         });
                //     },
                //     error: (paymentError) => {
                //         console.error('=== M-PESA STK PUSH ERROR ===');
                //         console.error('Error Status:', paymentError.status);
                //         console.error('Error Message:', paymentError.message);
                //         console.error('Error Details:', paymentError.error);
                //         console.error('Full Error Object:', paymentError);
                //         console.error('=== END M-PESA ERROR ===');
                //
                //         this.isSubmitting = false;
                //
                //         const errorMessage = paymentError?.error?.message ||
                //                            paymentError?.message ||
                //                            'Payment initiation failed. Please check your M-Pesa number and try again.';
                //
                //         this.snackBar.open(errorMessage, 'Close', {
                //             duration: 8000,
                //             panelClass: ['error-snackbar']
                //         });
                //     }
                // });
            },
            error: (applicationError) => {
                console.error('=== SHIPPING APPLICATION ERROR ===');
                console.error('Error Status:', applicationError.status);
                console.error('Error Message:', applicationError.message);
                console.error('Error Details:', applicationError.error);
                console.error('Full Error Object:', applicationError);
                console.error('=== END APPLICATION ERROR ===');

                this.isSubmitting = false;

                const errorMessage = applicationError?.error?.errors[0]?.developerMessage ||
                                   'Failed to create shipping application. Please try again.';

                this.snackBar.open(errorMessage, 'Close', {
                    duration: 8000,
                    panelClass: ['error-snackbar']
                });
            }
        });
    }

    fetchQuoteDetails(): void {
        // For DRAFT quotes, fetch quote details to get premium and pre-populate form
        if (this.data.quoteId) {
            this.userService.getSingleQuote(this.data.quoteId).subscribe({
                next: (quoteData) => {
                    // Pre-populate form with quote data if available
                    if (quoteData) {
                        const sumInsured = quoteData.sumassured || quoteData.sumInsured || 0;
                        const basePremium = quoteData.premium || 0;

                        // Calculate and store the premium rate for future calculations
                        if (sumInsured > 0 && basePremium > 0) {
                            this.premiumRate = basePremium / sumInsured;
                        }

                        this.shipmentForm.patchValue({
                            sumInsured: sumInsured,
                            modeOfShipment: quoteData.shippingmodeId?.toString() || '1',
                            countryOfOrigin: quoteData.originCountry,
                            // Add other fields as needed
                        }, { emitEvent: false }); // Don't trigger valueChanges yet

                        // Set premium values from quote
                        this.premium = basePremium;
                        this.tax = (quoteData.phcf || 0) + (quoteData.tl || 0) + (quoteData.sd || 0);
                        this.total = quoteData.netprem || quoteData.total || 0;
                    }
                    this.isLoading = false;
                },
                error: (err) => {
                    console.error('Error fetching quote details:', err);
                    // Don't block the form if quote fetch fails
                    this.isLoading = false;
                }
            });
        } else {
            this.isLoading = false;
        }
    }


    initiatePayment(): void {
        const kycFormValue = this.shipmentForm.getRawValue();

        if(!kycFormValue.mpesaNumber) {
            return;
        }
        this.isProcessPayment = true;

        this.quoteService.stkPush(kycFormValue.mpesaNumber, 1, this.paymentRefNo)
            .subscribe({
                next: (res) => {
                    console.log('STK Push response', res);

                    const checkOutRequestId = res.checkOutRequestId;
                    const merchantRequestId = res.merchantRequestId;

                    interval(5000).pipe(
                        switchMap(() =>
                            this.quoteService.validatePayment(merchantRequestId, checkOutRequestId)
                        ),
                        // stop polling once success or failure is reached
                        takeWhile(
                            (statusRes) =>
                                statusRes.resultCode === 0 && !statusRes.mpesaCode, // keep polling while still pending
                            true // emit the last value that breaks the condition
                        ),
                        catchError((err) => {
                            this.isProcessingStk = false;
                            return throwError(() => err);
                        })
                    ).subscribe({
                        next: (statusRes) => {
                            this.isSubmitting = false;
                            if (statusRes.resultCode === 0 && statusRes.mpesaCode) {
                                // success
                                this.isProcessingStk = false;
                                this.paymentSuccess = true;
                                this.isProcessPayment = false;
                                setTimeout(() => {
                                    this.dialogRef.close({
                                        success: true,
                                        method: 'stk',
                                        reference: this.paymentRefNo,
                                        mpesaReceipt: statusRes.mpesaCode
                                    });
                                    this.router.navigate(['/dashboard']);
                                }, 1000);


                            } else if (statusRes.resultCode !== 0) {
                                // user cancelled or failed
                                this.isProcessingStk = false;
                                this.paymentSuccess = false;

                            }
                            // If still pending (resultCode===0 but no mpesaCode), the loop continues until it changes
                        },
                        error: (err) => {
                            console.error('Polling error or timeout', err);
                            this.isProcessingStk = false;
                            this.isProcessPayment = false;
                        }
                    });
                },
                error: (err) => {
                    if (err.name === 'TimeoutError') {
                        console.error('STK request timed out');
                    } else {
                        console.error('Error', err);
                    }
                    this.isProcessingStk = false;
                    this.isProcessPayment = false;
                }
            });
    }


    listenForPremiumChanges(): void {
        this.shipmentForm.get('sumInsured')?.valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            switchMap((sumInsured) => {
                // Only recalculate if sumInsured has a valid value
                if (!sumInsured || sumInsured <= 0) {
                    // Return empty observable to skip recalculation
                    return EMPTY;
                }
                this.isSubmitting = true;
                // Use userService for premium recalculation
                return this.userService.recalculateMarinePremium(this.data.quoteId, sumInsured);
            })
        ).subscribe({
            next: (premiumDetails) => {
                // Only update if we received valid data
                if (premiumDetails) {
                    this.premium = premiumDetails.premium;
                    this.tax = premiumDetails.tax;
                    this.total = premiumDetails.total;
                }
                this.isSubmitting = false;
            },
            error: (err) => {
                console.error('Failed to recalculate premium', err);
                this.snackBar.open('Could not recalculate premium. Please check the value.', 'Close', { duration: 5000 });
                this.isSubmitting = false;
            }
        });
    }

    getCargoProtectionName(): string {
        const selectedId = this.shipmentForm.get('cargoProtection')?.value;
        if (selectedId && this.marineProducts.length > 0) {
            const product = this.marineProducts.find(p => p.id === selectedId);
            return product?.prodname || 'ICC (A) All Risk';
        }
        return 'ICC (A) All Risk';
    }


    // Input formatting methods for better UX
    onIdNumberInput(event: any): void {
        let value = event.target.value.trim().replace(/\D/g, ''); // Remove non-digits, trim spaces
        if (value.length > 9) {
            value = value.substring(0, 9); // Limit to 9 digits (8-9 digits allowed)
        }
        this.shipmentForm.get('idNumber')?.setValue(value);
    }

    onKraPinInput(event: any): void {
        let value = event.target.value.trim().toUpperCase().replace(/[^A-Z0-9]/g, ''); // Trim spaces, keep only letters and numbers, convert to uppercase

        // Format: 1 letter + 9 digits + 1 letter (e.g. A123456789B)
        if (value.length > 11) {
            value = value.substring(0, 11); // Limit to 11 characters
        }

        this.shipmentForm.get('kraPin')?.setValue(value);
    }

    onIdfNumberInput(event: any): void {
        let value = event.target.value.trim().toUpperCase().replace(/[^A-Z0-9]/g, ''); // Trim spaces, keep only letters and numbers, convert to uppercase

        // Format: 2 digits + NBOIM + 9 digits (e.g. 24NBOIM000002014)
        if (value.length > 16) {
            value = value.substring(0, 16); // Limit to 16 characters
        }

        this.shipmentForm.get('gcrNumber')?.setValue(value);
    }

    // Helper method to get validation error message
    getFieldErrorMessage(fieldName: string): string {
        const field = this.shipmentForm.get(fieldName);
        if (field?.errors) {
            if (field.errors['required']) {
                return `${fieldName} is required`;
            }
            if (field.errors['idNumber']) {
                return field.errors['idNumber'].message;
            }
            if (field.errors['kraPin']) {
                return field.errors['kraPin'].message;
            }
            if (field.errors['idfNumber']) {
                return field.errors['idfNumber'].message;
            }
        }
        return '';
    }

    ngOnDestroy() {
        this.scrollSubscription?.unsubscribe();
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    private setupSearchableDropdowns(): void {
        // Initialize all data sources from backend
        this.initializeAllData();

        // Setup client-side filtering for counties (no API needed)
        this.fetchCounties();

        // Listen for mode of shipment changes to load countries
        this.shipmentForm.get('modeOfShipment')?.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe((mode) => {
                if (mode) {
                    this.countryFilterCtrl.setValue('');
                    this.loadCountries(true);
                }
            });

        // Listen for search changes with debounce
        this.categorySearchCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy), debounceTime(300))
            .subscribe(() => {
                this.fetchCategories(this.categorySearchCtrl.value);
            });

        this.countryFilterCtrl.valueChanges
            .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this._onDestroy))
            .subscribe(term => {
                this.offset = 0;
                this.countries = [];
                this.currentSearchTerm = term || '';
                this.hasMore = true;
                this.loadCountries(true);
            });

        this.loadingPortSearchCtrl.valueChanges
            .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this._onDestroy))
            .subscribe((searchTerm) => {
                this.portOffset = 0;
                this.loadingPorts = [];
                this.portCurrentSearchTerm = searchTerm || '';
                this.portHasMore = true;
                this.fetchLoadingPorts(true);
            });

        this.dischargePortSearchCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy), debounceTime(300))
            .subscribe((searchTerm) => {
                console.log('Discharge port search term:', searchTerm);
                this.dischargePortPage = 0;
                this.fetchPorts( searchTerm || '');
            });

        this.countySearchCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy), debounceTime(300))
            .subscribe(() => {
                this.fetchCounties();
            });

        this.cargoTypeSearchCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy), debounceTime(300))
            .subscribe(() => {
                this.filterCargoTypes(this.cargoTypeSearchCtrl.value);
            });

        // Listen for category selection changes to fetch cargo types
        this.shipmentForm.get('selectCategory')?.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe((categoryId) => {
                if (categoryId) {
                    this.fetchCargoTypes(categoryId);
                    // Clear cargo type selection when category changes
                    this.shipmentForm.get('salesCategory')?.setValue('');
                }
            });

        // Listen for country selection changes to fetch ports
        this.shipmentForm.get('countryOfOrigin')?.valueChanges
            .pipe(
                takeUntil(this._onDestroy),
                distinctUntilChanged()
            )
            .subscribe((countryId) => {
                if (countryId) {
                    this.portOffset = 0;
                    this.fetchLoadingPorts(true);
                    this.dischargePortPage = 0;
                    this.fetchPorts('discharge');
                } else {
                    // Clear ports when no country is selected
                    this.loadingPorts = [];
                    this.dischargePorts = [];
                    this.filteredDischargePorts.next([]);
                }
            });
    }

    onSelectOpen(opened: boolean) {
        if (opened) {
            this.portOffset = 0;
            setTimeout(() => {
                // ✅ get the rendered panel
                const panel = this.countrySelect.panel?.nativeElement as HTMLElement;
                if (!panel) {
                    console.warn('No panel found');
                    return;
                }

                // ✅ The scrollable element in Angular Material 19 (MDC)
                const scrollContainer =
                    panel.querySelector('.mat-mdc-select-panel .mdc-list') ||
                    panel.querySelector('.mdc-list') ||
                    panel;

                console.log('Scroll container found:', scrollContainer);

                // Remove previous listener if any
                this.scrollSubscription?.unsubscribe();

                // Attach scroll listener
                this.scrollSubscription = fromEvent(scrollContainer!, 'scroll')
                    .pipe(throttleTime(150))
                    .subscribe((event: any) => {
                        const el = event.target as HTMLElement;
                        const scrollTop = el.scrollTop;
                        const scrollHeight = el.scrollHeight;
                        const clientHeight = el.clientHeight;
                        const scrollRatio = (scrollTop + clientHeight) / scrollHeight;

                        console.log(`scrollTop: ${scrollTop}, scrollHeight: ${scrollHeight}, clientHeight: ${clientHeight}, ratio: ${scrollRatio}`);

                        // ✅ Adjust threshold here (0.75 triggers earlier)
                        if (scrollRatio > 0.75 && !this.loading) {
                            console.log('✅ Reached bottom — loading next page');
                            this.loadCountries(false);
                        }
                    });
            }, 200); // wait for panel to render

        } else {
            // Cleanup
            this.scrollSubscription?.unsubscribe();
        }
    }

    onSelectOpenPorts(opened: boolean) {
        if (opened) {
            setTimeout(() => {
                // ✅ get the rendered panel
                const panel = this.portSelect.panel?.nativeElement as HTMLElement;
                if (!panel) {
                    console.warn('No panel found');
                    return;
                }

                // ✅ The scrollable element in Angular Material 19 (MDC)
                const scrollContainer =
                    panel.querySelector('.mat-mdc-select-panel .mdc-list') ||
                    panel.querySelector('.mdc-list') ||
                    panel;

                console.log('Scroll container found:', scrollContainer);

                // Remove previous listener if any
                this.scrollSubscription?.unsubscribe();

                // Attach scroll listener
                this.scrollSubscription = fromEvent(scrollContainer!, 'scroll')
                    .pipe(throttleTime(150))
                    .subscribe((event: any) => {
                        const el = event.target as HTMLElement;
                        const scrollTop = el.scrollTop;
                        const scrollHeight = el.scrollHeight;
                        const clientHeight = el.clientHeight;
                        const scrollRatio = (scrollTop + clientHeight) / scrollHeight;

                        console.log(`scrollTop: ${scrollTop}, scrollHeight: ${scrollHeight}, clientHeight: ${clientHeight}, ratio: ${scrollRatio}`);

                        // ✅ Adjust threshold here (0.75 triggers earlier)
                        if (scrollRatio > 0.75 && !this.portLoading) {
                            console.log('✅ Reached bottom — loading next page');
                            this.fetchLoadingPorts(false);
                        }
                    });
            }, 200); // wait for panel to render

        } else {
            // Cleanup
            this.scrollSubscription?.unsubscribe();
        }
    }



    onScroll(event: Event) {
        const panel = event.target as HTMLElement;
        const threshold = 200;
        const reachedBottom = panel.scrollHeight - panel.scrollTop <= panel.clientHeight + threshold;
        console.log('reached bottom...',reachedBottom);
        if (reachedBottom && this.hasMore && !this.loading) {
            this.loadCountries();
        }
    }

    onScrollPorts(event: Event) {
        const panel = event.target as HTMLElement;
        const threshold = 200;
        const reachedBottom = panel.scrollHeight - panel.scrollTop <= panel.clientHeight + threshold;
        console.log('reached bottom...',reachedBottom);
        if (reachedBottom && this.portHasMore && !this.portLoading) {
            this.fetchLoadingPorts();
        }
    }



    private fetchMarineProducts(): void {
        this.userService.getMarineProducts().subscribe({
            next: (response: any) => {
                this.marineProducts = Array.isArray(response) ? response : (response?.data || []);
                console.log('Marine products loaded:', this.marineProducts.length);

                // Find ICC(A) All Risk and set as default
                const iccA = this.marineProducts.find(p =>
                    p.prodname?.toLowerCase().includes('icc') &&
                    p.prodname?.toLowerCase().includes('a')
                );

                if (iccA) {
                    this.shipmentForm.patchValue({
                        cargoProtection: iccA.id
                    }, { emitEvent: false });
                    console.log('Default cargo protection set:', iccA.prodname);
                } else {
                    console.warn('ICC(A) All Risk product not found in marine products');
                }
            },
            error: (err) => {
                console.error('Error fetching marine products:', err);
                this.marineProducts = [];
                // Show user-friendly error message
                this.showErrorMessage('Failed to load cargo protection options. Please refresh the page.');
            }
        });
    }

    private fetchCategories(searchTerm: string = ''): void {
        // Only fetch once, then filter client-side
        if (this.categories.length === 0 && !this.isLoadingCategories) {
            this.isLoadingCategories = true;
            this.userService.getMarineCategories().subscribe({
                next: (response: any) => {
                    this.categories = Array.isArray(response) ? response : (response?.data || []);
                    console.log('Categories loaded:', this.categories.length);
                    this.filterCategories(searchTerm);
                    this.isLoadingCategories = false;
                },
                error: (err) => {
                    console.error('Error fetching categories:', err);
                    this.categories = [];
                    this.filteredCategories.next([]);
                    this.isLoadingCategories = false;
                    this.showErrorMessage('Failed to load cargo categories. Please refresh the page.');
                }
            });
        } else {
            // Client-side filtering
            this.filterCategories(searchTerm);
        }
    }

    private filterCategories(searchTerm: string = ''): void {
        if (!this.categories) {
            return;
        }
        if (!searchTerm) {
            this.filteredCategories.next(this.categories.slice());
            return;
        }
        const search = searchTerm.toLowerCase();
        const filtered = this.categories.filter(category =>
            category.catname?.toLowerCase().includes(search)
        );
        this.filteredCategories.next(filtered);
    }


    private loadCountries(reset = false) {
        const modeValue = this.shipmentForm.get('modeOfShipment')?.value;
        const modeId = modeValue === '1' ? 1 : modeValue === '2' ? 2 : 1;
        if(!modeId){
            return;
        }
        this.loading = true;
        this.userService
            .getCountries(this.offset, this.limit, modeId, this.currentSearchTerm)
            .pipe(takeUntil(this._onDestroy))
            .subscribe({
                next: (res) => {
                    const newItems = res?.pageItems  || [];
                    this.countries = reset ? newItems : [...this.countries, ...newItems];
                    if (newItems.length < this.limit) this.hasMore = false;
                    this.offset += this.limit;
                    this.loading = false;
                },
                error: (err) => {
                    this.loading = false;
                },
            });
    }



    private fetchLoadingPorts(reset = false): void {
        const modeValue = this.shipmentForm.get('modeOfShipment')?.value;
        const modeId = modeValue === '1' ? 1 : modeValue === '2' ? 2 : 1;
        const countryLoadingVal = this.shipmentForm.get('countryOfOrigin')?.value;
        this.portLoading = true;
        this.userService.getPorts(countryLoadingVal,''+modeId,this.portOffset, this.limit, this.portCurrentSearchTerm)
            .pipe(takeUntil(this._onDestroy))
            .subscribe({
                next: (res) => {
                    const newItems = res?.pageItems  || [];
                    this.loadingPorts = reset ? newItems : [...this.loadingPorts, ...newItems];
                    if (newItems.length < this.limit) this.portHasMore = false;
                    this.portOffset += this.limit;
                    this.portLoading = false;
                },
                error: (err) => {
                    this.portLoading = false;
                },
            });
    }



    private fetchCounties(): void {
        // Get the mode of shipment: 'Sea' = 1, 'Air' = 2

        this.isLoadingCounties = true;
        this.userService.getCounties(this.countyPage, this.pageSize).subscribe({
            next: (response) => {
                const newCounties = response?.pageItems || response?.data || [];

                // Append to existing if pagination, otherwise replace
                if (this.countyPage === 0) {
                    this.counties = newCounties;
                } else {
                    this.counties = [...this.counties, ...newCounties];
                }

                console.log('Total counties in array:', this.countries.length);
                this.filteredCounties.next(this.counties.slice());
                this.isLoadingCounties = false;
            },
            error: (err) => {
                console.error('Error fetching countries:', err);
                this.counties = [];
                this.filteredCounties.next([]);
                this.isLoadingCounties = false;
                this.showErrorMessage('Failed to load countries. Please check your connection and try again.');
            }
        });
    }



    private fetchCargoTypes(categoryId: number): void {
        if (!categoryId) {
            this.cargoTypes = [];
            this.filteredCargoTypes.next([]);
            return;
        }

        this.isLoadingCargoTypes = true;
        this.userService.getCargoTypesByCategory(categoryId).subscribe({
            next: (response: any) => {
                this.cargoTypes = Array.isArray(response) ? response : (response?.data || []);
                console.log('Cargo types loaded for category', categoryId, ':', this.cargoTypes.length);
                this.filteredCargoTypes.next(this.cargoTypes.slice());
                this.isLoadingCargoTypes = false;
            },
            error: (err) => {
                console.error('Error fetching cargo types for category', categoryId, ':', err);
                this.cargoTypes = [];
                this.filteredCargoTypes.next([]);
                this.isLoadingCargoTypes = false;
                this.showErrorMessage('Failed to load cargo types for the selected category.');
            }
        });
    }

    private filterCargoTypes(searchTerm: string = ''): void {
        if (!this.cargoTypes) {
            return;
        }
        if (!searchTerm) {
            this.filteredCargoTypes.next(this.cargoTypes.slice());
            return;
        }
        const search = searchTerm.toLowerCase();
        const filtered = this.cargoTypes.filter(cargoType =>
            cargoType.ctname?.toLowerCase().includes(search)
        );
        this.filteredCargoTypes.next(filtered);
    }

    private initializeAllData(): void {
        // Initialize all required data from backend APIs
        this.fetchMarineProducts();
        this.fetchCategories();
        this.loadCountries(true);

        this.loadingPorts = [];
        this.filteredDischargePorts.next([]);

    }

    private triggerInitialSearch(): void {

        // Trigger category search with empty term to load initial data
        if (this.categories.length === 0) {
            this.categorySearchCtrl.setValue('');
        }

        // Counties are already loaded (client-side data)
        console.log('Initial search triggered for all API-based dropdowns');
    }

    public onDropdownOpen(dropdownType:'countries' |  'categories' | 'loadingPorts' | 'dischargePorts'): void {
        switch (dropdownType) {
            case 'categories':
                if (this.categories.length === 0 && !this.isLoadingCategories) {
                    this.fetchCategories('');
                }
                break;
            case 'countries':
                if (this.countries.length === 0 && !this.isLoadingCountries) {
                    this.loadCountries(true);
                }
                break;
            case 'dischargePorts':
                const countryIdDischarge = this.shipmentForm.get('countryOfOrigin')?.value;
                if (countryIdDischarge && this.dischargePorts.length === 0 && !this.isLoadingDischargePorts) {
                    this.fetchPorts( '');
                }
                break;
        }
    }

    private showErrorMessage(message: string): void {
        this.snackBar.open(message, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
        });
    }

    private showSuccessMessage(message: string): void {
        this.snackBar.open(message, 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
        });
    }

    public refreshAllData(): void {
        // Reset all data arrays
        this.countries = [];
        this.categories = [];
        this.cargoTypes = [];
        this.marineProducts = [];
        this.loadingPorts = [];
        this.dischargePorts = [];

        // Reset loading states
        this.isLoadingCountries = false;
        this.isLoadingCategories = false;
        this.isLoadingCargoTypes = false;
        this.isLoadingLoadingPorts = false;
        this.isLoadingDischargePorts = false;

        // Reset pagination
        this.countryPage = 0;
        this.loadingPortPage = 0;
        this.dischargePortPage = 0;

        // Reinitialize all data
        this.initializeAllData();

        this.showSuccessMessage('Data refreshed successfully');
    }

    private validateDataIntegrity(): boolean {
        const validationResults = {
            marineProducts: this.marineProducts.length > 0,
            categories: this.categories.length > 0,
            countries: this.countries.length > 0
        };



        if (!validationResults.marineProducts) {
            console.warn('Marine products validation failed: No products loaded');
        }

        if (!validationResults.categories) {
            console.warn('Categories validation failed: No categories loaded');
        }

        if (!validationResults.countries) {
            console.warn('Countries validation failed: No countries loaded');
        }

        return Object.values(validationResults).every(result => result);
    }

    public validateAndRefreshIfNeeded(): void {
        if (!this.validateDataIntegrity()) {
            console.log('Data integrity check failed, attempting retry...');
            this.retryFailedApiCalls();
        } else {
            console.log('Data integrity check passed');
        }
    }

    private retryFailedApiCalls(): void {
        // Retry failed API calls with exponential backoff
        const retryAttempts = 3;
        const baseDelay = 1000; // 1 second

        const retryWithBackoff = (apiCall: () => void, attempt: number = 1) => {
            if (attempt > retryAttempts) {
                console.error('Max retry attempts reached for API call');
                return;
            }

            const delay = baseDelay * Math.pow(2, attempt - 1);
            setTimeout(() => {
                try {
                    apiCall();
                } catch (error) {
                    console.warn(`API call failed on attempt ${attempt}, retrying...`);
                    retryWithBackoff(apiCall, attempt + 1);
                }
            }, delay);
        };

        // Retry critical data if not loaded
        if (this.marineProducts.length === 0) {
            retryWithBackoff(() => this.fetchMarineProducts());
        }

        if (this.categories.length === 0) {
            retryWithBackoff(() => this.fetchCategories());
        }

    }

    get termsAgreed(): boolean {
        return this.shipmentForm.get('agreeToTerms')?.value || false;
    }

    private setupDateValidation(): void {
        // Watch for changes in Date of Dispatch
        this.shipmentForm.get('dateOfDispatch')?.valueChanges.subscribe(dispatchDate => {
            if (dispatchDate) {
                const arrivalControl = this.shipmentForm.get('estimatedArrival');
                const arrivalDate = arrivalControl?.value;

                // If arrival date exists and is before dispatch date, clear it
                if (arrivalDate && new Date(arrivalDate) < new Date(dispatchDate)) {
                    arrivalControl?.setValue('');
                    arrivalControl?.setErrors({ beforeDispatch: true });
                }
            }
        });

        // Watch for changes in Date of Arrival
        this.shipmentForm.get('estimatedArrival')?.valueChanges.subscribe(arrivalDate => {
            if (arrivalDate) {
                const dispatchDate = this.shipmentForm.get('dateOfDispatch')?.value;

                // Validate that arrival date is not before dispatch date
                if (dispatchDate && new Date(arrivalDate) < new Date(dispatchDate)) {
                    this.shipmentForm.get('estimatedArrival')?.setErrors({ beforeDispatch: true });
                } else {
                    // Clear the error if dates are valid
                    const arrivalControl = this.shipmentForm.get('estimatedArrival');
                    if (arrivalControl?.hasError('beforeDispatch')) {
                        arrivalControl.setErrors(null);
                    }
                }
            }
        });
    }

    private disableFormSections(): void {
        // Disable Importer Details fields
        this.shipmentForm.get('firstName')?.disable();
        this.shipmentForm.get('lastName')?.disable();
        this.shipmentForm.get('emailAddress')?.disable();
        this.shipmentForm.get('phoneNumber')?.disable();
        this.shipmentForm.get('kraPin')?.disable();
        this.shipmentForm.get('idNumber')?.disable();
        this.shipmentForm.get('streetAddress')?.disable();
        this.shipmentForm.get('postalCode')?.disable();

        // Disable Shipment Details fields
        this.shipmentForm.get('modeOfShipment')?.disable();
        this.shipmentForm.get('tradeType')?.disable();
        this.shipmentForm.get('product')?.disable();
        this.shipmentForm.get('commodityType')?.disable();
        this.shipmentForm.get('salesCategory')?.disable();
        this.shipmentForm.get('countryOfOrigin')?.disable();
        this.shipmentForm.get('gcrNumber')?.disable();
        this.shipmentForm.get('idNumber2')?.disable();
        this.shipmentForm.get('loadingPort')?.disable();
        this.shipmentForm.get('portOfDischarge')?.disable();
        this.shipmentForm.get('vesselName')?.disable();
        this.shipmentForm.get('finalDestination')?.disable();
        this.shipmentForm.get('dateOfDispatch')?.disable();
        this.shipmentForm.get('estimatedArrival')?.disable();
        this.shipmentForm.get('sumInsured')?.disable();
        this.shipmentForm.get('goodsDescription')?.disable();
    }

    private enableFormSections(): void {
        // Enable Importer Details fields
        this.shipmentForm.get('firstName')?.enable();
        this.shipmentForm.get('lastName')?.enable();
        this.shipmentForm.get('emailAddress')?.enable();
        this.shipmentForm.get('phoneNumber')?.enable();
        this.shipmentForm.get('kraPin')?.enable();
        this.shipmentForm.get('idNumber')?.enable();
        this.shipmentForm.get('streetAddress')?.enable();
        this.shipmentForm.get('postalCode')?.enable();

        // Enable Shipment Details fields
        this.shipmentForm.get('modeOfShipment')?.enable();
        this.shipmentForm.get('tradeType')?.enable();
        this.shipmentForm.get('product')?.enable();
        this.shipmentForm.get('commodityType')?.enable();
        this.shipmentForm.get('salesCategory')?.enable();
        this.shipmentForm.get('countryOfOrigin')?.enable();
        this.shipmentForm.get('gcrNumber')?.enable();
        this.shipmentForm.get('idNumber2')?.enable();
        this.shipmentForm.get('loadingPort')?.enable();
        this.shipmentForm.get('portOfDischarge')?.enable();
        this.shipmentForm.get('vesselName')?.enable();
        this.shipmentForm.get('finalDestination')?.enable();
        this.shipmentForm.get('dateOfDispatch')?.enable();
        this.shipmentForm.get('estimatedArrival')?.enable();
        this.shipmentForm.get('sumInsured')?.enable();
        this.shipmentForm.get('goodsDescription')?.enable();

        // Ports will be fetched automatically when country is selected via valueChanges subscription
    }

    private fetchPorts( searchTerm: string = ''): void {
        this.isLoadingDischargePorts = true;
        const formValue = this.shipmentForm.getRawValue();
        const modeOfShipment =  formValue.modeOfShipment;

        const countryId = modeOfShipment==='1'?116:43;

        this.userService.getPorts(countryId, modeOfShipment, this.dischargePortPage, this.pageSize, searchTerm).subscribe({
            next: (response) => {
                const newPorts = response?.pageItems || response?.data || [];
                if (this.dischargePortPage === 0) {
                    this.dischargePorts = newPorts;
                } else {
                    this.dischargePorts = [...this.dischargePorts, ...newPorts];
                }
                this.filteredDischargePorts.next(this.dischargePorts.slice());
                this.isLoadingDischargePorts = false;
            },
            error: (err) => {
                    this.dischargePorts = [];
                    this.filteredDischargePorts.next([]);
                    this.isLoadingLoadingPorts = false;

            }
        });
    }




    // onLoadingPortScroll(): void {
    //     // if (!this.isLoadingLoadingPorts) {
    //     //     this.loadingPortPage++;
    //     //     this.fetchPorts('loading', this.loadingPortSearchCtrl.value);
    //     // }
    // }

    onDischargePortScroll(): void {
        if (!this.isLoadingDischargePorts) {
            this.dischargePortPage++;
            this.fetchPorts( this.dischargePortSearchCtrl.value);
        }
    }

    openTermsOfUse(event: Event): void {
        event.preventDefault();
        const dialogRef = this.dialog.open(TermsModalComponent, {
            width: '600px',
            maxWidth: '90vw',
            maxHeight: '80vh',
            panelClass: 'terms-modal'
        });
    }

    openPrivacyPolicy(event: Event): void {
        event.preventDefault();
        const dialogRef = this.dialog.open(PrivacyModalComponent, {
            width: '600px',
            maxWidth: '90vw',
            maxHeight: '80vh',
            panelClass: 'privacy-modal'
        });
    }

    // Input validation handlers for new fields
    onFirstNameInput(event: any): void {
        let value = event.target.value.trim();
        value = value.replace(/[^a-zA-Z]/g, '');
        if (value.length > 0) {
            value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        }
        this.shipmentForm.patchValue({ firstName: value });
    }

    onLastNameInput(event: any): void {
        let value = event.target.value.trim();
        value = value.replace(/[^a-zA-Z]/g, '');
        if (value.length > 0) {
            value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        }
        this.shipmentForm.patchValue({ lastName: value });
    }

    onEmailInput(event: any): void {
        const value = event.target.value.trim();
        this.shipmentForm.patchValue({ emailAddress: value });
    }

    onPhoneNumberInput(event: any): void {
        let value = event.target.value.trim();
        value = value.replace(/[^0-9]/g, '');
        if (value.length > 10) {
            value = value.substring(0, 10);
        }
        this.shipmentForm.patchValue({ phoneNumber: value });
    }

    onPostalAddressInput(event: any): void {
        const value = event.target.value.trim();
        this.shipmentForm.patchValue({ streetAddress: value });
    }

    onPostalCodeInput(event: any): void {
        const value = event.target.value.trim();
        this.shipmentForm.patchValue({ postalCode: value });
    }

    onMpesaNumberInput(event: any): void {
        let value = event.target.value.trim();
        value = value.replace(/[^0-9]/g, '');
        if (value.length > 0 && !value.startsWith('0')) {
            value = '0' + value;
        }
        if (value.length > 10) {
            value = value.substring(0, 10);
        }
        this.shipmentForm.patchValue({ mpesaNumber: value });
    }

    onDescriptionInput(event: any): void {
        let value = event.target.value.trim();
        value = value.replace(/\b\w/g, (l: string) => l.toUpperCase());
        this.shipmentForm.patchValue({ goodsDescription: value });
    }

    onVesselNameInput(event: any): void {
        let value = event.target.value;
        // Allow letters, numbers, and spaces
        value = value.replace(/[^a-zA-Z0-9\s]/g, '');
        // Capitalize first letter of each word
        value = value.replace(/\b\w/g, (char: string) => char.toUpperCase());
        this.shipmentForm.patchValue({ vesselName: value });
    }

    clearDuplicateError(fieldName: string): void {
        if (this.duplicateFileErrors && this.duplicateFileErrors[fieldName]) {
            delete this.duplicateFileErrors[fieldName];
        }
    }

    // Format amount to hide .00 decimals for whole numbers
    formatAmount(value: number): string {
        if (!value && value !== 0) return '0';

        // Check if the number is a whole number
        if (value % 1 === 0) {
            // Return without decimals, with thousand separators
            return value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        } else {
            // Return with 2 decimal places, with thousand separators
            return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
    }

    // Check if all required fields are filled
    get isFormValid(): boolean {
        if (!this.shipmentForm) return false;

        // Check if all required form fields are valid and filled
        const requiredFields = [
            'firstName', 'lastName', 'emailAddress', 'phoneNumber', 'kraPin', 'idNumber',
            'streetAddress', 'postalCode', 'selectCategory', 'salesCategory', 'countryOfOrigin',
            'gcrNumber', 'loadingPort', 'portOfDischarge', 'finalDestination',
            'dateOfDispatch', 'estimatedArrival', 'sumInsured', 'goodsDescription'
        ];

        // Check if all required text fields have values
        const allFieldsFilled = requiredFields.every(field => {
            const control = this.shipmentForm.get(field);
            return control && control.value && control.value.toString().trim() !== '';
        });

        // Check if all required documents are uploaded
        const documentsUploaded = this.shipmentForm.get('idfDocument')?.value &&
                                 this.shipmentForm.get('invoice')?.value &&
                                 this.shipmentForm.get('kraPinCertificate')?.value &&
                                 this.shipmentForm.get('nationalId')?.value;

        // Check if terms are agreed
        const termsAgreed = this.shipmentForm.get('agreeToTerms')?.value;

        return allFieldsFilled && documentsUploaded && termsAgreed && this.shipmentForm.valid;
    }
}

// Terms of Use Modal Component
@Component({
    selector: 'app-terms-modal',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
    template: `
        <div class="modal-container">
            <div class="modal-header">
                <h2 class="modal-title">Terms of Use</h2>
                <button mat-icon-button (click)="close()" class="close-button">
                    <mat-icon>close</mat-icon>
                </button>
            </div>
            <div class="modal-content">
                <div class="overflow-y-auto max-h-[60vh] text-sm text-gray-700 space-y-4 p-6">
                    <p class="font-semibold text-base">Terms of Use for Geminia Insurance Company Limited</p>
                    <p>By accessing and using the services provided by Geminia Insurance Company Limited, you agree to comply with and be bound by the following terms and conditions:</p>

                    <div>
                        <h3 class="font-semibold text-gray-900 mb-1">1. Service Agreement</h3>
                        <p>These terms constitute a binding agreement between you and Geminia Insurance Company Limited regarding your use of our insurance services and platform.</p>
                    </div>

                    <div>
                        <h3 class="font-semibold text-gray-900 mb-1">2. Eligibility</h3>
                        <p>You must be at least 18 years old and legally capable of entering into binding contracts to use our services.</p>
                    </div>

                    <div>
                        <h3 class="font-semibold text-gray-900 mb-1">3. Accurate Information</h3>
                        <p>You agree to provide accurate, current, and complete information during registration and throughout your use of our services.</p>
                    </div>

                    <div>
                        <h3 class="font-semibold text-gray-900 mb-1">4. Privacy and Data Protection</h3>
                        <p>Your privacy is important to us. Please review our Data Privacy Policy to understand how we collect, use, and protect your personal information.</p>
                    </div>

                    <div>
                        <h3 class="font-semibold text-gray-900 mb-1">5. Service Availability</h3>
                        <p>We strive to maintain service availability but cannot guarantee uninterrupted access to our platform.</p>
                    </div>

                    <div>
                        <h3 class="font-semibold text-gray-900 mb-1">6. Limitation of Liability</h3>
                        <p>Geminia Insurance Company Limited shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.</p>
                    </div>

                    <div>
                        <h3 class="font-semibold text-gray-900 mb-1">7. Modifications</h3>
                        <p>We reserve the right to modify these terms at any time. Continued use of our services after modifications constitutes acceptance of the updated terms.</p>
                    </div>

                    <p class="text-xs text-gray-500 mt-4">Last updated: October 7, 2025</p>
                </div>
                <div class="px-6 pb-6 flex justify-end">
                    <button mat-raised-button class="action-button" (click)="close()">Close</button>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .modal-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            width: 100%;
            overflow: hidden;
        }

        .modal-header {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px 24px;
            background-color: #21275c;
            color: white;
            position: relative;
            flex-shrink: 0;
        }

        .modal-title {
            color: white;
            font-size: 20px;
            font-weight: 600;
            margin: 0;
            text-align: center;
        }

        .close-button {
            position: absolute;
            top: 8px;
            right: 8px;
            color: white;
        }

        .modal-content {
            flex: 1;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
        }

        .action-button {
            background-color: #21275c !important;
            color: white !important;
            padding: 8px 24px;
            font-weight: 500;
        }

        .action-button:hover {
            background-color: #2d3470 !important;
        }
    `]
})
export class TermsModalComponent {
    constructor(public dialogRef: MatDialogRef<TermsModalComponent>) {}

    close(): void {
        this.dialogRef.close();
    }
}

// Privacy Policy Modal Component
@Component({
    selector: 'app-privacy-modal',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
    template: `
        <div class="modal-container">
            <div class="modal-header">
                <h2 class="modal-title">Data Privacy Policy</h2>
                <button mat-icon-button (click)="close()" class="close-button">
                    <mat-icon>close</mat-icon>
                </button>
            </div>
            <div class="modal-content">
                <div class="overflow-y-auto max-h-[60vh] text-sm text-gray-700 space-y-4 p-6">
                    <p class="font-semibold text-base">Data Privacy Statement - Geminia Insurance Company Limited</p>
                    <p>Geminia Insurance Company Limited is committed to protecting the fundamental human right to privacy of those with whom we interact. We recognize the need to safeguard personal data that is collected or disclosed to us as part of the Know-your-customer information required by us in order to provide you with the requisite financial product or service.</p>

                    <p>We are committed to complying with the requirements of the Data Protection Act and the attendant regulations as well as best global best practices regarding the processing of your personal data. In this regard, you are required to acquaint yourselves with our data privacy statement which is intended to tell you how we use your personal data and describes how we collect and process your personal data during and after your relationship with us.</p>

                    <div>
                        <h3 class="font-semibold text-gray-900 mb-1">Data Collection</h3>
                        <p>We collect personal data necessary for providing insurance services, including but not limited to identification information, contact details, and financial information required for Know Your Customer (KYC) compliance.</p>
                    </div>

                    <div>
                        <h3 class="font-semibold text-gray-900 mb-1">Purpose of Processing</h3>
                        <p>Your personal data is processed for the following purposes:</p>
                        <ul class="list-disc pl-5 mt-2 space-y-1">
                            <li>Provision of insurance products and services</li>
                            <li>Compliance with regulatory requirements</li>
                            <li>Risk assessment and underwriting</li>
                            <li>Claims processing and settlement</li>
                            <li>Customer service and support</li>
                        </ul>
                    </div>

                    <div>
                        <h3 class="font-semibold text-gray-900 mb-1">Data Security</h3>
                        <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.</p>
                    </div>

                    <div>
                        <h3 class="font-semibold text-gray-900 mb-1">Your Rights</h3>
                        <p>You have the right to access, rectify, erase, or restrict processing of your personal data, as well as the right to data portability and to object to processing under certain circumstances.</p>
                    </div>

                    <div>
                        <h3 class="font-semibold text-gray-900 mb-1">Data Retention</h3>
                        <p>We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected or as required by applicable laws and regulations.</p>
                    </div>

                    <div>
                        <h3 class="font-semibold text-gray-900 mb-1">Contact Information</h3>
                        <p>For more detailed information about our data processing practices, please visit: <a href="https://geminia.co.ke/data-privacy-statement/" target="_blank" class="text-blue-600 hover:underline">https://geminia.co.ke/data-privacy-statement/</a></p>
                    </div>

                    <p class="text-xs text-gray-500 mt-4">Last updated: October 7, 2025</p>
                </div>
                <div class="px-6 pb-6 flex justify-end">
                    <button mat-raised-button class="action-button" (click)="close()">Close</button>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .modal-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            width: 100%;
            overflow: hidden;
        }

        .modal-header {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px 24px;
            background-color: #21275c;
            color: white;
            position: relative;
            flex-shrink: 0;
        }

        .modal-title {
            color: white;
            font-size: 20px;
            font-weight: 600;
            margin: 0;
            text-align: center;
        }

        .close-button {
            position: absolute;
            top: 8px;
            right: 8px;
            color: white;
        }

        .modal-content {
            flex: 1;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
        }

        .action-button {
            background-color: #21275c !important;
            color: white !important;
            padding: 8px 24px;
            font-weight: 500;
        }

        .action-button:hover {
            background-color: #2d3470 !important;
        }
    `]
})
export class PrivacyModalComponent {
    constructor(public dialogRef: MatDialogRef<PrivacyModalComponent>) {}

    close(): void {
        this.dialogRef.close();
    }
}
