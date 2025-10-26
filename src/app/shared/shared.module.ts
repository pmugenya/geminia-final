import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

// Third-party modules
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ScrollingModule } from '@angular/cdk/scrolling';

// Common pipes
import { CurrencyPipe, DatePipe } from '@angular/common';

// Fuse modules
import { FuseAlertComponent } from '@fuse/components/alert';

// Shared components
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';

const MATERIAL_MODULES = [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatCardModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatExpansionModule,
    MatStepperModule,
    MatTooltipModule,
    MatChipsModule,
    MatAutocompleteModule,
];

const THIRD_PARTY_MODULES = [
    NgxMatSelectSearchModule,
    ScrollingModule,
];

const COMMON_MODULES = [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
];

const FUSE_MODULES = [
    FuseAlertComponent,
];

// Note: Standalone components should not be imported in NgModule
// They are exported separately for direct import in other standalone components

@NgModule({
    imports: [
        ...COMMON_MODULES,
        ...MATERIAL_MODULES,
        ...THIRD_PARTY_MODULES,
        ...FUSE_MODULES,
    ],
    exports: [
        ...COMMON_MODULES,
        ...MATERIAL_MODULES,
        ...THIRD_PARTY_MODULES,
        ...FUSE_MODULES,
        // Common pipes
        CurrencyPipe,
        DatePipe,
    ],
    providers: [
        CurrencyPipe,
        DatePipe,
    ],
})
export class SharedModule {}