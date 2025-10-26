/**
 * API Interfaces
 * TypeScript Best Practice: Use interfaces for all data models
 * 
 * Benefits:
 * - Type safety at compile time
 * - Better IDE autocomplete
 * - Self-documenting code
 * - Easier refactoring
 */

// ============================================================================
// Authentication Interfaces
// ============================================================================

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface LoginResponse {
    tempToken?: string;
    requiresOtp?: boolean;
    message?: string;
    isAdmin?: boolean;
    adminUser?: AdminUser;
    accessToken?: string;
    base64EncodedAuthenticationKey?: string;
    token?: string;
}

export interface OtpVerificationRequest {
    tempToken: string;
    otp: string;
}

export interface OtpVerificationResponse {
    accessToken: string;
    base64EncodedAuthenticationKey?: string;
    token?: string;
    user?: User;
}

export interface AdminUser {
    username: string;
    name: string;
    email: string;
    role: string;
}

// ============================================================================
// User Interfaces
// ============================================================================

export interface User {
    username: string;
    name: string;
    email: string;
    userType: 'I' | 'A' | 'C'; // Individual, Admin, Corporate
    loginTime: number;
    phoneNumber?: string;
    avatar?: string;
    status?: string;
}

export interface StoredUser {
    username: string;
    userType: 'I' | 'A';
    loginTime: number;
    name: string;
    email: string;
    phoneNumber?: string;
}

export interface RegistrationData {
    accountType: 'C' | 'A'; // Customer, Agent
    fullName: string;
    email: string;
    kraPin: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
    iraNumber?: string;
    pinNumber?: string;
    agreementAccepted: boolean;
}

export interface StoredCredentials {
    username: string;
    password: string;
    type: 'individual' | 'intermediary';
}

// ============================================================================
// Quote Interfaces
// ============================================================================

export interface Quote {
    quoteId: number;
    shippingmodeId: number;
    id: string;
    prodName: string;
    phoneNo: string;
    refno: string;
    status: string;
    createDate: string;
    description: string | null;
    pinNumber: string;
    idNumber: string;
    originCountry: string | null;
    sumassured: number;
    netprem: number;
}

export interface PendingQuote extends Quote {
    // Additional fields specific to pending quotes
}

export interface MarineQuote {
    id?: number;
    customerName: string;
    email: string;
    phoneNumber: string;
    cargoType: string;
    cargoValue: number;
    originPort: string;
    destinationPort: string;
    shippingMode: 'sea' | 'air';
    estimatedPremium?: number;
    status: 'pending' | 'approved' | 'rejected';
    createdAt?: Date;
    updatedAt?: Date;
}

export interface TravelQuote {
    id?: number;
    customerName: string;
    email: string;
    phoneNumber: string;
    destination: string;
    departureDate: Date;
    returnDate: Date;
    numberOfTravelers: number;
    coverageType: 'basic' | 'comprehensive' | 'premium';
    estimatedPremium?: number;
    status: 'pending' | 'approved' | 'rejected';
    createdAt?: Date;
    updatedAt?: Date;
}

// ============================================================================
// Port & Location Interfaces
// ============================================================================

export interface Port {
    id: number;
    portName: string;
    country?: string;
    code?: string;
}

export interface PortData {
    id: number;
    portName: string;
}

export interface Country {
    id: number;
    name: string;
    code: string;
    flag?: string;
}

// ============================================================================
// API Response Interfaces
// ============================================================================

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    errors?: ApiError[];
}

export interface ApiError {
    field?: string;
    message: string;
    code?: string;
    developerMessage?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// ============================================================================
// Form Interfaces
// ============================================================================

export interface FormValidationError {
    field: string;
    message: string;
    code: string;
}

export interface FormSubmitResult {
    success: boolean;
    message?: string;
    data?: unknown;
    errors?: FormValidationError[];
}

// ============================================================================
// Alert & Notification Interfaces
// ============================================================================

export interface Alert {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    position?: 'inline' | 'bottom' | 'top';
    duration?: number;
    dismissible?: boolean;
}

export interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    action?: NotificationAction;
}

export interface NotificationAction {
    label: string;
    callback: () => void;
}

// ============================================================================
// Payment Interfaces
// ============================================================================

export interface Payment {
    id: string;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    method: 'mpesa' | 'card' | 'bank_transfer';
    transactionId?: string;
    createdAt: Date;
    completedAt?: Date;
}

export interface PaymentRequest {
    amount: number;
    currency: string;
    method: 'mpesa' | 'card' | 'bank_transfer';
    phoneNumber?: string;
    cardDetails?: CardDetails;
}

export interface CardDetails {
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    cardholderName: string;
}

// ============================================================================
// Dashboard Interfaces
// ============================================================================

export interface DashboardStats {
    totalQuotes: number;
    pendingQuotes: number;
    approvedQuotes: number;
    totalPremium: number;
    recentQuotes: Quote[];
}

export interface DashboardWidget {
    id: string;
    title: string;
    type: 'chart' | 'stat' | 'list' | 'table';
    data: unknown;
    position: { x: number; y: number; w: number; h: number };
}

// ============================================================================
// File Upload Interfaces
// ============================================================================

export interface FileUpload {
    file: File;
    progress: number;
    status: 'pending' | 'uploading' | 'completed' | 'failed';
    url?: string;
    error?: string;
}

export interface FileUploadResponse {
    success: boolean;
    url?: string;
    filename?: string;
    size?: number;
    error?: string;
}

// ============================================================================
// Search & Filter Interfaces
// ============================================================================

export interface SearchCriteria {
    query?: string;
    filters?: Record<string, unknown>;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
}

export interface FilterOption {
    label: string;
    value: string | number;
    count?: number;
}

// ============================================================================
// Configuration Interfaces
// ============================================================================

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

export interface EnvironmentConfig {
    production: boolean;
    apiUrl: string;
    apiTimeout: number;
    maxFileSize: number;
    allowedFileTypes: string[];
    sessionTimeout: number;
    enableLogging: boolean;
    enableDebug: boolean;
    supportedCurrencies: string[];
    supportedLanguages: string[];
    defaultLanguage: string;
    defaultCurrency: string;
    itemsPerPage: number;
    maxRetryAttempts: number;
    retryDelay: number;
    cacheExpiration: number;
}

// ============================================================================
// HTTP Interfaces
// ============================================================================

export interface HttpRequestOptions {
    headers?: Record<string, string>;
    params?: Record<string, string | number | boolean>;
    timeout?: number;
    retries?: number;
}

export interface HttpError {
    status: number;
    statusText: string;
    message: string;
    url?: string;
    error?: unknown;
}

// ============================================================================
// State Management Interfaces
// ============================================================================

export interface AppState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface LoadingState {
    [key: string]: boolean;
}

export interface ErrorState {
    [key: string]: string | null;
}

// ============================================================================
// Type Guards
// ============================================================================

export function isLoginResponse(obj: unknown): obj is LoginResponse {
    return typeof obj === 'object' && obj !== null && 
           ('tempToken' in obj || 'accessToken' in obj || 'isAdmin' in obj);
}

export function isApiError(obj: unknown): obj is ApiError {
    return typeof obj === 'object' && obj !== null && 'message' in obj;
}

export function isUser(obj: unknown): obj is User {
    return typeof obj === 'object' && obj !== null && 
           'username' in obj && 'email' in obj && 'userType' in obj;
}
