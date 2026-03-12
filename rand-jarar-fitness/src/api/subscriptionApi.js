import api from './index';

const subscriptionApi = {

  getPlans: async (language = null) => {
    try {
      const lang = language || localStorage.getItem('language') || 'ar';
      const response = await api.get('/subscriptions/plans', {
        params: { locale: lang }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      const lang = language || localStorage.getItem('language') || 'ar';
      return getDefaultPlans(lang);
    }
  },

  createPayPalPayment: async (data) => {
    try {
      const response = await api.post('/subscriptions/paypal/create', data);
      return response.data;
    } catch (error) {
      console.error('Error creating PayPal payment:', error.response?.data || error);
      throw error;
    }
  },

  capturePayPalPayment: async (token, subscriptionId) => {
    try {
      const response = await api.post('/subscriptions/paypal/capture', {
        token: token,
        subscription_id: Number(subscriptionId)
      });
      return response.data;
    } catch (error) {
      console.error('Error capturing PayPal payment:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  },

  createBankTransferSubscription: async (data) => {
    try {
      const response = await api.post('/subscriptions/bank-transfer', data);
      return response.data;
    } catch (error) {
      console.error('Error creating bank transfer subscription:', error.response?.data || error);
      throw error;
    }
  },

  // رفع إيصال بنك تحويل
  uploadBankReceipt: async (subscriptionId, data) => {
    try {
      const formData = new FormData();
      formData.append('bank_transfer_number', data.transferNumber);
      formData.append('receipt', data.receipt);

      const response = await api.post(`/subscriptions/${subscriptionId}/upload-receipt`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading bank receipt:', error.response?.data || error);
      throw error;
    }
  },

  // جلب اشتراكات المستخدم
  getUserSubscriptions: async () => {
    try {
      const response = await api.get('/subscriptions/my-subscriptions');
      return response.data;
    } catch (error) {
      console.error('Error fetching user subscriptions:', error.response?.data || error);
      throw error;
    }
  },

  // جلب الاشتراك النشط
  getActiveSubscription: async () => {
    try {
      const response = await api.get('/subscriptions/active');
      return response.data;
    } catch (error) {
      console.error('Error fetching active subscription:', error.response?.data || error);
      throw error;
    }
  },

  // جلب تفاصيل البنك (مؤقت)
  getBankDetails: async () => {
    try {
      const response = await api.get('/subscriptions/bank-details');
      return response.data;
    } catch (error) {
      console.error('Error fetching bank details:', error);
      return {
        success: true,
        data: {
          bank_name: 'National Commercial Bank',
          account_name: 'Rand Jarar',
          account_number: 'SA1234567890123456789012',
          iban: 'SA1234567890123456789012',
          swift_code: 'NCBKSARI',
          branch: 'Main Branch - Riyadh'
        }
      };
    }
  }
};

// بيانات افتراضية للخطط
const getDefaultPlans = (language = 'ar') => {
  const isArabic = language === 'ar';

  return {
    success: true,
    data: [
      {
        id: 'basic',
        name: isArabic ? 'الخطة الأساسية' : 'Basic Plan',
        subtitle: isArabic ? 'مثالي للبداية المستقلة' : 'Perfect for Independent Start',
        pricing: {
          '1month': { price: 39, originalPrice: 39, discount: 0 },
          '3months': { price: 111, originalPrice: 117, discount: 5 },
          '6months': { price: 210, originalPrice: 234, discount: 10 }
        },
        popular: false,
        features: isArabic
          ? [
              'مثالي للبداية المستقلة',
              'خريطة طريق واضحة لمن يحتاج هيكلة',
              'برنامج تدريب مخصص (نادي أو منزل)',
              'برنامج تغذية محسوب (ماكرو/سعرات)',
              'تحديثات شهرية للخطة'
            ]
          : [
              'Ideal choice for independent beginning',
              'Clear roadmap for those who need structure',
              'Customized workout plan (Gym or Home)',
              'Calculated nutrition plan (Macros/Calories)',
              'Monthly plan updates'
            ],
        color: 'blue',
        icon: '💪'
      },
      {
        id: 'nutrition',
        name: isArabic ? 'خطة التغذية' : 'Nutrition Plan',
        subtitle: isArabic ? 'حميتك تحت السيطرة' : 'Your Diet Under Control',
        pricing: {
          '1month': { price: 49, originalPrice: 49, discount: 0 },
          '3months': { price: 139, originalPrice: 147, discount: 5 },
          '6months': { price: 264, originalPrice: 294, discount: 10 }
        },
        popular: false,
        features: isArabic
          ? ['حميتك تحت السيطرة', 'حسابات دقيقة للسعرات والماكرو', 'قائمة تبديل أطعمة لمنع الملل', 'تحديثات شهرية للتغذية']
          : ['Your diet under control', 'Accurate calorie and macro calculations', 'Food exchange list to prevent boredom', 'Monthly nutrition updates'],
        color: 'green',
        icon: '🥗'
      },
      {
        id: 'elite',
        name: isArabic ? 'الخطة المتميزة' : 'Elite Plan',
        subtitle: isArabic ? 'التزام ومتابعة' : 'Commitment & Follow-up',
        pricing: {
          '1month': { price: 79, originalPrice: 79, discount: 0 },
          '3months': { price: 225, originalPrice: 237, discount: 5 },
          '6months': { price: 426, originalPrice: 474, discount: 10 }
        },
        popular: true,
        badge: isArabic ? 'الأكثر شعبية' : 'Most Popular',
        features: isArabic
          ? [
              'كل ما في الخطة الأساسية',
              'نتائج مضمونة مع الالتزام والمتابعة',
              'تعديلات دورية للتقدم الأمثل',
              'متابعة أسبوعية للتقدم',
              'دردشة لدعم استفساراتك',
              'إرشادات المكملات'
            ]
          : [
              'Everything in Basic Plan',
              'Guaranteed results with commitment and follow-up',
              'Regular adjustments for optimal progress',
              'Weekly progress check-ins',
              'Chat support for your questions',
              'Supplements guidance'
            ],
        color: 'pink',
        icon: '🔥'
      },
      {
        id: 'vip',
        name: isArabic ? 'الخطة VIP' : 'VIP Plan',
        subtitle: isArabic ? 'تجربة تدريب شخصي كاملة' : 'Complete Personal Training Experience',
        pricing: {
          '1month': { price: 149, originalPrice: 149, discount: 0 },
          '3months': { price: 424, originalPrice: 447, discount: 5 },
          '6months': { price: 804, originalPrice: 894, discount: 10 }
        },
        popular: false,
        features: isArabic
          ? ['كل ما في الخطة المتميزة', 'دعم مباشر يومي', 'أولوية في التواصل', 'جلسة استشارية شهرية فردية']
          : ['Everything in Elite Plan', 'Direct daily support', 'Priority communication', 'One-on-one monthly consulting session'],
        color: 'gold',
        icon: '👑'
      }
    ]
  };
};

export default subscriptionApi;
