import { motion } from 'framer-motion';
import { FaGlobe } from 'react-icons/fa';
import { useProfileLanguage } from '../../../contexts/ProfileLanguageContext';
import './LanguageToggle.scss';

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
      <FaGlobe className="globe-icon" />
      <span className="lang-text">{currentLang === 'ar' ? 'EN' : 'AR'}</span>
    </motion.button>
  );
};

export default LanguageToggle;