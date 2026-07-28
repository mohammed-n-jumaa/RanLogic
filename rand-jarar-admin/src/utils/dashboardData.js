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
    { month: 'يناير', subscriptions: 120 },
    { month: 'فبراير', subscriptions: 135 },
    { month: 'مارس', subscriptions: 148 },
    { month: 'أبريل', subscriptions: 142 },
    { month: 'مايو', subscriptions: 156 },
    { month: 'يونيو', subscriptions: 162 },
  ];

  // بيانات الدخل
  data.revenueData = [
    { day: 'السبت', revenue: 1200 },
    { day: 'الأحد', revenue: 1800 },
    { day: 'الإثنين', revenue: 1500 },
    { day: 'الثلاثاء', revenue: 2200 },
    { day: 'الأربعاء', revenue: 1900 },
    { day: 'الخميس', revenue: 2500 },
    { day: 'الجمعة', revenue: 2100 },
  ];

  // بيانات حالات الدفع
  data.paymentStatusData = [
    { name: 'مدفوع', value: 156, color: '#4caf50' },
    { name: 'قيد الانتظار', value: 24, color: '#ff9800' },
    { name: 'منتهي', value: 12, color: '#f44336' },
    { name: 'ملغي', value: 8, color: '#9e9e9e' },
  ];

  // بيانات أنواع البرامج
  data.programTypeData = [
    { name: 'تنشيف', value: 65, color: '#e91e63' },
    { name: 'نحت', value: 45, color: '#9c27b0' },
    { name: 'زيادة عضل', value: 30, color: '#2196f3' },
    { name: 'لياقة عامة', value: 25, color: '#4caf50' },
    { name: 'تغذية', value: 15, color: '#ff9800' },
  ];

  // بيانات إنجاز البرامج
  data.programCompletionData = [
    { program: 'تنشيف', completion: 82 },
    { program: 'نحت', completion: 75 },
    { program: 'زيادة عضل', completion: 68 },
    { program: 'لياقة عامة', completion: 88 },
    { program: 'تغذية', completion: 92 },
  ];

  // بيانات التفاعل
  data.engagementData = [
    { month: 'يناير', workout: 75, nutrition: 82 },
    { month: 'فبراير', workout: 78, nutrition: 85 },
    { month: 'مارس', workout: 72, nutrition: 80 },
    { month: 'أبريل', workout: 80, nutrition: 88 },
    { month: 'مايو', workout: 85, nutrition: 90 },
    { month: 'يونيو', workout: 82, nutrition: 87 },
  ];

  // بيانات المسار
  data.funnelData = [
    { stage: 'التسجيلات', value: 200, fill: '#e91e63' },
    { stage: 'اشتراكات نشطة', value: 156, fill: '#9c27b0' },
    { stage: 'التجديدات', value: 120, fill: '#2196f3' },
    { stage: 'منتهية', value: 45, fill: '#4caf50' },
  ];

  // بيانات التنبيهات
  data.alerts = [
    {
      id: 1,
      type: 'warning',
      title: 'اشتراكات تنتهي خلال 3 أيام',
      count: 8,
      icon: 'Clock',
      color: '#ff9800'
    },
    {
      id: 2,
      type: 'info',
      title: 'اشتراكات تنتهي خلال 7 أيام',
      count: 15,
      icon: 'Calendar',
      color: '#2196f3'
    },
    {
      id: 3,
      type: 'danger',
      title: 'مدفوعات متأخرة',
      count: 5,
      icon: 'AlertCircle',
      color: '#f44336'
    },
    {
      id: 4,
      type: 'success',
      title: 'تجديدات هذا الشهر',
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
      text: 'هذا الشهر شهد زيادة 18% في الاشتراكات'
    },
    {
      id: 2,
      icon: 'Target',
      text: 'برامج التنشيف هي الأكثر طلبًا'
    },
    {
      id: 3,
      icon: 'Activity',
      text: 'الالتزام الغذائي أعلى من الالتزام الرياضي'
    },
    {
      id: 4,
      icon: 'TrendingUp',
      text: 'نسبة تجديد الاشتراكات 75%'
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