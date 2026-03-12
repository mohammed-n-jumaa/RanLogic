import api from './index';

const testimonialApi = {
  // جبل البيانات لصفحة Testimonials العامة
  getTestimonials: async (language = null) => {
    try {
      const lang = language || localStorage.getItem('language') || 'ar';
      const response = await api.get('/testimonials/public', {
        params: { locale: lang }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      // إرجاع بيانات افتراضية في حالة الخطأ
      return getDefaultTestimonials(lang);
    }
  },

  // جبل البيانات للوحة الإدارة
  getAdminTestimonials: async () => {
    try {
      const response = await api.get('/admin/testimonials');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin testimonials:', error);
      throw error;
    }
  },

  // تحديث إعدادات القسم
  updateSection: async (data) => {
    try {
      const response = await api.put('/admin/testimonials/section', data);
      return response.data;
    } catch (error) {
      console.error('Error updating section:', error);
      throw error;
    }
  },

  // تحديث شامل للآراء
  updateAll: async (data) => {
    try {
      const response = await api.post('/admin/testimonials/update-all', data);
      return response.data;
    } catch (error) {
      console.error('Error updating all testimonials:', error);
      throw error;
    }
  },

  // رفع صورة رأي
  uploadImage: async (id, file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post(`/admin/testimonials/${id}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading testimonial image:', error);
      throw error;
    }
  },

  // حذف صورة رأي
  deleteImage: async (id) => {
    try {
      const response = await api.delete(`/admin/testimonials/${id}/image`);
      return response.data;
    } catch (error) {
      console.error('Error deleting testimonial image:', error);
      throw error;
    }
  }
};

// بيانات افتراضية للـ Testimonials
const getDefaultTestimonials = (language = 'ar') => {
  const isArabic = language === 'ar';
  
  return {
    success: true,
    data: {
      section: {
        badge: isArabic ? 'آراء العملاء' : 'Client Reviews',
        title: isArabic ? 'قصص نجاح ملهمة' : 'Inspiring Success Stories',
        description: isArabic 
          ? 'استمع إلى تجارب عملائنا وكيف غيروا حياتهم للأفضل'
          : 'Listen to our clients\' experiences and how they changed their lives for the better'
      },
      testimonials: [
        {
          id: 1,
          name: isArabic ? 'سارة أحمد' : 'Sarah Ahmed',
          title: isArabic ? 'مهندسة معمارية' : 'Architect',
          text: isArabic 
            ? 'تجربة رائعة! خسرت 12 كجم في 3 أشهر مع برنامج رند الشخصي. الدعم والمتابعة المستمرة كانا استثنائيين'
            : 'Amazing experience! Lost 12 kg in 3 months with Rand\'s personalized program. The support and continuous follow-up were outstanding',
          rating: 5,
          image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
        },
        {
          id: 2,
          name: isArabic ? 'ليلى محمود' : 'Layla Mahmoud',
          title: isArabic ? 'طبيبة' : 'Doctor',
          text: isArabic 
            ? 'أفضل مدرب عملت معه! برنامج التخسيس كان فعالاً جداً والنتائج ظهرت بسرعة. شكراً رند'
            : 'Best trainer I\'ve ever worked with! The cutting program was very effective and results showed quickly. Thank you Rand',
          rating: 5,
          image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop'
        },
        {
          id: 3,
          name: isArabic ? 'نور الدين' : 'Nour Aldin',
          title: isArabic ? 'مصمم جرافيك' : 'Graphic Designer',
          text: isArabic 
            ? 'التدريب أونلاين كان مناسباً جداً لي. رند محترف ويستطيع فهم احتياجاتك بشكل مثالي'
            : 'Online training was so convenient for me. Rand is professional and understands your needs perfectly',
          rating: 5,
          image_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop'
        },
        {
          id: 4,
          name: isArabic ? 'مريم خالد' : 'Mariam Khaled',
          title: isArabic ? 'مديرة تسويق' : 'Marketing Manager',
          text: isArabic 
            ? 'برنامج التغذية كان مناسباً تماماً لنمط حياتي المزدحم. خسرت الوزن وزدت طاقة وثقة'
            : 'The nutrition program was perfectly suited to my busy lifestyle. Lost weight and gained energy and confidence',
          rating: 5,
          image_url: 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=400&h=400&fit=crop'
        },
        {
          id: 5,
          name: isArabic ? 'دانا سعيد' : 'Dana Saeed',
          title: isArabic ? 'صيدلانية' : 'Pharmacist',
          text: isArabic 
            ? 'المتابعة المستمرة والتحفيز الذي يقدمه رند لا مثيل له! شكراً على كل شيء'
            : 'The continuous follow-up and motivation that Rand provides is unmatched! Thank you for everything',
          rating: 5,
          image_url: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop'
        },
        {
          id: 6,
          name: isArabic ? 'ريم عبدالله' : 'Reem Abdullah',
          title: isArabic ? 'معلمة' : 'Teacher',
          text: isArabic 
            ? 'حياتي تغيرت بعد أن بدأت مع رند! ليس فقط جسدي، حتى صحتي النفسية تحسنت بشكل كبير'
            : 'My life changed after I started with Rand! Not just my body, even my mental health improved significantly',
          rating: 5,
          image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop'
        }
      ]
    }
  };
};

export default testimonialApi;