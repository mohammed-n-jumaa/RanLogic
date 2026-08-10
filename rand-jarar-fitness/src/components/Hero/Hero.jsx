import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import heroApi from '../../api/heroApi';
import './Hero.scss';
import { ArrowRight, ArrowLeft, Play } from 'lucide-react';
import DOMPurify from 'dompurify';

// ─── Static fallback (مطابق للصور) ──────────────────────────────────────────
const getStaticHero = (isArabic) => ({
  video_url:   '/hero_video.mp4',
  badge:       isArabic ? 'برنامج تدريب شخصي'                                                            : 'Personalized Training Program',
  main_title:  isArabic ? '* استثمر في نفسك، واصنع النسخة الأفضل من ذاتك اليوم.'                        : 'Invest in yourself, and build the best version of you today',
  sub_title:   isArabic ? 'رحلتك نحو جسم قوي وثقة لا تهتز تبدأ من هنا.'                                 : 'Your journey toward a strong body and unshakable confidence starts here.',
  description: isArabic
    ? 'وداعاً للبرامج العشوائية. انضم إلى برنامج ضُمم علمياً ليناسب أهدافك الخاصة.'
    : 'Say goodbye to generic plans. Join a program scientifically tailored to your specific goals.',
  stats: [
    { value: '+200', label: isArabic ? 'متدرب سعيد'  : 'Happy Trainees'      },
    { value: '+4',   label: isArabic ? 'سنوات خبرة'  : 'Years of Experience'  },
    { value: '98%',  label: isArabic ? 'نسبة النجاح' : 'Success Rate'         },
  ],
});

// ─── Variants ────────────────────────────────────────────────────────────────
const containerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

// ─── Component ────────────────────────────────────────────────────────────────
const Hero = () => {
  const { currentLang, isArabic } = useLanguage();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [heroData,    setHeroData]    = useState(() => getStaticHero(true));
  const [videoLoaded, setVideoLoaded] = useState(false);

  // ── جلب الـ API + تحديث اللغة في useEffect واحد ─────────────────────────────
  useEffect(() => {
    // أول شي حدّث الـ static للغة الحالية
    setHeroData(prev => prev._fromApi ? prev : getStaticHero(isArabic));

    // ثم اجلب الـ API في الخلفية
    let cancelled = false;
    heroApi.getHeroSection(currentLang).then(res => {
      if (!cancelled && res?.success && res?.data) {
        setHeroData({ ...res.data, _fromApi: true });
      }
    });
    return () => { cancelled = true; };
  }, [currentLang]); 

  useEffect(() => {
  if (!videoRef.current) return;
  videoRef.current.src = heroData.video_url;
  videoRef.current.load();
}, [heroData.video_url]);

  const { badge, main_title, sub_title, description, stats = [] } = heroData;

  return (
    <section className="hero" id="home">

      {/* ── Video Background ── */}
      <div className="hero-video-container">
        <video
          ref={videoRef}
          className={`hero-video ${videoLoaded ? 'hero-video--loaded' : ''}`}
          autoPlay
          loop
          muted
          playsInline
          controls={false}
          preload="none"
          onCanPlay={() => setVideoLoaded(true)}
          aria-hidden="true"
        />
        <div className="hero-overlay" />
      </div>

      {/* ── Content ── */}
      <div className="hero-content">
        <motion.div
          className="hero-text"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={currentLang}
        >
          <motion.div className="hero-badge" variants={itemVariants}>
            <span className="badge-dot" />
            <span>{badge}</span>
          </motion.div>

          <motion.h1 className="hero-title" variants={itemVariants}>
            {main_title}
            <br />
            <span className="highlight">{sub_title}</span>
          </motion.h1>

          <motion.p
            className="hero-description"
            variants={itemVariants}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }}
          />

          <motion.div className="hero-buttons" variants={itemVariants}>
            <button className="btn btn-primary" onClick={() => navigate('/auth')}>
              {isArabic
                ? <><span>ابدأ الآن</span><ArrowLeft /></>
                : <><span>Start Now</span><ArrowRight /></>}
            </button>
            <button
              className="btn btn-white"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Play />
              {isArabic ? 'استكشف البرامج' : 'Explore Programs'}
            </button>
          </motion.div>

          {stats.length > 0 && (
            <motion.div className="hero-stats" variants={itemVariants}>
              {stats.map((stat, index) => (
                <div key={index} className="stat-wrapper">
                  {index > 0 && <div className="stat-divider" />}
                  <div className="stat-item">
                    <motion.h3
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 1 + index * 0.2 }}
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
    </section>
  );
};

export default Hero;