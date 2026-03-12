import apiClient from './apiClient';

/**
 * Chat API Service
 * جميع الاتصالات مع الـ Backend للدردشة
 */

const BASE_URL = '/admin/chat';

/**
 * ==================== المحادثات ====================
 */

/**
 * جلب قائمة المحادثات
 * @param {string} search - نص البحث (اختياري)
 */
export const getConversations = async (search = '') => {
  try {
    const params = search ? { search } : {};
    const response = await apiClient.get(`${BASE_URL}/conversations`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

/**
 * جلب محادثة معينة مع الرسائل
 * @param {number} traineeId - معرف المتدرب
 */
export const getConversation = async (traineeId) => {
  try {
    const response = await apiClient.get(`${BASE_URL}/conversations/${traineeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching conversation:', error);
    throw error;
  }
};

/**
 * حذف محادثة
 * @param {number} conversationId - معرف المحادثة
 */
export const deleteConversation = async (conversationId) => {
  try {
    const response = await apiClient.delete(`${BASE_URL}/conversations/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting conversation:', error);
    throw error;
  }
};

/**
 * تحديد الرسائل كمقروءة
 * @param {number} conversationId - معرف المحادثة
 */
export const markConversationAsRead = async (conversationId) => {
  try {
    const response = await apiClient.post(`${BASE_URL}/conversations/${conversationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Error marking conversation as read:', error);
    throw error;
  }
};

/**
 * ==================== الرسائل ====================
 */

/**
 * إرسال رسالة نصية
 * @param {number} traineeId - معرف المتدرب
 * @param {string} content - محتوى الرسالة
 */
export const sendMessage = async (traineeId, content) => {
  try {
    const response = await apiClient.post(`${BASE_URL}/conversations/${traineeId}/messages`, {
      content,
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

/**
 * إرسال ملف (صورة، فيديو، PDF، مستند)
 * @param {number} traineeId - معرف المتدرب
 * @param {File} file - الملف
 * @param {string} caption - تعليق (اختياري)
 * @param {function} onProgress - callback لتتبع التقدم
 */
export const sendFile = async (traineeId, file, caption = '', onProgress = null) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (caption) {
      formData.append('caption', caption);
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    if (onProgress) {
      config.onUploadProgress = (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      };
    }

    const response = await apiClient.post(
      `${BASE_URL}/conversations/${traineeId}/files`,
      formData,
      config
    );
    return response.data;
  } catch (error) {
    console.error('Error sending file:', error);
    throw error;
  }
};

/**
 * حذف رسالة
 * @param {number} messageId - معرف الرسالة
 */
export const deleteMessage = async (messageId) => {
  try {
    const response = await apiClient.delete(`${BASE_URL}/messages/${messageId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};

/**
 * ==================== الإحصائيات ====================
 */

/**
 * جلب إحصائيات الدردشة
 */
export const getChatStats = async () => {
  try {
    const response = await apiClient.get(`${BASE_URL}/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chat stats:', error);
    throw error;
  }
};

/**
 * ==================== الإشعارات ====================
 */

/**
 * جلب الإشعارات
 * @param {number} limit - عدد الإشعارات
 */
export const getNotifications = async (limit = 20) => {
  try {
    const response = await apiClient.get(`${BASE_URL}/notifications`, {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

/**
 * جلب عدد الإشعارات غير المقروءة
 */
export const getUnreadNotificationsCount = async () => {
  try {
    const response = await apiClient.get(`${BASE_URL}/notifications/unread-count`);
    return response.data;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    throw error;
  }
};

/**
 * تحديد جميع الإشعارات كمقروءة
 */
export const markNotificationsAsRead = async () => {
  try {
    const response = await apiClient.post(`${BASE_URL}/notifications/read`);
    return response.data;
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    throw error;
  }
};

/**
 * ==================== Helpers ====================
 */

/**
 * الحصول على أيقونة نوع الملف
 */
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

/**
 * التحقق من نوع الملف المدعوم
 */
export const isFileTypeSupported = (file) => {
  const supportedTypes = [
    // Images
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    // Videos
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-ms-wmv',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  return supportedTypes.includes(file.type);
};

/**
 * الحصول على الحجم الأقصى للملف (50MB)
 */
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

/**
 * التحقق من حجم الملف
 */
export const isFileSizeValid = (file) => {
  return file.size <= MAX_FILE_SIZE;
};

/**
 * تنسيق حجم الملف
 */
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