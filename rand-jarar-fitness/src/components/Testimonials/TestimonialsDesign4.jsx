import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import './TestimonialsDesign4.scss';

const DEFAULT_AVATAR = 'https://i.postimg.cc/WpqHf2CH/download.png';

const TestimonialsDesign4 = ({ section, testimonials }) => {
  const { isArabic } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const handleImageError = (e) => { e.target.src = DEFAULT_AVATAR; };

  if (!testimonials?.length) return null;

  const getIndex = (offset) => (activeIndex + offset + testimonials.length) % testimonials.length;
  const prev = () => setActiveIndex(getIndex(-1));
  const next = () => setActiveIndex(getIndex(1));
  const active = testimonials[activeIndex];
  const leftItem = testimonials.length > 1 ? testimonials[getIndex(-1)] : null;
  const rightItem = testimonials.length > 2 ? testimonials[getIndex(1)] : null;

  const renderSideCard = (item, side) => {
    if (!item) return <div className="tst4-side-placeholder" />;
    return (
      <div className={`tst4-side tst4-side--${side}`}>
        <div className="tst4-side__inner">
          <div className="tst4-side__avatar">
            {item.image_url ? <img src={item.image_url} alt={item.name} onError={handleImageError} /> : <span>{(item.name || '?').charAt(0)}</span>}
          </div>
          <div className="tst4-side__stars">
            {[...Array(item.rating || 5)].map((_, i) => (<Star key={i} size={10} fill="var(--site-primary)" color="var(--site-primary)" />))}
          </div>
          <p className="tst4-side__text">{(item.text || '').slice(0, 80)}...</p>
          <span className="tst4-side__name">{item.name}</span>
        </div>
      </div>
    );
  };

  return (
    <section className="tst4" id="testimonials" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="tst4-wrap">
        {/* Header */}
        <motion.div className="tst4-header" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          {section?.badge && <span className="tst4-badge"><span className="tst4-badge__dot" />{section.badge}</span>}
          <h2 className="tst4-title">{section?.title || ''}</h2>
        </motion.div>

        {/* 3D Carousel */}
        <div className="tst4-carousel">
          {renderSideCard(isArabic ? rightItem : leftItem, 'left')}

          {/* Center Hero Card */}
          <AnimatePresence mode="wait">
            <motion.div className="tst4-hero" key={activeIndex} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.35 }}>
              <div className="tst4-hero__glow" />
              <div className="tst4-hero__inner">
                <div className="tst4-hero__quote-icon"><span>"</span></div>
                <p className="tst4-hero__text">{active.text}</p>
                <div className="tst4-hero__divider" />
                <div className="tst4-hero__author">
                  <div className="tst4-hero__avatar">
                    {active.image_url ? <img src={active.image_url} alt={active.name} onError={handleImageError} /> : <span>{(active.name || '?').charAt(0)}</span>}
                  </div>
                  <div>
                    <h4 className="tst4-hero__name">{active.name}</h4>
                    <span className="tst4-hero__job">{active.title}</span>
                  </div>
                </div>
                <div className="tst4-hero__stars">
                  {[...Array(active.rating || 5)].map((_, i) => (<Star key={i} size={14} fill="var(--site-primary)" color="var(--site-primary)" />))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {renderSideCard(isArabic ? leftItem : rightItem, 'right')}
        </div>

        {/* Dots */}
        <div className="tst4-dots">
          {testimonials.map((_, i) => (
            <button key={i} className={`tst4-dot ${i === activeIndex ? 'tst4-dot--active' : ''}`} onClick={() => setActiveIndex(i)} aria-label={`Testimonial ${i + 1}`} />
          ))}
        </div>

        {/* Arrows */}
        {testimonials.length > 1 && (
          <div className="tst4-arrows">
            <button className="tst4-arrow" onClick={isArabic ? next : prev}><ChevronRight size={16} /></button>
            <button className="tst4-arrow tst4-arrow--primary" onClick={isArabic ? prev : next}><ChevronLeft size={16} /></button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsDesign4;
