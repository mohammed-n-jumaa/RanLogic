import api from './index';

const footerApi = {
  // جلب بيانات الفوتر للصفحة العامة
  getFooter: async (language = null) => {
    try {
      const lang = language || localStorage.getItem('language') || 'ar';
      const response = await api.get('/footer/public');
      return response.data;
    } catch (error) {
      console.error('Error fetching footer:', error);
      // إرجاع بيانات افتراضية في حالة الخطأ
      return getDefaultFooterData(lang);
    }
  },

  // جلب بيانات الفوتر للوحة الإدارة
  getFooterForAdmin: async () => {
    try {
      const response = await api.get('/admin/footer');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin footer:', error);
      throw error;
    }
  },

  // تحديث روابط السوشيال ميديا فقط
  updateSocialLinks: async (socialLinks) => {
    try {
      const response = await api.put('/admin/footer', { social_links: socialLinks });
      return response.data;
    } catch (error) {
      console.error('Error updating social links:', error);
      throw error;
    }
  },

  // منصات السوشيال ميديا المدعومة
  socialPlatforms: [
    { value: 'facebook', label: 'Facebook', icon: 'fab fa-facebook-f', color: '#1877F2' },
    { value: 'instagram', label: 'Instagram', icon: 'fab fa-instagram', color: '#E4405F' },
    { value: 'twitter', label: 'Twitter', icon: 'fab fa-twitter', color: '#1DA1F2' },
    { value: 'youtube', label: 'YouTube', icon: 'fab fa-youtube', color: '#FF0000' },
    { value: 'tiktok', label: 'TikTok', icon: 'fab fa-tiktok', color: '#000000' },
    { value: 'whatsapp', label: 'WhatsApp', icon: 'fab fa-whatsapp', color: '#25D366' },
    { value: 'linkedin', label: 'LinkedIn', icon: 'fab fa-linkedin-in', color: '#0A66C2' },
    { value: 'snapchat', label: 'Snapchat', icon: 'fab fa-snapchat-ghost', color: '#FFFC00' },
  ],

  // روابط سريعة ثابتة
  quickLinks: [
    { text_en: 'Home', text_ar: 'الرئيسية', url: '#home' },
    { text_en: 'About Coach', text_ar: 'عن المدرب', url: '#about' },
    { text_en: 'Programs', text_ar: 'البرامج', url: '#programs' },
    { text_en: 'Testimonials', text_ar: 'آراء العملاء', url: '#testimonials' },
  ],

  // روابط قانونية ثابتة
  legalLinks: [
    { text_en: 'Privacy Policy', text_ar: 'سياسة الخصوصية', url: '/privacy' },
    { text_en: 'Terms & Conditions', text_ar: 'الشروط والأحكام', url: '/terms' },
  ],
};

// بيانات افتراضية للفوتر
const getDefaultFooterData = (language = 'ar') => {
  const isArabic = language === 'ar';
  
  return {
    success: true,
    data: {
      logo: {
        url: '/images/logo.png',
        alt: 'RAND JARAR Logo'
      },
      description: isArabic 
        ? 'مدربة لياقة بدنية معتمدة دولياً تساعدك في تحقيق أهدافك'
        : 'Internationally Certified Fitness Coach helping you achieve your goals',
      copyright: isArabic
        ? '© 2026 RAND JARAR. جميع الحقوق محفوظة.'
        : '© 2026 RAND JARAR. All rights reserved.',
      quick_links_title: isArabic ? 'روابط سريعة' : 'Quick Links',
      quick_links: footerApi.quickLinks.map(link => ({
        text: isArabic ? link.text_ar : link.text_en,
        url: link.url
      })),
      legal_links: footerApi.legalLinks.map(link => ({
        text: isArabic ? link.text_ar : link.text_en,
        url: link.url
      })),
      social_links: [
        { platform: 'facebook', url: 'https://facebook.com/randjarar' },
        { platform: 'instagram', url: 'https://instagram.com/randjarar' },
        { platform: 'twitter', url: 'https://twitter.com/randjarar' },
      ],
    
    }
  };
};

export default footerApi;