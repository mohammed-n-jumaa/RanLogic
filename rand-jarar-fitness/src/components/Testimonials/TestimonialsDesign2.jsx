import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import './TestimonialsDesign2.scss';

const DEFAULT_AVATAR = 'https://i.postimg.cc/WpqHf2CH/download.png';

const TestimonialsDesign2 = ({ section, testimonials }) => {
  const { isArabic } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  if (!testimonials?.length) return null;
  const active = testimonials[activeIndex];

  const goTo = (idx) => {
    setDirection(idx > activeIndex ? 1 : -1);
    setActiveIndex(idx);
  };

  const next = () => { setDirection(1); setActiveIndex((activeIndex + 1) % testimonials.length); };
  const prev = () => { setDirection(-1); setActiveIndex((activeIndex - 1 + testimonials.length) % testimonials.length); };

  const handleImageError = (e) => { e.target.src = DEFAULT_AVATAR; };

  const variants = {
    enter: (d) => ({ opacity: 0, x: d > 0 ? 80 : -80, scale: 0.95 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (d) => ({ opacity: 0, x: d < 0 ? 80 : -80, scale: 0.95 }),
  };

  return (
    <section className="tst2" id="testimonials" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="tst2-bg"><div className="tst2-glow tst2-glow--1" /><div className="tst2-glow tst2-glow--2" /></div>

      <div className="tst2-wrap">
        {/* Header */}
        <motion.div className="tst2-header" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          {section?.badge && <span className="tst2-badge"><span className="tst2-badge__dot" />{section.badge}</span>}
          <h2 className="tst2-title">{section?.title || ''}</h2>
          {section?.description && <p className="tst2-desc">{section.description}</p>}
        </motion.div>

        {/* Spotlight */}
        <div className="tst2-stage">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div className="tst2-spotlight" key={activeIndex} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
              {/* Photo */}
              <div className="tst2-photo">
                <img src={active.image_url || DEFAULT_AVATAR} alt={active.name} onError={handleImageError} loading="lazy" />
                <div className="tst2-photo__ring" />
                <div className="tst2-photo__stars">
                  {[...Array(active.rating || 5)].map((_, i) => (<Star key={i} size={14} fill="var(--site-primary)" color="var(--site-primary)" />))}
                </div>
              </div>

              {/* Content */}
              <div className="tst2-content">
                <div className="tst2-quote-mark">"</div>
                <p className="tst2-text">{active.text}</p>
                <div className="tst2-author">
                  <div className="tst2-author__info">
                    <h4 className="tst2-author__name">{active.name}</h4>
                    <span className="tst2-author__title">{active.title}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          {testimonials.length > 1 && (
            <div className="tst2-nav-arrows">
              <button className="tst2-arrow" onClick={prev} aria-label="Previous"><ChevronLeft size={18} /></button>
              <button className="tst2-arrow" onClick={next} aria-label="Next"><ChevronRight size={18} /></button>
            </div>
          )}
        </div>

        {/* Thumbnail Strip */}
        {testimonials.length > 1 && (
          <div className="tst2-thumbs">
            {testimonials.map((t, i) => (
              <button key={t.id || i} className={`tst2-thumb ${i === activeIndex ? 'tst2-thumb--active' : ''}`} onClick={() => goTo(i)} aria-label={t.name}>
                {t.image_url ? (
                  <img src={t.image_url} alt={t.name} onError={handleImageError} />
                ) : (
                  <span>{(t.name || '?').charAt(0)}</span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Stats Strip */}
        <div className="tst2-stats">
          <div className="tst2-stat"><span className="tst2-stat__num">+{testimonials.length * 50}</span><span className="tst2-stat__label">{isArabic ? 'متدربة' : 'Clients'}</span></div>
          <div className="tst2-stat-div" />
          <div className="tst2-stat"><span className="tst2-stat__num">4.9</span><span className="tst2-stat__label">{isArabic ? 'تقييم' : 'Rating'}</span></div>
          <div className="tst2-stat-div" />
          <div className="tst2-stat"><span className="tst2-stat__num">96%</span><span className="tst2-stat__label">{isArabic ? 'رضا العملاء' : 'Satisfaction'}</span></div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsDesign2;
