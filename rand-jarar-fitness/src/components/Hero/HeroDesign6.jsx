import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowRight, ArrowLeft, Play } from 'lucide-react';
import DOMPurify from 'dompurify';
import './HeroDesign6.scss';

const HeroDesign6 = ({ heroData }) => {
  const { isArabic } = useLanguage();
  const navigate = useNavigate();
  const reelRef = useRef(null);
  const [bgIdx, setBgIdx] = useState(0);

  const { badge, main_title, sub_title, description, stats = [], cta_buttons = [], slides = [] } = heroData;

  // Cycle background image
  useEffect(() => {
    if (slides.length <= 1) return;
    const iv = setInterval(() => setBgIdx(c => (c + 1) % slides.length), 4000);
    return () => clearInterval(iv);
  }, [slides.length]);

  const bgImg = slides[bgIdx]?.image_url || slides[0]?.image_url || '';

  // Build reel frames (repeat 3x for seamless loop)
  useEffect(() => {
    if (!reelRef.current || slides.length === 0) return;
    const reel = reelRef.current;
    reel.innerHTML = '';
    for (let rep = 0; rep < 3; rep++) {
      slides.forEach(sl => {
        const frame = document.createElement('div');
        frame.className = 'hd6-frame';
        const img = document.createElement('img');
        img.src = sl.image_url;
        img.alt = '';
        frame.appendChild(img);
        reel.appendChild(frame);
      });
    }
  }, [slides]);

  const handleCta = (btn) => {
    if (!btn) return;
    btn.target_type === 'section' ? document.getElementById(btn.target_value)?.scrollIntoView({ behavior: 'smooth' }) : navigate(btn.target_value || '/auth');
  };
  const primaryBtn = cta_buttons.find(b => b.style === 'primary') || cta_buttons[0];
  const secondaryBtn = cta_buttons.find(b => b.style === 'secondary') || cta_buttons[1];

  return (
    <section className="hd6" id="home">
      {/* Background from slides */}
      <div className="hd6-bg">
        <AnimatePresence mode="wait">
          {bgImg && (
            <motion.img key={bgImg} src={bgImg} alt="" className="hd6-bg__img"
              initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 1 }} />
          )}
        </AnimatePresence>
        <div className="hd6-bg__overlay" />
      </div>

      <div className="hd6-content">
        {badge && <div className="hd6-kicker"><span className="hd6-kicker__dot" />{badge}</div>}
        <h1 className="hd6-title">{main_title}</h1>
        {sub_title && <p className="hd6-sub">{sub_title}</p>}
        {description && <p className="hd6-desc" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }} />}
        <div className="hd6-btns">
          {primaryBtn ? <button className="hd6-btn hd6-btn--primary" onClick={() => handleCta(primaryBtn)}><span>{primaryBtn.label}</span>{isArabic ? <ArrowLeft size={16}/> : <ArrowRight size={16}/>}</button>
           : <button className="hd6-btn hd6-btn--primary" onClick={() => navigate('/auth')}><span>{isArabic ? 'ابدأ الآن' : 'Start Now'}</span>{isArabic ? <ArrowLeft size={16}/> : <ArrowRight size={16}/>}</button>}
          {secondaryBtn ? <button className="hd6-btn hd6-btn--secondary" onClick={() => handleCta(secondaryBtn)}><Play size={14}/><span>{secondaryBtn.label}</span></button>
           : <button className="hd6-btn hd6-btn--secondary" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}><Play size={14}/><span>{isArabic ? 'استكشف البرامج' : 'Explore Programs'}</span></button>}
        </div>
      </div>

      {stats.length > 0 && (
        <div className="hd6-stats-side">
          {stats.map((s, i) => (
            <div key={i} className="hd6-st"><div className="hd6-st__v">{s.value}</div><div className="hd6-st__l">{s.label}</div></div>
          ))}
        </div>
      )}

      <div className="hd6-reel-track" ref={reelRef} />
      <div className="hd6-reel-overlay" />
      <div className="hd6-spotlight" />
    </section>
  );
};
export default HeroDesign6;
