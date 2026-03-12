import api from './index';

const faqApi = {
  // جلب بيانات FAQ للصفحة العامة
  getFaq: async (language = null) => {
    try {
      const lang = language || localStorage.getItem('language') || 'ar';
      const response = await api.get('/faq/public', {
        params: { locale: lang }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching FAQ:', error);
      // إرجاع بيانات افتراضية في حالة الخطأ
      return getDefaultFaqData(lang);
    }
  },

  // إرسال سؤال جديد من المستخدم
  submitUserQuestion: async (data) => {
    try {
      const response = await api.post('/faq/user-question', data);
      return response.data;
    } catch (error) {
      console.error('Error submitting user question:', error);
      throw error;
    }
  },

  // جلب بيانات FAQ للوحة الإدارة
  getAdminFaq: async () => {
    try {
      const response = await api.get('/admin/faq');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin FAQ:', error);
      throw error;
    }
  },

  // تحديث جميع بيانات FAQ
  updateAllFaq: async (data) => {
    try {
      const response = await api.post('/admin/faq/update-all', data);
      return response.data;
    } catch (error) {
      console.error('Error updating FAQ:', error);
      throw error;
    }
  }
};

// بيانات افتراضية للـ FAQ
const getDefaultFaqData = (language = 'ar') => {
  const isArabic = language === 'ar';
  
  const defaultFaq = {
    section: {
      title: isArabic ? 'الأسئلة الشائعة' : 'Frequently Asked Questions',
      subtitle: isArabic ? 'كل ما تحتاج معرفته عن رحلتك الرياضية ❤️' : 'Everything you need to know about your fitness journey 🤍'
    },
    questions: [
      {
        id: 1,
        category: isArabic ? 'أسئلة عامة' : 'General Questions',
        question: isArabic ? 'أنا مبتدئ، هل البرنامج يناسبني؟' : 'I\'m a beginner, does the program suit me?',
        answer: isArabic ? 'بالتأكيد، برامجنا تتدرج من المستوى صفر إلى المستوى المحترف.' : 'Of course, our programs progress from zero to professional level.',
        icon: '🚀'
      },
      {
        id: 2,
        category: isArabic ? 'أسئلة عامة' : 'General Questions',
        question: isArabic ? 'هل أحتاج للتدريب في النادي؟' : 'Do I need to train at the gym?',
        answer: isArabic ? 'لا، نوفر خطط تمرين منزلية (بوزن الجسم) وخطط نادي أيضاً.' : 'No, we provide home workout plans (bodyweight) and gym plans as well.',
        icon: '🏋️'
      },
      {
        id: 3,
        category: isArabic ? 'التغذية' : 'Nutrition',
        question: isArabic ? 'هل النظام الغذائي مقيد؟' : 'Is the diet restrictive?',
        answer: isArabic ? 'لا على الإطلاق، نظامنا مرن ومبني على حساب السعرات مع الأطعمة التي تحبها.' : 'Not at all, our system is flexible and based on calorie counting with the foods you love.',
        icon: '🥗'
      },
      {
        id: 4,
        category: isArabic ? 'التغذية' : 'Nutrition',
        question: isArabic ? 'هل هناك خيارات للنباتيين؟' : 'Are there vegetarian options?',
        answer: isArabic ? 'نعم، الخطط متاحة لجميع أنواع التفضيلات الغذائية والحساسية.' : 'Yes, plans are available for all types of dietary preferences and allergies.',
        icon: '🌱'
      },
      {
        id: 5,
        category: isArabic ? 'النتائج والمتابعة' : 'Results & Follow-up',
        question: isArabic ? 'متى ستظهر النتائج؟' : 'When will results appear?',
        answer: isArabic ? 'مع الالتزام، ستلاحظ فرقاً حقيقياً خلال 4 إلى 8 أسابيع.' : 'With commitment, you will notice a real difference within 4 to 8 weeks.',
        icon: '📈'
      },
      {
        id: 6,
        category: isArabic ? 'النتائج والمتابعة' : 'Results & Follow-up',
        question: isArabic ? 'هل هناك متابعة شخصية؟' : 'Is there personal follow-up?',
        answer: isArabic ? 'نعم، حسب خطتك يمكنك التواصل مباشرة مع المدرب.' : 'Yes, depending on your plan you can communicate directly with the coach.',
        icon: '💬'
      },
      {
        id: 7,
        category: isArabic ? 'الاشتراك' : 'Subscription',
        question: isArabic ? 'كيف أصل للبرنامج؟' : 'How do I access the program?',
        answer: isArabic ? 'من خلال هاتفك أو حاسوبك في أي وقت ومن أي مكان.' : 'Through your phone or computer anytime and from anywhere.',
        icon: '🌐'
      },
      {
        id: 8,
        category: isArabic ? 'الاشتراك' : 'Subscription',
        question: isArabic ? 'هل يمكنني إلغاء اشتراكي؟' : 'Can I cancel my subscription?',
        answer: isArabic ? 'نعم، يمكنك إلغاء أو تعديل اشتراكك بسهولة بنقرة واحدة.' : 'Yes, you can cancel or modify your subscription easily with one click.',
        icon: '✅'
      }
    ]
  };

  return {
    success: true,
    data: defaultFaq
  };
};

export default faqApi;