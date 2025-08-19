import { apiClient } from './apiClient';

class AuthService {
  async register(userData) {
    try {
      const response = await apiClient.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async login(credentials) {
    try {
      const response = await apiClient.post('/api/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout() {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      // Silent error handling
    }
  }

  async getProfile() {
    try {
      const response = await apiClient.get('/api/auth/profile');
      return response.data.user;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProfile(profileData) {
    try {
      const response = await apiClient.put('/api/auth/profile', profileData);
      return response.data.user;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async changePassword(passwordData) {
    try {
      const response = await apiClient.post('/api/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async forgotPassword(email) {
    try {
      const response = await apiClient.post('/api/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async resetPassword(resetData) {
    try {
      const response = await apiClient.post('/api/auth/reset-password', resetData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async refreshToken(refreshToken) {
    try {
      const response = await apiClient.post('/api/auth/refresh-token', { refreshToken });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const { data, status } = error.response;
      
      // Handle standardized error responses
      if (data?.error) {
        const { type, message, details } = data.error;
        
        // Create a structured error object
        const structuredError = {
          type,
          message,
          details,
          statusCode: status,
          isFieldError: type === 'VALIDATION_ERROR' && details?.fields,
          fieldErrors: type === 'VALIDATION_ERROR' ? (details?.fields || []) : 
                      type === 'CONFLICT_ERROR' && details?.field ? [{ field: details.field, message }] : []
        };
        
        // For CONFLICT_ERROR, ensure we have the field information for display
        if (type === 'CONFLICT_ERROR' && details?.field) {
          structuredError.isFieldError = true;
          structuredError.fieldErrors = [{ field: details.field, message }];
        }
        
        return structuredError;
      }
      
      // Handle legacy error format (fallback)
      if (data?.message) {
        return new Error(data.message);
      }
      
      // Handle status-specific errors
      switch (status) {
        case 400:
          return new Error('Bad request');
        case 401:
          return new Error('Unauthorized');
        case 403:
          return new Error('Access denied');
        case 404:
          return new Error('Resource not found');
        case 409:
          return new Error('Conflict occurred');
        case 422:
          return new Error('Validation failed');
        case 429:
          return new Error('Too many requests. Please try again later.');
        case 500:
          return new Error('Internal server error. Please try again later.');
        default:
          return new Error('An error occurred');
      }
    } else if (error.request) {
      // Request made but no response received
      return new Error('Network error. Please check your connection.');
    } else {
      // Something else happened
      return new Error(error.message || 'An unexpected error occurred.');
    }
  }
}

export const authService = new AuthService();
