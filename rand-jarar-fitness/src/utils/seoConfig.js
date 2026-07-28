// ============================================================
// seoConfig.js — RanLogic  (Bilingual: Arabic + English)
// ============================================================

export const siteConfig = {
  siteName: 'RanLogic',
  siteUrl: 'https://ranlogic.com',
  defaultLanguage: 'ar',
  supportedLanguages: ['ar', 'en'],
  email: 'info@ranlogic.com',

  social: {
    instagram: 'https://www.instagram.com/ran.logicc/',
    twitter: 'https://x.com/ranLogic',
    youtube: 'https://www.youtube.com/@Ran_Logic',
    tiktok: 'https://tiktok.com/@ranlogic'
  },

  logo: '/icons/icon-512x512.png',
  defaultOgImage: '/og-image.jpg',
  favicon: '/favicon.ico',

  googleAnalyticsId: '',   // G-XXXXXXXXXX
  googleTagManagerId: '',   // GTM-XXXXXXX
  facebookPixelId: '',   // 123456789
};

// ============================================================
// Per-page SEO — Arabic & English
// ============================================================
export const pagesSEO = {

  // ── HOME ──────────────────────────────────────────────────
  home: {
    ar: {
      title: 'RanLogic | فريق مدربين ومختصي تغذية أونلاين - برامج تدريب ونظام غذائي مخصص',
      description: 'RanLogic منصة لياقة بدنية متكاملة: مدربين شخصيين معتمدين + مختصي تغذية + حاسبة سعرات مجانية + برامج مخصصة لحرق الدهون وبناء العضلات. اشترك الآن!',
      keywords: 'مدرب شخصي أونلاين, مختص تغذية أونلاين, برنامج تدريبي مخصص, نظام غذائي, حرق دهون, بناء عضلات, لياقة بدنية, كوتش رياضي, فريق مدربين, RanLogic, رانلوجيك, حاسبة سعرات',
      ogImage: '/og-image.jpg'
    },
    en: {
      title: 'RanLogic | Online Personal Trainers & Nutrition Specialists - Custom Programs',
      description: 'RanLogic is a complete fitness platform: certified personal trainers + nutrition specialists + free calorie calculator + custom programs for fat loss, muscle building & more. Join now!',
      keywords: 'online personal trainer, online nutritionist, custom workout program, nutrition plan, fat loss program, muscle building, fitness coach, RanLogic, calorie calculator, online fitness team',
      ogImage: '/og-image.jpg'
    }
  },

  // ── PLANS ─────────────────────────────────────────────────
  plans: {
    ar: {
      title: 'باقات الاشتراك | خطط تدريب وتغذية أونلاين - RanLogic',
      description: 'اختر باقتك من بين خطط تدريب شخصي + تغذية مخصصة بأسعار مناسبة. اشتراكات شهرية وسنوية مع متابعة يومية من فريق RanLogic.',
      keywords: 'اشتراك تدريب أونلاين, باقات لياقة بدنية, أسعار مدرب شخصي, خطط تغذية, اشتراك شهري تدريب, باقات RanLogic',
      ogImage: '/og-image.jpg'
    },
    en: {
      title: 'Subscription Plans | Online Training & Nutrition Packages - RanLogic',
      description: 'Choose your plan: personal training + custom nutrition at flexible prices. Monthly and annual subscriptions with daily follow-up from the RanLogic team.',
      keywords: 'online training subscription, fitness packages pricing, personal trainer cost, nutrition plan packages, monthly training plan, RanLogic plans, workout subscription',
      ogImage: '/og-image.jpg'
    }
  },

  // ── FAQ ───────────────────────────────────────────────────
  faq: {
    ar: {
      title: 'الأسئلة الشائعة | كل ما تريد معرفته عن التدريب والتغذية أونلاين - RanLogic',
      description: 'إجابات على أكثر الأسئلة شيوعاً: كيف يعمل التدريب أونلاين؟ ما الفرق بين الباقات؟ كيف يُصمَّم النظام الغذائي؟ وأكثر.',
      keywords: 'أسئلة تدريب أونلاين, كيف أبدأ التدريب, نظام غذائي كيف يعمل, باقات التدريب FAQ, أسئلة لياقة بدنية',
      ogImage: '/og-image.jpg'
    },
    en: {
      title: 'FAQ | Everything About Online Training & Nutrition - RanLogic',
      description: 'Answers to common questions: How does online training work? What\'s included in each plan? How is the nutrition plan designed? The RanLogic team answers.',
      keywords: 'online training FAQ, how to start workout plan, nutrition plan questions, fitness packages guide, personal trainer FAQ, RanLogic questions',
      ogImage: '/og-image.jpg'
    }
  },

  // ── CALORIE CALCULATOR ────────────────────────────────────
  calorieCalculator: {
    ar: {
      title: 'حاسبة السعرات الحرارية المجانية | احسب احتياجاتك اليومية - RanLogic',
      description: 'أداة مجانية لحساب السعرات الحرارية اليومية، البروتين، الكربوهيدرات، والدهون بناءً على وزنك وطولك وهدفك. مقدمة مجاناً من فريق RanLogic.',
      keywords: 'حاسبة سعرات حرارية, حساب السعرات اليومية, كم سعرة أحتاج, حاسبة BMR TDEE, أداة حساب وزن, حاسبة تغذية مجانية',
      ogImage: '/og-image.jpg'
    },
    en: {
      title: 'Free Calorie Calculator | Calculate Your Daily Needs - RanLogic',
      description: 'Free tool to calculate your daily calories, protein, carbs, and fats based on your weight, height, age, and fitness goal. Provided free by the RanLogic team.',
      keywords: 'calorie calculator, daily calorie needs, how many calories do I need, BMR calculator, TDEE calculator, free macro calculator, nutrition calculator online',
      ogImage: '/og-image.jpg'
    }
  },

  // ── CONTACT ───────────────────────────────────────────────
  contact: {
    ar: {
      title: 'تواصل معنا | فريق RanLogic للتدريب والتغذية',
      description: 'تواصل مع فريق RanLogic من المدربين ومختصي التغذية. نحن هنا للإجابة على استفساراتك ومساعدتك في اختيار الباقة المناسبة.',
      keywords: 'تواصل RanLogic, الدعم الفني, استفسارات تدريب, تواصل مدرب شخصي, خدمة عملاء لياقة',
      ogImage: '/og-image.jpg'
    },
    en: {
      title: 'Contact Us | RanLogic Training & Nutrition Team',
      description: 'Get in touch with the RanLogic team of certified trainers and nutrition specialists. We\'re here to answer your questions and help you choose the right plan.',
      keywords: 'contact RanLogic, fitness support, training inquiry, personal trainer contact, nutrition consultation, customer service',
      ogImage: '/og-image.jpg'
    }
  },

  // ── AUTH ──────────────────────────────────────────────────
  auth: {
    ar: {
      title: 'انضم الآن | أنشئ حسابك وابدأ برنامجك - RanLogic',
      description: 'سجّل حسابك في RanLogic وابدأ برنامجك التدريبي والغذائي المخصص مع فريق من المدربين ومختصي التغذية المعتمدين.',
      keywords: 'تسجيل RanLogic, إنشاء حساب تدريب, انضم للتدريب, ابدأ برنامجك الرياضي',
      ogImage: '/og-image.jpg'
    },
    en: {
      title: 'Join Now | Create Account & Start Your Program - RanLogic',
      description: 'Sign up for RanLogic and get a custom training and nutrition program from our certified team of personal trainers and nutrition specialists.',
      keywords: 'RanLogic signup, create fitness account, join training program, start workout plan, online coach register',
      ogImage: '/og-image.jpg'
    }
  },
  privacyPolicy: {
    ar: { title: 'سياسة الخصوصية | RanLogic', description: 'تعرف على كيفية جمع وحماية بياناتك في منصة RanLogic.', keywords: 'سياسة الخصوصية, RanLogic', ogImage: '/og-image.jpg' },
    en: { title: 'Privacy Policy | RanLogic', description: 'Learn how your data is collected and protected on the RanLogic platform.', keywords: 'privacy policy, RanLogic', ogImage: '/og-image.jpg' }
  },
  termsOfService: {
    ar: { title: 'شروط الاستخدام | RanLogic', description: 'اطلع على شروط استخدام منصة فريق RanLogic وخدمات التدريب والتغذية أونلاين.', keywords: 'شروط الاستخدام, RanLogic', ogImage: '/og-image.jpg' },
    en: { title: 'Terms of Service | RanLogic', description: 'Read the terms governing the use of RanLogic team platform and online training services.', keywords: 'terms of service, RanLogic', ogImage: '/og-image.jpg' }
  },

  // ── PROFILE (private — noindex) ───────────────────────────
  profile: {
    ar: { title: 'ملفي الشخصي - RanLogic', description: 'متابعة تقدمك التدريبي والغذائي.', keywords: '', ogImage: '/og-image.jpg' },
    en: { title: 'My Profile - RanLogic', description: 'Track your training and nutrition progress.', keywords: '', ogImage: '/og-image.jpg' }
  },
};

