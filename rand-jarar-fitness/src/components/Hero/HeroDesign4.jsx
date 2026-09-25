import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowRight, ArrowLeft, Play } from 'lucide-react';
import DOMPurify from 'dompurify';
import './HeroDesign4.scss';

const SLIDE_INTERVAL = 4000;
const COLS = 4, ROWS = 5;

const HeroDesign4 = ({ heroData }) => {
  const { isArabic } = useLanguage();
  const navigate = useNavigate();
  const [cur, setCur] = useState(0);
  const [scattered, setScattered] = useState(false);

  const { badge, main_title, sub_title, description, stats = [], cta_buttons = [], slides = [] } = heroData;
  const total = Math.max(slides.length, 1);

  const tiles = useMemo(() => {
    const arr = [];
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++)
        arr.push({ c, r, sx: (Math.random()-0.5)*300, sy: (Math.random()-0.5)*300, sr: (Math.random()-0.5)*60 });
    return arr;
  }, []);

  useEffect(() => {
    if (total <= 1) return;
    const iv = setInterval(() => {
      setScattered(true);
      setTimeout(() => { setCur(c => (c+1)%total); setScattered(false); }, 600);
    }, SLIDE_INTERVAL);
    return () => clearInterval(iv);
  }, [total]);

  const slide = slides[cur];
  const title = slide?.main_title || main_title || '';
  const subtitle = slide?.sub_title || sub_title || '';
  const desc = slide?.description || description || '';
  const imgUrl = slide?.image_url || slides[0]?.image_url || '';

  const handleCta = (btn) => {
    if (!btn) return;
    btn.target_type === 'section' ? document.getElementById(btn.target_value)?.scrollIntoView({ behavior: 'smooth' }) : navigate(btn.target_value || '/auth');
  };
  const primaryBtn = cta_buttons.find(b => b.style === 'primary') || cta_buttons[0];
  const secondaryBtn = cta_buttons.find(b => b.style === 'secondary') || cta_buttons[1];

  return (
    <section className="hd4" id="home">
      <div className="hd4-bg">{imgUrl && <img src={imgUrl} alt="" className="hd4-bg__img" />}</div>

      <div className="hd4-mosaic">
        {imgUrl && tiles.map((t, i) => (
          <div key={i} className={`hd4-tile ${scattered ? 'hd4-tile--scatter' : ''}`}
            style={{
              left: `${(t.c / COLS) * 100}%`,
              top: `${(t.r / ROWS) * 100}%`,
              width: `${100 / COLS}%`,
              height: `${100 / ROWS}%`,
              '--sx': `${t.sx}px`, '--sy': `${t.sy}px`, '--sr': `${t.sr}deg`,
              transitionDelay: `${i * 0.025}s`,
            }}>
            <div className="hd4-tile__inner" style={{
              backgroundImage: `url(${imgUrl})`,
              backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
              backgroundPosition: `${(t.c / (COLS - 1)) * 100}% ${(t.r / (ROWS - 1)) * 100}%`,
            }} />
          </div>
        ))}
      </div>

      <div className="hd4-content">
        <AnimatePresence mode="wait">
          <motion.div key={cur} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            {badge && <div className="hd4-kicker"><span className="hd4-kicker__line" />{badge}</div>}
            {title && <h1 className="hd4-title">{title}</h1>}
            {subtitle && <p className="hd4-sub">{subtitle}</p>}
            {desc && <p className="hd4-desc" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(desc) }} />}
          </motion.div>
        </AnimatePresence>
        <div className="hd4-btns">
          {primaryBtn ? <button className="hd4-btn hd4-btn--primary" onClick={() => handleCta(primaryBtn)}><span>{primaryBtn.label}</span>{isArabic ? <ArrowLeft size={16}/> : <ArrowRight size={16}/>}</button>
           : <button className="hd4-btn hd4-btn--primary" onClick={() => navigate('/auth')}><span>{isArabic ? 'ابدأ الآن' : 'Start Now'}</span>{isArabic ? <ArrowLeft size={16}/> : <ArrowRight size={16}/>}</button>}
          {secondaryBtn ? <button className="hd4-btn hd4-btn--secondary" onClick={() => handleCta(secondaryBtn)}><Play size={14}/><span>{secondaryBtn.label}</span></button>
           : <button className="hd4-btn hd4-btn--secondary" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}><Play size={14}/><span>{isArabic ? 'استكشف البرامج' : 'Explore Programs'}</span></button>}
        </div>
      </div>

      <div className="hd4-bottom">
        {stats.length > 0 && <div className="hd4-stats">{stats.map((s,i) => (<div key={i} className="hd4-st"><span className="hd4-st__v">{s.value}</span><span className="hd4-st__l">{s.label}</span></div>))}</div>}
        {total > 1 && <div className="hd4-dots">{slides.map((_, i) => <button key={i} className={`hd4-dot ${i === cur ? 'hd4-dot--on' : ''}`} onClick={() => { setScattered(true); setTimeout(() => { setCur(i); setScattered(false); }, 600); }} />)}</div>}
      </div>
    </section>
  );
};
export default HeroDesign4;
