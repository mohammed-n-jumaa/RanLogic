import api from './index';
import { getSocketId } from '../lib/echo';

const withSocketHeader = () => {
  const socketId = getSocketId();
  return socketId ? { 'X-Socket-ID': socketId } : {};
};

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

  // عدد الرسائل غير المقروءة + آخر 3 رسائل بدون فتح/تصفير المحادثة
  getUnreadCount: async () => {
    try {
      const response = await api.get('/trainee/chat/unread-count');
      return response.data;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return { success: true, data: { unread_count: 0, recent_messages: [] } };
    }
  },

  sendMessage: async (content) => {
    try {
      const response = await api.post(
        '/trainee/chat/messages',
        { content },
        { headers: { ...withSocketHeader() } }
      );
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
        headers: { 'Content-Type': 'multipart/form-data', ...withSocketHeader() },
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message with image:', error);
      throw error;
    }
  },

  markAsRead: async () => {
    try {
      const response = await api.post(
        '/trainee/chat/conversation/read',
        {},
        { headers: { ...withSocketHeader() } }
      );
      return response.data;
    } catch (error) {
      console.error('Error marking as read:', error);
      throw error;
    }
  },

  sendTyping: async (isTyping) => {
    try {
      const response = await api.post(
        '/trainee/chat/conversation/typing',
        { is_typing: isTyping },
        { headers: { ...withSocketHeader() } }
      );
      return response.data;
    } catch (error) {
      console.error('Error sending typing status:', error);
      throw error;
    }
  },
};

export default chatApi;