import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Auth from '../components/Auth/Auth';
import SEO from '../components/SEO/SEO';
import { useLanguage } from '../contexts/LanguageContext';
import { pagesSEO, breadcrumbs } from '../utils/seoConfig';

const AuthPage = () => {
  const navigate = useNavigate();
  const { currentLang } = useLanguage();
  const [isOpen] = useState(true);

  const seoData = pagesSEO.auth[currentLang];

  const handleClose = () => {
    navigate('/');
  };

  return (
    <>
      <SEO
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        image={seoData.ogImage}
        lang={currentLang}
        breadcrumbItems={breadcrumbs.home(currentLang)}
        noindex={true} // Auth pages should not be indexed
      />
      
      <Auth isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

export default AuthPage;