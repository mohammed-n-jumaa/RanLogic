import api from './index';

const certificationApi = {

  getCertifications: async (language = null) => {
    try {
      const lang = language || localStorage.getItem('language') || 'ar';
      const response = await api.get('/certifications/public', {
        params: { locale: lang }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching certifications:', error);
      return getDefaultCertifications(language || localStorage.getItem('language') || 'ar');
    }
  },

  getAdminCertifications: async () => {
    try {
      const response = await api.get('/admin/certifications');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin certifications:', error);
      throw error;
    }
  },

  createCertification: async (data) => {
    try {
      const response = await api.post('/admin/certifications', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateCertification: async (id, data) => {
    try {
      const response = await api.put(`/admin/certifications/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteCertification: async (id) => {
    try {
      const response = await api.delete(`/admin/certifications/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  reorderCertifications: async (order) => {
    try {
      const response = await api.post('/admin/certifications/reorder', { order });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  bulkUpdateCertifications: async (certifications) => {
    try {
      const response = await api.post('/admin/certifications/bulk-update', { certifications });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// ── البيانات الافتراضية ────────────────────────────────────────────────────────
const getDefaultCertifications = (language = 'ar') => {
  const isAr = language === 'ar';

  const data = [
    {
      id: 1,
      icon: '🏆',
      title:        isAr ? 'شهادة تدريب وتأهيل رياضي'           : 'Sports Training & Rehabilitation Certificate',
      organization: isAr ? 'جامعة البتراء'                       : 'University of Petra',
      is_verified: true,
      order: 1,
    },
    {
      id: 2,
      icon: '🍎',
      title:        isAr ? 'أخصائية تغذية معتمدة'                : 'Certified Nutritionist Specialist',
      organization: isAr ? 'Jump Academy'                        : 'Jump Academy',
      is_verified: true,
      order: 2,
    },
    {
      id: 3,
      icon: '⚡',
      title:        isAr ? 'دورة تصميم برامج المقاومة'           : 'Resistance Training Program Design Course',
      organization: isAr ? 'Jump Academy'                        : 'Jump Academy',
      is_verified: true,
      order: 3,
    },
    {
      id: 4,
      icon: '🥗',
      title:        isAr ? 'دورة وضع أنظمة غذائية'              : 'Nutrition Plans Development Course',
      organization: isAr ? 'Jump Academy'                        : 'Jump Academy',
      is_verified: true,
      order: 4,
    },
    {
      id: 5,
      icon: '💉',
      title:        isAr ? 'دورة أنظمة غذائية لمرضى السكري'     : 'Diabetic Nutrition Plans Course',
      organization: isAr ? 'Jump Academy'                        : 'Jump Academy',
      is_verified: true,
      order: 5,
    },
    {
      id: 6,
      icon: '💪',
      title:        isAr ? 'دورة تغذية الرياضيين'               : 'Sports Nutrition Course',
      organization: isAr ? 'Jump Academy'                        : 'Jump Academy',
      is_verified: true,
      order: 6,
    },
    {
      id: 7,
      icon: '📱',
      title:        isAr ? 'دورة تسويق رياضي'                   : 'Sports Marketing Course',
      organization: isAr ? 'Jump Academy'                        : 'Jump Academy',
      is_verified: true,
      order: 7,
    },
  ];

  return { success: true, data };
};

export { getDefaultCertifications };
export default certificationApi;