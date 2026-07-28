import api from './index';

// ── منصات السوشيال ميديا — نفس القائمة المستخدمة في الداش بورد ──────────────
const socialPlatforms = [
  { value: 'instagram', label: 'Instagram', bg: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', icon: 'fab fa-instagram'  },
  { value: 'facebook',  label: 'Facebook',  bg: '#1877F2', icon: 'fab fa-facebook-f'  },
  { value: 'twitter',   label: 'X', bg: '#000',  icon: 'fab fa-x-twitter'   },
  { value: 'tiktok',    label: 'TikTok',    bg: '#010101', icon: 'fab fa-tiktok'       },
  { value: 'youtube',   label: 'YouTube',   bg: '#FF0000', icon: 'fab fa-youtube'      },
  { value: 'whatsapp',  label: 'WhatsApp',  bg: '#25D366', icon: 'fab fa-whatsapp'     },
  { value: 'telegram',  label: 'Telegram',  bg: '#0088CC', icon: 'fab fa-telegram'     },
  { value: 'snapchat',  label: 'Snapchat',  bg: '#FFFC00', icon: 'fab fa-snapchat', iconColor: '#000' },
  { value: 'linkedin',  label: 'LinkedIn',  bg: '#0A66C2', icon: 'fab fa-linkedin-in'  },
  { value: 'pinterest', label: 'Pinterest', bg: '#E60023', icon: 'fab fa-pinterest'    },
  { value: 'threads',   label: 'Threads',   bg: '#000',    icon: 'fab fa-threads'      },
  { value: 'alfan',     label: 'Alfan',     bg: '#E8000D', icon: 'fas fa-star'         },
];

const getPlatform = (value) =>
  socialPlatforms.find(p => p.value === value) ??
  { value, label: value, bg: '#555', icon: 'fas fa-link', iconColor: '#fff' };

// ── روابط سريعة ثابتة ────────────────────────────────────────────────────────
const quickLinks = {
  ar: [
    { name: 'الرئيسية',        href: '#home',                type: 'anchor' },
    { name: 'حاسبة السعرات',   href: '/calorie-calculator',  type: 'route'  },
    { name: 'حاسبة الوجبة',    href: '/meal-calculator',     type: 'route'  },
    { name: 'سياسة الخصوصية', href: '/privacy-policy',      type: 'route'  },
    { name: 'شروط الاستخدام',  href: '/terms-of-service',    type: 'route'  },
    { name: 'سياسة الاسترجاع', href: '/refund-policy',       type: 'route'  },
    { name: 'تواصل معنا',      href: '/contact',             type: 'route'  },
  ],
  en: [
    { name: 'Home',               href: '#home',               type: 'anchor' },
    { name: 'Calorie Calculator', href: '/calorie-calculator', type: 'route'  },
    { name: 'Meal Calculator',    href: '/meal-calculator',    type: 'route'  },
    { name: 'Privacy Policy',     href: '/privacy-policy',     type: 'route'  },
    { name: 'Terms of Service',   href: '/terms-of-service',   type: 'route'  },
    { name: 'Refund Policy',      href: '/refund-policy',      type: 'route'  },
    { name: 'Contact Us',         href: '/contact',            type: 'route'  },
  ],
};

// ── بيانات افتراضية تُستخدم قبل جلب الـ API أو عند فشله ─────────────────────
const getDefaultData = (lang = 'ar') => {
  const isAr = lang === 'ar';
  const year = new Date().getFullYear();
  return {
    logo: null,
    description_ar: 'فريق من المدربين ومختصي التغذية المعتمدين يقدمون لك خطة متكاملة نحو جسم صحي ومتوازن.',
    description_en: 'A team of certified trainers and nutrition specialists providing you with a comprehensive plan for a healthy, balanced body.',
    copyright_ar:   `© ${year} RanLogic. جميع الحقوق محفوظة.`,
    copyright_en:   `© ${year} RanLogic. All rights reserved.`,
    quick_links_title_ar: 'روابط سريعة',
    quick_links_title_en: 'Quick Links',
    email:      '',
    phone:      '',
    address_ar: '',
    address_en: '',
    social_links: [
      { platform: 'instagram', url: 'https://instagram.com/ranlogicc' },
      { platform: 'tiktok',    url: 'https://tiktok.com/@ranlogicc'   },
      { platform: 'youtube',   url: 'https://youtube.com/@ranlogic'   },
      { platform: 'twitter',   url: 'https://twitter.com/ranLogic'    },
    ],
  };
};

const footerApi = {
  socialPlatforms,
  getPlatform,
  quickLinks,
  getDefaultData,

  getFooter: async (lang = 'ar') => {
    try {
      const response = await api.get('/footer/public');
      if (response.data?.success && response.data?.data) {
        return { success: true, data: response.data.data };
      }
      return { success: true, data: getDefaultData(lang) };
    } catch (error) {
      console.error('Footer API error:', error);
      return { success: true, data: getDefaultData(lang) };
    }
  },

  getFooterForAdmin: async () => {
    try {
      const response = await api.get('/admin/footer');
      return response.data;
    } catch (error) {
      console.error('Admin footer error:', error);
      throw error;
    }
  },

  updateSocialLinks: async (socialLinks) => {
    try {
      const response = await api.put('/admin/footer', { social_links: socialLinks });
      return response.data;
    } catch (error) {
      console.error('Update social links error:', error);
      throw error;
    }
  },
};

export default footerApi;