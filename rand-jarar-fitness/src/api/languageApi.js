import api from './index';

const languageApi = {
  // تغيير لغة المستخدم (محلي فقط بدون API)
  changeLanguage: async (language) => {
    try {
      // تغيير اللغة محلياً فقط بدون إرسال للخادم
      const response = { 
        data: { 
          success: true, 
          message: 'Language changed successfully',
          data: {
            language: language,
            direction: language === 'ar' ? 'rtl' : 'ltr'
          }
        } 
      };
      
      return response.data;
    } catch (error) {
      console.error('Error changing language:', error);
      
      // Fallback: تغيير محلي فقط
      const fallbackResponse = { 
        data: { 
          success: true, 
          message: 'Language changed locally',
          data: {
            language: language,
            direction: language === 'ar' ? 'rtl' : 'ltr'
          }
        } 
      };
      
      return fallbackResponse.data;
    }
  },

  // جلب الشعار مع اللغة الحالية
  getActiveLogo: async () => {
    try {
      const response = await api.get('/logo/active');
      return response.data;
    } catch (error) {
      console.error('Error fetching logo:', error);
      return {
        success: false,
        message: 'Failed to fetch logo',
        data: null
      };
    }
  },

  // جلب بيانات الهيرو سيكشن
  getHeroSection: async () => {
    try {
      const language = localStorage.getItem('language') || 'ar';
      const response = await api.get('/hero-section/public', {
        params: { locale: language }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching hero section:', error);
      return getDefaultHeroData();
    }
  },

  // جبل بيانات "عن المدرب"
  getAboutCoach: async () => {
    try {
      const language = localStorage.getItem('language') || 'ar';
      const response = await api.get('/about-coach/public', {
        params: { locale: language }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching about coach:', error);
      return getDefaultAboutData();
    }
  },

  // جلب الشهادات
  getCertifications: async () => {
    try {
      const language = localStorage.getItem('language') || 'ar';
      const response = await api.get('/certifications/public', {
        params: { locale: language }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching certifications:', error);
      return getDefaultCertifications();
    }
  },

  // جلب كل البيانات للصفحة الرئيسية
  getHomePageData: async () => {
    try {
      const language = localStorage.getItem('language') || 'ar';
      
      // جلب كل البيانات بالتوازي
      const [heroData, aboutData, certsData] = await Promise.all([
        this.getHeroSection(),
        this.getAboutCoach(),
        this.getCertifications()
      ]);
      
      return {
        hero: heroData,
        about: aboutData,
        certifications: certsData,
        language: language
      };
    } catch (error) {
      console.error('Error fetching home page data:', error);
      throw error;
    }
  },

  // التحقق من اتصال API
  checkApiConnection: async () => {
    try {
      await api.get('/');
      return {
        connected: true,
        message: 'API connected successfully'
      };
    } catch (error) {
      return {
        connected: false,
        message: 'API connection failed'
      };
    }
  }
};

// ===================================
// البيانات الافتراضية
// ===================================

const getDefaultHeroData = () => {
  const language = localStorage.getItem('language') || 'ar';
  const isArabic = language === 'ar';
  
  return {
    success: true,
    data: {
      video_url: 'https://www.youtube.com/embed/-jFk6lUZ6Fg?autoplay=1&mute=1&loop=1&playlist=-jFk6lUZ6Fg&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1',
      badge: isArabic ? 'برنامج تدريبي مخصص لك' : 'Personalized Training Program',
      main_title: isArabic ? 'دَرْبِ جِسْمَك بِنَقَةٍ' : 'Train Your Body with Confidence',
      sub_title: isArabic ? 'برنامج مصمم خصيصاً لك' : 'A Program Designed Just for You',
      description: isArabic 
        ? 'تدريب وتغذية مبنية على جسمك، هدفك، ونمط حياتك<br/>ابدأ رحلتك نحو النسخة الأفضل منك'
        : 'Training and nutrition based on your body, goals, and lifestyle<br/>Start your journey towards the best version of yourself',
      stats: [
        { value: '+500', label: isArabic ? 'متدرج سعيد' : 'Happy Trainees' },
        { value: '+5', label: isArabic ? 'سنوات خبرة' : 'Years Experience' },
        { value: '98%', label: isArabic ? 'نسبة النجاح' : 'Success Rate' }
      ]
    }
  };
};

const getDefaultAboutData = () => {
  const language = localStorage.getItem('language') || 'ar';
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

const getDefaultCertifications = () => {
  const language = localStorage.getItem('language') || 'ar';
  const isArabic = language === 'ar';
  
  return {
    success: true,
    data: [
      {
        id: 1,
        icon: '🎖️',
        title: isArabic ? 'مدربة معتمدة' : 'Certified Trainer',
        organization: isArabic ? 'أكاديمية العلوم الرياضية الوطنية (الولايات المتحدة)' : 'NASM – National Academy of Sports Medicine (USA)',
        is_verified: true,
        order: 1
      },
      {
        id: 2,
        icon: '🏆',
        title: isArabic ? 'اختصاصي رياضة دولي' : 'International Sports Specialist',
        organization: isArabic ? 'الجمعية الدولية لعلوم الرياضة' : 'ISSA – International Sports Sciences Association',
        is_verified: true,
        order: 2
      },
      {
        id: 3,
        icon: '🥇',
        title: isArabic ? 'مدرب تمرين أمريكي' : 'American Exercise Coach',
        organization: isArabic ? 'المجلس الأمريكي للتمرين' : 'ACE – American Council on Exercise',
        is_verified: true,
        order: 3
      },
      {
        id: 4,
        icon: '⭐',
        title: isArabic ? 'مدرب قوة وتكييف' : 'Strength & Conditioning Coach',
        organization: isArabic ? 'الجمعية الوطنية للقوة والتكييف' : 'NSCA – National Strength & Conditioning Association',
        is_verified: true,
        order: 4
      },
      {
        id: 5,
        icon: '🎓',
        title: isArabic ? 'مدرب كروس فيت دولي' : 'CrossFit International Trainer',
        organization: isArabic ? 'كروس فيت المستوى 1' : 'CrossFit Level 1 Trainer (International)',
        is_verified: true,
        order: 5
      },
      {
        id: 6,
        icon: '🧘',
        title: isArabic ? 'مدرب يوغا معتمد' : 'Certified Yoga Trainer',
        organization: isArabic ? 'تحالف اليوجا - RYT معتمد' : 'Yoga Alliance – RYT Certified',
        is_verified: true,
        order: 6
      }
    ]
  };
};

export default languageApi;