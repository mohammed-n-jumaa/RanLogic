import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Auth from '../features/Auth/Auth';
import SEO from '../components/common/SEO/SEO';
import { useLanguage } from '../contexts/LanguageContext';
import { breadcrumbs } from '../utils/seoConfig';

const AuthPage = () => {
  const navigate = useNavigate();
  const { currentLang } = useLanguage();
  const [isOpen] = useState(true);

  const handleClose = () => {
    navigate('/');
  };

  return (
    <>
      <SEO
        page="auth"
        breadcrumbItems={breadcrumbs.auth(currentLang)}
        noindex={true}
      />

      <Auth isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

export default AuthPage;
