import React from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { useLanguage } from '../../contexts/LanguageContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop';
import SEO from '../../components/SEO/SEO';
import '../Legal/LegalPages.scss';

const ContactPage = () => {
  const { isArabic, currentLang } = useLanguage();

  const content = {
    ar: {
      seoTitle: 'تواصل معنا | RanLogic',
      seoDescription:
        'تواصل مع RanLogic ورند جرار عبر البريد الإلكتروني أو حسابات التواصل الرسمية.',
      badge: 'تواصل معنا',
      title: 'تواصل معنا',
      subtitle:
        'إذا كان لديك استفسار عن الاشتراك أو الخطط أو استخدام المنصة، يمكنك التواصل معنا عبر البريد الإلكتروني أو منصات التواصل التالية.',
      boxTitle: 'نحن هنا لمساعدتك',
      boxText:
        'للاستفسارات العامة أو الأسئلة المتعلقة بالاشتراك والخطط والتجديد، استخدم إحدى وسائل التواصل التالية.',
      emailTitle: 'البريد الإلكتروني',
      emailSub: 'راسلنا مباشرة',
      socialTitle: 'منصات التواصل',
      socialText: 'روابط مباشرة إلى حسابات RanLogic و Rand Jarrar الرسمية.'
    },
    en: {
      seoTitle: 'Contact Us | RanLogic',
      seoDescription:
        'Get in touch with RanLogic and Rand Jarrar by email or through official social channels.',
      badge: 'Contact Us',
      title: 'Contact Us',
      subtitle:
        'If you have questions about subscriptions, plans, renewals, or using the platform, you can contact us by email or through the following social channels.',
      boxTitle: 'We’re here to help',
      boxText:
        'For general inquiries and questions related to subscriptions, plans, or renewals, use one of the contact options below.',
      emailTitle: 'Email',
      emailSub: 'Contact us directly',
      socialTitle: 'Social Platforms',
      socialText: 'Direct links to the official RanLogic and Rand Jarrar accounts.'
    }
  };

  const t = isArabic ? content.ar : content.en;

  const socials = [
    {
      title: 'Instagram',
      subtitle: '@randjarrar',
      href: 'https://instagram.com/',
      icon: <FaInstagram />
    },
    {
      title: 'YouTube',
      subtitle: 'RanLogic Channel',
      href: 'https://youtube.com/',
      icon: <FaYoutube />
    },
    {
      title: 'X',
      subtitle: '@randjarrar',
      href: 'https://x.com/',
      icon: <FaXTwitter />
    },
    {
      title: 'TikTok',
      subtitle: '@randjarrar',
      href: 'https://tiktok.com/',
      icon: <FaTiktok />
    }
  ];

  return (
    <>
      <SEO
        title={t.seoTitle}
        description={t.seoDescription}
        lang={currentLang}
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
              <motion.div
                className="contact-box"
                initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              >
                <h2 className="box-title">{t.boxTitle}</h2>
                <p className="box-text">{t.boxText}</p>

                <div className="contact-list">
                  <a href="mailto:support@ranlogic.com" className="contact-item">
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