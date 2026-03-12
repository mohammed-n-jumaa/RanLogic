// SEO Configuration for RanLogic - Global Online Training
// Focus on intent-based keywords - Worldwide reach

export const siteConfig = {
  // Basic Site Info
  siteName: 'RanLogic',
  siteUrl: 'https://ranlogic.com', // Replace with actual domain
  trainerName: 'Rend Jarrar',
  defaultLanguage: 'ar',
  supportedLanguages: ['ar', 'en'],

  // Contact & Social
  email: 'info@ranlogic.com',
  phone: '+962-XXX-XXXX',
  
  social: {
    facebook: 'https://facebook.com/rendjarrar',
    instagram: 'https://instagram.com/rendjarrar',
    twitter: 'https://twitter.com/rendjarrar',
    youtube: 'https://youtube.com/@rendjarrar',
    tiktok: 'https://tiktok.com/@rendjarrar'
  },

  // Business Info
  businessType: 'Online Fitness Trainer',
  location: {
    city: 'Global',
    country: 'Worldwide',
    address: 'Online Training - Worldwide'
  },

  // Images
  logo: '/logo.png',
  defaultOgImage: '/og-image.jpg',
  favicon: '/favicon.ico',

  // Analytics & Tracking
  googleAnalyticsId: '', // Add your GA4 ID
  googleTagManagerId: '', // Add your GTM ID
  facebookPixelId: '', // Add your Facebook Pixel ID
};

