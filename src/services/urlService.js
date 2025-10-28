import { apiClient } from './apiClient';

class URLService {
  async createShortUrl(urlData) {
    try {
      const response = await apiClient.post('/api/urls', urlData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getShortUrls(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);
      if (params.groupId) queryParams.append('groupId', params.groupId);
      if (params.isActive !== undefined) queryParams.append('isActive', String(params.isActive));

      const queryString = queryParams.toString();
      const url = queryString ? `/api/urls?${queryString}` : '/api/urls';
      const response = await apiClient.get(url);
      // The backend returns { success: true, data: [], pagination: {...} }
      return response.data;
    } catch (error) {
      const errorMessage = this.handleError(error);
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

  async toggleUrlStatus(id) {
    try {
      const response = await apiClient.patch(`/api/urls/${id}/toggle-status`);
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

  async getUrlClickLogs(id, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);

      const response = await apiClient.get(`/api/urls/${id}/click-logs?${queryParams}`);
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
