import { useEffect } from 'react';

const usePageTitle = (arTitle, enTitle, lang) => {
  useEffect(() => {
    const isArabic = lang === 'ar';
    const title = isArabic ? arTitle : enTitle;
    document.title = `${title} | RanLogic`;

    return () => {
      document.title = 'RanLogic';
    };
  }, [arTitle, enTitle, lang]);
};

export default usePageTitle;