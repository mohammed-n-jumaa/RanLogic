import React from 'react';
import Header from '../components/layout/Header/Header';
import Footer from '../components/layout/Footer/Footer';
import ScrollToTop from '../components/common/ScrollToTop/ScrollToTop';
import SEO from '../components/common/SEO/SEO';
import CalorieCalculator from '../components/CalorieCalculator/CalorieCalculator';
import usePageTitle from '@/hooks/usePageTitle';
import { useLanguage } from '@/contexts/LanguageContext';
import './CalorieCalculatorPage.scss';

const CalorieCalculatorPage = () => {
  const { currentLang, isArabic } = useLanguage();
  usePageTitle('حاسبة السعرات', 'Calorie Calculator', currentLang);
  

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
