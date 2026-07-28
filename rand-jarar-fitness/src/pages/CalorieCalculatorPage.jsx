import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';
import SEO from '../components/SEO/SEO';
import CalorieCalculator from '../components/CalorieCalculator/CalorieCalculator';
import { useLanguage } from '../contexts/LanguageContext';
import './CalorieCalculatorPage.scss';

const CalorieCalculatorPage = () => {
  const { currentLang, isArabic } = useLanguage();

  return (
    <>
      <SEO
        page="calorieCalculator"
        isCalcPage={true}
        breadcrumbItems={[
          { name: isArabic ? 'الرئيسية' : 'Home', url: '/' },
          { name: isArabic ? 'حاسبة السعرات' : 'Calorie Calculator', url: '/calorie-calculator' }
        ]}
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
