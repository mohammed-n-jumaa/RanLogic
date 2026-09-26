import React from 'react';
import './CertDesign3.scss';

const CertDesign3 = ({ certifications, isArabic }) => {
  const items = [...certifications, ...certifications].map((c, i) => ({ ...c, uid: `${c.id}-${i}` }));
  const getIcon = (icon) => {
    const m = { '🏆': '🏆', '🍎': '🍎', '⚡': '⚡', '🥗': '🥗', '💉': '💉', '💪': '💪', '📱': '📱', '🎖️': '🎖️' };
    return m[icon] || '⭐';
  };

  return (
    <section className="cert3" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="cert3-track">
        {items.map((c) => (
          <div key={c.uid} className="cert3-item">
            <div className="cert3-medal"><span>{getIcon(c.icon)}</span></div>
            <h4>{c.title}</h4>
            <span className="cert3-org">{c.organization}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CertDesign3;
