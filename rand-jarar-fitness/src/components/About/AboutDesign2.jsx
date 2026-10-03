import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowRight, ArrowLeft, Play } from 'lucide-react';
import DOMPurify from 'dompurify';
import './AboutDesign2.scss';

const AboutDesign2 = ({ aboutData }) => {
  const { isArabic } = useLanguage();
  const navigate = useNavigate();
  const { badge, title, main_description, highlight_text, image_url, features = [] } = aboutData;
  const isTransparent = aboutData.bg_style === 'transparent';

  const STATS = [
    { value: '200+', label: isArabic ? 'متدرب سعيد' : 'Trainees' },
    { value: '+4',   label: isArabic ? 'سنوات خبرة' : 'Years' },
    { value: '98%',  label: isArabic ? 'نسبة النجاح' : 'Success' },
  ];

  return (
    <section className={`abt2 ${isTransparent ? 'abt2--light' : ''}`} id="about">
      <div className="abt2-img">
        <img src={image_url || '/coach.webp'} alt="Coach" onError={e => e.target.src = '/coach.webp'} />
      </div>

      <div className="abt2-content">
        <div className="abt2-eyebrow">
          <span className="abt2-eyebrow__line" />
          <span className="abt2-eyebrow__text">{badge}</span>
        </div>

        <h2 className="abt2-title" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(title) }} />
        <div className="abt2-divider" />
        <div className="abt2-desc" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(main_description) }} />

        <div className="abt2-features">
          {features.map((f, i) => (
            <div key={i} className="abt2-feat">
              <div className="abt2-feat__icon">{f.icon}</div>
              <div>
                <h4>{f.title}</h4>
                <p>{f.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="abt2-bottom">
          <button className="abt2-cta" onClick={() => navigate('/auth')}>
            {isArabic ? 'ابدأ رحلتك الآن →' : 'Start your journey →'}
          </button>
          <div className="abt2-stats">
            {STATS.map((s, i) => (
              <div key={i} className="abt2-stat">
                <span className="abt2-stat__v">{s.value}</span>
                <span className="abt2-stat__l">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {highlight_text && (
        <div className="abt2-quote">
          <div className="abt2-quote__mark">"</div>
          <p>{highlight_text}</p>
          <div className="abt2-quote__name">— Rand Jarar</div>
        </div>
      )}
    </section>
  );
};

export default AboutDesign2;
