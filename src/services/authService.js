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
      console.error('Logout error:', error);
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
      const message = error.response.data?.message || 'An error occurred';
      return new Error(message);
    } else if (error.request) {
      // Request made but no response received
      return new Error('Network error. Please check your connection.');
    } else {
      // Something else happened
      return new Error('An unexpected error occurred.');
    }
  }
}

export const authService = new AuthService();
