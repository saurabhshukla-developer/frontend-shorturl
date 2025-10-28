import { apiClient } from './apiClient.js';

/**
 * Send a message to the chatbot
 */
export const sendChatMessage = async (message) => {
  try {
    const response = await apiClient.post('/api/chatbot/message', { message });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to send message');
  }
};

/**
 * Get chat history for the current user
 */
export const getChatHistory = async () => {
  try {
    const response = await apiClient.get('/api/chatbot/history');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get chat history');
  }
};

/**
 * Clear chat history for the current user
 */
export const clearChatHistory = async () => {
  try {
    const response = await apiClient.delete('/api/chatbot/history');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to clear chat history');
  }
};

/**
 * Clear chatbot cache (deprecated)
 */
export const clearChatCache = async () => {
  try {
    const response = await apiClient.post('/api/chatbot/clear');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to clear cache');
  }
};

