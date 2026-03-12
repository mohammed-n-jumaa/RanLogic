import { createContext, useState, useContext, useEffect } from 'react';
import languageApi from '../api/languageApi';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('language') || 'ar';
  });

  const [isLoading, setIsLoading] = useState(false);

  const changeLanguage = async (newLang) => {
    setIsLoading(true);
    
    try {
      await languageApi.changeLanguage(newLang);
      
      localStorage.setItem('language', newLang);
      setCurrentLang(newLang);
      
      document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = newLang;
      
      window.location.reload();
      
    } catch (error) {
      console.error('Error changing language:', error);

      localStorage.setItem('language', newLang);
      setCurrentLang(newLang);
      document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = newLang;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
    
    const fetchPageData = async () => {
      const page = window.location.pathname.replace('/', '') || 'home';
      try {

      } catch (error) {
        console.error('Error fetching page data:', error);
      }
    };
    
    fetchPageData();
  }, [currentLang]);

  const value = {
    currentLang,
    changeLanguage,
    isLoading,
    isArabic: currentLang === 'ar',
    isEnglish: currentLang === 'en'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;