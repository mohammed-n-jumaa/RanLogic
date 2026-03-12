import api from './index';

const heroApi = {
  // جلب بيانات الهيرو سيكشن للصفحة العامة
  getHeroSection: async (language = null) => {
    try {
      const lang = language || localStorage.getItem('language') || 'ar';
      const response = await api.get('/hero-section/public', {
        params: { locale: lang }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching hero section:', error);
      // إرجاع بيانات افتراضية في حالة الخطأ
      return getDefaultHeroData(lang);
    }
  },

  // جلب بيانات الهيرو سيكشن للوحة الإدارة
  getAdminHeroSection: async () => {
    try {
      const response = await api.get('/admin/hero-section');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin hero section:', error);
      throw error;
    }
  },

  // تحديث الهيرو سيكشن
  updateHeroSection: async (data) => {
    try {
      const response = await api.put('/admin/hero-section', data);
      return response.data;
    } catch (error) {
      console.error('Error updating hero section:', error);
      throw error;
    }
  },

  // رفع فيديو جديد
  uploadVideo: async (file) => {
    try {
      const formData = new FormData();
      formData.append('video', file);

      const response = await api.post('/admin/hero-section/video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading hero video:', error);
      throw error;
    }
  },

  // حذف الفيديو
  deleteVideo: async () => {
    try {
      const response = await api.delete('/admin/hero-section/video');
      return response.data;
    } catch (error) {
      console.error('Error deleting hero video:', error);
      throw error;
    }
  }
};

// بيانات افتراضية للهيرو سيكشن
const getDefaultHeroData = (language = 'ar') => {
  const isArabic = language === 'ar';
  
  return {
    success: true,
    data: {
      video_url: 'https://www.youtube.com/embed/-jFk6lUZ6Fg?autoplay=1&mute=1&loop=1&playlist=-jFk6lUZ6Fg&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1',
      badge: isArabic ? 'برنامج تدريب شخصي' : 'Personalized Training Program',
      main_title: isArabic ? 'درّب جسدك بثقة' : 'Train Your Body with Confidence',
      sub_title: isArabic ? 'برنامج مصمم خصيصاً لك' : 'A Program Designed Just for You',
      description: isArabic 
        ? 'تدريب وتغذية مبنية على جسدك، أهدافك، ونمط حياتك<br/>ابدأ رحلتك نحو أفضل نسخة من نفسك'
        : 'Training and nutrition based on your body, goals, and lifestyle<br/>Start your journey towards the best version of yourself',
      stats: [
        { value: '+500', label: isArabic ? 'متدرب سعيد' : 'Happy Trainees' },
        { value: '+5', label: isArabic ? 'سنوات خبرة' : 'Years Experience' },
        { value: '98%', label: isArabic ? 'معدل النجاح' : 'Success Rate' }
      ]
    }
  };
};

export default heroApi;