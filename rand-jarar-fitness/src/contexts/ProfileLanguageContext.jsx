import { createContext, useContext, useState, useEffect } from 'react';

const ProfileLanguageContext = createContext();

export const useProfileLanguage = () => {
  const context = useContext(ProfileLanguageContext);
  if (!context) {
    throw new Error('useProfileLanguage must be used within ProfileLanguageProvider');
  }
  return context;
};

export const ProfileLanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState('ar');

  useEffect(() => {
    const savedLang = localStorage.getItem('profile_language') || 'ar';
    setCurrentLang(savedLang);
    document.documentElement.setAttribute('dir', savedLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', savedLang);
  }, []);

  const toggleLanguage = () => {
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    setCurrentLang(newLang);
    localStorage.setItem('profile_language', newLang);
    document.documentElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', newLang);
  };

  const t = (ar, en) => {
    return currentLang === 'ar' ? ar : en;
  };

  return (
    <ProfileLanguageContext.Provider value={{ currentLang, toggleLanguage, t, isArabic: currentLang === 'ar' }}>
      {children}
    </ProfileLanguageContext.Provider>
  );
};