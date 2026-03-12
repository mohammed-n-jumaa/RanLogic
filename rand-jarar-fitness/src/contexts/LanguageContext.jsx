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

  // تغيير اللغة مع الاتصال بالخادم
  const changeLanguage = async (newLang) => {
    setIsLoading(true);
    
    try {
      // إرسال طلب للـ Laravel API
      await languageApi.changeLanguage(newLang);
      
      // حفظ اللغة في localStorage
      localStorage.setItem('language', newLang);
      setCurrentLang(newLang);
      
      // تغيير اتجاه الصفحة
      document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = newLang;
      
      // إعادة تحميل الصفحة لتفعيل التغييرات
      window.location.reload();
      
    } catch (error) {
      console.error('Error changing language:', error);
      // Fallback: تغيير محلي فقط إذا فشل الاتصال
      localStorage.setItem('language', newLang);
      setCurrentLang(newLang);
      document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = newLang;
    } finally {
      setIsLoading(false);
    }
  };

  // تطبيق اللغة عند التحميل
  useEffect(() => {
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
    
    // جلب البيانات المترجمة للصفحة الحالية
    const fetchPageData = async () => {
      const page = window.location.pathname.replace('/', '') || 'home';
      try {
        // يمكن تفعيل هذا لاحقاً عندما يكون API جاهز
        // await languageApi.getTranslatedContent(page, currentLang);
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