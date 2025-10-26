// Core Interfaces and Types
// This file provides centralized type definitions for the application

// Base interfaces
export interface BaseEntity {
    id: string | number;
    createdAt?: Date;
    updatedAt?: Date;
}

// User related interfaces
export interface User extends BaseEntity {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    avatar?: string;
    role: UserRole;
    isActive: boolean;
    lastLoginAt?: Date;
}

export interface StoredUser {
    id: string | number;
    email: string;
    firstName: string;
    lastName: string;
    token: string;
    role: UserRole;
}

export type UserRole = 'admin' | 'user' | 'agent' | 'underwriter';

// Authentication interfaces
export interface LoginRequest {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface LoginResponse {
    user: StoredUser;
    token: string;
    refreshToken?: string;
    expiresIn: number;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
}

// Quote related interfaces
export interface BaseQuote extends BaseEntity {
    quoteNumber: string;
    status: QuoteStatus;
    expiryDate: Date;
    totalPremium: number;
    currency: string;
    userId: string | number;
    createdBy: string;
}

export type QuoteStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'expired' | 'converted';

// Marine Cargo Quote interfaces
export interface MarineCargoQuote extends BaseQuote {
    type: 'marine_cargo';
    sumAssured: number;
    commodityDescription: string;
    packingMethod: string;
    conveyance: string;
    voyageFrom: string;
    voyageTo: string;
    transitType: TransitType;
    coverageType: CoverageType;
    deductible: number;
    vesselName?: string;
    voyageNumber?: string;
    billOfLadingNumber?: string;
    invoiceValue: number;
    freightValue?: number;
    insuranceValue: number;
}

export type TransitType = 'sea' | 'air' | 'road' | 'rail' | 'multimodal';
export type CoverageType = 'icc_a' | 'icc_b' | 'icc_c' | 'custom';

// Travel Quote interfaces
export interface TravelQuote extends BaseQuote {
    type: 'travel';
    tripType: TripType;
    destination: string;
    departureDate: Date;
    returnDate?: Date;
    numberOfTravellers: number;
    travellers: Traveller[];
    coverageArea: string;
    coverageLevel: CoverageLevel;
    medicalCoverLimit: number;
    emergencyEvacuationLimit: number;
    personalAccidentLimit: number;
}

export type TripType = 'single' | 'multi' | 'annual';
export type CoverageLevel = 'basic' | 'standard' | 'premium' | 'comprehensive';

export interface Traveller {
    id?: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    age: number;
    gender: 'male' | 'female' | 'other';
    passportNumber?: string;
    nationality: string;
    preExistingConditions?: string[];
    relationshipToMainInsured: RelationshipType;
}

export type RelationshipType = 'self' | 'spouse' | 'child' | 'parent' | 'sibling' | 'other';

// Policy interfaces
export interface Policy extends BaseEntity {
    policyNumber: string;
    quoteId: string | number;
    status: PolicyStatus;
    effectiveDate: Date;
    expiryDate: Date;
    premium: number;
    sumAssured: number;
    currency: string;
    paymentStatus: PaymentStatus;
    documents: PolicyDocument[];
}

export type PolicyStatus = 'active' | 'expired' | 'cancelled' | 'suspended' | 'lapsed';
export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'failed' | 'refunded';

export interface PolicyDocument {
    id: string;
    name: string;
    type: DocumentType;
    url: string;
    uploadedAt: Date;
    size: number;
}

export type DocumentType = 'policy_certificate' | 'invoice' | 'receipt' | 'endorsement' | 'claim_form' | 'other';

// Claim interfaces
export interface Claim extends BaseEntity {
    claimNumber: string;
    policyId: string | number;
    status: ClaimStatus;
    claimAmount: number;
    settledAmount?: number;
    incidentDate: Date;
    reportedDate: Date;
    description: string;
    documents: ClaimDocument[];
    assessorNotes?: string;
    rejectionReason?: string;
}

export type ClaimStatus = 'submitted' | 'under_review' | 'more_info_required' | 'approved' | 'settled' | 'rejected';

export interface ClaimDocument {
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: Date;
    size: number;
}

// Payment interfaces
export interface Payment extends BaseEntity {
    paymentReference: string;
    quoteId?: string | number;
    policyId?: string | number;
    amount: number;
    currency: string;
    method: PaymentMethod;
    status: PaymentStatus;
    transactionId?: string;
    gatewayResponse?: any;
    paidAt?: Date;
}

export type PaymentMethod = 'mpesa' | 'card' | 'bank_transfer' | 'cash' | 'cheque';

// API Response interfaces
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    errors?: ValidationError[];
    pagination?: PaginationInfo;
}

export interface ValidationError {
    field: string;
    message: string;
    code?: string;
}

export interface PaginationInfo {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

// Form interfaces
export interface FormField {
    name: string;
    label: string;
    type: FormFieldType;
    required: boolean;
    placeholder?: string;
    options?: SelectOption[];
    validation?: ValidationRule[];
}

export type FormFieldType = 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'file';

export interface SelectOption {
    value: any;
    label: string;
    disabled?: boolean;
}

export interface ValidationRule {
    type: ValidationType;
    value?: any;
    message: string;
}

export type ValidationType = 'required' | 'minLength' | 'maxLength' | 'min' | 'max' | 'pattern' | 'email' | 'custom';

// Notification interfaces
export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    actionUrl?: string;
    actionText?: string;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

// Dashboard interfaces
export interface DashboardStats {
    totalQuotes: number;
    activeQuotes: number;
    expiredQuotes: number;
    totalPolicies: number;
    activePolicies: number;
    totalClaims: number;
    pendingClaims: number;
    settledClaims: number;
    totalPremium: number;
    monthlyPremium: number;
}

// Search and Filter interfaces
export interface SearchCriteria {
    query?: string;
    filters?: FilterCriteria[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
}

export interface FilterCriteria {
    field: string;
    operator: FilterOperator;
    value: any;
}

export type FilterOperator = 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'between' | 'in';

// Configuration interfaces
export interface AppConfig {
    apiBaseUrl: string;
    enableLogging: boolean;
    enableDebug: boolean;
    defaultLanguage: string;
    supportedLanguages: string[];
    defaultCurrency: string;
    supportedCurrencies: string[];
    maxFileSize: number;
    allowedFileTypes: string[];
}

// Utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Event interfaces
export interface AppEvent<T = any> {
    type: string;
    payload?: T;
    timestamp: Date;
    source?: string;
}

// Error interfaces
export interface AppError {
    code: string;
    message: string;
    details?: any;
    timestamp: Date;
    stack?: string;
}
