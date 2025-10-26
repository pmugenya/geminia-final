// Shared Imports for Standalone Components
// This file provides commonly used imports for standalone components

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Material Modules - Core UI Components
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

// Material Modules - Data & Navigation
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

// Material Modules - Form Controls
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';

// Material Modules - Layout & Indicators
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';

// Third-party modules
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ScrollingModule } from '@angular/cdk/scrolling';

// Common pipes
import { CurrencyPipe, DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';

// Fuse components
import { FuseAlertComponent } from '@fuse/components/alert';

/**
 * Common imports for basic standalone components
 */
export const COMMON_STANDALONE_IMPORTS = [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
] as const;

/**
 * Essential Material UI modules for most components
 */
export const ESSENTIAL_MATERIAL_IMPORTS = [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatProgressSpinnerModule,
] as const;

/**
 * Form-related Material UI modules
 */
export const FORM_MATERIAL_IMPORTS = [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatChipsModule,
] as const;

/**
 * Data display Material UI modules
 */
export const DATA_MATERIAL_IMPORTS = [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    MatExpansionModule,
] as const;

/**
 * Navigation Material UI modules
 */
export const NAVIGATION_MATERIAL_IMPORTS = [
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatTabsModule,
] as const;

/**
 * Dialog and overlay Material UI modules
 */
export const DIALOG_MATERIAL_IMPORTS = [
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
] as const;

/**
 * All Material UI modules (use sparingly to avoid large bundles)
 */
export const ALL_MATERIAL_IMPORTS = [
    ...ESSENTIAL_MATERIAL_IMPORTS,
    ...FORM_MATERIAL_IMPORTS,
    ...DATA_MATERIAL_IMPORTS,
    ...NAVIGATION_MATERIAL_IMPORTS,
    ...DIALOG_MATERIAL_IMPORTS,
    MatBadgeModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatStepperModule,
] as const;

/**
 * Third-party modules commonly used
 */
export const THIRD_PARTY_IMPORTS = [
    NgxMatSelectSearchModule,
    ScrollingModule,
] as const;

/**
 * Common pipes for standalone components
 */
export const COMMON_PIPES = [
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    TitleCasePipe,
] as const;

/**
 * Fuse framework components
 */
export const FUSE_IMPORTS = [
    FuseAlertComponent,
] as const;

/**
 * Complete import set for complex standalone components
 * Use this when you need most functionality
 */
export const COMPLETE_STANDALONE_IMPORTS = [
    ...COMMON_STANDALONE_IMPORTS,
    ...ALL_MATERIAL_IMPORTS,
    ...THIRD_PARTY_IMPORTS,
    ...FUSE_IMPORTS,
] as const;

/**
 * Minimal import set for simple standalone components
 * Use this for lightweight components
 */
export const MINIMAL_STANDALONE_IMPORTS = [
    ...COMMON_STANDALONE_IMPORTS,
    ...ESSENTIAL_MATERIAL_IMPORTS,
] as const;
