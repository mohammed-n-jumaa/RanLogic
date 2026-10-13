import { t } from '../i18n';
// بيانات تجريبية للداشبورد
export const generateMockData = (timeFilter) => {
  const data = {
    metrics: {
      totalSubscriptions: 0,
      newRegistrations: 0,
      totalRevenue: 0,
      avgSubscriptionDuration: 0,
      completionRate: 0,
      previousPeriodChange: {
        subscriptions: 0,
        revenue: 0,
        registrations: 0
      }
    },
    growthData: [],
    revenueData: [],
    paymentStatusData: [],
    programTypeData: [],
    programCompletionData: [],
    engagementData: [],
    funnelData: [],
    heatmapData: [],
    alerts: [],
    insights: []
  };

  // ضبط القيم حسب الفترة الزمنية
  switch(timeFilter) {
    case 'this_week':
      data.metrics = {
        totalSubscriptions: 156,
        newRegistrations: 24,
        totalRevenue: 34500,
        avgSubscriptionDuration: 3.2,
        completionRate: 78,
        previousPeriodChange: {
          subscriptions: 12,
          revenue: 8,
          registrations: 18
        }
      };
      break;
    case 'this_month':
      data.metrics = {
        totalSubscriptions: 642,
        newRegistrations: 98,
        totalRevenue: 148500,
        avgSubscriptionDuration: 3.5,
        completionRate: 82,
        previousPeriodChange: {
          subscriptions: 15,
          revenue: 12,
          registrations: 22
        }
      };
      break;
    case 'last_3_months':
      data.metrics = {
        totalSubscriptions: 1845,
        newRegistrations: 285,
        totalRevenue: 425000,
        avgSubscriptionDuration: 3.8,
        completionRate: 85,
        previousPeriodChange: {
          subscriptions: 18,
          revenue: 15,
          registrations: 25
        }
      };
      break;
  }

  // بيانات النمو
  data.growthData = [
    { month: t('يناير'), subscriptions: 120 },
    { month: t('فبراير'), subscriptions: 135 },
    { month: t('مارس'), subscriptions: 148 },
    { month: t('أبريل'), subscriptions: 142 },
    { month: t('مايو'), subscriptions: 156 },
    { month: t('يونيو'), subscriptions: 162 },
  ];

  // بيانات الدخل
  data.revenueData = [
    { day: t('السبت'), revenue: 1200 },
    { day: t('الأحد'), revenue: 1800 },
    { day: t('الإثنين'), revenue: 1500 },
    { day: t('الثلاثاء'), revenue: 2200 },
    { day: t('الأربعاء'), revenue: 1900 },
    { day: t('الخميس'), revenue: 2500 },
    { day: t('الجمعة'), revenue: 2100 },
  ];

  // بيانات حالات الدفع
  data.paymentStatusData = [
    { name: t('مدفوع'), value: 156, color: '#4caf50' },
    { name: t('قيد الانتظار'), value: 24, color: '#ff9800' },
    { name: t('منتهي'), value: 12, color: '#f44336' },
    { name: t('ملغي'), value: 8, color: '#9e9e9e' },
  ];

  // بيانات أنواع البرامج
  data.programTypeData = [
    { name: t('تنشيف'), value: 65, color: '#e91e63' },
    { name: t('نحت'), value: 45, color: '#9c27b0' },
    { name: t('زيادة عضل'), value: 30, color: '#2196f3' },
    { name: t('لياقة عامة'), value: 25, color: '#4caf50' },
    { name: t('تغذية'), value: 15, color: '#ff9800' },
  ];

  // بيانات إنجاز البرامج
  data.programCompletionData = [
    { program: t('تنشيف'), completion: 82 },
    { program: t('نحت'), completion: 75 },
    { program: t('زيادة عضل'), completion: 68 },
    { program: t('لياقة عامة'), completion: 88 },
    { program: t('تغذية'), completion: 92 },
  ];

  // بيانات التفاعل
  data.engagementData = [
    { month: t('يناير'), workout: 75, nutrition: 82 },
    { month: t('فبراير'), workout: 78, nutrition: 85 },
    { month: t('مارس'), workout: 72, nutrition: 80 },
    { month: t('أبريل'), workout: 80, nutrition: 88 },
    { month: t('مايو'), workout: 85, nutrition: 90 },
    { month: t('يونيو'), workout: 82, nutrition: 87 },
  ];

  // بيانات المسار
  data.funnelData = [
    { stage: t('التسجيلات'), value: 200, fill: '#e91e63' },
    { stage: t('اشتراكات نشطة'), value: 156, fill: '#9c27b0' },
    { stage: t('التجديدات'), value: 120, fill: '#2196f3' },
    { stage: t('منتهية'), value: 45, fill: '#4caf50' },
  ];

  // بيانات التنبيهات
  data.alerts = [
    {
      id: 1,
      type: 'warning',
      title: t('اشتراكات تنتهي خلال 3 أيام'),
      count: 8,
      icon: 'Clock',
      color: '#ff9800'
    },
    {
      id: 2,
      type: 'info',
      title: t('اشتراكات تنتهي خلال 7 أيام'),
      count: 15,
      icon: 'Calendar',
      color: '#2196f3'
    },
    {
      id: 3,
      type: 'danger',
      title: t('مدفوعات متأخرة'),
      count: 5,
      icon: 'AlertCircle',
      color: '#f44336'
    },
    {
      id: 4,
      type: 'success',
      title: t('تجديدات هذا الشهر'),
      count: 23,
      icon: 'Users',
      color: '#4caf50'
    }
  ];

  // بيانات Insights
  data.insights = [
    {
      id: 1,
      icon: 'TrendingUp',
      text: t('هذا الشهر شهد زيادة 18% في الاشتراكات')
    },
    {
      id: 2,
      icon: 'Target',
      text: t('برامج التنشيف هي الأكثر طلبًا')
    },
    {
      id: 3,
      icon: 'Activity',
      text: t('الالتزام الغذائي أعلى من الالتزام الرياضي')
    },
    {
      id: 4,
      icon: 'TrendingUp',
      text: t('نسبة تجديد الاشتراكات 75%')
    }
  ];

  return data;
};

// وظائف مساعدة للبيانات
export const formatNumber = (num) => {
  return num.toLocaleString('ar-SA');
};

export const formatCurrency = (amount, currency = '$') => {
  return `${formatNumber(amount)} ${currency}`;
};

export const formatPercentage = (value) => {
  return `${value}%`;
};