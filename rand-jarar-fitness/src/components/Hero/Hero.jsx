import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaArrowLeft, FaPlay, FaSpinner } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';
import heroApi from '../../api/heroApi';
import './Hero.scss';

const Hero = () => {
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentLang, isArabic } = useLanguage();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    fetchHeroData();
  }, [currentLang]);

  const fetchHeroData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await heroApi.getHeroSection(currentLang);

      if (response.success && response.data) {
        setHeroData(response.data);
      } else {
        setError('Failed to load hero section');
      }
    } catch (err) {
      console.error('Error fetching hero data:', err);
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
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  if (loading) {
    return (
      <section className="hero" id="home">
        <div className="hero-video-container">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="hero-loading">
            <FaSpinner className="spinner" />
            <p>{isArabic ? 'جاري تحميل المحتوى...' : 'Loading content...'}</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !heroData) {
    return (
      <section className="hero" id="home">
        <div className="hero-video-container">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="hero-error">
            <p>{isArabic ? 'عذراً، حدث خطأ في تحميل المحتوى' : 'Sorry, error loading content'}</p>
            <button
              className="btn btn-primary"
              onClick={fetchHeroData}
            >
              {isArabic ? 'إعادة المحاولة' : 'Try Again'}
            </button>
          </div>
        </div>
      </section>
    );
  }

  const {
    video_url,
    badge,
    main_title,
    sub_title,
    description,
    stats = []
  } = heroData;

  return (
    <section className="hero" id="home">
      {/* Video Background - يغطي كامل الشاشة بدون صوت */}
      <div className="hero-video-container">
        <video
          ref={videoRef}
          className="hero-video"
          src={video_url}
          autoPlay
          loop
          muted
          playsInline
          controls={false}
          volume={0}
        />
        <div className="hero-overlay"></div>
      </div>

      {/* Content */}
      <div className="hero-content">
        <motion.div
          className="hero-text"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={currentLang}
        >
          <motion.div
            className="hero-badge"
            variants={itemVariants}
          >
            <span className="badge-dot"></span>
            <span>{badge}</span>
          </motion.div>

          <motion.h1
            className="hero-title"
            variants={itemVariants}
          >
            {main_title}
            <br />
            <span className="highlight">{sub_title}</span>
          </motion.h1>

          <motion.p
            className="hero-description"
            variants={itemVariants}
            dangerouslySetInnerHTML={{ __html: description }}
          />

          <motion.div
            className="hero-buttons"
            variants={itemVariants}
          >
            <button
              className="btn btn-primary"
              onClick={() => navigate('/auth')}
            >
              {isArabic ? (
                <>
                  ابدأ الآن
                  <FaArrowLeft /> 
                </>
              ) : (
                <>
                  Start Now
                  <FaArrowRight /> 
                </>
              )}
            </button>

            <button
              className="btn btn-white"
              onClick={() => {
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                  aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <FaPlay />
              {isArabic ? 'استكشف البرامج' : 'Explore Programs'}
            </button>
          </motion.div>

          {stats.length > 0 && (
            <motion.div
              className="hero-stats"
              variants={itemVariants}
            >
              {stats.map((stat, index) => (
                <div key={index} className="stat-wrapper">
                  {index > 0 && <div className="stat-divider"></div>}
                  <div className="stat-item">
                    <motion.h3
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 1 + (index * 0.2) }}
                    >
                      {stat.value}
                    </motion.h3>
                    <p>{stat.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="scroll-indicator"
        animate={{ y: [0, 10, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="mouse">
          <div className="wheel"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;