// Page-specific SEO configurations with INTENT-BASED keywords
export const pagesSEO = {
  // Home Page
  home: {
    ar: {
      title: 'رند جرار | مدربة لياقة بدنية أونلاين عالمياً - RanLogic',
      description: 'احصل على برنامج تدريبي ونظام غذائي مخصص أونلاين من أي مكان في العالم مع المدربة المعتمدة رند جرار. خسارة وزن، بناء عضلات، تنشيف للنساء والرجال. متابعة يومية ونتائج مضمونة عالمياً.',
      // Intent-based keywords (what users search for)
      keywords: 'مدربة شخصية أونلاين عالمياً, برنامج تدريبي أونلاين دولي, نظام غذائي للتنشيف عالمي, خسارة وزن للنساء أونلاين, بناء عضلات للنساء عن بعد, مدرب لياقة عالمي, اشتراك تدريب أونلاين دولي, برنامج تنشيف للنساء عالمياً, تمارين منزلية للنساء أونلاين, كوتش رياضي عالمي, رند جرار',
      ogImage: '/images/og/home-ar.jpg'
    },
    en: {
      title: 'Rend Jarrar | Global Online Fitness Coach - Personal Training Worldwide',
      description: 'Get customized online workout and nutrition plans from anywhere in the world with certified trainer Rend Jarrar. Weight loss, muscle building, cutting programs for women and men. Daily follow-up and guaranteed results worldwide.',
      // Intent-based keywords
      keywords: 'global online personal trainer, international fitness coach, worldwide workout plan women, online nutrition plan cutting, weight loss program women worldwide, muscle building women online, global fitness trainer, international training subscription, home workout program worldwide, female fitness coach global, rend jarrar',
      ogImage: '/images/og/home-en.jpg'
    }
  },

  // FAQ Page
  faq: {
    ar: {
      title: 'أسئلة شائعة | كيف تبدأ التدريب أونلاين عالمياً مع رند جرار',
      description: 'كل ما تحتاج معرفته عن برامج التدريب الأونلاين العالمي: كيفية الاشتراك من أي دولة، الأسعار، الأنظمة الغذائية، المتابعة اليومية، والنتائج المتوقعة مع المدربة رند جرار.',
      keywords: 'أسئلة تدريب أونلاين عالمي, كيف أبدأ تمارين منزلية عن بعد, أسعار التدريب الشخصي الدولي, نظام غذائي عالمي كم سعره, متابعة يومية مدرب عن بعد, برنامج تدريبي دولي كم يكلف, أسئلة شائعة تدريب عالمي, رند جرار FAQ',
      ogImage: '/images/og/faq-ar.jpg'
    },
    en: {
      title: 'FAQ | How to Start Global Online Training with Rend Jarrar',
      description: 'Everything you need to know about worldwide online training programs: subscription process from any country, pricing, nutrition plans, daily follow-up, and expected results with trainer Rend Jarrar.',
      keywords: 'global online training FAQ, how to start home workout worldwide, international personal training cost, online nutrition plan price, daily coaching follow-up remote, training program cost worldwide, international fitness questions, rend jarrar FAQ',
      ogImage: '/images/og/faq-en.jpg'
    }
  },

  // Plans Page
  plans: {
    ar: {
      title: 'خطط اشتراك التدريب أونلاين العالمي | أسعار وباقات رند جرار',
      description: 'اختر باقة التدريب المناسبة لك من أي مكان في العالم: برامج شهرية، 3 أشهر، 6 أشهر مع خصومات. برنامج تدريبي + نظام غذائي + متابعة يومية + دردشة مباشرة. ابدأ اليوم من أي دولة واحصل على جسمك المثالي.',
      keywords: 'اشتراك تدريب أونلاين عالمي, أسعار التدريب الشخصي الدولي, باقات التدريب الرياضي العالمية, برنامج تدريبي شهري عن بعد, اشتراك 3 شهور تدريب دولي, خطة تدريب 6 شهور عالمية, تكلفة مدرب شخصي عالمي, أسعار كوتش أونلاين دولي, عروض اشتراك تدريب عالمي, رند جرار اشتراك',
      ogImage: '/images/og/plans-ar.jpg'
    },
    en: {
      title: 'Global Online Training Subscription Plans | Rend Jarrar Worldwide Pricing',
      description: 'Choose the right training package from anywhere in the world: monthly, 3-month, 6-month plans with discounts. Workout program + nutrition plan + daily follow-up + direct chat. Start today from any country and get your dream body.',
      keywords: 'global online training subscription, international personal training prices, worldwide fitness packages, monthly workout plan remote, 3 month training program international, 6 month fitness plan global, personal trainer cost worldwide, online coach pricing international, training subscription deals global, rend jarrar plans',
      ogImage: '/images/og/plans-en.jpg'
    }
  },

  // Profile Page
  profile: {
    ar: {
      title: 'ملفي الشخصي | متابعة تقدمي مع رند جرار',
      description: 'تابع تقدمك اليومي، برنامجك التدريبي المخصص، نظامك الغذائي، وتواصل مباشر مع المدربة رند جرار.',
      keywords: 'ملف تدريبي, متابعة تقدم, برنامج تدريبي شخصي, نظام غذائي خاص, تواصل مع مدرب',
      ogImage: '/images/og/profile-ar.jpg'
    },
    en: {
      title: 'My Profile | Progress Tracking with Rend Jarrar',
      description: 'Track your daily progress, customized workout program, nutrition plan, and direct communication with trainer Rend Jarrar.',
      keywords: 'training profile, progress tracking, personalized workout, custom nutrition, trainer communication',
      ogImage: '/images/og/profile-en.jpg'
    }
  },

  // Auth Page
  auth: {
    ar: {
      title: 'انضم الآن | ابدأ رحلتك الرياضية العالمية مع رند جرار',
      description: 'سجل حساب جديد أو سجل دخولك للوصول إلى برنامجك التدريبي ونظامك الغذائي المخصص. ابدأ رحلة التحول اليوم من أي مكان في العالم.',
      keywords: 'تسجيل اشتراك تدريب عالمي, إنشاء حساب رياضي دولي, تسجيل دخول تدريب عن بعد, انضم لبرنامج تدريبي عالمي, ابدأ التدريب الآن',
      ogImage: '/images/og/auth-ar.jpg'
    },
    en: {
      title: 'Join Now | Start Your Global Fitness Journey with Rend Jarrar',
      description: 'Create a new account or login to access your customized workout program and nutrition plan. Start your transformation journey today from anywhere in the world.',
      keywords: 'training signup worldwide, fitness account global, training login international, join workout program worldwide, start training now',
      ogImage: '/images/og/auth-en.jpg'
    }
  }
};

