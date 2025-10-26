// Complete validation methods to be added to marine-buy-now-modal.component.ts

// ID Number validation - trim spaces, numbers only, 8 digits
onIdNumberInputNew(event: any): void {
  let value = event.target.value.trim();
  // Remove any non-numeric characters
  value = value.replace(/[^0-9]/g, '');
  // Limit to 8 digits
  if (value.length > 8) {
    value = value.substring(0, 8);
  }
  this.shipmentForm.patchValue({ idNumber: value });
}

// KRA PIN validation - trim spaces, format validation
onKraPinInputNew(event: any): void {
  let value = event.target.value.trim().toUpperCase();
  // Remove any characters that are not alphanumeric
  value = value.replace(/[^A-Z0-9]/g, '');
  // Limit to 11 characters
  if (value.length > 11) {
    value = value.substring(0, 11);
  }
  this.shipmentForm.patchValue({ kraPin: value });
}

// First Name validation - trim spaces, capitalize first letter, letters only
onFirstNameInput(event: any): void {
  let value = event.target.value.trim();
  // Remove any non-letter characters
  value = value.replace(/[^a-zA-Z\s]/g, '');
  // Capitalize first letter of each word
  value = value.replace(/\b\w/g, l => l.toUpperCase());
  this.shipmentForm.patchValue({ firstName: value });
}

// Last Name validation - trim spaces, capitalize first letter, letters only
onLastNameInput(event: any): void {
  let value = event.target.value.trim();
  // Remove any non-letter characters
  value = value.replace(/[^a-zA-Z\s]/g, '');
  // Capitalize first letter of each word
  value = value.replace(/\b\w/g, l => l.toUpperCase());
  this.shipmentForm.patchValue({ lastName: value });
}

// Email validation - trim spaces
onEmailInput(event: any): void {
  const value = event.target.value.trim();
  this.shipmentForm.patchValue({ emailAddress: value });
}

// Phone Number validation - numbers only
onPhoneNumberInput(event: any): void {
  let value = event.target.value.replace(/[^0-9]/g, '');
  this.shipmentForm.patchValue({ phoneNumber: value });
}

// IDF Number validation - trim spaces, format: 24NBOIM000002014
onIdfNumberInputNew(event: any): void {
  let value = event.target.value.trim().toUpperCase();
  // Remove any characters that are not alphanumeric
  value = value.replace(/[^A-Z0-9]/g, '');
  // Limit to 16 characters max
  if (value.length > 16) {
    value = value.substring(0, 16);
  }
  this.shipmentForm.patchValue({ gcrNumber: value });
}

// M-Pesa Number validation - format: 0722123456 or 011123456
onMpesaNumberInput(event: any): void {
  let value = event.target.value.replace(/[^0-9]/g, '');
  
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

// Clear duplicate error method
clearDuplicateError(fieldName: string): void {
  if (this.duplicateFileErrors && this.duplicateFileErrors[fieldName]) {
    delete this.duplicateFileErrors[fieldName];
  }
}

// Additional property that might be needed
duplicateFileErrors: { [key: string]: string } = {};
