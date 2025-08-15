import { apiClient } from './apiClient';

class GroupService {
  async createGroup(groupData) {
    try {
      const response = await apiClient.post('/api/groups', groupData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getGroups() {
    try {
      const response = await apiClient.get('/api/groups');
      console.log('Group service response:', response.data);
      // The backend returns { success: true, data: [], pagination: {...} }
      return response.data.data || [];
    } catch (error) {
      console.error('Group service error:', error);
      const errorMessage = this.handleError(error);
      console.error('Handled error message:', errorMessage.message);
      throw errorMessage;
    }
  }

  async getGroup(id) {
    try {
      const response = await apiClient.get(`/api/groups/${id}`);
      return response.data.group;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateGroup(id, groupData) {
    try {
      const response = await apiClient.put(`/api/groups/${id}`, groupData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteGroup(id) {
    try {
      const response = await apiClient.delete(`/api/groups/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getGroupStats(id) {
    try {
      const response = await apiClient.get(`/api/groups/${id}/stats`);
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

export const groupService = new GroupService();
