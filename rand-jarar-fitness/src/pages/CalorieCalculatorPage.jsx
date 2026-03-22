import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';
import SEO from '../components/SEO/SEO';
import CalorieCalculator from '../components/CalorieCalculator/CalorieCalculator';
import { useLanguage } from '../contexts/LanguageContext';
import './CalorieCalculatorPage.scss';

const CalorieCalculatorPage = () => {
  const { currentLang } = useLanguage();

  const seoContent = {
    ar: {
      title: 'حاسبة السعرات اليومية | RanLogic',
      description: 'احسب احتياجك اليومي من السعرات الحرارية بناءً على الوزن والطول والعمر والنشاط والهدف.',
      keywords: 'حاسبة سعرات, السعرات اليومية, احتياج السعرات, nutrition calculator, calorie calculator'
    },
    en: {
      title: 'Daily Calorie Calculator | RanLogic',
      description: 'Calculate your daily calorie needs based on weight, height, age, activity level, and goal.',
      keywords: 'calorie calculator, daily calories, nutrition calculator, maintenance calories, weight loss calories'
    }
  };

  const seoData = seoContent[currentLang] || seoContent.en;

  return (
    <>
      <SEO
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        lang={currentLang}
      />

      <div className="calorie-calculator-page">
        <Header />
        <CalorieCalculator />
        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
};

export default CalorieCalculatorPage;