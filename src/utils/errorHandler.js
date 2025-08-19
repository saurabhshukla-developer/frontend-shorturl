/**
 * Frontend error handling utility
 * Works with standardized backend error responses
 */

/**
 * Process standardized error responses and categorize them
 * @param {Object} error - Error object from backend
 * @returns {Object} Processed error with categorization
 */
export const processError = (error) => {
  // Handle structured errors from standardized backend responses
  if (error.type) {
    return {
      type: error.type,
      message: error.message,
      details: error.details,
      statusCode: error.statusCode,
      isFieldError: error.isFieldError,
      fieldErrors: error.fieldErrors || [],
      category: categorizeError(error.type)
    };
  }
  
  // Handle legacy error format (fallback)
  return {
    type: 'LEGACY_ERROR',
    message: error.message,
    category: 'GENERAL',
    isFieldError: false,
    fieldErrors: []
  };
};

/**
 * Categorize errors for frontend display logic
 * @param {string} errorType - Error type from backend
 * @returns {string} Error category
 */
export const categorizeError = (errorType) => {
  switch (errorType) {
    case 'VALIDATION_ERROR':
      return 'VALIDATION';
    case 'AUTHENTICATION_ERROR':
      return 'AUTHENTICATION';
    case 'AUTHORIZATION_ERROR':
      return 'AUTHORIZATION';
    case 'CONFLICT_ERROR':
      return 'CONFLICT';
    case 'NOT_FOUND_ERROR':
      return 'NOT_FOUND';
    case 'RATE_LIMIT_ERROR':
      return 'RATE_LIMIT';
    case 'INTERNAL_ERROR':
      return 'INTERNAL';
    default:
      return 'GENERAL';
  }
};

/**
 * Map field errors to form state
 * @param {Array} fieldErrors - Array of field error objects
 * @returns {Object} Form errors object
 */
export const mapFieldErrors = (fieldErrors) => {
  const formErrors = {};
  
  if (Array.isArray(fieldErrors)) {
    fieldErrors.forEach((fieldError) => {
      if (fieldError.field && fieldError.message) {
        formErrors[fieldError.field] = fieldError.message;
      }
    });
  }
  
  return formErrors;
};

/**
 * Determine if error should be displayed as field error or general error
 * @param {Object} error - Processed error object
 * @returns {Object} { fieldErrors, generalError }
 */
export const categorizeErrorsForDisplay = (error) => {
  if (error.type === 'VALIDATION_ERROR' && error.fieldErrors && error.fieldErrors.length > 0) {
    return {
      fieldErrors: mapFieldErrors(error.fieldErrors),
      generalError: null
    };
  }
  
  if (error.type === 'CONFLICT_ERROR' && error.fieldErrors && error.fieldErrors.length > 0) {
    return {
      fieldErrors: mapFieldErrors(error.fieldErrors),
      generalError: null
    };
  }
  
  // Handle CONFLICT_ERROR with field details but no fieldErrors array
  if (error.type === 'CONFLICT_ERROR' && error.details?.field) {
    return {
      fieldErrors: { [error.details.field]: error.message },
      generalError: null
    };
  }
  
  // Handle CONFLICT_ERROR by analyzing the message content (fallback)
  if (error.type === 'CONFLICT_ERROR' && error.message) {
    const message = error.message.toLowerCase();
    if (message.includes('email')) {
      return {
        fieldErrors: { email: error.message },
        generalError: null
      };
    }
    if (message.includes('contact') || message.includes('phone')) {
      return {
        fieldErrors: { contactNumber: error.message },
        generalError: null
      };
    }
  }
  
  // All other errors are general errors
  return {
    fieldErrors: {},
    generalError: error.message
  };
};

/**
 * Get user-friendly error message based on error type
 * @param {Object} error - Processed error object
 * @returns {string} User-friendly error message
 */
export const getUserFriendlyMessage = (error) => {
  switch (error.type) {
    case 'VALIDATION_ERROR':
      return 'Please check your input and try again.';
    case 'AUTHENTICATION_ERROR':
      return error.message || 'Authentication failed. Please check your credentials.';
    case 'CONFLICT_ERROR':
      return error.message || 'This resource already exists.';
    case 'RATE_LIMIT_ERROR':
      return 'Too many requests. Please try again later.';
    case 'INTERNAL_ERROR':
      return 'Something went wrong. Please try again later.';
    default:
      return error.message || 'An unexpected error occurred.';
  }
};

/**
 * Get field-specific error message for a given field
 * @param {Object} error - Processed error object
 * @param {string} fieldName - Name of the field
 * @returns {string|null} Field-specific error message or null
 */
export const getFieldError = (error, fieldName) => {
  if (error.type === 'VALIDATION_ERROR' && error.fieldErrors) {
    const fieldError = error.fieldErrors.find(err => err.field === fieldName);
    return fieldError ? fieldError.message : null;
  }
  return null;
};

/**
 * Check if an error is retryable
 * @param {Object} error - Processed error object
 * @returns {boolean} Whether the error can be retried
 */
export const isRetryableError = (error) => {
  const retryableTypes = ['RATE_LIMIT_ERROR', 'INTERNAL_ERROR'];
  const retryableStatusCodes = [429, 500, 502, 503, 504];
  
  return retryableTypes.includes(error.type) || 
         retryableStatusCodes.includes(error.statusCode);
};

/**
 * Get retry delay in milliseconds for rate limit errors
 * @param {Object} error - Processed error object
 * @returns {number} Retry delay in milliseconds
 */
export const getRetryDelay = (error) => {
  if (error.type === 'RATE_LIMIT_ERROR') {
    // Default to 5 seconds for rate limit errors
    return 5000;
  }
  
  if (error.statusCode === 429) {
    // Check for Retry-After header or default to 1 second
    const retryAfter = error.details?.retryAfter || 1;
    return retryAfter * 1000;
  }
  
  // Default exponential backoff for other retryable errors
  return 1000;
};

/**
 * Get error icon based on error type
 * @param {Object} error - Processed error object
 * @returns {string} Icon name or class
 */
export const getErrorIcon = (error) => {
  switch (error.type) {
    case 'VALIDATION_ERROR':
      return '⚠️';
    case 'AUTHENTICATION_ERROR':
      return '🔒';
    case 'CONFLICT_ERROR':
      return '⚠️';
    case 'RATE_LIMIT_ERROR':
      return '⏱️';
    case 'INTERNAL_ERROR':
      return '💥';
    default:
      return '❌';
  }
};

/**
 * Get error color scheme based on error type
 * @param {Object} error - Processed error object
 * @returns {Object} Color scheme object
 */
export const getErrorColorScheme = (error) => {
  switch (error.type) {
    case 'VALIDATION_ERROR':
      return {
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        border: 'border-yellow-200 dark:border-yellow-800',
        text: 'text-yellow-700 dark:text-yellow-300',
        icon: 'text-yellow-500'
      };
    case 'AUTHENTICATION_ERROR':
      return {
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-200 dark:border-red-800',
        text: 'text-red-700 dark:text-red-300',
        icon: 'text-red-500'
      };
    case 'CONFLICT_ERROR':
      return {
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        border: 'border-orange-200 dark:border-orange-800',
        text: 'text-orange-700 dark:text-orange-300',
        icon: 'text-orange-500'
      };
    case 'RATE_LIMIT_ERROR':
      return {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-700 dark:text-blue-300',
        icon: 'text-blue-500'
      };
    default:
      return {
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-200 dark:border-red-800',
        text: 'text-red-700 dark:text-red-300',
        icon: 'text-red-500'
      };
  }
};
