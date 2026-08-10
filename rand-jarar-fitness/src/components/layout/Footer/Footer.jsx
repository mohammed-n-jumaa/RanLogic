import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import footerApi from '../../../api/footerApi';
import logoApi from '../../../api/logoApi';
import './Footer.scss';

// ── load Font Awesome 6.5 (يدعم x-twitter و threads) ────────────────────────
const loadFA = () => {
  if (!document.querySelector('link[href*="font-awesome"]')) {
    const l = document.createElement('link');
    l.rel  = 'stylesheet';
    l.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css';
    l.crossOrigin = 'anonymous';
    document.head.appendChild(l);
  }
};

// ── Footer Component ──────────────────────────────────────────────────────────
const Footer = () => {
  const { currentLang, isArabic } = useLanguage();
  const currentYear               = new Date().getFullYear();

  // نبدأ بالبيانات الافتراضية حتى يجي الـ API
  const [footerData, setFooterData] = useState(footerApi.getDefaultData(currentLang));
  const [logoUrl, setLogoUrl]       = useState('/Logo.webp');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(false);

  useEffect(() => { loadFA(); }, []);

  useEffect(() => { fetchData(); }, [currentLang]);

  const fetchData = async () => {

    setError(false);
    try {
      const [footerRes, logoRes] = await Promise.all([
        footerApi.getFooter(currentLang),
        logoApi.getActiveLogo(),
      ]);

      if (footerRes.success && footerRes.data) {
        // ادمج الـ API data مع الافتراضي حتى ما في حقل فاضي
        setFooterData({ ...footerApi.getDefaultData(currentLang), ...footerRes.data });

        // الـ logo ممكن يجي من footer response مباشرة
        const footerLogo = footerRes.data?.logo;
        const footerLogoUrl = footerLogo?.url || footerLogo?.full_url || null;
        if (footerLogoUrl) {
          setLogoUrl(footerLogoUrl);
          return; // ما نحتاج logoRes
        }
      }

      // fallback: جرب logoApi response بكل الأشكال الممكنة
      if (logoRes?.success && logoRes?.data) {
        const d = logoRes.data;
        const url = d?.url || d?.full_url || d?.logo_url || d?.path || null;
        if (url) setLogoUrl(url);
      }

    } catch (err) {
      console.error('Footer fetch error:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // helpers
  const t = (arVal, enVal) => isArabic ? (arVal || enVal) : (enVal || arVal);
  const links = footerApi.quickLinks[currentLang] || footerApi.quickLinks.ar;



  if (error) {
    return (
      <footer className="footer">
        <div className="footer-error">
          <p>{t('عذراً، حدث خطأ في تحميل الفوتر', 'Sorry, an error occurred while loading the footer')}</p>
          <button className="retry-btn" onClick={fetchData}>
            {t('إعادة المحاولة', 'Retry')}
          </button>
        </div>
      </footer>
    );
  }

  const {
    description_ar, description_en,
    copyright_ar,   copyright_en,
    quick_links_title_ar, quick_links_title_en,
    social_links = [],
  } = footerData;

  return (
    <footer className="footer" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="footer-container">

        {/* ── Main grid ── */}
        <div className="footer-main">

          {/* Brand */}
          <motion.div className="footer-brand"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}>

            <div className="brand-mark">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={t('شعار RanLogic', 'RanLogic Logo')}
                  className="logo-image"
                  onError={(e) => {
                    // لو الصورة فشلت — أظهر الـ fallback
                    e.target.style.display = 'none';
                    const fallback = e.target.closest('.brand-mark').querySelector('.brand-icon-block');
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}

              {/* Fallback — يظهر فقط إذا ما في لوجو أو فشلت الصورة */}
              <div className="brand-icon-block" style={{ display: logoUrl ? 'none' : 'flex' }}>
                <div className="brand-icon-box">R</div>
                <div className="brand-name-block">
                  <span className="brand-name">RanLogic</span>
                  <span className="brand-sub">{t('فريق التدريب والتغذية', 'Training & Nutrition Team')}</span>
                </div>
              </div>
            </div>

            <p className="brand-description">
              {t(description_ar, description_en)}
            </p>

            <div className="cert-badge">
              <span className="cert-dot" />
              {t('فريق معتمد دولياً', 'Internationally Certified Team')}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div className="footer-links"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>

            <h4 className="footer-col-title">
              {t(quick_links_title_ar, quick_links_title_en)}
            </h4>
            <ul className="links-list">
              {links.map((link, i) => (
                <li key={i}>
                  {link.type === 'route'
                    ? <Link to={link.href}>{link.name}</Link>
                    : <a href={link.href}>{link.name}</a>}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social */}
          <motion.div className="footer-social"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>

            <h4 className="footer-col-title">
              {t('تابعونا', 'Follow Us')}
            </h4>

            {social_links.length === 0 ? (
              <p className="no-social">{t('لا توجد روابط', 'No links yet')}</p>
            ) : (
              <div className="social-cards-grid">
                {social_links.map((social, i) => {
                  const p = footerApi.getPlatform(social.platform);
                  return (
                    <motion.a
                      key={i}
                      href={social.url || '#'}
                      className="social-card"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={p.label}
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {/* أيقونة ملونة بنفس لون المنصة */}
                      <span
                        className="sc-icon-wrap"
                        style={{ background: p.bg }}
                      >
                        <i
                          className={p.icon}
                          style={{ color: p.iconColor || '#fff' }}
                        />
                      </span>
                      <span className="sc-name">{p.label}</span>
                    </motion.a>
                  );
                })}
              </div>
            )}
          </motion.div>

        </div>

        {/* ── Bottom ── */}
        <motion.div className="footer-bottom"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}>
          <p className="footer-copyright">
            {t(copyright_ar, copyright_en)}
          </p>
          <span className="year-badge">{currentYear}</span>
        </motion.div>

      </div>
    </footer>
  );
};

export default Footer;