// ============================================================
// Structured Data Generators (bilingual)
// ============================================================
export const structuredData = {

  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteConfig.siteUrl}/#organization`,
    name: 'RanLogic',
    alternateName: ['رانلوجيك', 'RanLogic Fitness'],
    url: siteConfig.siteUrl,
    logo: { '@type': 'ImageObject', url: `${siteConfig.siteUrl}/icons/icon-512x512.png` },
    sameAs: Object.values(siteConfig.social),
    availableLanguage: [
      { '@type': 'Language', name: 'Arabic', alternateName: 'ar' },
      { '@type': 'Language', name: 'English', alternateName: 'en' }
    ]
  },

  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.siteUrl}/#website`,
    name: 'RanLogic',
    alternateName: 'رانلوجيك',
    url: siteConfig.siteUrl,
    inLanguage: ['ar', 'en'],
    publisher: { '@id': `${siteConfig.siteUrl}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${siteConfig.siteUrl}/faq?q={search_term_string}` },
      'query-input': 'required name=search_term_string'
    }
  },

  sitelinks: {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'RanLogic Main Pages',
    url: siteConfig.siteUrl,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Plans | باقات الاشتراك', url: `${siteConfig.siteUrl}/plans` },
      { '@type': 'ListItem', position: 2, name: 'Calorie Calculator | حاسبة السعرات', url: `${siteConfig.siteUrl}/calorie-calculator` },
      { '@type': 'ListItem', position: 3, name: 'FAQ | الأسئلة الشائعة', url: `${siteConfig.siteUrl}/faq` },
      { '@type': 'ListItem', position: 4, name: 'Contact | تواصل معنا', url: `${siteConfig.siteUrl}/contact` },
      { '@type': 'ListItem', position: 5, name: 'Sign Up | تسجيل الدخول', url: `${siteConfig.siteUrl}/auth` },
    ]
  },

  generateFAQSchema: (faqs) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer }
    }))
  }),

  generateBreadcrumb: (items) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${siteConfig.siteUrl}${item.url}`
    }))
  }),

  // Auto breadcrumb by page + lang
  breadcrumbFor: (page, lang = 'ar') => {
    const home = lang === 'ar' ? 'الرئيسية' : 'Home';
    const map = {
      plans: [{ name: home, url: '/' }, { name: lang === 'ar' ? 'باقات الاشتراك' : 'Plans', url: '/plans' }],
      faq: [{ name: home, url: '/' }, { name: lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ', url: '/faq' }],
      calorieCalculator: [{ name: home, url: '/' }, { name: lang === 'ar' ? 'حاسبة السعرات' : 'Calorie Calculator', url: '/calorie-calculator' }],
      contact: [{ name: home, url: '/' }, { name: lang === 'ar' ? 'تواصل معنا' : 'Contact', url: '/contact' }],
      auth: [{ name: home, url: '/' }, { name: lang === 'ar' ? 'تسجيل الدخول' : 'Login', url: '/auth' }],
    };
    return map[page] || [{ name: home, url: '/' }];
  },

  generateOffersSchema: (plans, lang = 'ar') => ({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: lang === 'ar' ? 'باقات التدريب والتغذية - RanLogic' : 'Training & Nutrition Plans - RanLogic',
    itemListElement: plans.map((plan, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Offer',
        name: plan.name,
        description: plan.description,
        price: plan.price,
        priceCurrency: plan.currency || 'USD',
        availability: 'https://schema.org/InStock',
        url: `${siteConfig.siteUrl}/plans`,
        seller: { '@id': `${siteConfig.siteUrl}/#organization` }
      }
    }))
  }),

  calorieCalculatorTool: (lang = 'ar') => ({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: lang === 'ar' ? 'حاسبة السعرات الحرارية - RanLogic' : 'Calorie Calculator - RanLogic',
    url: `${siteConfig.siteUrl}/calorie-calculator`,
    description: lang === 'ar'
      ? 'أداة مجانية لحساب السعرات الحرارية اليومية والمغذيات الكبرى'
      : 'Free tool to calculate daily calorie and macronutrient needs',
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web Browser',
    inLanguage: ['ar', 'en'],
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    provider: { '@id': `${siteConfig.siteUrl}/#organization` }
  }),
};
// أضف هذا في آخر الملف — قبل export default
export const breadcrumbs = {
  home: (lang) => [
    { name: lang === 'ar' ? 'الرئيسية' : 'Home', url: '/' }
  ],
  plans: (lang) => [
    { name: lang === 'ar' ? 'الرئيسية' : 'Home', url: '/' },
    { name: lang === 'ar' ? 'باقات الاشتراك' : 'Plans', url: '/plans' }
  ],
  faq: (lang) => [
    { name: lang === 'ar' ? 'الرئيسية' : 'Home', url: '/' },
    { name: lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ', url: '/faq' }
  ],
  auth: (lang) => [
    { name: lang === 'ar' ? 'الرئيسية' : 'Home', url: '/' },
    { name: lang === 'ar' ? 'تسجيل الدخول' : 'Login', url: '/auth' }
  ],
  profile: (lang) => [
    { name: lang === 'ar' ? 'الرئيسية' : 'Home', url: '/' },
    { name: lang === 'ar' ? 'الملف الشخصي' : 'Profile', url: '/profile' }
  ],
  calorieCalculator: (lang) => [
    { name: lang === 'ar' ? 'الرئيسية' : 'Home', url: '/' },
    { name: lang === 'ar' ? 'حاسبة السعرات' : 'Calorie Calculator', url: '/calorie-calculator' }
  ],
  contact: (lang) => [
    { name: lang === 'ar' ? 'الرئيسية' : 'Home', url: '/' },
    { name: lang === 'ar' ? 'تواصل معنا' : 'Contact', url: '/contact' }
  ],
};
export default { siteConfig, pagesSEO, structuredData };
