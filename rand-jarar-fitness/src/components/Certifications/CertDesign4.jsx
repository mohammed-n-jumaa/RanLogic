import React from 'react';
import './CertDesign4.scss';

const CertDesign4 = ({ certifications, isArabic }) => {
  const items = [...certifications, ...certifications].map((c, i) => ({ ...c, uid: `${c.id}-${i}` }));

  const getMedalIcon = (icon) => {
    const icons = { '🏆': '🏆', '🍎': '🍎', '⚡': '⚡', '🥗': '🥗', '💉': '💉', '💪': '💪', '📱': '📱', '🎖️': '🎖️' };
    return icons[icon] || '⭐';
  };

  return (
    <section className="cert4" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="cert4-track">
        {items.map((c) => (
          <div key={c.uid} className="cert4-item">
            <div className="cert4-shield">
              <svg viewBox="0 0 30 34" fill="none" className="cert4-shield__svg">
                <path d="M15 2L3 7v8c0 8 5 13 12 15 7-2 12-7 12-15V7L15 2z"
                  fill="rgba(253,184,19,0.08)" stroke="rgba(253,184,19,0.3)" strokeWidth="1"/>
              </svg>
              <span className="cert4-shield__icon">{getMedalIcon(c.icon)}</span>
            </div>
            <div className="cert4-text">
              <h4>{c.title}</h4>
              <span>{c.organization}</span>
            </div>
            <div className="cert4-tag">
              {isArabic ? 'معتمد' : 'verified'}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CertDesign4;
