import apiClient from './apiClient';
import { getSocketId } from '../lib/echo';

const BASE_URL = '/admin/chat';

const withSocketHeader = () => {
  const socketId = getSocketId();
  return socketId ? { 'X-Socket-ID': socketId } : {};
};

export const getConversations = async (search = '') => {
  const params = search ? { search } : {};
  const response = await apiClient.get(`${BASE_URL}/conversations`, { params });
  return response.data;
};

export const getConversation = async (traineeId) => {
  const response = await apiClient.get(`${BASE_URL}/conversations/${traineeId}`);
  return response.data;
};

export const deleteConversation = async (conversationId) => {
  const response = await apiClient.delete(`${BASE_URL}/conversations/${conversationId}`);
  return response.data;
};

export const markConversationAsRead = async (conversationId) => {
  const response = await apiClient.post(
    `${BASE_URL}/conversations/${conversationId}/read`,
    {},
    { headers: withSocketHeader() }
  );
  return response.data;
};

export const sendTyping = async (traineeId, isTyping) => {
  const response = await apiClient.post(
    `${BASE_URL}/conversations/${traineeId}/typing`,
    { is_typing: isTyping },
    { headers: withSocketHeader() }
  );
  return response.data;
};

export const sendMessage = async (traineeId, content) => {
  const response = await apiClient.post(
    `${BASE_URL}/conversations/${traineeId}/messages`,
    { content },
    { headers: withSocketHeader() }
  );
  return response.data;
};

export const sendFile = async (traineeId, file, caption = '', onProgress = null) => {
  const formData = new FormData();
  formData.append('file', file);
  if (caption) formData.append('caption', caption);

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...withSocketHeader(),
    },
  };

  if (onProgress) {
    config.onUploadProgress = (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      onProgress(percentCompleted);
    };
  }

  const response = await apiClient.post(`${BASE_URL}/conversations/${traineeId}/files`, formData, config);
  return response.data;
};

export const deleteMessage = async (messageId) => {
  const response = await apiClient.delete(`${BASE_URL}/messages/${messageId}`);
  return response.data;
};

export const getChatStats = async () => {
  const response = await apiClient.get(`${BASE_URL}/stats`);
  return response.data;
};

export const getNotifications = async (limit = 20) => {
  const response = await apiClient.get(`${BASE_URL}/notifications`, { params: { limit } });
  return response.data;
};

export const getUnreadNotificationsCount = async () => {
  const response = await apiClient.get(`${BASE_URL}/notifications/unread-count`);
  return response.data;
};

export const markNotificationsAsRead = async () => {
  const response = await apiClient.post(`${BASE_URL}/notifications/read`);
  return response.data;
};

export const getFileTypeIcon = (type) => {
  switch (type) {
    case 'image':
      return '🖼️';
    case 'video':
      return '🎬';
    case 'pdf':
      return '📄';
    case 'doc':
      return '📝';
    default:
      return '📎';
  }
};

export const isFileTypeSupported = (file) => {
  const supportedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-ms-wmv',
    'video/webm',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  const ext = file.name.split('.').pop()?.toLowerCase();
  const supportedExts = ['jpeg', 'jpg', 'png', 'gif', 'webp', 'mp4', 'mov', 'avi', 'wmv', 'webm', 'pdf', 'doc', 'docx'];

  return supportedTypes.includes(file.type) || supportedExts.includes(ext);
};

export const MAX_FILE_SIZE = 50 * 1024 * 1024;

export const isFileSizeValid = (file) => file.size <= MAX_FILE_SIZE;

export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default {
  getConversations,
  getConversation,
  deleteConversation,
  markConversationAsRead,
  sendTyping,
  sendMessage,
  sendFile,
  deleteMessage,
  getChatStats,
  getNotifications,
  getUnreadNotificationsCount,
  markNotificationsAsRead,
  getFileTypeIcon,
  isFileTypeSupported,
  isFileSizeValid,
  formatFileSize,
  MAX_FILE_SIZE,
};
export const archiveConversation = async (conversationId) => {
  const response = await apiClient.post(`${BASE_URL}/conversations/${conversationId}/archive`);
  return response.data;
};

export const unarchiveConversation = async (conversationId) => {
  const response = await apiClient.post(`${BASE_URL}/conversations/${conversationId}/unarchive`);
  return response.data;
};

export const getArchivedConversations = async (search = '') => {
  const params = { archived: 1, ...(search ? { search } : {}) };
  const response = await apiClient.get(`${BASE_URL}/conversations`, { params });
  return response.data;
};