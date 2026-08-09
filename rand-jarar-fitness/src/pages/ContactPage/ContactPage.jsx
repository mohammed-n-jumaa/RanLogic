import React from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { useLanguage } from '../../contexts/LanguageContext';
import Header from '../../components/layout/Header/Header';
import Footer from '../../components/layout/Footer/Footer';
import ScrollToTop from '../../components/common/ScrollToTop/ScrollToTop';
import SEO from '../../components/common/SEO/SEO';
import { breadcrumbs } from '../../utils/seoConfig';
import '../Legal/LegalPages.scss';

const ContactPage = () => {
  const { isArabic, currentLang } = useLanguage();

  const content = {
    ar: {
      badge:       'تواصل معنا',
      title:       'تواصل معنا',
      subtitle:    'إذا كان لديك استفسار عن الاشتراك أو الخطط أو استخدام المنصة، يمكنك التواصل مع فريق RanLogic عبر البريد الإلكتروني أو منصات التواصل التالية.',
      boxTitle:    'فريقنا هنا لمساعدتك',
      boxText:     'للاستفسارات العامة أو الأسئلة المتعلقة بالاشتراك والخطط والتجديد، تواصل مع فريق RanLogic عبر إحدى وسائل التواصل التالية.',
      emailTitle:  'البريد الإلكتروني',
      emailSub:    'راسلنا مباشرة',
      socialTitle: 'منصات التواصل',
      socialText:  'روابط مباشرة إلى حسابات فريق RanLogic الرسمية.'
    },
    en: {
      badge:       'Contact Us',
      title:       'Contact Us',
      subtitle:    'If you have questions about subscriptions, plans, renewals, or using the platform, you can reach the RanLogic team by email or through the following social channels.',
      boxTitle:    'Our team is here to help',
      boxText:     'For general inquiries and questions related to subscriptions, plans, or renewals, contact the RanLogic team using one of the options below.',
      emailTitle:  'Email',
      emailSub:    'Contact us directly',
      socialTitle: 'Social Platforms',
      socialText:  'Direct links to the official RanLogic team accounts.'
    }
  };

  const t = isArabic ? content.ar : content.en;

  const socials = [
    {
      title:    'Instagram',
      subtitle: '@ranlogicc',
      href:     'https://www.instagram.com/ran.logicc/',
      icon:     <FaInstagram />
    },
    {
      title:    'YouTube',
      subtitle: 'RanLogic Channel',
      href:     'https://www.youtube.com/@Ran_Logic',
      icon:     <FaYoutube />
    },
    {
      title:    'X',
      subtitle: '@ranLogic',
      href:     'https://x.com/ranLogic',
      icon:     <FaXTwitter />
    },
    {
      title:    'TikTok',
      subtitle: '@ranlogicc',
      href:     'https://tiktok.com/@ranlogic',
      icon:     <FaTiktok />
    }
  ];

  return (
    <>
      <SEO
        page="contact"
        breadcrumbItems={breadcrumbs.contact(currentLang)}
      />

      <div className="legal-page-wrapper">
        <Header />

        <div className="legal-page" dir={isArabic ? 'rtl' : 'ltr'}>
          <div className="legal-page__inner">
            <motion.div
              className="legal-hero"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="hero-badge">
                <FaEnvelope />
                <span>{t.badge}</span>
              </div>
              <h1 className="hero-title">{t.title}</h1>
              <p className="hero-subtitle">{t.subtitle}</p>
            </motion.div>

            <div className="contact-grid">
              {/* Email Box */}
              <motion.div
                className="contact-box"
                initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              >
                <h2 className="box-title">{t.boxTitle}</h2>
                <p className="box-text">{t.boxText}</p>

                <div className="contact-list">
                  <a href="mailto:ran.logic1@gmail.com" className="contact-item">
                    <span className="icon-wrap">
                      <FaEnvelope />
                    </span>
                    <span>
                      <span className="item-title">{t.emailTitle}</span>
                      <span className="item-subtitle">ran.logic1@gmail.com</span>
                    </span>
                  </a>
                </div>
              </motion.div>

              {/* Social Box */}
              <motion.div
                className="contact-box"
                initial={{ opacity: 0, x: isArabic ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.08 }}
              >
                <h2 className="box-title">{t.socialTitle}</h2>
                <p className="box-text">{t.socialText}</p>

                <div className="social-static">
                  {socials.map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      className="social-static__link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="social-icon">{item.icon}</span>
                      <span className="social-text">
                        <strong>{item.title}</strong>
                        <span>{item.subtitle}</span>
                      </span>
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
};

export default ContactPage;