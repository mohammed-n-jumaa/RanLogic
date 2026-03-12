import { useEffect, useState, useCallback } from 'react';
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
import { pagesSEO, breadcrumbs, structuredData, siteConfig } from '../utils/seoConfig';

import './Home.scss';

const Home = () => {
  const { currentLang, isArabic } = useLanguage();
  const seoData = pagesSEO.home[currentLang];

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

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .section-transition {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .section-transition.active {
        opacity: 1;
        transform: translateY(0);
      }
      
      .fade-in-up {
        animation: fadeInUp 0.8s ease forwards;
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(40px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (style.parentNode) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Structured data for home page
  const homeStructuredData = [
    structuredData.organization,
    structuredData.person,
    structuredData.service,
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: `${siteConfig.siteName} - ${siteConfig.trainerName}`,
      image: `${siteConfig.siteUrl}${siteConfig.logo}`,
      '@id': siteConfig.siteUrl,
      url: siteConfig.siteUrl,
      telephone: siteConfig.phone,
      priceRange: '$$',
      areaServed: {
        '@type': 'Place',
        name: 'Worldwide'
      },
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
      <SEO
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        image={seoData.ogImage}
        lang={currentLang}
        structuredDataOverride={homeStructuredData}
        breadcrumbItems={breadcrumbs.home(currentLang)}
      />

      {/* Hidden SEO Content for semantic weight */}
      <HiddenSEO as="div">
        <h1>
          {isArabic
            ? 'رند جرار - مدربة لياقة بدنية أونلاين معتمدة عالمياً'
            : 'Rend Jarrar - Certified Global Online Fitness Trainer'
          }
        </h1>
        <p>
          {isArabic
            ? 'احصل على برنامج تدريبي مخصص ونظام غذائي أونلاين من أي مكان في العالم مع المدربة المعتمدة دولياً رند جرار. برامج خسارة الوزن، بناء العضلات، التنشيف للنساء والرجال. متابعة يومية ونتائج مضمونة في جميع أنحاء العالم عبر الإنترنت.'
            : 'Get customized online workout programs and nutrition plans from anywhere in the world with internationally certified trainer Rend Jarrar. Weight loss, muscle building, and cutting programs for women and men. Daily follow-up and guaranteed results worldwide online.'
          }
        </p>
        <h2>
          {isArabic
            ? 'خدمات التدريب الأونلاين المتوفرة عالمياً'
            : 'Global Online Training Services Available'
          }
        </h2>
        <ul>
          <li>{isArabic ? 'برامج تدريبية مخصصة للنساء والرجال في جميع أنحاء العالم' : 'Customized training programs for women and men worldwide'}</li>
          <li>{isArabic ? 'أنظمة غذائية للتنشيف وخسارة الوزن عن بعد' : 'Remote nutrition plans for cutting and weight loss'}</li>
          <li>{isArabic ? 'برامج بناء العضلات ونحت الجسم أونلاين' : 'Online muscle building and body sculpting programs'}</li>
          <li>{isArabic ? 'متابعة يومية ودعم مستمر من أي دولة' : 'Daily follow-up and continuous support from any country'}</li>
          <li>{isArabic ? 'تمارين منزلية وتمارين في النادي عبر الإنترنت' : 'Home workouts and gym exercises online'}</li>
          <li>{isArabic ? 'تدريب شخصي أونلاين متاح 24/7' : 'Personal training online available 24/7'}</li>
        </ul>
        <h3>
          {isArabic
            ? 'لماذا تختار رند جرار كمدربة أونلاين؟'
            : 'Why Choose Rend Jarrar as Your Online Trainer?'
          }
        </h3>
        <p>
          {isArabic
            ? 'مدربة معتمدة دولياً مع خبرة في تدريب العملاء من جميع أنحاء العالم. برامج مخصصة تناسب جميع المستويات والأهداف، سواء كنت مبتدئاً أو محترفاً.'
            : 'Internationally certified trainer with experience training clients from all over the world. Customized programs suitable for all levels and goals, whether you are a beginner or professional.'
          }
        </p>
      </HiddenSEO>

      <div className="home-page">
        <Header />
        <Hero />

        {hasCertifications ? (
          <Certifications onDataStatus={handleCertificationsStatus} />
        ) : null}

        {hasAbout ? <About onDataStatus={handleAboutStatus} /> : null}

        {hasTestimonials ? (
          <Testimonials onDataStatus={handleTestimonialsStatus} />
        ) : null}

        {hasCTA ? <CTA onDataStatus={handleCtaStatus} /> : null}

        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
};

export default Home;