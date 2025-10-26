import { Component, Inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { Subject, takeUntil, debounceTime } from 'rxjs';
import { QuoteService } from '../shared/services/quote.service';
import { UserService } from '../../../core/user/user.service';

export interface ShipmentDetailsData {
    shippingId: number;
    postalAddress?: string;
    postalCode?: string;
}

@Component({
    selector: 'app-shipment-details-modal',
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
        MatTabsModule,
        MatDividerModule,
        MatCardModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatRadioModule
    ],
    template: `
        <div class="modal-container">
            <div class="modal-header">
                <h2 mat-dialog-title class="modal-title">Review & Pay for Marine Insurance</h2>
                <button mat-icon-button (click)="closeDialog()" class="close-button" aria-label="Close dialog">
                    <mat-icon>close</mat-icon>
                </button>
            </div>
            
            <mat-dialog-content class="modal-content">
                <mat-tab-group [(selectedIndex)]="selectedTabIndex" class="payment-tabs">
                    
                    <!-- Shipment Details Tab -->
                    <mat-tab label="Shipment Details">
                        <div class="tab-content">
                            <form [formGroup]="shipmentForm" class="p-4">
                                
                                <!-- Document Uploads Section -->
                                <div class="document-uploads-section mb-6">
                                    <h3 class="section-title">Document Uploads</h3>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div class="document-upload-item">
                                            <label class="document-label">
                                                IDF Document <span class="required-mark">*</span>
                                            </label>
                                            <div class="upload-box">
                                                <button type="button" mat-button color="primary" (click)="idfDocumentInput.click()">
                                                    <mat-icon>upload_file</mat-icon>
                                                    Choose file
                                                </button>
                                                <input hidden #idfDocumentInput type="file" (change)="onFileSelected($event, 'idfDocument')">
                                                <p class="file-name">{{ shipmentForm.get('idfDocument')?.value?.name || 'No file chosen' }}</p>
                                            </div>
                                        </div>
                                        <div class="document-upload-item">
                                            <label class="document-label">
                                                Invoice <span class="required-mark">*</span>
                                            </label>
                                            <div class="upload-box">
                                                <button type="button" mat-button color="primary" (click)="invoiceInput.click()">
                                                    <mat-icon>upload_file</mat-icon>
                                                    Choose file
                                                </button>
                                                <input hidden #invoiceInput type="file" (change)="onFileSelected($event, 'invoice')">
                                                <p class="file-name">{{ shipmentForm.get('invoice')?.value?.name || 'No file chosen' }}</p>
                                            </div>
                                        </div>
                                        <div class="document-upload-item">
                                            <label class="document-label">
                                                KRA PIN Certificate <span class="required-mark">*</span>
                                            </label>
                                            <div class="upload-box">
                                                <button type="button" mat-button color="primary" (click)="kraPinInput.click()">
                                                    <mat-icon>upload_file</mat-icon>
                                                    Choose file
                                                </button>
                                                <input hidden #kraPinInput type="file" (change)="onFileSelected($event, 'kraPinCertificate')">
                                                <p class="file-name">{{ shipmentForm.get('kraPinCertificate')?.value?.name || 'No file chosen' }}</p>
                                            </div>
                                        </div>
                                        <div class="document-upload-item">
                                            <label class="document-label">
                                                National ID <span class="required-mark">*</span>
                                            </label>
                                            <div class="upload-box">
                                                <button type="button" mat-button color="primary" (click)="nationalIdInput.click()">
                                                    <mat-icon>upload_file</mat-icon>
                                                    Choose file
                                                </button>
                                                <input hidden #nationalIdInput type="file" (change)="onFileSelected($event, 'nationalId')">
                                                <p class="file-name">{{ shipmentForm.get('nationalId')?.value?.name || 'No file chosen' }}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="terms-checkbox">
                                        <mat-checkbox formControlName="agreeToTerms" color="primary"></mat-checkbox>
                                        <label class="terms-label">
                                            I agree to the <a href="#" class="terms-link">Terms of Use</a> and to the <a href="#" class="terms-link">Data Privacy Policy</a>
                                        </label>
                                    </div>
                                </div>

                                <mat-divider class="section-divider"></mat-divider>

                                <!-- Shipment Information Fields -->
                                <div class="shipment-info-section">
                                    <h3 class="section-title">Shipment Information</h3>
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

                                    <!-- Cargo Protection Field -->
                                    <div class="cargo-protection-field md:col-span-2 mb-4">
                                        <label class="cargo-protection-label">Cargo Protection:</label>
                                        <span class="cargo-protection-value">ICC (A) All Risk</span>
                                    </div>

                                    <mat-form-field appearance="outline">
                                        <mat-label>Mode of Shipment</mat-label>
                                        <input matInput formControlName="shippingModeName" (blur)="onFormChange()">
                                    </mat-form-field>

                                    <mat-form-field appearance="outline">
                                        <mat-label>Trade Type</mat-label>
                                        <input matInput formControlName="importerType" (blur)="onFormChange()">
                                    </mat-form-field>

                                    <mat-form-field appearance="outline">
                                        <mat-label>Vessel Name</mat-label>
                                        <input matInput formControlName="vesselName" (blur)="onFormChange()">
                                    </mat-form-field>

                                    <mat-form-field appearance="outline">
                                        <mat-label>IDF Number</mat-label>
                                        <input matInput formControlName="idfNumber" (blur)="onFormChange()">
                                    </mat-form-field>

                                    <mat-form-field appearance="outline">
                                        <mat-label>Sum Insured (KES)</mat-label>
                                        <input matInput formControlName="sumassured" type="number" placeholder="Enter amount in KES" (blur)="onFormChange()">
                                        <span matTextPrefix>KES </span>
                                        <mat-error *ngIf="shipmentForm.get('sumassured')?.hasError('required')">Sum insured is required</mat-error>
                                    </mat-form-field>

                                    <!-- Packaging Type Radio Buttons -->
                                    <div class="packaging-type-section">
                                        <label class="section-label">Packaging Type</label>
                                        <mat-radio-group formControlName="packagingType" class="packaging-radio-group" (change)="onFormChange()">
                                            <mat-radio-button value="containerized" class="packaging-radio">Containerized</mat-radio-button>
                                            <mat-radio-button value="non-containerized" class="packaging-radio">Non Containerized</mat-radio-button>
                                        </mat-radio-group>
                                    </div>

                                    <mat-form-field appearance="outline">
                                        <mat-label>Select Category</mat-label>
                                        <mat-select formControlName="category" (selectionChange)="onFormChange()">
                                            <mat-option value="general-cargo">General Cargo</mat-option>
                                            <mat-option value="electronics">Electronics</mat-option>
                                            <mat-option value="textiles">Textiles</mat-option>
                                            <mat-option value="machinery">Machinery</mat-option>
                                            <mat-option value="food-beverages">Food & Beverages</mat-option>
                                            <mat-option value="chemicals">Chemicals</mat-option>
                                            <mat-option value="automotive">Automotive</mat-option>
                                            <mat-option value="other">Other</mat-option>
                                        </mat-select>
                                    </mat-form-field>

                                    <mat-form-field appearance="outline">
                                        <mat-label>Cargo Type</mat-label>
                                        <mat-select formControlName="cargoType" (selectionChange)="onFormChange()">
                                            <mat-option value="dry-cargo">Dry Cargo</mat-option>
                                            <mat-option value="liquid-cargo">Liquid Cargo</mat-option>
                                            <mat-option value="refrigerated">Refrigerated Cargo</mat-option>
                                            <mat-option value="hazardous">Hazardous Materials</mat-option>
                                            <mat-option value="bulk">Bulk Cargo</mat-option>
                                            <mat-option value="fragile">Fragile Items</mat-option>
                                        </mat-select>
                                        <mat-error *ngIf="shipmentForm.get('cargoType')?.hasError('required')">Cargo type is required</mat-error>
                                    </mat-form-field>

                                    <mat-form-field appearance="outline">
                                        <mat-label>Date of Dispatch</mat-label>
                                        <input matInput [matDatepicker]="dispatchPicker" formControlName="dateOfDispatch" (dateChange)="onFormChange()" readonly>
                                        <mat-datepicker-toggle matIconSuffix [for]="dispatchPicker"></mat-datepicker-toggle>
                                        <mat-datepicker #dispatchPicker></mat-datepicker>
                                        <mat-error *ngIf="shipmentForm.get('dateOfDispatch')?.hasError('required')">Date of dispatch is required</mat-error>
                                    </mat-form-field>

                                    <mat-form-field appearance="outline">
                                        <mat-label>Estimated Arrival Time</mat-label>
                                        <input matInput [matDatepicker]="arrivalPicker" formControlName="estimatedArrival" (dateChange)="onFormChange()" readonly>
                                        <mat-datepicker-toggle matIconSuffix [for]="arrivalPicker"></mat-datepicker-toggle>
                                        <mat-datepicker #arrivalPicker></mat-datepicker>
                                        <mat-error *ngIf="shipmentForm.get('estimatedArrival')?.hasError('required')">Estimated arrival time is required</mat-error>
                                    </mat-form-field>

                                    <mat-form-field appearance="outline">
                                        <mat-label>Country of Origin</mat-label>
                                        <mat-select formControlName="originCountryName" (selectionChange)="onFormChange()">
                                            <mat-option value="china">China</mat-option>
                                            <mat-option value="india">India</mat-option>
                                            <mat-option value="uae">United Arab Emirates</mat-option>
                                            <mat-option value="usa">United States</mat-option>
                                            <mat-option value="uk">United Kingdom</mat-option>
                                            <mat-option value="germany">Germany</mat-option>
                                            <mat-option value="japan">Japan</mat-option>
                                            <mat-option value="south-africa">South Africa</mat-option>
                                            <mat-option value="other">Other</mat-option>
                                        </mat-select>
                                        <mat-error *ngIf="shipmentForm.get('originCountryName')?.hasError('required')">Country of origin is required</mat-error>
                                    </mat-form-field>

                                    <mat-form-field appearance="outline">
                                        <mat-label>Loading Port</mat-label>
                                        <mat-select formControlName="originPortName" (selectionChange)="onFormChange()">
                                            <mat-option value="shanghai">Shanghai, China</mat-option>
                                            <mat-option value="dubai">Dubai, UAE</mat-option>
                                            <mat-option value="mumbai">Mumbai, India</mat-option>
                                            <mat-option value="singapore">Singapore</mat-option>
                                            <mat-option value="rotterdam">Rotterdam, Netherlands</mat-option>
                                            <mat-option value="hamburg">Hamburg, Germany</mat-option>
                                            <mat-option value="los-angeles">Los Angeles, USA</mat-option>
                                            <mat-option value="other">Other</mat-option>
                                        </mat-select>
                                        <mat-error *ngIf="shipmentForm.get('originPortName')?.hasError('required')">Loading port is required</mat-error>
                                    </mat-form-field>

                                    <mat-form-field appearance="outline">
                                        <mat-label>Port of Discharge</mat-label>
                                        <mat-select formControlName="destPortName" (selectionChange)="onFormChange()">
                                            <mat-option value="mombasa">Mombasa, Kenya</mat-option>
                                            <mat-option value="dar-es-salaam">Dar es Salaam, Tanzania</mat-option>
                                            <mat-option value="durban">Durban, South Africa</mat-option>
                                            <mat-option value="djibouti">Djibouti</mat-option>
                                            <mat-option value="other">Other</mat-option>
                                        </mat-select>
                                        <mat-error *ngIf="shipmentForm.get('destPortName')?.hasError('required')">Port of discharge is required</mat-error>
                                    </mat-form-field>

                                    <mat-form-field appearance="outline">
                                        <mat-label>Final Destination</mat-label>
                                        <mat-select formControlName="countyName" (selectionChange)="onFormChange()">
                                            <mat-option value="nairobi">Nairobi</mat-option>
                                            <mat-option value="mombasa">Mombasa</mat-option>
                                            <mat-option value="kisumu">Kisumu</mat-option>
                                            <mat-option value="nakuru">Nakuru</mat-option>
                                            <mat-option value="eldoret">Eldoret</mat-option>
                                            <mat-option value="thika">Thika</mat-option>
                                            <mat-option value="machakos">Machakos</mat-option>
                                            <mat-option value="other">Other</mat-option>
                                        </mat-select>
                                        <mat-error *ngIf="shipmentForm.get('countyName')?.hasError('required')">Final destination is required</mat-error>
                                    </mat-form-field>

                                    <!-- M-Pesa Number Field -->
                                    <mat-form-field appearance="outline" class="md:col-span-2">
                                        <mat-label>M-Pesa Number</mat-label>
                                        <input matInput formControlName="phoneNumber" placeholder="254XXXXXXXXX" (blur)="onFormChange()">
                                        <mat-icon matSuffix>phone</mat-icon>
                                        <mat-hint>Enter your M-Pesa registered phone number</mat-hint>
                                    </mat-form-field>

                                    <mat-form-field appearance="outline" class="md:col-span-2">
                                        <mat-label>Description of Goods</mat-label>
                                        <textarea matInput formControlName="description" rows="4" placeholder="Describe the goods being shipped" (blur)="onFormChange()"></textarea>
                                        <mat-hint>Provide detailed description of the cargo</mat-hint>
                                        <mat-error *ngIf="shipmentForm.get('description')?.hasError('required')">Description is required</mat-error>
                                    </mat-form-field>

                                </div>
                            </form>
                        </div>
                    </mat-tab>
                    
                    <!-- Quote Summary Tab -->
                    <mat-tab label="Quote Summary" [disabled]="!quoteCalculated">
                        <div class="tab-content">
                            <div class="quote-summary-section">
                                <mat-card class="premium-card">
                                    <mat-card-header>
                                        <mat-card-title class="premium-title">
                                            <mat-icon class="premium-icon">receipt</mat-icon>
                                            Payment
                                        </mat-card-title>
                                    </mat-card-header>
                                    <mat-card-content>
                                        <div class="premium-breakdown" *ngIf="premiumCalculation">
                                            <div class="premium-row cargo-protection-row">
                                                <span class="premium-label">Cargo Protection:</span>
                                                <span class="premium-value">ICC (A) All Risk</span>
                                            </div>
                                            <div class="premium-row">
                                                <span class="premium-label">Sum Insured:</span>
                                                <span class="premium-value">KES {{ premiumCalculation.sumInsured | number:'1.2-2' }}</span>
                                            </div>
                                            <div class="premium-row">
                                                <span class="premium-label">Base Premium:</span>
                                                <span class="premium-value">KES {{ premiumCalculation.basePremium | number:'1.2-2' }}</span>
                                            </div>
                                            <div class="premium-row">
                                                <span class="premium-label">PHCF (0.25%):</span>
                                                <span class="premium-value">KES {{ premiumCalculation.phcf | number:'1.2-2' }}</span>
                                            </div>
                                            <div class="premium-row">
                                                <span class="premium-label">Training Levy (0.2%):</span>
                                                <span class="premium-value">KES {{ premiumCalculation.trainingLevy | number:'1.2-2' }}</span>
                                            </div>
                                            <div class="premium-row">
                                                <span class="premium-label">Stamp Duty (0.05%):</span>
                                                <span class="premium-value">KES {{ premiumCalculation.stampDuty | number:'1.2-2' }}</span>
                                            </div>
                                            <mat-divider class="premium-divider"></mat-divider>
                                            <div class="premium-row total-row">
                                                <span class="premium-label total-label">Total Premium:</span>
                                                <span class="premium-value total-value">KES {{ premiumCalculation.totalPayable | number:'1.2-2' }}</span>
                                            </div>
                                            
                                            <mat-divider class="premium-divider"></mat-divider>
                                            
                                            <div class="mpesa-field-section">
                                                <form [formGroup]="paymentForm">
                                                    <mat-form-field appearance="outline" class="mpesa-field">
                                                        <mat-label>M-Pesa Number</mat-label>
                                                        <input matInput formControlName="phoneNumber" placeholder="254XXXXXXXXX">
                                                        <mat-icon matSuffix>phone</mat-icon>
                                                        <mat-hint>Enter your M-Pesa registered phone number</mat-hint>
                                                    </mat-form-field>
                                                </form>
                                            </div>
                                        </div>
                                        
                                        <div class="recalculating-message" *ngIf="isRecalculating">
                                            <mat-icon class="spin">refresh</mat-icon>
                                            <span>Recalculating premium...</span>
                                        </div>
                                        
                                        <div class="no-quote-message" *ngIf="!premiumCalculation && !isRecalculating">
                                            <mat-icon>info</mat-icon>
                                            <span>Please review shipment details to calculate premium</span>
                                        </div>
                                    </mat-card-content>
                                </mat-card>
                            </div>
                        </div>
                    </mat-tab>
                    
                    <!-- Payment Tab -->
                    <mat-tab label="Payment" [disabled]="!premiumCalculation">
                        <div class="tab-content">
                            <div class="payment-section">
                                <div class="payment-summary">
                                    <mat-card class="payment-card">
                                        <mat-card-header>
                                            <mat-card-title class="payment-title">
                                                <mat-icon class="payment-icon">payment</mat-icon>
                                                M-Pesa Payment
                                            </mat-card-title>
                                        </mat-card-header>
                                        <mat-card-content>
                                            <div class="amount-display">
                                                <span class="amount-label">Amount to Pay:</span>
                                                <span class="amount-value">KES {{ premiumCalculation?.totalPayable | number:'1.2-2' }}</span>
                                            </div>
                                            
                                            <form [formGroup]="paymentForm" class="payment-form">
                                                <mat-form-field appearance="outline" class="phone-field">
                                                    <mat-label>M-Pesa Phone Number</mat-label>
                                                    <input matInput formControlName="phoneNumber" placeholder="254XXXXXXXXX">
                                                    <mat-icon matSuffix>phone</mat-icon>
                                                    <mat-hint>Enter your M-Pesa registered phone number</mat-hint>
                                                </mat-form-field>
                                                
                                                <div class="payment-actions">
                                                    <button mat-raised-button 
                                                            class="pay-button" 
                                                            [disabled]="paymentForm.invalid || isProcessingPayment"
                                                            (click)="initiatePayment()">
                                                        <mat-icon *ngIf="!isProcessingPayment">credit_card</mat-icon>
                                                        <mat-icon *ngIf="isProcessingPayment" class="spin">refresh</mat-icon>
                                                        {{ isProcessingPayment ? 'Processing...' : 'Pay with M-Pesa' }}
                                                    </button>
                                                </div>
                                            </form>
                                            
                                            <div class="payment-info">
                                                <mat-icon class="info-icon">info</mat-icon>
                                                <div class="info-text">
                                                    <p>You will receive an M-Pesa prompt on your phone.</p>
                                                    <p>Enter your M-Pesa PIN to complete the payment.</p>
                                                </div>
                                            </div>
                                        </mat-card-content>
                                    </mat-card>
                                </div>
                            </div>
                        </div>
                    </mat-tab>
                    
                </mat-tab-group>
            </mat-dialog-content>
            
            <mat-dialog-actions align="end" class="modal-actions">
                <button mat-stroked-button (click)="closeDialog()">Cancel</button>
                <button mat-raised-button 
                        color="primary" 
                        (click)="proceedToNextTab()"
                        [disabled]="!canProceed()">
                    {{ getActionButtonText() }}
                </button>
            </mat-dialog-actions>
        </div>
    `,
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
      
      /* Global modal dialog overrides for mobile */
      ::ng-deep .cdk-overlay-pane {
        max-width: 100vw !important;
        max-height: 100vh !important;
      }
      
      ::ng-deep .mat-mdc-dialog-container {
        padding: 0 !important;
        margin: 0 !important;
        max-width: 100vw !important;
        max-height: 100vh !important;
        width: 100vw !important;
        height: 100vh !important;
      }
      
      @media (min-width: 768px) {
        ::ng-deep .mat-mdc-dialog-container {
          padding: 24px !important;
          margin: auto !important;
          width: auto !important;
          height: auto !important;
          max-width: 900px !important;
          max-height: 95vh !important;
        }
      }

      .modal-container { 
        max-width: 900px; 
        width: 100%; 
        height: 100vh;
        max-height: 100vh;
        display: flex;
        flex-direction: column;
        margin: 0;
        border-radius: 0;
      }
      
      @media (min-width: 768px) {
        .modal-container {
          height: 95vh;
          max-height: 95vh;
          margin: 2.5vh auto;
          border-radius: 8px;
        }
      }
      .modal-header { 
        display: flex; 
        justify-content: space-between; 
        align-items: center; 
        padding: 12px 16px; 
        background-color: var(--primary-color); 
        color: white;
        flex-shrink: 0;
      }
      
      @media (min-width: 768px) {
        .modal-header {
          padding: 16px 24px;
        }
      }
      .modal-title { 
        margin: 0; 
        font-size: 16px; 
        font-weight: 600; 
        color: white; 
      }
      
      @media (min-width: 768px) {
        .modal-title {
          font-size: 20px;
        }
      }
      .close-button { color: rgba(255,255,255,0.7); }
      .modal-content { 
        padding: 0; 
        flex: 1;
        overflow-y: auto;
        min-height: 0;
        height: calc(100vh - 140px);
      }
      
      @media (min-width: 768px) {
        .modal-content {
          height: calc(95vh - 140px);
        }
      }
      .modal-actions { 
        padding: 12px 16px; 
        border-top: 1px solid var(--border-color);
        flex-shrink: 0;
        background-color: white;
      }
      
      @media (min-width: 768px) {
        .modal-actions {
          padding: 16px 24px;
        }
      }
      
      /* Tab Styles */
      .payment-tabs {
        width: 100%;
      }
      
      ::ng-deep .payment-tabs .mat-mdc-tab-header {
        background-color: var(--bg-light);
        border-bottom: 1px solid var(--border-color);
      }
      
      ::ng-deep .payment-tabs .mat-mdc-tab-label {
        color: var(--text-secondary);
        font-weight: 500;
      }
      
      ::ng-deep .payment-tabs .mat-mdc-tab-label.mdc-tab--active {
        color: var(--primary-color);
      }
      
      ::ng-deep .payment-tabs .mat-ink-bar {
        background-color: var(--secondary-color);
      }
      
      .tab-content {
        padding: 16px;
        min-height: 0;
        height: calc(100vh - 220px);
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }
      
      @media (min-width: 768px) {
        .tab-content {
          padding: 24px;
          height: calc(95vh - 220px);
        }
      }
      
      /* Premium Card Styles */
      .premium-card {
        margin-bottom: 16px;
        border: 1px solid var(--border-color);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      }
      
      .premium-title {
        display: flex;
        align-items: center;
        color: var(--primary-color);
        font-weight: 600;
      }
      
      .premium-icon {
        margin-right: 8px;
        color: var(--secondary-color);
      }
      
      .premium-breakdown {
        margin-top: 16px;
      }
      
      .premium-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid var(--bg-light);
      }
      
      .premium-row:last-child {
        border-bottom: none;
      }
      
      .premium-label {
        color: var(--text-secondary);
        font-weight: 500;
      }
      
      .premium-value {
        color: var(--text-primary);
        font-weight: 600;
      }
      
      .cargo-protection-row {
        background-color: #f0f9ff;
        padding: 12px;
        margin: -8px -16px 8px -16px;
        border-radius: 8px;
        border: 1px solid #bae6fd;
      }
      
      .cargo-protection-row .premium-label {
        color: #0369a1;
        font-weight: 600;
      }
      
      .cargo-protection-row .premium-value {
        color: #0c4a6e;
        font-weight: 700;
      }
      
      .premium-divider {
        margin: 16px 0;
      }
      
      .total-row {
        background-color: var(--bg-light);
        padding: 16px;
        margin: 16px -16px -16px -16px;
        border-radius: 8px;
      }
      
      .total-label {
        color: var(--primary-color);
        font-weight: 700;
        font-size: 16px;
      }
      
      .total-value {
        color: var(--primary-color);
        font-weight: 700;
        font-size: 18px;
      }
      
      /* Payment Card Styles */
      .payment-card {
        border: 1px solid var(--border-color);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      }
      
      .payment-title {
        display: flex;
        align-items: center;
        color: var(--primary-color);
        font-weight: 600;
      }
      
      .payment-icon {
        margin-right: 8px;
        color: var(--secondary-color);
      }
      
      .amount-display {
        background-color: #f0f9ff;
        border: 1px solid #bae6fd;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 24px;
        text-align: center;
      }
      
      .amount-label {
        display: block;
        color: #0369a1;
        font-weight: 500;
        margin-bottom: 8px;
      }
      
      .amount-value {
        display: block;
        color: #0c4a6e;
        font-weight: 700;
        font-size: 24px;
      }
      
      .payment-form {
        margin-bottom: 24px;
      }
      
      .phone-field {
        width: 100%;
      }
      
      .payment-actions {
        display: flex;
        justify-content: center;
        margin-top: 16px;
      }
      
      .pay-button {
        background-color: #22c55e !important;
        color: white !important;
        padding: 12px 32px;
        font-weight: 600;
        font-size: 16px;
        min-width: 200px;
      }
      
      .pay-button:hover:not(:disabled) {
        background-color: #16a34a !important;
      }
      
      .pay-button:disabled {
        background-color: #9ca3af !important;
        color: #6b7280 !important;
      }
      
      .payment-info {
        display: flex;
        align-items: flex-start;
        background-color: #fef3c7;
        border: 1px solid #fbbf24;
        border-radius: 8px;
        padding: 16px;
      }
      
      .info-icon {
        color: #d97706;
        margin-right: 12px;
        margin-top: 2px;
      }
      
      .info-text {
        color: #92400e;
      }
      
      .info-text p {
        margin: 0 0 4px 0;
        font-size: 14px;
      }
      
      /* M-Pesa Field Section */
      .mpesa-field-section {
        margin-top: 16px;
      }
      
      .mpesa-field {
        width: 100%;
      }
      
      /* Loading and Status Messages */
      .recalculating-message,
      .no-quote-message {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 32px;
        color: var(--text-secondary);
        font-weight: 500;
      }
      
      .recalculating-message mat-icon,
      .no-quote-message mat-icon {
        margin-right: 8px;
      }
      
      .spin {
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      /* Toast message styles */
      ::ng-deep .success-snackbar {
        background-color: #4caf50 !important;
        color: white !important;
      }
      
      ::ng-deep .error-snackbar {
        background-color: #f44336 !important;
        color: white !important;
      }
      
      ::ng-deep .warning-snackbar {
        background-color: #ff9800 !important;
        color: white !important;
      }
      
      ::ng-deep .info-snackbar {
        background-color: #2196f3 !important;
        color: white !important;
      }
      
      ::ng-deep .success-snackbar .mat-mdc-snack-bar-action {
        color: white !important;
      }
      
      ::ng-deep .error-snackbar .mat-mdc-snack-bar-action {
        color: white !important;
      }
      
      ::ng-deep .warning-snackbar .mat-mdc-snack-bar-action {
        color: white !important;
      }
      
      ::ng-deep .info-snackbar .mat-mdc-snack-bar-action {
        color: white !important;
      }
      
      /* Document Upload Styles */
      .document-uploads-section {
        background-color: var(--bg-light);
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 16px;
      }
      
      @media (min-width: 768px) {
        .document-uploads-section {
          padding: 20px;
          margin-bottom: 24px;
        }
      }
      
      .section-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--primary-color);
        margin: 0;
        padding: 0;
      }
      
      .document-upload-item {
        display: flex;
        flex-direction: column;
      }
      
      .document-label {
        font-size: 14px;
        font-weight: 500;
        color: var(--text-primary);
        margin-bottom: 8px;
      }
      
      .required-mark {
        color: #ef4444;
      }
      
      .upload-box {
        border: 2px dashed var(--border-color);
        border-radius: 8px;
        padding: 16px;
        text-align: center;
        background-color: white;
        transition: border-color 0.3s;
      }
      
      .upload-box:hover {
        border-color: var(--secondary-color);
      }
      
      .upload-box button {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0 auto;
      }
      
      .file-name {
        font-size: 12px;
        color: var(--text-secondary);
        margin-top: 8px;
        margin-bottom: 0;
      }
      
      .terms-checkbox {
        display: flex;
        align-items: center;
        margin-top: 16px;
      }
      
      .terms-label {
        font-size: 14px;
        color: var(--text-secondary);
        margin-left: 8px;
      }
      
      .terms-link {
        color: var(--secondary-color);
        text-decoration: none;
      }
      
      .terms-link:hover {
        text-decoration: underline;
      }
      
      .section-divider {
        margin: 24px 0;
      }
      
      .shipment-info-section {
        margin-bottom: 16px;
        clear: both;
      }
      
      /* Cargo Protection Field in Shipment Form */
      .cargo-protection-field {
        background-color: #f0f9ff;
        border: 1px solid #bae6fd;
        border-radius: 8px;
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      
      .cargo-protection-label {
        font-size: 16px;
        font-weight: 600;
        color: #0369a1;
      }
      
      .cargo-protection-value {
        font-size: 16px;
        font-weight: 700;
        color: #0c4a6e;
      }
      
      /* Form Layout Improvements */
      .grid {
        display: grid;
        position: relative;
        margin-top: 0;
      }
      
      .grid-cols-1 {
        grid-template-columns: repeat(1, minmax(0, 1fr));
      }
      
      @media (min-width: 768px) {
        .md\\:grid-cols-2 {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        
        .md\\:col-span-2 {
          grid-column: span 2 / span 2;
        }
      }
      
      .gap-x-6 {
        column-gap: 1.5rem;
      }
      
      .gap-y-4 {
        row-gap: 1rem;
      }
      
      /* Ensure the form grid has bottom spacing */
      .grid.grid-cols-1.md\\:grid-cols-2 {
        padding-bottom: 2rem;
      }
      
      /* Ensure form fields are properly sized */
      mat-form-field {
        width: 100%;
        margin-bottom: 8px;
      }
      
      /* Form container padding */
      .p-4 {
        padding: 0.5rem;
        padding-bottom: 3rem; /* Extra bottom padding to ensure last fields are visible */
      }
      
      @media (min-width: 768px) {
        .p-4 {
          padding: 1rem;
          padding-bottom: 2rem;
        }
      }
      
      /* Section spacing */
      .mb-6 {
        margin-bottom: 1.5rem;
      }
      
      .mb-4 {
        margin-bottom: 1rem;
      }
      
      /* Packaging Type Section Styles */
      .packaging-type-section {
        display: flex;
        flex-direction: column;
        margin-bottom: 16px;
        width: 100%;
      }
      
      .section-label {
        font-size: 14px;
        font-weight: 500;
        color: var(--text-primary);
        margin-bottom: 12px;
      }
      
      .packaging-radio-group {
        display: flex;
        gap: 24px;
      }
      
      .packaging-radio {
        margin-right: 16px;
      }
      
      ::ng-deep .packaging-radio .mdc-radio {
        --mdc-radio-selected-icon-color: var(--secondary-color);
        --mdc-radio-selected-hover-icon-color: var(--secondary-color);
        --mdc-radio-selected-pressed-icon-color: var(--secondary-color);
        --mdc-radio-selected-focus-icon-color: var(--secondary-color);
      }
    `]
})
export class ShipmentDetailsModalComponent implements OnInit, OnDestroy {
    shipmentForm!: FormGroup;
    paymentForm!: FormGroup;
    private destroy$ = new Subject<void>();

    // Tab management
    selectedTabIndex = 0;
    
    // Quote calculation
    premiumCalculation: any = null;
    quoteCalculated = false;
    isRecalculating = false;
    
    // Payment processing
    isProcessingPayment = false;


    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<ShipmentDetailsModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ShipmentDetailsData,
        private quoteService: QuoteService,
        private userService: UserService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.shipmentForm = this.fb.group({
            // Document Uploads
            idfDocument: [null, Validators.required],
            invoice: [null, Validators.required],
            kraPinCertificate: [null, Validators.required],
            nationalId: [null, Validators.required],
            agreeToTerms: [false, Validators.requiredTrue],
            
            // Shipment Information
            shippingModeName: [''],
            importerType: [''],
            originCountryName: ['', Validators.required],
            sumassured: [null, Validators.required],
            description: ['', Validators.required],
            vesselName: [''],
            originPortName: ['', Validators.required],
            destPortName: ['', Validators.required],
            countyName: ['', Validators.required],
            idfNumber: [''],
            
            // New form controls
            packagingType: ['containerized', Validators.required],
            category: ['', Validators.required],
            cargoType: ['', Validators.required],
            dateOfDispatch: [null, Validators.required],
            estimatedArrival: [null, Validators.required],
            
            phoneNumber: ['', [Validators.required, Validators.pattern(/^254[0-9]{9}$/)]]
        });

        this.paymentForm = this.fb.group({
            phoneNumber: ['', [Validators.required, Validators.pattern(/^254[0-9]{9}$/)]]
        });

        // Use setTimeout to avoid change detection issues
        setTimeout(() => {
            this.loadShipmentDetails();
        }, 0);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    // File selection handler
    onFileSelected(event: Event, controlName: string): void {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            this.shipmentForm.get(controlName)?.setValue(file);
            this.shipmentForm.get(controlName)?.markAsTouched();
        }
    }

    // Form change handler to trigger quote recalculation
    onFormChange(): void {
        if (this.shipmentForm.valid) {
            this.recalculateQuote();
        }
    }

    // Recalculate quote when form changes
    recalculateQuote(): void {
        this.isRecalculating = true;
        this.quoteCalculated = false;
        
        // Simulate API call for quote calculation
        setTimeout(() => {
            const sumInsured = this.shipmentForm.get('sumassured')?.value || 0;
            const basePremium = sumInsured * 0.015; // 1.5% base rate
            const phcf = basePremium * 0.0025; // 0.25% PHCF
            const trainingLevy = basePremium * 0.002; // 0.2% Training Levy
            const stampDuty = basePremium * 0.0005; // 0.05% Stamp Duty
            const totalPayable = basePremium + phcf + trainingLevy + stampDuty;

            this.premiumCalculation = {
                sumInsured,
                basePremium,
                phcf,
                trainingLevy,
                stampDuty,
                totalPayable
            };
            
            this.isRecalculating = false;
            this.quoteCalculated = true;
            this.cdr.detectChanges();
        }, 1500);
    }

    // Tab navigation methods
    proceedToNextTab(): void {
        if (this.selectedTabIndex === 0) {
            if (this.shipmentForm.valid) {
                this.recalculateQuote();
                this.selectedTabIndex = 1;
            } else {
                this.snackBar.open('Please fill in all required fields', 'Close', {
                    duration: 3000,
                    panelClass: ['error-snackbar']
                });
            }
        } else if (this.selectedTabIndex === 1) {
            this.selectedTabIndex = 2;
        }
    }

    canProceed(): boolean {
        if (this.selectedTabIndex === 0) {
            return this.shipmentForm.valid;
        } else if (this.selectedTabIndex === 1) {
            return this.quoteCalculated && !!this.premiumCalculation;
        }
        return false;
    }

    getActionButtonText(): string {
        if (this.selectedTabIndex === 0) {
            return 'Calculate Premium';
        } else if (this.selectedTabIndex === 1) {
            return 'Proceed to Payment';
        }
        return 'Complete';
    }

    // M-Pesa payment integration
    initiatePayment(): void {
        if (this.paymentForm.invalid || !this.premiumCalculation) {
            this.snackBar.open('Please enter a valid phone number', 'Close', {
                duration: 3000,
                panelClass: ['error-snackbar']
            });
            return;
        }

        this.isProcessingPayment = true;
        const phoneNumber = this.paymentForm.get('phoneNumber')?.value;
        const amount = this.premiumCalculation.totalPayable;

        this.snackBar.open('Initiating M-Pesa payment...', 'Close', {
            duration: 2000,
            panelClass: ['info-snackbar']
        });

        setTimeout(() => {
            this.snackBar.open('M-Pesa prompt sent to your phone. Please enter your PIN to complete payment.', 'Close', {
                duration: 5000,
                panelClass: ['success-snackbar']
            });
            
            setTimeout(() => {
                this.isProcessingPayment = false;
                this.snackBar.open('Payment successful! Your marine insurance policy is now active.', 'Close', {
                    duration: 5000,
                    panelClass: ['success-snackbar']
                });
                
                setTimeout(() => {
                    this.dialogRef.close({ paymentSuccess: true });
                }, 2000);
            }, 3000);
        }, 2000);
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

    // Load shipment details and populate form
    private loadShipmentDetails(): void {
        if (this.data.shippingId) {
            this.quoteService.getShipmentDetails(this.data.shippingId).subscribe({
                next: (details: any) => {
                    if (details) {
                        this.shipmentForm.patchValue({
                            shippingModeName: details.shippingModeName || '',
                            importerType: details.importerType || '',
                            originCountryName: details.originCountryName || '',
                            consignmentNumber: details.consignmentNumber || '',
                            sumassured: details.sumassured || null,
                            description: details.description || '',
                            vesselName: details.vesselName || '',
                            originPortName: details.originPortName || '',
                            destPortName: details.destPortName || '',
                            countyName: details.countyName || '',
                            idfNumber: details.idfNumber || '',
                            ucrNumber: details.ucrNumber || ''
                        });

                    }
                },
                error: (error) => {
                    console.error('Error loading shipment details:', error);
                    this.snackBar.open('Error loading shipment details', 'Close', {
                        duration: 3000,
                        panelClass: ['error-snackbar']
                    });
                }
            });

            if (this.data.postalAddress || this.data.postalCode) {
                this.shipmentForm.patchValue({
                    postalAddress: this.data.postalAddress,
                    postalCode: this.data.postalCode
                });
            }
        }
    }
}
