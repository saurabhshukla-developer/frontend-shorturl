import { apiClient } from './apiClient';

class DashboardService {
  async getDashboardStats() {
    try {
      const response = await apiClient.get('/api/dashboard');
      return response.data;
    } catch (error) {
      console.error('Dashboard stats service error:', error);
      const errorMessage = this.handleError(error);
      console.error('Handled error message:', errorMessage.message);
      throw errorMessage;
    }
  }

  async getAnalytics() {
    try {
      const response = await apiClient.get('/api/dashboard/analytics');
      return response.data;
    } catch (error) {
      console.error('Dashboard analytics service error:', error);
      const errorMessage = this.handleError(error);
      console.error('Handled error message:', errorMessage.message);
      throw errorMessage;
    }
  }

  handleError(error) {
    if (error.response) {
      const message = error.response.data?.message || 'An error occurred';
      return new Error(message);
    } else if (error.request) {
      return new Error('Network error. Please check your connection.');
    } else {
      return new Error('An unexpected error occurred.');
    }
  }
}

export const dashboardService = new DashboardService();
