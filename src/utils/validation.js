/**
 * Comprehensive validation utility
 * Provides consistent validation rules and error messages
 */

// Validation rules
export const VALIDATION_RULES = {
  // Name validation
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s\-']+$/,
    messages: {
      required: 'Name is required',
      minLength: 'Name must be at least 2 characters',
      maxLength: 'Name cannot exceed 50 characters',
      pattern: 'Name can only contain letters, spaces, hyphens, and apostrophes'
    }
  },

  // Email validation
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    messages: {
      required: 'Email is required',
      pattern: 'Please enter a valid email address'
    }
  },

  // Contact number validation
  contactNumber: {
    required: true,
    pattern: /^[+]?[\d\s\-\(\)]+$/,
    minLength: 7,
    maxLength: 20,
    messages: {
      required: 'Contact number is required',
      pattern: 'Please enter a valid contact number',
      minLength: 'Contact number must be at least 7 digits',
      maxLength: 'Contact number cannot exceed 20 characters'
    }
  },

  // Password validation
  password: {
    required: true,
    minLength: 8,
    maxLength: 128,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    messages: {
      required: 'Password is required',
      minLength: 'Password must be at least 8 characters',
      maxLength: 'Password cannot exceed 128 characters',
      pattern: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }
  },

  // Confirm password validation
  confirmPassword: {
    required: true,
    messages: {
      required: 'Please confirm your password'
    }
  },

  // URL validation
  url: {
    required: true,
    pattern: /^https?:\/\/.+/,
    messages: {
      required: 'URL is required',
      pattern: 'Please enter a valid URL starting with http:// or https://'
    }
  },

  // Custom slug validation
  slug: {
    required: true,
    pattern: /^[a-z0-9-]+$/,
    minLength: 3,
    maxLength: 50,
    messages: {
      required: 'Slug is required',
      pattern: 'Slug can only contain lowercase letters, numbers, and hyphens',
      minLength: 'Slug must be at least 3 characters',
      maxLength: 'Slug cannot exceed 50 characters'
    }
  }
};

/**
 * Validate a single field against its rules
 * @param {string} fieldName - Name of the field to validate
 * @param {any} value - Value to validate
 * @param {Object} rules - Validation rules (optional, will use default if not provided)
 * @returns {string|null} Error message or null if valid
 */
export const validateField = (fieldName, value, rules = null) => {
  const fieldRules = rules || VALIDATION_RULES[fieldName];
  
  if (!fieldRules) {
    return null; // No validation rules for this field
  }

  // Required validation
  if (fieldRules.required && !value) {
    return fieldRules.messages.required;
  }

  // Skip other validations if value is empty and not required
  if (!value) {
    return null;
  }

  // Min length validation
  if (fieldRules.minLength && value.length < fieldRules.minLength) {
    return fieldRules.messages.minLength;
  }

  // Max length validation
  if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
    return fieldRules.messages.maxLength;
  }

  // Pattern validation
  if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
    return fieldRules.messages.pattern;
  }

  return null; // Field is valid
};

/**
 * Validate multiple fields
 * @param {Object} formData - Object containing form data
 * @param {Array} fieldsToValidate - Array of field names to validate
 * @param {Object} customRules - Custom validation rules (optional)
 * @returns {Object} Object containing field errors
 */
export const validateFields = (formData, fieldsToValidate, customRules = null) => {
  const errors = {};

  fieldsToValidate.forEach(fieldName => {
    const error = validateField(fieldName, formData[fieldName], customRules?.[fieldName]);
    if (error) {
      errors[fieldName] = error;
    }
  });

  return errors;
};

/**
 * Validate entire form
 * @param {Object} formData - Object containing form data
 * @param {Object} customRules - Custom validation rules (optional)
 * @returns {Object} Object containing field errors
 */
export const validateForm = (formData, customRules = null) => {
  const errors = {};

  Object.keys(VALIDATION_RULES).forEach(fieldName => {
    if (formData.hasOwnProperty(fieldName)) {
      const error = validateField(fieldName, formData[fieldName], customRules?.[fieldName]);
      if (error) {
        errors[fieldName] = error;
      }
    }
  });

  return errors;
};

/**
 * Validate password confirmation
 * @param {string} password - Password value
 * @param {string} confirmPassword - Confirm password value
 * @returns {string|null} Error message or null if valid
 */
export const validatePasswordConfirmation = (password, confirmPassword) => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }

  return null;
};

/**
 * Get password strength score
 * @param {string} password - Password to evaluate
 * @returns {Object} Object containing score and feedback
 */
export const getPasswordStrength = (password) => {
  if (!password) {
    return { score: 0, feedback: 'Enter a password' };
  }

  let score = 0;
  const feedback = [];

  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('At least 8 characters');
  }

  // Character variety checks
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[@$!%*?&]/.test(password)) score += 1;

  // Additional checks
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Determine strength level
  let strength = 'weak';
  if (score >= 4) strength = 'strong';
  else if (score >= 3) strength = 'medium';
  else if (score >= 2) strength = 'fair';

  // Generate feedback
  if (score < 4) {
    if (!/[a-z]/.test(password)) feedback.push('Add lowercase letters');
    if (!/[A-Z]/.test(password)) feedback.push('Add uppercase letters');
    if (!/\d/.test(password)) feedback.push('Add numbers');
    if (!/[@$!%*?&]/.test(password)) feedback.push('Add special characters');
  }

  return {
    score,
    strength,
    feedback: feedback.length > 0 ? feedback : ['Strong password!']
  };
};

/**
 * Sanitize input value
 * @param {string} value - Value to sanitize
 * @param {string} type - Type of input (text, email, url, etc.)
 * @returns {string} Sanitized value
 */
export const sanitizeInput = (value, type = 'text') => {
  if (typeof value !== 'string') {
    return value;
  }

  let sanitized = value.trim();

  switch (type) {
    case 'email':
      sanitized = sanitized.toLowerCase();
      break;
    case 'url':
      if (sanitized && !sanitized.startsWith('http://') && !sanitized.startsWith('https://')) {
        sanitized = 'https://' + sanitized;
      }
      break;
    case 'name':
      sanitized = sanitized.replace(/[^\w\s\-']/g, '');
      break;
    case 'slug':
      sanitized = sanitized.toLowerCase().replace(/[^\w-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      break;
    default:
      break;
  }

  return sanitized;
};

/**
 * Check if form is valid
 * @param {Object} errors - Object containing field errors
 * @returns {boolean} True if no errors, false otherwise
 */
export const isFormValid = (errors) => {
  return Object.keys(errors).length === 0;
};

/**
 * Get validation summary
 * @param {Object} formData - Form data
 * @param {Object} errors - Field errors
 * @returns {Object} Validation summary
 */
export const getValidationSummary = (formData, errors) => {
  const totalFields = Object.keys(VALIDATION_RULES).length;
  const validFields = totalFields - Object.keys(errors).length;
  const progress = (validFields / totalFields) * 100;

  return {
    totalFields,
    validFields,
    invalidFields: Object.keys(errors).length,
    progress: Math.round(progress),
    isComplete: validFields === totalFields,
    isValid: Object.keys(errors).length === 0
  };
};
