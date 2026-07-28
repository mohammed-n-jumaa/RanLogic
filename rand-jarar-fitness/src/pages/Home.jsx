import { useState, useCallback } from 'react';
import Header from '../components/Header/Header';
import Hero from '../components/Hero/Hero';
import Certifications from '../components/Certifications/Certifications';
import About from '../components/About/About';
import Testimonials from '../components/Testimonials/Testimonials';
import CTA from '../components/CTA/CTA';
import Footer from '../components/Footer/Footer';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';
import SEO from '../components/SEO/SEO';
import HiddenSEO from '../components/SEO/HiddenSEO';
import { useLanguage } from '../contexts/LanguageContext';
import { breadcrumbs, structuredData, siteConfig } from '../utils/seoConfig';
import './Home.scss';

const Home = () => {
  const { currentLang, isArabic } = useLanguage();

  const [hasCertifications, setHasCertifications] = useState(true);
  const [hasAbout, setHasAbout] = useState(true);
  const [hasTestimonials, setHasTestimonials] = useState(true);
  const [hasCTA, setHasCTA] = useState(true);

  const handleCertificationsStatus = useCallback((hasData) => {
    setHasCertifications(Boolean(hasData));
  }, []);

  const handleAboutStatus = useCallback((hasData) => {
    setHasAbout(Boolean(hasData));
  }, []);

  const handleTestimonialsStatus = useCallback((hasData) => {
    setHasTestimonials(Boolean(hasData));
  }, []);

  const handleCtaStatus = useCallback((hasData) => {
    setHasCTA(Boolean(hasData));
  }, []);

  // Structured data للصفحة الرئيسية
  const homeStructuredData = [
    structuredData.organization,
    structuredData.website,
    structuredData.sitelinks,
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: siteConfig.siteName,
      image: `${siteConfig.siteUrl}${siteConfig.logo}`,
      '@id': siteConfig.siteUrl,
      url: siteConfig.siteUrl,
      priceRange: '$$',
      areaServed: { '@type': 'Place', name: 'Worldwide' },
      availableLanguage: ['Arabic', 'English'],
      sameAs: Object.values(siteConfig.social),
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '200',
        bestRating: '5',
        worstRating: '1'
      }
    }
  ];

  return (
    <>
      {/* SEO واحد فقط للصفحة الرئيسية */}
      <SEO
        page="home"
        structuredDataOverride={homeStructuredData}
        breadcrumbItems={breadcrumbs.home(currentLang)}
      />

      {/*
        HiddenSEO — محتوى نصي مرئي لـ screen readers وGoogle.
        مقبول من Google لأنه:
        1. محتواه ذو صلة بالصفحة
        2. متاح لقارئات الشاشة (sr-only)
        3. ليس مخفياً بـ opacity أو color:transparent (cloaking)
      */}
      <HiddenSEO as="div">
        <h1>
          {isArabic
            ? 'RanLogic - فريق مدربين ومختصي تغذية أونلاين معتمدين عالمياً'
            : 'RanLogic - Certified Online Personal Trainers & Nutrition Specialists'}
        </h1>
        <p>
          {isArabic
            ? 'منصة لياقة بدنية متكاملة: فريق من المدربين الشخصيين المعتمدين ومختصي التغذية. برامج خسارة الوزن، بناء العضلات، التنشيف للنساء والرجال. متابعة يومية ونتائج مضمونة في جميع أنحاء العالم عبر الإنترنت.'
            : 'Complete fitness platform: team of certified personal trainers and nutrition specialists. Weight loss, muscle building, and cutting programs for women and men. Daily follow-up and guaranteed results worldwide.'}
        </p>
        <h2>
          {isArabic
            ? 'خدمات RanLogic المتوفرة عالمياً'
            : 'RanLogic Global Services'}
        </h2>
        <ul>
          <li>{isArabic ? 'تدريب شخصي أونلاين مع مدرب معتمد' : 'Online personal training with certified coach'}</li>
          <li>{isArabic ? 'استشارة تغذية مخصصة مع مختص معتمد' : 'Custom nutrition consultation with certified specialist'}</li>
          <li>{isArabic ? 'برامج حرق الدهون وتنشيف الجسم' : 'Fat loss and body toning programs'}</li>
          <li>{isArabic ? 'برامج بناء العضلات وزيادة القوة' : 'Muscle building and strength programs'}</li>
          <li>{isArabic ? 'حاسبة السعرات الحرارية مجانية' : 'Free calorie calculator'}</li>
          <li>{isArabic ? 'متابعة يومية وأسبوعية' : 'Daily and weekly follow-up'}</li>
          <li>{isArabic ? 'اشتراكات مرنة شهرية وسنوية' : 'Flexible monthly and annual subscriptions'}</li>
        </ul>
      </HiddenSEO>

      <div className="home-page page-shell">
        <Header />
        <Hero />

        {hasCertifications && (
          <Certifications onDataStatus={handleCertificationsStatus} />
        )}

        {hasAbout && (
          <About onDataStatus={handleAboutStatus} />
        )}

        {hasTestimonials && (
          <Testimonials onDataStatus={handleTestimonialsStatus} />
        )}

        {hasCTA && (
          <CTA onDataStatus={handleCtaStatus} />
        )}

        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
};

export default Home;