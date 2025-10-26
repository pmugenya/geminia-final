import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';

// Third-party modules
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ScrollingModule } from '@angular/cdk/scrolling';

// Fuse modules
import { FuseAlertComponent } from '@fuse/components/alert';

// Shared modules
import { SharedModule } from '../../../shared/shared.module';

// Feature components
import { MarineCargoQuotationComponent } from './marine-cargo.component';
import { MarineBuyNowModalComponent } from './marine-buy-now-modal.component';

// Routes
import marineCargoQuotationRoutes from './marine-cargo-quotation.routes';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild(marineCargoQuotationRoutes),
        
        // Material Modules
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatCardModule,
        MatStepperModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCheckboxModule,
        MatRadioModule,
        MatTabsModule,
        
        // Third-party modules
        NgxMatSelectSearchModule,
        ScrollingModule,
        
        // Fuse modules
        FuseAlertComponent,
        
        // Shared modules
        SharedModule,
        
        // Feature components
        MarineCargoQuotationComponent,
        MarineBuyNowModalComponent,
    ],
    exports: [
        MarineCargoQuotationComponent,
        MarineBuyNowModalComponent,
    ],
})
export class MarineCargoModule {}
