import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowRight, ArrowLeft, Play } from 'lucide-react';
import DOMPurify from 'dompurify';
import './HeroDesign3.scss';

const SLIDE_INTERVAL = 3500;

const HeroDesign3 = ({ heroData }) => {
  const { isArabic } = useLanguage();
  const navigate = useNavigate();
  const [cur, setCur] = useState(0);

  const { badge, main_title, sub_title, description, stats = [], cta_buttons = [], slides = [] } = heroData;
  const total = Math.max(slides.length, 1);

  useEffect(() => {
    if (total <= 1) return;
    const iv = setInterval(() => setCur(c => (c + 1) % total), SLIDE_INTERVAL);
    return () => clearInterval(iv);
  }, [total]);

  const slide = slides[cur];
  const title    = slide?.main_title  || main_title  || '';
  const subtitle = slide?.sub_title   || sub_title   || '';
  const desc     = slide?.description || description || '';
  const bgImg    = slide?.image_url   || slides[0]?.image_url || '';

  const handleCta = (btn) => {
    if (!btn) return;
    btn.target_type === 'section'
      ? document.getElementById(btn.target_value)?.scrollIntoView({ behavior: 'smooth' })
      : navigate(btn.target_value || '/auth');
  };

  const primaryBtn   = cta_buttons.find(b => b.style === 'primary')   || cta_buttons[0];
  const secondaryBtn = cta_buttons.find(b => b.style === 'secondary') || cta_buttons[1];

  const getCardClass = (index) => {
    const pos = (index - cur + total) % total;
    if (pos === 0) return 'hd3-card--front';
    if (pos === 1) return 'hd3-card--c1';
    if (pos === 2) return 'hd3-card--c2';
    return 'hd3-card--c3';
  };

  // Stats component (reused in both desktop & mobile positions)
  const StatsBar = () => stats.length > 0 ? (
    <div className="hd3-stats-bar">
      {stats.map((s, i) => (
        <div key={i} className="hd3-stat-item">
          {i > 0 && <div className="hd3-stat-div" />}
          <div className="hd3-stat">
            <span className="hd3-stat__val">{s.value}</span>
            <span className="hd3-stat__lbl">{s.label}</span>
          </div>
        </div>
      ))}
    </div>
  ) : null;

  const Dots = () => total > 1 ? (
    <div className="hd3-dots">
      {slides.map((_, i) => (
        <button key={i} className={`hd3-dot ${i === cur ? 'hd3-dot--on' : ''}`} onClick={() => setCur(i)} />
      ))}
    </div>
  ) : null;

  return (
    <section className="hd3" id="home">
      {/* Full-screen background */}
      <div className="hd3-bg">
        <AnimatePresence mode="wait">
          {bgImg && (
            <motion.img key={bgImg} src={bgImg} alt="" className="hd3-bg__img"
              initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 1 }} />
          )}
        </AnimatePresence>
        <div className="hd3-bg__overlay" />
      </div>

      {/* Desktop stats & dots (absolute positioned) */}
      <div className="hd3-desktop-only">
        <StatsBar />
        <Dots />
      </div>

      {/* Main layout */}
      <div className="hd3-wrap">
        {/* Card Stack */}
        <div className="hd3-cards">
          <div className="hd3-stack">
            {slides.length > 0 ? slides.map((sl, i) => (
              <div key={i} className={`hd3-card ${getCardClass(i)}`}
                onClick={() => setCur((cur + 1) % total)}>
                <img src={sl.image_url} alt="" />
              </div>
            )) : null}
          </div>
        </div>

        {/* Text content */}
        <div className="hd3-content">
          <AnimatePresence mode="wait">
            <motion.div key={cur} initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
              {badge && <div className="hd3-badge"><span className="hd3-badge__dot" />{badge}</div>}
              {title && <h1 className="hd3-title">{title}</h1>}
              {subtitle && <p className="hd3-sub">{subtitle}</p>}
              {desc && <p className="hd3-desc" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(desc) }} />}
            </motion.div>
          </AnimatePresence>

          <div className="hd3-btns">
            {primaryBtn ? (
              <button className="hd3-btn hd3-btn--primary" onClick={() => handleCta(primaryBtn)}>
                <span>{primaryBtn.label}</span>
                {isArabic ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
              </button>
            ) : (
              <button className="hd3-btn hd3-btn--primary" onClick={() => navigate('/auth')}>
                <span>{isArabic ? 'ابدأ الآن' : 'Start Now'}</span>
                {isArabic ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
              </button>
            )}
            {secondaryBtn ? (
              <button className="hd3-btn hd3-btn--secondary" onClick={() => handleCta(secondaryBtn)}>
                <Play size={14} /><span>{secondaryBtn.label}</span>
              </button>
            ) : (
              <button className="hd3-btn hd3-btn--secondary" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
                <Play size={14} /><span>{isArabic ? 'استكشف البرامج' : 'Explore Programs'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile stats & dots (in-flow) */}
        <div className="hd3-mobile-only">
          <StatsBar />
          <Dots />
        </div>
      </div>
    </section>
  );
};

export default HeroDesign3;
