import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { Star } from 'lucide-react';
import './TestimonialsDesign3.scss';

const DEFAULT_AVATAR = 'https://i.postimg.cc/WpqHf2CH/download.png';

const TestimonialsDesign3 = ({ section, testimonials }) => {
  const { isArabic } = useLanguage();
  const handleImageError = (e) => { e.target.src = DEFAULT_AVATAR; };

  if (!testimonials?.length) return null;

  return (
    <section className="tst3" id="testimonials" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="tst3-wrap">
        {/* Header */}
        <motion.div className="tst3-header" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="tst3-eyebrow">
            <div className="tst3-eyebrow__line" />
            <span>{section?.badge || (isArabic ? 'آراء العملاء' : 'Testimonials')}</span>
          </div>
          <h2 className="tst3-title">{section?.title || ''}</h2>
        </motion.div>

        {/* Timeline */}
        <div className="tst3-timeline">
          <div className="tst3-line" />

          {testimonials.map((t, i) => (
            <motion.div
              key={t.id || i}
              className={`tst3-card ${i === 0 ? 'tst3-card--featured' : ''}`}
              initial={{ opacity: 0, x: isArabic ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{ opacity: Math.max(1 - i * 0.15, 0.35) }}
            >
              {/* Dot on line */}
              <div className={`tst3-dot ${i === 0 ? 'tst3-dot--active' : ''}`} />

              <div className={`tst3-card__inner ${i === 0 ? 'tst3-card__inner--featured' : ''}`}>
                {/* Avatar */}
                <div className={`tst3-avatar ${i === 0 ? 'tst3-avatar--lg' : ''}`}>
                  {t.image_url ? (
                    <img src={t.image_url} alt={t.name} onError={handleImageError} />
                  ) : (
                    <span>{(t.name || '?').charAt(0)}</span>
                  )}
                </div>

                <div className="tst3-card__body">
                  {/* Name + Stars */}
                  <div className="tst3-card__top">
                    <div>
                      <h4 className="tst3-card__name">{t.name}</h4>
                      <span className="tst3-card__job">{t.title}</span>
                    </div>
                    <div className="tst3-card__stars">
                      {[...Array(t.rating || 5)].map((_, si) => (
                        <Star key={si} size={i === 0 ? 13 : 11} fill="var(--site-primary)" color="var(--site-primary)" />
                      ))}
                    </div>
                  </div>

                  {/* Text */}
                  <p className="tst3-card__text">{t.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsDesign3;
