import apiClient from './apiClient';

const footerApi = {

  getFooterForAdmin: async () => {
    try {
      const res = await apiClient.get('/admin/footer');
      return { success: true, data: res.data.data };
    } catch (error) {
      return { success: false, data: null, message: error.response?.data?.message || 'فشل في جلب البيانات' };
    }
  },

  updateFooter: async (data) => {
    try {
      const res = await apiClient.put('/admin/footer', data);
      return { success: true, data: res.data.data, message: res.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'فشل في الحفظ' };
    }
  },

  socialPlatforms: [
    { value: 'instagram', label: 'Instagram', bg: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', icon: 'fab fa-instagram'  },
    { value: 'facebook',  label: 'Facebook',  bg: '#1877F2', icon: 'fab fa-facebook-f'  },
    { value: 'twitter',   label: 'X (Twitter)', bg: '#000',  icon: 'fab fa-x-twitter'   },
    { value: 'tiktok',    label: 'TikTok',    bg: '#010101', icon: 'fab fa-tiktok'       },
    { value: 'youtube',   label: 'YouTube',   bg: '#FF0000', icon: 'fab fa-youtube'      },
    { value: 'whatsapp',  label: 'WhatsApp',  bg: '#25D366', icon: 'fab fa-whatsapp'     },
    { value: 'telegram',  label: 'Telegram',  bg: '#0088CC', icon: 'fab fa-telegram'     },
    { value: 'snapchat',  label: 'Snapchat',  bg: '#FFFC00', icon: 'fab fa-snapchat', iconColor: '#000' },
    { value: 'linkedin',  label: 'LinkedIn',  bg: '#0A66C2', icon: 'fab fa-linkedin-in'  },
    { value: 'pinterest', label: 'Pinterest', bg: '#E60023', icon: 'fab fa-pinterest'    },
    { value: 'threads',   label: 'Threads',   bg: '#000',    icon: 'fab fa-threads'      },
    { value: 'alfan',     label: 'Alfan',     bg: '#E8000D', icon: 'fas fa-star'         },
  ],

  getPlatform(value) {
    return this.socialPlatforms.find(p => p.value === value)
      ?? { value, label: value, bg: '#555', icon: 'fas fa-link' };
  },
};

export default footerApi;