import React from 'react';
import Header from '../components/Header/Header';
import FAQ from '../components/FAQ/FAQ';
import Footer from '../components/Footer/Footer';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';
import { useLanguage } from '../contexts/LanguageContext';
import './FAQPage.scss';

// ملاحظة: SEO يُحقن من داخل مكوّن FAQ مباشرة (مع faqItems الكاملة)
// لذلك لا حاجة لـ SEO هنا في FAQPage

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
