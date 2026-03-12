import apiClient from './apiClient';

const footerApi = {
  
  // Get footer for public website
  getPublicFooter: async () => {
    try {
      const response = await apiClient.get('/footer/public');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to fetch footer',
        error: error.response?.data?.error,
      };
    }
  },

  // Get footer data for admin
  getFooterForAdmin: async () => {
    try {
      const response = await apiClient.get('/admin/footer');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'فشل في جلب بيانات الفوتر',
        error: error.response?.data?.error,
      };
    }
  },

  // Update footer configuration
  updateFooter: async (footerData) => {
    try {
      const response = await apiClient.put('/admin/footer', footerData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'فشل في تحديث الفوتر',
        errors: error.response?.data?.errors,
        error: error.response?.data?.error,
      };
    }
  },

  // Social media platforms with icons
  socialPlatforms: [
    { value: 'facebook', label: 'Facebook', icon: 'fab fa-facebook-f', color: '#1877F2' },
    { value: 'twitter', label: 'Twitter', icon: 'fab fa-twitter', color: '#1DA1F2' },
    { value: 'instagram', label: 'Instagram', icon: 'fab fa-instagram', color: '#E4405F' },
    { value: 'linkedin', label: 'LinkedIn', icon: 'fab fa-linkedin-in', color: '#0A66C2' },
    { value: 'youtube', label: 'YouTube', icon: 'fab fa-youtube', color: '#FF0000' },
    { value: 'tiktok', label: 'TikTok', icon: 'fab fa-tiktok', color: '#000000' },
    { value: 'whatsapp', label: 'WhatsApp', icon: 'fab fa-whatsapp', color: '#25D366' },
    { value: 'telegram', label: 'Telegram', icon: 'fab fa-telegram', color: '#0088CC' },
  ],

  // Default quick links
  defaultQuickLinks: [
    { text_en: 'Home', text_ar: 'الرئيسية', url: '/' },
    { text_en: 'About Coach', text_ar: 'عن المدربة', url: '/about' },
    { text_en: 'Programs', text_ar: 'البرامج', url: '/programs' },
    { text_en: 'Testimonials', text_ar: 'آراء المتدربات', url: '/testimonials' },
  ],

 
};

export default footerApi;