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

      return getDefaultCertifications(lang);
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
      console.error('Error creating certification:', error);
      throw error;
    }
  },

  updateCertification: async (id, data) => {
    try {
      const response = await api.put(`/admin/certifications/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating certification:', error);
      throw error;
    }
  },

  deleteCertification: async (id) => {
    try {
      const response = await api.delete(`/admin/certifications/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting certification:', error);
      throw error;
    }
  },

  reorderCertifications: async (order) => {
    try {
      const response = await api.post('/admin/certifications/reorder', { order });
      return response.data;
    } catch (error) {
      console.error('Error reordering certifications:', error);
      throw error;
    }
  },

  bulkUpdateCertifications: async (certifications) => {
    try {
      const response = await api.post('/admin/certifications/bulk-update', { certifications });
      return response.data;
    } catch (error) {
      console.error('Error bulk updating certifications:', error);
      throw error;
    }
  }
};

const getDefaultCertifications = (language = 'ar') => {
  const isArabic = language === 'ar';
  
  const defaultCertifications = [
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
  ];

  return {
    success: true,
    data: defaultCertifications
  };
};

export default certificationApi;