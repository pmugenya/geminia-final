// Updated input handlers for marine-buy-now-modal.component.ts
// Add these methods to your component class

// ID Number validation - trim spaces, numbers only
onIdNumberInput(event: any): void {
  let value = event.target.value.trim();
  // Remove any non-numeric characters
  value = value.replace(/[^0-9]/g, '');
  // Limit to 10 digits max
  if (value.length > 10) {
    value = value.substring(0, 10);
  }
  this.shipmentForm.patchValue({ idNumber: value });
}

// KRA PIN validation - trim spaces, alphanumeric, uppercase
onKraPinInput(event: any): void {
  let value = event.target.value.trim().toUpperCase();
  // Remove any characters that are not alphanumeric
  value = value.replace(/[^A-Z0-9]/g, '');
  // Limit to 11 characters
  if (value.length > 11) {
    value = value.substring(0, 11);
  }
  this.shipmentForm.patchValue({ kraPin: value });
}

// First Name validation - trim spaces, capitalize first letter, letters only, min 3 chars
onFirstNameInput(event: any): void {
  let value = event.target.value.trim();
  // Remove any non-letter characters
  value = value.replace(/[^a-zA-Z]/g, '');
  // Capitalize first letter
  if (value.length > 0) {
    value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
  this.shipmentForm.patchValue({ firstName: value });
}

// Last Name validation - trim spaces, capitalize first letter, letters only, min 3 chars
onLastNameInput(event: any): void {
  let value = event.target.value.trim();
  // Remove any non-letter characters
  value = value.replace(/[^a-zA-Z]/g, '');
  // Capitalize first letter
  if (value.length > 0) {
    value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
  this.shipmentForm.patchValue({ lastName: value });
}

// Email validation - trim spaces when starting typing
onEmailInput(event: any): void {
  const value = event.target.value.trim();
  this.shipmentForm.patchValue({ emailAddress: value });
}

// Phone Number validation - trim spaces while typing, numbers only
onPhoneNumberInput(event: any): void {
  let value = event.target.value.trim();
  // Remove any non-numeric characters
  value = value.replace(/[^0-9]/g, '');
  // Limit to 10 digits
  if (value.length > 10) {
    value = value.substring(0, 10);
  }
  this.shipmentForm.patchValue({ phoneNumber: value });
}

// Postal Address validation - trim spaces while typing (like ID number field)
onPostalAddressInput(event: any): void {
  const value = event.target.value.trim();
  this.shipmentForm.patchValue({ streetAddress: value });
}

// Postal Code validation - trim spaces while typing (like ID number field)
onPostalCodeInput(event: any): void {
  const value = event.target.value.trim();
  this.shipmentForm.patchValue({ postalCode: value });
}

// IDF Number validation - trim spaces, format validation
onIdfNumberInput(event: any): void {
  let value = event.target.value.trim().toUpperCase();
  // Remove any characters that are not alphanumeric
  value = value.replace(/[^A-Z0-9]/g, '');
  // Limit to 16 characters max
  if (value.length > 16) {
    value = value.substring(0, 16);
  }
  this.shipmentForm.patchValue({ gcrNumber: value });
}

// M-Pesa Number validation - trim spaces while typing (like ID number field)
onMpesaNumberInput(event: any): void {
  let value = event.target.value.trim();
  // Remove any non-numeric characters
  value = value.replace(/[^0-9]/g, '');
  
  // Ensure it starts with 0
  if (value.length > 0 && !value.startsWith('0')) {
    value = '0' + value;
  }
  
  // Limit to 10 characters
  if (value.length > 10) {
    value = value.substring(0, 10);
  }
  
  this.shipmentForm.patchValue({ mpesaNumber: value });
}

// Description of Goods validation - trim spaces, capitalize first letters, minimum 1 word
onDescriptionInput(event: any): void {
  let value = event.target.value.trim();
  
  // Capitalize first letter of each word
  value = value.replace(/\b\w/g, l => l.toUpperCase());
  
  this.shipmentForm.patchValue({ goodsDescription: value });
}

// Custom validators for form initialization
static firstNameValidator(control: any): any {
  const value = control.value;
  if (!value) return null;
  // Check if it's at least 3 characters and contains only letters
  const regex = /^[A-Za-z]{3,}$/;
  return regex.test(value) ? null : { firstName: true };
}

static lastNameValidator(control: any): any {
  const value = control.value;
  if (!value) return null;
  // Check if it's at least 3 characters and contains only letters
  const regex = /^[A-Za-z]{3,}$/;
  return regex.test(value) ? null : { lastName: true };
}

static descriptionValidator(control: any): any {
  const value = control.value;
  if (!value) return null;
  // Check if it contains at least 1 word (minimum 1 character)
  const trimmed = value.trim();
  return trimmed.length >= 1 ? null : { description: true };
}

// Form initialization with validators (update your existing form setup)
initializeFormWithValidators(): void {
  this.shipmentForm = this.fb.group({
    // Client Details
    idNumber: ['', Validators.required],
    kraPin: ['', Validators.required],
    firstName: ['', [Validators.required, YourComponent.firstNameValidator]],
    lastName: ['', [Validators.required, YourComponent.lastNameValidator]],
    emailAddress: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', Validators.required],
    streetAddress: ['', Validators.required],
    postalCode: ['', Validators.required],
    
    // Shipment Details
    gcrNumber: ['', Validators.required],
    vesselName: ['', Validators.required],
    sumInsured: ['', Validators.required],
    goodsDescription: ['', [Validators.required, YourComponent.descriptionValidator]],
    dateOfDispatch: ['', Validators.required],
    estimatedArrival: ['', Validators.required],
    countryOfOrigin: ['', Validators.required],
    loadingPort: ['', Validators.required],
    portOfDischarge: ['', Validators.required],
    finalDestination: ['', Validators.required],
    selectCategory: ['', Validators.required],
    salesCategory: ['', Validators.required],
    
    // Payment
    mpesaNumber: ['', Validators.required],
    
    // Other fields...
    agreeToTerms: [false, Validators.requiredTrue],
    commodityType: [''],
    idfDocument: [''],
    invoice: [''],
    kraPinCertificate: [''],
    nationalId: ['']
  });
}
