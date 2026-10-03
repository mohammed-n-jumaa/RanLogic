import { useState, useCallback, useEffect } from 'react';
import HomeSkeleton from '../components/common/HomeSkeleton/HomeSkeleton';
import Header from '../components/layout/Header/Header';
import Hero from '../components/Hero/Hero';
import Certifications from '../components/Certifications/Certifications';
import About from '../components/About/About';
import Testimonials from '../components/Testimonials/Testimonials';
import CTA from '../components/CTA/CTA';
import Footer from '../components/layout/Footer/Footer';
import ScrollToTop from '../components/common/ScrollToTop/ScrollToTop';
import SEO from '../components/common/SEO/SEO';
import { breadcrumbs, structuredData, siteConfig } from '../utils/seoConfig';
import usePageTitle from '@/hooks/usePageTitle';
import { useLanguage } from '@/contexts/LanguageContext';
import './Home.scss';

const Home = () => {
  const { currentLang } = useLanguage();
  usePageTitle('الرئيسية', 'Home', currentLang);

  const [isLoading, setIsLoading] = useState(true);
  const [hasCertifications, setHasCertifications] = useState(true);
  const [hasAbout, setHasAbout] = useState(true);
  const [hasTestimonials, setHasTestimonials] = useState(true);
  const [hasCTA, setHasCTA] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

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

      {isLoading && <HomeSkeleton />}
      <div className="home-page page-shell" style={{ display: isLoading ? 'none' : undefined }}>
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