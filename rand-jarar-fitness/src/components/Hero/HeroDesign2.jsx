import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import DOMPurify from 'dompurify';
import './HeroDesign2.scss';

const SLIDE_INTERVAL = 3000;
const containerV = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.15 } } };
const itemV = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } };

const HeroDesign2 = ({ heroData }) => {
  const { isArabic } = useLanguage();
  const navigate = useNavigate();
  const [cur, setCur] = useState(0);
  const [progress, setProgress] = useState(0);

  const { badge, main_title, sub_title, description, stats = [], cta_buttons = [], slides = [] } = heroData;
  const total = Math.max(slides.length, 1);

  // Auto-advance
  useEffect(() => {
    if (total <= 1) return;
    const iv = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { setCur(c => (c + 1) % total); return 0; }
        return p + (100 / (SLIDE_INTERVAL / 100));
      });
    }, 100);
    return () => clearInterval(iv);
  }, [total]);

  const goTo = useCallback((i) => { setCur(i % total); setProgress(0); }, [total]);

  const slide = slides[cur];
  const title = slide?.main_title || main_title;
  const subtitle = slide?.sub_title || sub_title;
  const desc = slide?.description || description;
  const curStat = stats[cur % Math.max(stats.length, 1)] || stats[0];
  const circumference = 2 * Math.PI * 14;

  const handleCta = (btn) => {
    if (!btn) return;
    btn.target_type === 'section'
      ? document.getElementById(btn.target_value)?.scrollIntoView({ behavior: 'smooth' })
      : navigate(btn.target_value || '/auth');
  };

  const primaryBtn = cta_buttons.find(b => b.style === 'primary') || cta_buttons[0];
  const secondaryBtn = cta_buttons.find(b => b.style === 'secondary') || cta_buttons[1];

  return (
    <section className="hero-d2" id="home">
      {/* Background slides */}
      <div className="hero-d2__bg">
        {slides.length > 0 ? slides.map((sl, i) => (
          <div key={i} className={`hero-d2__slide ${i === cur ? 'hero-d2__slide--active' : ''}`}>
            <img src={sl.image_url} alt="" />
          </div>
        )) : (
          heroData.video_url && <video className="hero-d2__video" autoPlay loop muted playsInline src={heroData.video_url} />
        )}
        <div className="hero-d2__overlay" />
      </div>

      {/* Content */}
      <div className="hero-d2__content">
        <AnimatePresence mode="wait">
          <motion.div className="hero-d2__text" key={cur} variants={containerV} initial="hidden" animate="visible" exit={{ opacity: 0, transition: { duration: 0.3 } }}>
            {badge && (
              <motion.div className="hero-d2__badge" variants={itemV}>
                <span className="hero-d2__badge-dot" /><span>{badge}</span>
              </motion.div>
            )}
            <motion.h1 className="hero-d2__title" variants={itemV}>
              {title}<span className="hero-d2__accent">{subtitle}</span>
            </motion.h1>
            {desc && <motion.p className="hero-d2__desc" variants={itemV} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(desc) }} />}
            <motion.div className="hero-d2__btns" variants={itemV}>
              {primaryBtn && <button className="hero-d2__btn hero-d2__btn--primary" onClick={() => handleCta(primaryBtn)}><span>{primaryBtn.label}</span>{isArabic ? '←' : '→'}</button>}
              {secondaryBtn && <button className="hero-d2__btn hero-d2__btn--secondary" onClick={() => handleCta(secondaryBtn)}>▶ <span>{secondaryBtn.label}</span></button>}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Floating stat */}
        {curStat && (
          <motion.div className="hero-d2__float" key={`s-${cur}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <div className="hero-d2__float-val">{curStat.value}</div>
            <div className="hero-d2__float-lbl">{curStat.label}</div>
            <div className="hero-d2__float-bar"><motion.div className="hero-d2__float-fill" initial={{ width: 0 }} animate={{ width: '92%' }} transition={{ delay: 0.6, duration: 1.2 }} /></div>
          </motion.div>
        )}
      </div>

      {/* Indicators */}
      {total > 1 && (
        <div className="hero-d2__indicators">
          {slides.map((_, i) => <button key={i} className={`hero-d2__ind ${i === cur ? 'hero-d2__ind--active' : ''}`} onClick={() => goTo(i)} />)}
        </div>
      )}

      {/* Timer ring */}
      {total > 1 && (
        <svg className="hero-d2__ring" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="14" fill="none" strokeWidth="2" stroke="rgba(255,255,255,0.1)" />
          <circle cx="16" cy="16" r="14" fill="none" strokeWidth="2" stroke="var(--site-primary)" strokeDasharray={circumference} strokeDashoffset={circumference - (circumference * progress) / 100} strokeLinecap="round" style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 0.1s linear' }} />
        </svg>
      )}
    </section>
  );
};

export default HeroDesign2;
