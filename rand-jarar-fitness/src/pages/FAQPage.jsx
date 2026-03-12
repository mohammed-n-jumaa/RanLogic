import React, { useState, useEffect } from 'react';
import Header from '../components/Header/Header';
import FAQ from '../components/FAQ/FAQ';
import Footer from '../components/Footer/Footer';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';
import SEO from '../components/SEO/SEO';
import { useLanguage } from '../contexts/LanguageContext';
import { pagesSEO, breadcrumbs, structuredData } from '../utils/seoConfig';
import faqApi from '../api/faqApi';
import './FAQPage.scss';

const FAQPage = () => {
  const { currentLang } = useLanguage();
  const seoData = pagesSEO.faq[currentLang];
  const [faqStructuredData, setFaqStructuredData] = useState(null);

  useEffect(() => {
    // Fetch FAQ data to generate structured data
    const fetchFAQData = async () => {
      try {
        const response = await faqApi.getFaq(currentLang);
        
        if (response.success && response.data && response.data.questions) {
          // Generate FAQ structured data
          const faqSchema = structuredData.generateFAQSchema(
            response.data.questions.map(q => ({
              question: q.question,
              answer: q.answer
            }))
          );
          
          setFaqStructuredData([faqSchema]);
        }
      } catch (error) {
        console.error('Error fetching FAQ for structured data:', error);
      }
    };

    fetchFAQData();
  }, [currentLang]);

  return (
    <>
      <SEO
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        image={seoData.ogImage}
        lang={currentLang}
        structuredDataOverride={faqStructuredData}
        breadcrumbItems={breadcrumbs.faq(currentLang)}
      />

      <div className="faq-page">
        <Header />
        <FAQ />
        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
};

export default FAQPage;