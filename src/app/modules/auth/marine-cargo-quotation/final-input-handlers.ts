// Final complete input handlers for marine-buy-now-modal.component.ts
// Copy these methods into your component class

// ID Number - trim spaces, numbers only
onIdNumberInput(event: any): void {
  let value = event.target.value.trim();
  value = value.replace(/[^0-9]/g, '');
  if (value.length > 10) {
    value = value.substring(0, 10);
  }
  this.shipmentForm.patchValue({ idNumber: value });
}

// KRA PIN - trim spaces, alphanumeric, uppercase
onKraPinInput(event: any): void {
  let value = event.target.value.trim().toUpperCase();
  value = value.replace(/[^A-Z0-9]/g, '');
  if (value.length > 11) {
    value = value.substring(0, 11);
  }
  this.shipmentForm.patchValue({ kraPin: value });
}

// First Name - trim spaces, auto-capitalize first letter, letters only, min 3 chars
onFirstNameInput(event: any): void {
  let value = event.target.value.trim();
  value = value.replace(/[^a-zA-Z]/g, '');
  if (value.length > 0) {
    value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
  this.shipmentForm.patchValue({ firstName: value });
}

// Last Name - trim spaces, auto-capitalize first letter, letters only, min 3 chars
onLastNameInput(event: any): void {
  let value = event.target.value.trim();
  value = value.replace(/[^a-zA-Z]/g, '');
  if (value.length > 0) {
    value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
  this.shipmentForm.patchValue({ lastName: value });
}

// Email - trim spaces when starting typing
onEmailInput(event: any): void {
  const value = event.target.value.trim();
  this.shipmentForm.patchValue({ emailAddress: value });
}

// Phone Number - trim spaces while typing, numbers only
onPhoneNumberInput(event: any): void {
  let value = event.target.value.trim();
  value = value.replace(/[^0-9]/g, '');
  if (value.length > 10) {
    value = value.substring(0, 10);
  }
  this.shipmentForm.patchValue({ phoneNumber: value });
}

// Postal Address - trim spaces while typing (like ID number field)
onPostalAddressInput(event: any): void {
  const value = event.target.value.trim();
  this.shipmentForm.patchValue({ streetAddress: value });
}

// Postal Code - trim spaces while typing (like ID number field)
onPostalCodeInput(event: any): void {
  const value = event.target.value.trim();
  this.shipmentForm.patchValue({ postalCode: value });
}

// IDF Number - trim spaces, format validation
onIdfNumberInput(event: any): void {
  let value = event.target.value.trim().toUpperCase();
  value = value.replace(/[^A-Z0-9]/g, '');
  if (value.length > 16) {
    value = value.substring(0, 16);
  }
  this.shipmentForm.patchValue({ gcrNumber: value });
}

// M-Pesa Number - trim spaces while typing (like ID number field)
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

// Description of Goods - trim spaces, auto-capitalize first letters, minimum 1 word
onDescriptionInput(event: any): void {
  let value = event.target.value.trim();
  // Capitalize first letter of each word
  value = value.replace(/\b\w/g, l => l.toUpperCase());
  this.shipmentForm.patchValue({ goodsDescription: value });
}
