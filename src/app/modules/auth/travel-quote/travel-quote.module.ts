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

// Shared modules
import { SharedModule } from '../../../shared/shared.module';

// Feature components (these would need to be imported from their respective files)
// import { TravelQuoteComponent } from './travel-quote.component';
// import { TravellerDetailsModalComponent } from './traveller-details-modal.component';

// Routes
import travelQuoteRoutes from './travel-quote.routes';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild(travelQuoteRoutes),
        
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
        
        // Shared modules
        SharedModule,
        
        // Feature components would be added here when available
        // TravelQuoteComponent,
        // TravellerDetailsModalComponent,
    ],
    exports: [
        // Feature components would be exported here when available
        // TravelQuoteComponent,
        // TravellerDetailsModalComponent,
    ],
})
export class TravelQuoteModule {}
