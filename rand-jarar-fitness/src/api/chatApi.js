import api from './index';

const chatApi = {

  getConversation: async () => {
    try {
      const response = await api.get('/trainee/chat/conversation');
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  },

  sendMessage: async (content) => {
    try {
      const response = await api.post('/trainee/chat/messages', {
        content: content
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  sendMessageWithImage: async (content, imageFile) => {
    try {
      const formData = new FormData();
      if (content) formData.append('content', content);
      formData.append('file', imageFile);
      
      const response = await api.post('/trainee/chat/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message with image:', error);
      throw error;
    }
  },

  markAsRead: async (conversationId) => {
    try {
      return { success: true };
    } catch (error) {
      console.error('Error marking as read:', error);
      throw error;
    }
  }
};

export default chatApi;