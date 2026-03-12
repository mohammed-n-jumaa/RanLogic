import api from './index';

const aboutApi = {
  // جلب بيانات "عن المدرب" للصفحة العامة
  getAboutCoach: async (language = null) => {
    try {
      const lang = language || localStorage.getItem('language') || 'ar';
      const response = await api.get('/about-coach/public', {
        params: { locale: lang }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching about coach:', error);
      // إرجاع بيانات افتراضية في حالة الخطأ
      return getDefaultAboutData(lang);
    }
  },

  // جلب بيانات "عن المدرب" للوحة الإدارة
  getAdminAboutCoach: async () => {
    try {
      const response = await api.get('/admin/about-coach');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin about coach:', error);
      throw error;
    }
  },

  // تحديث بيانات "عن المدرب"
  updateAboutCoach: async (data) => {
    try {
      const response = await api.put('/admin/about-coach', data);
      return response.data;
    } catch (error) {
      console.error('Error updating about coach:', error);
      throw error;
    }
  },

  // رفع صورة المدرب
  uploadCoachImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post('/admin/about-coach/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading coach image:', error);
      throw error;
    }
  },

  // حذف صورة المدرب
  deleteCoachImage: async () => {
    try {
      const response = await api.delete('/admin/about-coach/image');
      return response.data;
    } catch (error) {
      console.error('Error deleting coach image:', error);
      throw error;
    }
  }
};

// بيانات افتراضية لـ "عن المدرب"
const getDefaultAboutData = (language = 'ar') => {
  const isArabic = language === 'ar';
  
  return {
    success: true,
    data: {
      badge: isArabic ? 'من أنا' : 'Who I Am',
      title: isArabic ? 'عن المدرب' : 'About the Coach',
      main_description: isArabic 
        ? '<strong>مدرب لياقة بدنية معتمد دولياً</strong> مع خبرة تزيد عن <strong>5 سنوات</strong> في تغيير حياة النساء. أؤمن أن كل جسد فريد، لذلك أصمم برامج تدريب وتغذية شخصية تناسب احتياجاتك وأهدافك الشخصية.<br/><br/>ساعدت أكثر من <strong>500 متدرب</strong> في تحقيق أهدافهم في اللياقة والصحة من خلال برامج شاملة تجمع بين التدريب الفعال، التغذية السليمة، والدعم النفسي المستمر.'
        : '<strong>Internationally certified fitness coach</strong> with over <strong>5 years</strong> of experience transforming women\'s lives. I believe that every body is unique, which is why I design personalized training and nutrition programs that suit your needs and personal goals.<br/><br/>I\'ve helped over <strong>500 trainees</strong> achieve their fitness and health goals through comprehensive programs that combine effective training, proper nutrition, and continuous psychological support.',
      highlight_text: isArabic 
        ? 'رحلتك في اللياقة البدنية تبدأ من الداخل، أساعدك في بناء نسخة أقوى وأكثر ثقة من نفسك'
        : 'Your fitness journey starts from within, I help you build a stronger and more confident version of yourself',
      image_url: '/images/trainer-profile.jpg',
      features: [
        {
          id: 1,
          icon: '👥',
          title: isArabic ? 'تدريب شخصي أونلاين' : 'Online Personal Training',
          description: isArabic ? 'جلسات تدريب مباشرة ومتابعة يومية' : 'Live training sessions and daily follow-up'
        },
        {
          id: 2,
          icon: '🍎',
          title: isArabic ? 'خطط تغذية مخصصة' : 'Custom Nutrition Plans',
          description: isArabic ? 'خطط تغذية مصممة خصيصاً لك' : 'Nutrition plans designed specifically for you'
        },
        {
          id: 3,
          icon: '💪',
          title: isArabic ? 'قص، نحت، تضخيم' : 'Cutting, Sculpting, Bulking',
          description: isArabic ? 'برامج شاملة لتحقيق أهدافك' : 'Comprehensive programs to achieve your goals'
        },
        {
          id: 4,
          icon: '📈',
          title: isArabic ? 'متابعة مستمرة' : 'Continuous Monitoring',
          description: isArabic ? 'دعم ومتابعة طوال الأسبوع' : 'Support and follow-up throughout the week'
        }
      ]
    }
  };
};

export default aboutApi;