import { motion } from 'framer-motion';
import { useProfileLanguage } from '../../../contexts/ProfileLanguageContext';
import './LanguageToggle.scss';
import { Globe } from 'lucide-react';

const LanguageToggle = () => {
  const { currentLang, toggleLanguage } = useProfileLanguage();

  return (
    <motion.button
      className="language-toggle-button"
      onClick={toggleLanguage}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
    >
      <Globe className="globe-icon" />
      <span className="lang-text">{currentLang === 'ar' ? 'EN' : 'AR'}</span>
    </motion.button>
  );
};

export default LanguageToggle;