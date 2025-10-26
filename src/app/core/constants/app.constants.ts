// Application Constants
export const APP_CONSTANTS = {
    // API Configuration
    API: {
        BASE_URL: 'http://localhost:3000/api',
        TIMEOUT: 30000,
        RETRY_ATTEMPTS: 3,
    },

    // Storage Keys
    STORAGE_KEYS: {
        USER_TOKEN: 'user_token',
        USER_DATA: 'user_data',
        THEME_PREFERENCE: 'theme_preference',
        LANGUAGE_PREFERENCE: 'language_preference',
        PENDING_QUOTES: 'pending_quotes',
        MARINE_QUOTE_DRAFT: 'marine_quote_draft',
        TRAVEL_QUOTE_DRAFT: 'travel_quote_draft',
    },

    // Pagination
    PAGINATION: {
        DEFAULT_PAGE_SIZE: 10,
        PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100],
        MAX_PAGE_SIZE: 100,
    },

    // Validation
    VALIDATION: {
        MIN_PASSWORD_LENGTH: 8,
        MAX_PASSWORD_LENGTH: 128,
        MIN_USERNAME_LENGTH: 3,
        MAX_USERNAME_LENGTH: 50,
        MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
        ALLOWED_FILE_TYPES: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
    },

    // UI Configuration
    UI: {
        DEBOUNCE_TIME: 300,
        NOTIFICATION_DURATION: 5000,
        LOADING_DELAY: 500,
        ANIMATION_DURATION: 300,
    },

    // Date Formats
    DATE_FORMATS: {
        DISPLAY: 'DD/MM/YYYY',
        API: 'YYYY-MM-DD',
        DATETIME: 'DD/MM/YYYY HH:mm',
        TIME: 'HH:mm',
    },

    // Currency
    CURRENCY: {
        DEFAULT: 'USD',
        SUPPORTED: ['USD', 'EUR', 'GBP', 'KES', 'UGX', 'TZS'],
        DECIMAL_PLACES: 2,
    },

    // Quote Configuration
    QUOTES: {
        EXPIRY_DAYS: 30,
        MAX_ITEMS_PER_QUOTE: 50,
        MIN_SUM_ASSURED: 1000,
        MAX_SUM_ASSURED: 10000000,
    },

    // Marine Cargo Specific
    MARINE_CARGO: {
        SHIPPING_MODES: [
            { id: 1, name: 'Sea Freight' },
            { id: 2, name: 'Air Freight' },
            { id: 3, name: 'Road Transport' },
            { id: 4, name: 'Rail Transport' },
        ],
        IMPORTER_TYPES: [
            { id: 1, name: 'Individual' },
            { id: 2, name: 'Company' },
            { id: 3, name: 'Government' },
        ],
        COVERAGE_TYPES: [
            { id: 1, name: 'Institute Cargo Clauses A' },
            { id: 2, name: 'Institute Cargo Clauses B' },
            { id: 3, name: 'Institute Cargo Clauses C' },
        ],
    },

    // Travel Insurance Specific
    TRAVEL: {
        TRIP_TYPES: [
            { id: 1, name: 'Single Trip' },
            { id: 2, name: 'Multi Trip' },
            { id: 3, name: 'Annual' },
        ],
        COVERAGE_AREAS: [
            { id: 1, name: 'Worldwide' },
            { id: 2, name: 'Europe' },
            { id: 3, name: 'Africa' },
            { id: 4, name: 'Asia' },
            { id: 5, name: 'Americas' },
        ],
        AGE_GROUPS: [
            { id: 1, name: '0-17', min: 0, max: 17 },
            { id: 2, name: '18-64', min: 18, max: 64 },
            { id: 3, name: '65+', min: 65, max: 120 },
        ],
    },

    // Error Messages
    ERROR_MESSAGES: {
        NETWORK_ERROR: 'Network error. Please check your connection and try again.',
        SERVER_ERROR: 'Server error. Please try again later.',
        VALIDATION_ERROR: 'Please check your input and try again.',
        UNAUTHORIZED: 'You are not authorized to perform this action.',
        SESSION_EXPIRED: 'Your session has expired. Please log in again.',
        FILE_TOO_LARGE: 'File size exceeds the maximum allowed limit.',
        INVALID_FILE_TYPE: 'Invalid file type. Please select a supported file format.',
    },

    // Success Messages
    SUCCESS_MESSAGES: {
        QUOTE_SAVED: 'Quote saved successfully.',
        QUOTE_SUBMITTED: 'Quote submitted successfully.',
        PAYMENT_SUCCESSFUL: 'Payment processed successfully.',
        PROFILE_UPDATED: 'Profile updated successfully.',
        PASSWORD_CHANGED: 'Password changed successfully.',
        FILE_UPLOADED: 'File uploaded successfully.',
    },

    // Routes
    ROUTES: {
        HOME: '/home',
        DASHBOARD: '/dashboard',
        SIGN_IN: '/sign-in',
        SIGN_UP: '/sign-up',
        MARINE_QUOTE: '/marine-quote',
        TRAVEL_QUOTE: '/travel-quote',
        ADMIN: '/admin',
    },

    // Regular Expressions
    REGEX: {
        EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        PHONE: /^[\+]?[1-9][\d]{0,15}$/,
        PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
        NUMERIC: /^\d+$/,
    },
};

// Environment-specific constants
export const ENVIRONMENT_CONSTANTS = {
    PRODUCTION: {
        API_BASE_URL: 'https://api.geminia.com',
        ENABLE_LOGGING: false,
        ENABLE_DEBUG: false,
    },
    DEVELOPMENT: {
        API_BASE_URL: 'http://localhost:3000/api',
        ENABLE_LOGGING: true,
        ENABLE_DEBUG: true,
    },
    STAGING: {
        API_BASE_URL: 'https://staging-api.geminia.com',
        ENABLE_LOGGING: true,
        ENABLE_DEBUG: false,
    },
};
