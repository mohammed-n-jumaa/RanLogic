import { FaDumbbell, FaFire, FaCrown } from 'react-icons/fa';

export const pricingPlans = [
  {
    id: 'starter',
    name: 'البرنامج الأساسي',
    tagline: 'للبداية المثالية',
    icon: FaDumbbell,
    monthlyPrice: 99,
    yearlyPrice: 950, 
    duration: 'شهر واحد',
    color: '#3b82f6', 
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    features: [
      { text: 'برنامج تدريب مخصص', included: true },
      { text: 'خطة تغذية أساسية', included: true },
      { text: 'متابعة أسبوعية', included: true },
      { text: 'دعم عبر الرسائل', included: true },
      { text: 'تمارين فيديو', included: true },
      { text: 'متابعة يومية', included: false },
      { text: 'استشارات خاصة', included: false },
      { text: 'برنامج مكملات', included: false }
    ],
    popular: false,
    description: 'مثالي للمبتدئات اللواتي يرغبن في بداية صحية ومنظمة'
  },
  {
    id: 'premium',
    name: 'برنامج التحول الذهبي',
    tagline: 'الأكثر شعبية',
    icon: FaFire,
    monthlyPrice: 299,
    yearlyPrice: 2870,
    duration: '3 أشهر',
    color: '#E91E63',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    features: [
      { text: 'برنامج تدريب متقدم', included: true },
      { text: 'خطة تغذية شاملة', included: true },
      { text: 'متابعة يومية', included: true },
      { text: 'دعم على مدار الساعة', included: true },
      { text: 'تمارين فيديو عالية الجودة', included: true },
      { text: 'استشارات أسبوعية', included: true },
      { text: 'تحليل جسم شامل', included: true },
      { text: 'برنامج مكملات مخصص', included: false }
    ],
    popular: true,
    description: 'برنامج شامل لتحقيق أهدافك في 3 أشهر مع متابعة مكثفة'
  },
  {
    id: 'elite',
    name: 'البرنامج الماسي',
    tagline: 'التجربة الكاملة',
    icon: FaCrown,
    monthlyPrice: 599,
    yearlyPrice: 5750,
    duration: '6 أشهر',
    color: '#fbbf24',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    features: [
      { text: 'برنامج VIP مخصص بالكامل', included: true },
      { text: 'خطة تغذية احترافية', included: true },
      { text: 'متابعة على مدار الساعة', included: true },
      { text: 'خط ساخن مباشر', included: true },
      { text: 'مكتبة تمارين حصرية', included: true },
      { text: 'استشارات خاصة مرتين أسبوعياً', included: true },
      { text: 'تحليل جسم متقدم شهرياً', included: true },
      { text: 'برنامج مكملات VIP', included: true }
    ],
    popular: false,
    description: 'البرنامج الأشمل للوصول لأفضل نسخة منك مع متابعة VIP'
  }
];

export const commonFeatures = [
  {
    title: 'تدريب مخصص',
    description: 'برامج تدريب مصممة خصيصاً لأهدافك ومستواك',
    icon: '💪'
  },
  {
    title: 'تغذية متكاملة',
    description: 'خطط غذائية صحية ولذيذة تناسب نمط حياتك',
    icon: '🥗'
  },
  {
    title: 'متابعة مستمرة',
    description: 'دعم يومي وتعديلات مستمرة على برنامجك',
    icon: '📊'
  },
  {
    title: 'نتائج مضمونة',
    description: 'التزامنا معك حتى تحققي أهدافك',
    icon: '🎯'
  }
];

export const pricingFAQs = [
  {
    question: 'هل يمكنني إلغاء الاشتراك في أي وقت؟',
    answer: 'نعم، يمكنك إلغاء اشتراكك في أي وقت. سيستمر الاشتراك حتى نهاية الفترة المدفوعة ولن يتم تجديده تلقائياً بعد ذلك.'
  },
  {
    question: 'هل توجد فترة تجريبية مجانية؟',
    answer: 'نقدم ضمان استرداد المال خلال 7 أيام الأولى إذا لم تكوني راضية عن البرنامج لأي سبب.'
  },
  {
    question: 'كيف تتم عملية الدفع؟',
    answer: 'نستخدم PayPal لضمان أمان معاملاتك. جميع المدفوعات مشفرة ومحمية بالكامل.'
  },
  {
    question: 'هل يمكنني تغيير الخطة لاحقاً؟',
    answer: 'بالطبع! يمكنك الترقية أو تغيير خطتك في أي وقت. سيتم حساب الفرق بشكل عادل.'
  },
  {
    question: 'ماذا يشمل الدعم على مدار الساعة؟',
    answer: 'يمكنك التواصل معنا في أي وقت عبر الرسائل وسنرد عليك في أقرب وقت ممكن، عادة خلال ساعات قليلة.'
  },
  {
    question: 'هل البرامج مناسبة للمبتدئين؟',
    answer: 'نعم! نصمم البرامج لتناسب جميع المستويات من المبتدئين إلى المحترفين. كل برنامج يتم تخصيصه حسب مستواك.'
  }
];