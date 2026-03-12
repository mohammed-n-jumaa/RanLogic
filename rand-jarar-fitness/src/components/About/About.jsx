import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';
import aboutApi from '../../api/aboutApi';
import './About.scss';

// رموز الأيقونات لكل ميزة
const getIconComponent = (icon) => {
  switch(icon) {
    case '👥': return '👥';
    case '🍎': return '🍎';
    case '💪': return '💪';
    case '📈': return '📈';
    case '🎯': return '🎯';
    case '❤️': return '❤️';
    case '⏰': return '⏰';
    case '🌟': return '🌟';
    default: return '✨';
  }
};

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const { currentLang, isArabic } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAboutData();
  }, [currentLang]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth <= 1024 && window.innerWidth > 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await aboutApi.getAboutCoach(currentLang);
      
      if (response.success && response.data) {
        setAboutData(response.data);
      } else {
        setError('Failed to load about section');
      }
    } catch (err) {
      console.error('Error fetching about data:', err);
      setError('Error loading content');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const profileVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // عرض حالة التحميل
  if (loading) {
    return (
      <section className="about" id="about">
        <div className="about-container">
          <div className="about-loading">
            <FaSpinner className="spinner" />
            <p>{isArabic ? 'جاري تحميل المحتوى...' : 'Loading content...'}</p>
          </div>
        </div>
      </section>
    );
  }

  // عرض حالة الخطأ
  if (error || !aboutData) {
    return (
      <section className="about" id="about">
        <div className="about-container">
          <div className="about-error">
            <p>{isArabic ? 'عذراً، حدث خطأ في تحميل المحتوى' : 'Sorry, error loading content'}</p>
            <button 
              className="retry-btn"
              onClick={fetchAboutData}
            >
              {isArabic ? 'إعادة المحاولة' : 'Try Again'}
            </button>
          </div>
        </div>
      </section>
    );
  }

  const { 
    badge, 
    title, 
    main_description, 
    highlight_text, 
    image_url, 
    features = [] 
  } = aboutData;

  // دالة لتنسيق النص القادم من قاعدة البيانات
  const formatDescription = (html) => {
    if (!html) return '';
    
    let formatted = html
      .replace(/تمكين|empower/gi, '<strong style="color: #FDB813;">$&</strong>')
      .replace(/إمكانياتهم|potential/gi, '<strong style="color: #FDB813;">$&</strong>')
      .replace(/نهج مختلف|unique approach/gi, '<strong style="color: #FDB813;">$&</strong>')
      .replace(/برامج متكاملة|comprehensive programs/gi, '<strong style="color: #FDB813;">$&</strong>')
      .replace(/4 سنوات|four years/gi, '<strong style="color: #FDB813;">$&</strong>')
      .replace(/200 مترب ومتدربة|200 clients/gi, '<strong style="color: #FDB813;">$&</strong>');
    
    return formatted;
  };

  return (
    <section className="about" id="about">
      <div className="about-container">
        <motion.div
          className="about-content"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          key={currentLang}
        >
          {/* Left Column - About & Features */}
          <motion.div
            className="about-details"
            variants={itemVariants}
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            <div className="section-header">
              <span className="section-tag">{badge}</span>
              <h3 className="section-title" style={{ color: "#1C1C1C" }}>
                {title}
              </h3>
            </div>
            
            <div 
              className="experience-text"
              dangerouslySetInnerHTML={{ __html: formatDescription(main_description) }}
              dir={isArabic ? 'rtl' : 'ltr'}
              style={{ 
                textAlign: isArabic ? 'right' : 'left',
                fontFamily: isArabic ? 'Tajawal, sans-serif' : 'Poppins, sans-serif',
                color: '#444444',
                lineHeight: '1.8',
                fontSize: '1.1rem'
              }}
            />

            {features.length > 0 && (
              <div className="services-grid">
                {features.map((feature, index) => (
                  <motion.div
                    key={`feature-${feature.id || index}-${feature.title}`}
                    className="service-card"
                    variants={itemVariants}
                    whileHover={!isMobile ? {
                      y: -3,
                      transition: { duration: 0.2 }
                    } : {}}
                    whileTap={isMobile ? { scale: 0.98 } : {}}
                    dir={isArabic ? 'rtl' : 'ltr'}
                    style={{ 
                      textAlign: isArabic ? 'right' : 'left',
                      fontFamily: isArabic ? 'Tajawal, sans-serif' : 'Poppins, sans-serif',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #F0F0F0',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <div className="service-icon">
                      <span className="icon-symbol">
                        {getIconComponent(feature.icon)}
                      </span>
                    </div>
                    <div className="service-content">
                      <h4 style={{ 
                        color: '#1C1C1C',
                        fontSize: '1.15rem',
                        fontWeight: '700',
                        marginBottom: '8px'
                      }}>
                        {feature.title}
                      </h4>
                      <p style={{ 
                        color: '#666666',
                        fontSize: '0.95rem',
                        lineHeight: '1.5'
                      }}>
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="about-cta">
              <motion.button
                className="cta-button"
                whileHover={!isMobile ? { scale: 1.05 } : {}}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/auth')}
                style={{ 
                  fontFamily: isArabic ? 'Tajawal, sans-serif' : 'Poppins, sans-serif',
                  background: 'linear-gradient(135deg, #FDB813 0%, #FFD166 100%)',
                  color: '#1C1C1C',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  padding: '1rem 2.5rem',
                  borderRadius: '50px',
                  border: 'none',
                  boxShadow: '0 6px 20px rgba(253, 184, 19, 0.3)'
                }}
              >
                {isArabic ? 'ابدأ رحلتك الآن' : 'Start Your Journey Now'}
              </motion.button>
            </div>
          </motion.div>

          {/* Right Column - Trainer Profile - ✅ مع أبعاد ثابتة للصورة */}
          <motion.div
            className="trainer-profile"
            variants={isTablet ? itemVariants : profileVariants}
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            <div className="profile-image-wrapper">
              <img
                src={image_url}
                alt={isArabic ? 'رند جرار - مدرب لياقة بدنية' : 'Rand Jarar - Fitness Coach'}
                className="profile-image"
                width="400"
                height="533"
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  aspectRatio: '3/4'
                }}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=800&fit=crop';
                }}
              />
              <div className="profile-badge">
                <FaCheckCircle />
                <span style={{ color: '#1C1C1C' }}>
                  {isArabic ? 'مدربة معتمدة' : 'Certified Coach'}
                </span>
              </div>
            </div>

            <div className="profile-info">
              <h3 className="trainer-name" style={{ 
                color: '#1C1C1C',
                fontSize: '2.2rem',
                fontWeight: '800',
                marginBottom: '10px'
              }}>
                Rand Jarar
              </h3>
              <p 
                className="trainer-philosophy"
                style={{ 
                  fontFamily: isArabic ? 'Tajawal, sans-serif' : 'Poppins, sans-serif',
                  fontStyle: isArabic ? 'normal' : 'italic',
                  color: '#555555',
                  fontSize: '1.1rem',
                  lineHeight: '1.6',
                  padding: '0 10px',
                  background: 'linear-gradient(90deg, rgba(253,184,19,0.1) 0%, rgba(255,255,255,0) 100%)',
                  borderRadius: '8px',
                  borderLeft: isArabic ? 'none' : '4px solid #FDB813',
                  borderRight: isArabic ? '4px solid #FDB813' : 'none',
                  paddingLeft: isArabic ? '15px' : '20px',
                  paddingRight: isArabic ? '20px' : '15px',
                  marginTop: '15px'
                }}
              >
                {highlight_text}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="decorative-circle circle-1"></div>
      <div className="decorative-circle circle-2"></div>
    </section>
  );
};

export default About;