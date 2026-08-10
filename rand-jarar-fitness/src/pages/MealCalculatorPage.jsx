import Header from '../components/layout/Header/Header';
import Footer from '../components/layout/Footer/Footer';
import MealCalculator from '../components/MealCalculator/MealCalculator';
import usePageTitle from '@/hooks/usePageTitle';
import { useLanguage } from '@/contexts/LanguageContext';

const MealCalculatorPage = () => {
  const { currentLang } = useLanguage();
  usePageTitle('حاسبة الوجبات', 'Meal Calculator', currentLang);
  return (
    <>
      <Header />
      <MealCalculator />
      <Footer />
    </>
  );
};

export default MealCalculatorPage;