// Input validation methods to be added to marine-buy-now-modal.component.ts

// First Name validation - trim spaces, capitalize first letter, letters only
onFirstNameInput(event: any): void {
  let value = event.target.value.trim();
  // Remove any non-letter characters
  value = value.replace(/[^a-zA-Z]/g, '');
  // Capitalize first letter and make rest lowercase
  if (value.length > 0) {
    value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
  this.shipmentForm.patchValue({ firstName: value });
}

// Last Name validation - trim spaces, capitalize first letter, letters only
onLastNameInput(event: any): void {
  let value = event.target.value.trim();
  // Remove any non-letter characters
  value = value.replace(/[^a-zA-Z]/g, '');
  // Capitalize first letter and make rest lowercase
  if (value.length > 0) {
    value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
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
