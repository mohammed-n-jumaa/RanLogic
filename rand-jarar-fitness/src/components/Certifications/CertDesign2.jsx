import React from 'react';
import './CertDesign2.scss';

const CertDesign2 = ({ certifications, isArabic }) => {
  const items = [...certifications, ...certifications].map((c, i) => ({ ...c, uid: `${c.id}-${i}` }));

  return (
    <section className="cert2" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="cert2-track">
        {items.map((c) => (
          <div key={c.uid} className="cert2-item">
            <div className="cert2-dot" />
            <div className="cert2-text">
              <h4>{c.title}</h4>
              <span>{c.organization}</span>
            </div>
            {c.is_verified && <div className="cert2-check">✓</div>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CertDesign2;
