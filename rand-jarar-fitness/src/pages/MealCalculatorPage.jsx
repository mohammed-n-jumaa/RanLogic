import Header from '../components/layout/Header/Header';
import Footer from '../components/layout/Footer/Footer';
import MealCalculator from '../components/MealCalculator/MealCalculator';
import SEO from '../components/common/SEO/SEO';
import { useLanguage } from '@/contexts/LanguageContext';

const MealCalculatorPage = () => {
  const { isArabic } = useLanguage();
  return (
    <>
      <SEO
        page="mealCalculator"
        breadcrumbItems={[
          { name: isArabic ? 'الرئيسية' : 'Home', url: '/' },
          { name: isArabic ? 'حاسبة الوجبات' : 'Meal Calculator', url: '/meal-calculator' }
        ]}
      />
      <Header />
      <MealCalculator />
      <Footer />
    </>
  );
};

export default MealCalculatorPage;
