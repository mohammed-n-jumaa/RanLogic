import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaDumbbell } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';
import footerApi from '../../api/footerApi';
import logoApi from '../../api/logoApi';
import { Link } from 'react-router-dom';
import './Footer.scss';

const Footer = () => {
  const [footerData, setFooterData] = useState(null);
  const [logoData, setLogoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentLang, isArabic } = useLanguage();
  const currentYear = new Date().getFullYear();

  const quickLinks = {
    ar: [
      { name: 'الرئيسية', href: '#home', type: 'anchor' },
      { name: 'سياسة الخصوصية', href: '/privacy-policy', type: 'route' },
      { name: 'شروط الاستخدام', href: '/terms-of-service', type: 'route' },
      { name: 'سياسة عدم الاسترجاع', href: '/refund-policy', type: 'route' },
      { name: 'تواصل معنا', href: '/contact', type: 'route' }
    ],
    en: [
      { name: 'Home', href: '#home', type: 'anchor' },
      { name: 'Privacy Policy', href: '/privacy-policy', type: 'route' },
      { name: 'Terms of Service', href: '/terms-of-service', type: 'route' },
      { name: 'No Refund Policy', href: '/refund-policy', type: 'route' },
      { name: 'Contact Us', href: '/contact', type: 'route' }
    ]
  };

  useEffect(() => {
    fetchFooterData();
  }, [currentLang]);

  const fetchFooterData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [footerResponse, logoResponse] = await Promise.all([
        footerApi.getFooter(currentLang),
        logoApi.getActiveLogo()
      ]);

      if (footerResponse.success && footerResponse.data) {
        setFooterData(footerResponse.data);
      } else {
        setError('فشل تحميل الفوتر');
      }

      if (logoResponse.success && logoResponse.data) {
        setLogoData(logoResponse.data);
      }

    } catch (err) {
      console.error('خطأ في جلب بيانات الفوتر:', err);
      setError('خطأ في تحميل محتوى الفوتر');
    } finally {
      setLoading(false);
    }
  };

  const getSocialIcon = (platform) => {
    const platformInfo = footerApi.socialPlatforms.find(p => p.value === platform);
    return platformInfo ? platformInfo.icon : 'fab fa-link';
  };

  const getSocialColor = (platform) => {
    const platformInfo = footerApi.socialPlatforms.find(p => p.value === platform);
    return platformInfo ? platformInfo.color : '#6c757d';
  };

  useEffect(() => {
    const loadFontAwesome = () => {
      if (!document.querySelector('link[href*="font-awesome"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(link);
      }
    };

    loadFontAwesome();
  }, []);

  if (loading) {
    return (
      <footer className="footer">
        <div className="footer-loading">
          <div className="spinner"></div>
          <p>{isArabic ? 'جاري تحميل الفوتر...' : 'Loading footer...'}</p>
        </div>
      </footer>
    );
  }

  if (error || !footerData) {
    return (
      <footer className="footer">
        <div className="footer-error">
          <p>{isArabic ? 'عذراً، حدث خطأ في تحميل الفوتر' : 'Sorry, an error occurred while loading the footer'}</p>
          <button
            className="retry-btn"
            onClick={fetchFooterData}
          >
            {isArabic ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      </footer>
    );
  }

  const {
    logo,
    description,
    copyright,
    quick_links_title,
    social_links = []
  } = footerData;

  return (
    <footer className="footer" dir={isArabic ? "rtl" : "ltr"}>
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Brand Section */}
          <motion.div
            className="footer-brand"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="brand-logo">
              {logo ? (
                <img
                  src={logo.url}
                  alt={logo.alt || (isArabic ? 'شعار رند جرّار' : 'RAND JARAR Logo')}
                  className="logo-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="fallback-logo" style={{ display: logo ? 'none' : 'flex' }}>
                <FaDumbbell className="logo-icon" />
                <span className="logo-text">RAND JARAR</span>
              </div>
            </div>
            <p className="brand-description">
              {description || (isArabic
                ? 'مدربة لياقة بدنية معتمدة دولياً تساعدك في تحقيق أهدافك'
                : 'Internationally Certified Fitness Coach helping you achieve your goals')}
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="footer-links"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="footer-title">
              {quick_links_title || (isArabic ? 'روابط سريعة' : 'Quick Links')}
            </h4>
            <ul className="links-list">
              {(quickLinks[currentLang] || quickLinks.ar).map((link, index) => (
                <li key={index}>
                  {link.type === 'route' ? (
                    <Link to={link.href}>{link.name}</Link>
                  ) : (
                    <a href={link.href}>{link.name}</a>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact & Social */}
          <motion.div
            className="footer-social"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="footer-title">
              {isArabic ? 'تابعنا' : 'Follow Us'}
            </h4>
            <div className="social-links">
              {social_links.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  className="social-link"
                  aria-label={social.platform}
                  style={{
                    backgroundColor: getSocialColor(social.platform) + '15',
                    borderColor: getSocialColor(social.platform) + '30'
                  }}
                  whileHover={{
                    scale: 1.1,
                    y: -3,
                    backgroundColor: getSocialColor(social.platform),
                    borderColor: getSocialColor(social.platform)
                  }}
                  whileTap={{ scale: 0.95 }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className={getSocialIcon(social.platform)}></i>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer Bottom - إزالة الروابط القانونية */}
        <motion.div
          className="footer-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="footer-copyright">
            {copyright || (isArabic
              ? `© ${currentYear} Rand Jarar. جميع الحقوق محفوظة.`
              : `© ${currentYear} Rand Jarar. All rights reserved.`)}
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;