// Structured Data Templates
export const structuredData = {
  // Organization Schema
  organization: {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: 'RanLogic - Rend Jarrar Fitness',
    image: `${siteConfig.siteUrl}/logo.png`,
    '@id': siteConfig.siteUrl,
    url: siteConfig.siteUrl,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Global',
      addressCountry: 'Worldwide'
    },
    sameAs: Object.values(siteConfig.social),
    areaServed: {
      '@type': 'Place',
      name: 'Worldwide'
    }
  },

  // Person Schema (Trainer)
  person: {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.trainerName,
    jobTitle: 'Certified International Personal Trainer & Global Online Fitness Coach',
    url: siteConfig.siteUrl,
    image: `${siteConfig.siteUrl}/images/trainer-profile.jpg`,
    description: 'Internationally certified global online fitness trainer specializing in weight loss, muscle building, body transformation, and customized nutrition plans for clients worldwide',
    sameAs: Object.values(siteConfig.social),
    knowsAbout: [
      'Global Online Personal Training',
      'International Fitness Coaching',
      'Worldwide Nutrition Planning',
      'Weight Loss Programs Worldwide',
      'Muscle Building Online',
      'Body Sculpting Remote Training',
      'Home Workout Programs Global',
      'Women Fitness Training Worldwide'
    ]
  },

  // Service Schema
  service: {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Global Online Personal Training',
    provider: {
      '@type': 'Person',
      name: siteConfig.trainerName
    },
    areaServed: {
      '@type': 'Place',
      name: 'Worldwide'
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      availableDeliveryMethod: 'https://schema.org/OnlineOnly'
    }
  },

  // FAQ Schema Generator
  generateFAQSchema: (faqs) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }),

  // Course/Program Schema
  course: (programData) => ({
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: programData.name,
    description: programData.description,
    provider: {
      '@type': 'Person',
      name: siteConfig.trainerName
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'PT1H',
      instructor: {
        '@type': 'Person',
        name: siteConfig.trainerName
      }
    },
    availableLanguage: ['ar', 'en']
  }),

  // Offer Schema for Plans
  offer: (planData) => ({
    '@context': 'https://schema.org',
    '@type': 'Offer',
    name: planData.name,
    description: planData.description,
    price: planData.price,
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    url: `${siteConfig.siteUrl}/plans`,
    areaServed: {
      '@type': 'Place',
      name: 'Worldwide'
    },
    seller: {
      '@type': 'Person',
      name: siteConfig.trainerName
    }
  }),

  // Review/Rating Schema
  aggregateRating: (rating, reviewCount) => ({
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    ratingValue: rating,
    reviewCount: reviewCount,
    bestRating: '5',
    worstRating: '1'
  })
};

// Breadcrumb configurations
export const breadcrumbs = {
  home: (lang) => [
    {
      name: lang === 'ar' ? 'الرئيسية' : 'Home',
      url: '/'
    }
  ],
  faq: (lang) => [
    {
      name: lang === 'ar' ? 'الرئيسية' : 'Home',
      url: '/'
    },
    {
      name: lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ',
      url: '/faq'
    }
  ],
  plans: (lang) => [
    {
      name: lang === 'ar' ? 'الرئيسية' : 'Home',
      url: '/'
    },
    {
      name: lang === 'ar' ? 'خطط الاشتراك' : 'Plans',
      url: '/plans'
    }
  ],
  profile: (lang) => [
    {
      name: lang === 'ar' ? 'الرئيسية' : 'Home',
      url: '/'
    },
    {
      name: lang === 'ar' ? 'الملف الشخصي' : 'Profile',
      url: '/profile'
    }
  ]
};

export default {
  siteConfig,
  pagesSEO,
  structuredData,
  breadcrumbs
};