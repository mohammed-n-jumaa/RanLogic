import React from 'react';
import Header from '../components/layout/Header/Header';
import FAQ from '../components/FAQ/FAQ';
import Footer from '../components/layout/Footer/Footer';
import ScrollToTop from '../components/common/ScrollToTop/ScrollToTop';
import { useLanguage } from '../contexts/LanguageContext';
import './FAQPage.scss';


const FAQPage = () => {
  const { currentLang } = useLanguage();

  return (
    <div className="faq-page">
      <Header />
      <FAQ />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default FAQPage;
