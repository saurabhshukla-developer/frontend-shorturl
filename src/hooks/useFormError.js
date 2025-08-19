import { useState, useCallback } from 'react';
import { processError, categorizeErrorsForDisplay } from '../utils/errorHandler';

/**
 * Custom hook for managing form errors
 * Provides consistent error handling across forms
 */
export const useFormError = (initialErrors = {}) => {
  const [errors, setErrors] = useState(initialErrors);
  const [retryCount, setRetryCount] = useState(0);
  const [maxRetries] = useState(3);

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setErrors({});
    setRetryCount(0);
  }, []);

  /**
   * Clear a specific field error
   */
  const clearFieldError = useCallback((fieldName) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  /**
   * Clear general error
   */
  const clearGeneralError = useCallback(() => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.general;
      return newErrors;
    });
  }, []);

  /**
   * Set a field-specific error
   */
  const setFieldError = useCallback((fieldName, message) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: message
    }));
  }, []);

  /**
   * Set multiple field errors
   */
  const setFieldErrors = useCallback((fieldErrors) => {
    setErrors(prev => ({
      ...prev,
      ...fieldErrors
    }));
  }, []);

  /**
   * Set a general error
   */
  const setGeneralError = useCallback((message) => {
    setErrors(prev => ({
      ...prev,
      general: message
    }));
  }, []);

  /**
   * Process and categorize backend errors
   */
  const processBackendError = useCallback((error) => {
    // Handle specific error types directly
    if (error.type === 'CONFLICT_ERROR' && error.details?.field) {
      setFieldError(error.details.field, error.message);
      return;
    }

    // Process and categorize the error
    const processedError = processError(error);
    const { fieldErrors, generalError } = categorizeErrorsForDisplay(processedError);

    // Set field-specific errors
    if (Object.keys(fieldErrors).length > 0) {
      setFieldErrors(fieldErrors);
    }

    // Set general error if any
    if (generalError) {
      setGeneralError(generalError);
    }

    // If no errors were set, show the original error message as general error
    if (Object.keys(fieldErrors).length === 0 && !generalError) {
      setGeneralError(error.message || 'An error occurred. Please try again.');
    }
  }, [setFieldError, setFieldErrors, setGeneralError]);

  /**
   * Handle form submission with error processing
   */
  const handleSubmitWithErrors = useCallback(async (submitFn) => {
    try {
      clearErrors(); // Clear previous errors
      const result = await submitFn();
      return { success: true, data: result };
    } catch (error) {
      processBackendError(error);
      return { success: false, error };
    }
  }, [clearErrors, processBackendError]);

  /**
   * Retry form submission
   */
  const retry = useCallback(async (submitFn) => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      clearErrors(); // Clear errors before retry
      return await handleSubmitWithErrors(submitFn);
    }
    return { success: false, error: new Error('Max retries exceeded') };
  }, [retryCount, maxRetries, clearErrors, handleSubmitWithErrors]);

  /**
   * Reset retry count when form data changes
   */
  const resetRetryCount = useCallback(() => {
    if (retryCount > 0) {
      setRetryCount(0);
    }
  }, [retryCount]);

  /**
   * Check if form has any errors
   */
  const hasErrors = useCallback(() => {
    return Object.keys(errors).length > 0;
  }, [errors]);

  /**
   * Check if a specific field has an error
   */
  const hasFieldError = useCallback((fieldName) => {
    return !!errors[fieldName];
  }, [errors]);

  /**
   * Check if there's a general error
   */
  const hasGeneralError = useCallback(() => {
    return !!errors.general;
  }, [errors]);

  /**
   * Get error message for a specific field
   */
  const getFieldError = useCallback((fieldName) => {
    return errors[fieldName] || null;
  }, [errors]);

  /**
   * Get general error message
   */
  const getGeneralError = useCallback(() => {
    return errors.general || null;
  }, [errors]);

  return {
    // State
    errors,
    retryCount,
    maxRetries,
    
    // Actions
    clearErrors,
    clearFieldError,
    clearGeneralError,
    setFieldError,
    setFieldErrors,
    setGeneralError,
    processBackendError,
    handleSubmitWithErrors,
    retry,
    resetRetryCount,
    
    // Queries
    hasErrors,
    hasFieldError,
    hasGeneralError,
    getFieldError,
    getGeneralError,
    
    // Setters (for direct state manipulation if needed)
    setErrors,
    setRetryCount
  };
};
