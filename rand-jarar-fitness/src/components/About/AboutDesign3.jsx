import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import DOMPurify from 'dompurify';
import './AboutDesign3.scss';

const AboutDesign3 = ({ aboutData }) => {
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
    <section className={`abt3 ${isTransparent ? 'abt3--light' : ''}`} id="about">
      <div className="abt3-img-side">
        <div className="abt3-verified">
          {isArabic ? '✓ معتمدة' : '✓ Certified'}
        </div>
        <img src={image_url || '/coach.png'} alt="Coach" className="abt3-img"
          onError={(e) => { e.target.src = '/coach.png'; }} />
        <div className="abt3-img-overlay" />
        <div className="abt3-name-tag">
          <h3>Rand Jarar</h3>
          <span>{isArabic ? 'مدربة رئيسية' : 'Head Coach'}</span>
        </div>
      </div>

      <div className="abt3-content">
        <div className="abt3-eyebrow">
          <span className="abt3-eyebrow__line" />
          <span className="abt3-eyebrow__text">{badge}</span>
        </div>
        <h2 className="abt3-title" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(title) }} />
        <div className="abt3-desc" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(main_description) }} />
        <div className="abt3-stats">
          {STATS.map((s, i) => (
            <div key={i} className="abt3-stat">
              <span className="abt3-stat__val">{s.value}</span>
              <span className="abt3-stat__lbl">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="abt3-feats">
          {features.slice(0, 4).map((f, i) => (
            <div key={i} className="abt3-feat">
              <div className="abt3-feat__icon">{f.icon}</div>
              <div className="abt3-feat__text">
                <h4>{f.title}</h4>
                <p>{f.description}</p>
              </div>
            </div>
          ))}
        </div>
        {highlight_text && (
          <div className="abt3-quote">
            <div className="abt3-quote__bar" />
            <div className="abt3-quote__body">
              <p>{highlight_text}</p>
              <span>— Rand Jarar</span>
            </div>
          </div>
        )}
        <button className="abt3-cta" onClick={() => navigate('/auth')}>
          {isArabic ? 'ابدأ رحلتك الآن →' : 'Start your journey →'}
        </button>
      </div>
    </section>
  );
};

export default AboutDesign3;
