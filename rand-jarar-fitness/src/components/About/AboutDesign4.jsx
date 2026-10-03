import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import DOMPurify from 'dompurify';
import './AboutDesign4.scss';

const AboutDesign4 = ({ aboutData }) => {
  const { isArabic } = useLanguage();
  const navigate = useNavigate();
  const { badge, title, main_description, highlight_text, image_url, features = [] } = aboutData;
  const isTransparent = aboutData.bg_style === 'transparent';

  const STATS = [
    { value: '200+', label: isArabic ? 'متدرب' : 'Trainees' },
    { value: '+4',   label: isArabic ? 'سنوات' : 'Years' },
    { value: '98%',  label: isArabic ? 'نجاح' : 'Success' },
  ];
  const leftFeats = features.slice(0, 2);
  const rightFeats = features.slice(2, 4);

  return (
    <section className={`abt4 ${isTransparent ? 'abt4--light' : ''}`} id="about">
      <div className="abt4-glow" />
      <div className="abt4-wrap">
        <div className="abt4-col abt4-col--left">
          <div className="abt4-card abt4-card--info">
            <div className="abt4-badge"><span className="abt4-badge__dot" />{badge}</div>
            <h2 className="abt4-title" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(title) }} />
            <div className="abt4-desc" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(main_description) }} />
          </div>
          {leftFeats.map((f, i) => (
            <div key={i} className="abt4-feat">
              <div className="abt4-feat__icon">{f.icon}</div>
              <div><h4>{f.title}</h4><span>{f.description}</span></div>
            </div>
          ))}
        </div>
        <div className="abt4-col abt4-col--center">
          <div className="abt4-photo">
            <div className="abt4-cert">✓ {isArabic ? 'معتمدة' : 'Certified'}</div>
            <img src={image_url || '/coach.webp'} alt="Coach" onError={e => e.target.src = '/coach.webp'} />
          </div>
          <div className="abt4-name"><h3>Rand Jarar</h3><span>{isArabic ? 'مدربة رئيسية' : 'Head Coach'}</span></div>
          <div className="abt4-float-stats">
            {STATS.map((s, i) => (
              <div key={i} className="abt4-fs">
                <span className="abt4-fs__v">{s.value}</span>
                <span className="abt4-fs__l">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="abt4-col abt4-col--right">
          {rightFeats.map((f, i) => (
            <div key={i} className="abt4-feat">
              <div className="abt4-feat__icon">{f.icon}</div>
              <div><h4>{f.title}</h4><span>{f.description}</span></div>
            </div>
          ))}
          {highlight_text && (
            <div className="abt4-quote">
              <div className="abt4-quote__bar" />
              <div className="abt4-quote__body">
                <p>{highlight_text}</p>
                <span>— Rand Jarar</span>
              </div>
            </div>
          )}
          <button className="abt4-cta" onClick={() => navigate('/auth')}>
            {isArabic ? 'ابدأ رحلتك الآن →' : 'Start your journey →'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutDesign4;
