import { apiClient } from './apiClient';

class URLService {
  async createShortUrl(urlData) {
    try {
      console.log('URL service - creating short URL with data:', urlData);
      const response = await apiClient.post('/api/urls', urlData);
      console.log('URL service - response received:', response.data);
      return response.data;
    } catch (error) {
      console.error('URL service - error creating short URL:', error);
      throw this.handleError(error);
    }
  }

  async getShortUrls() {
    try {
      const response = await apiClient.get('/api/urls');
      console.log('URL service response:', response.data);
      // The backend returns { success: true, data: [], pagination: {...} }
      return response.data.data || [];
    } catch (error) {
      console.error('URL service error:', error);
      const errorMessage = this.handleError(error);
      console.error('Handled error message:', errorMessage.message);
      throw errorMessage;
    }
  }

  async getShortUrl(id) {
    try {
      const response = await apiClient.get(`/api/urls/${id}`);
      return response.data.url;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateShortUrl(id, urlData) {
    try {
      const response = await apiClient.put(`/api/urls/${id}`, urlData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteShortUrl(id) {
    try {
      const response = await apiClient.delete(`/api/urls/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getUrlStats(id) {
    try {
      const response = await apiClient.get(`/api/urls/${id}/stats`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async bulkUpdateUrls(urlIds, updateData) {
    try {
      const response = await apiClient.put('/api/urls/bulk', {
        urlIds,
        ...updateData
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
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

export const urlService = new URLService();
