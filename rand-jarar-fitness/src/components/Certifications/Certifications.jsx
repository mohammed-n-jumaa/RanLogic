import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import certificationApi, { getDefaultCertifications } from '../../api/certificationApi';
import CertDesign2 from './CertDesign2';
import CertDesign3 from './CertDesign3';
import CertDesign4 from './CertDesign4';
import './Certifications.scss';
import { Loader2 } from 'lucide-react';

const getIconSVG = (icon) => {
  const c = 'var(--site-secondary)';
  switch (icon) {
    case '🎖️': case '⭐':
      return (<svg viewBox="0 0 18 18" fill="none"><path d="M9 2l1.8 3.6L15 6.3l-3 2.9.7 4.1L9 11.4l-3.7 1.9.7-4.1L3 6.3l4.2-.7L9 2z" stroke={c} strokeWidth="1.4" strokeLinejoin="round"/></svg>);
    case '🏆':
      return (<svg viewBox="0 0 18 18" fill="none"><path d="M5 3h8v6a4 4 0 01-8 0V3z" stroke={c} strokeWidth="1.4" strokeLinejoin="round"/><path d="M5 6H3a2 2 0 002 2M13 6h2a2 2 0 01-2 2" stroke={c} strokeWidth="1.4" strokeLinecap="round"/><path d="M9 13v2M6 15h6" stroke={c} strokeWidth="1.4" strokeLinecap="round"/></svg>);
    case '🍎':
      return (<svg viewBox="0 0 18 18" fill="none"><path d="M9 5c-3 0-5 2.5-5 5.5C4 14 6 16 9 16s5-2 5-5.5C14 7.5 12 5 9 5z" stroke={c} strokeWidth="1.4" strokeLinejoin="round"/><path d="M9 5V3M9 3c0 0 1-2 3-1" stroke={c} strokeWidth="1.4" strokeLinecap="round"/></svg>);
    case '💪':
      return (<svg viewBox="0 0 18 18" fill="none"><path d="M6 13c0 1.1.9 2 2 2h2a2 2 0 002-2v-1l2-4-2-1-1 2V5a1 1 0 00-2 0v3H8V5a1 1 0 00-2 0v8z" stroke={c} strokeWidth="1.4" strokeLinejoin="round"/></svg>);
    case '⚡':
      return (<svg viewBox="0 0 18 18" fill="none"><path d="M11 2L5 10h5l-3 6 8-9h-5l1-5z" stroke={c} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round"/></svg>);
    case '🥗':
      return (<svg viewBox="0 0 18 18" fill="none"><path d="M3 7h12l-1.5 6H4.5L3 7z" stroke={c} strokeWidth="1.4" strokeLinejoin="round"/><path d="M6 7c0-2 1-3 3-3s3 1 3 3" stroke={c} strokeWidth="1.4" strokeLinecap="round"/></svg>);
    case '💉':
      return (<svg viewBox="0 0 18 18" fill="none"><path d="M13 3l2 2-8 8-3 1 1-3 8-8z" stroke={c} strokeWidth="1.4" strokeLinejoin="round"/><path d="M11 5l2 2" stroke={c} strokeWidth="1.4" strokeLinecap="round"/></svg>);
    case '📱':
      return (<svg viewBox="0 0 18 18" fill="none"><rect x="4" y="2" width="10" height="14" rx="2" stroke={c} strokeWidth="1.4"/><circle cx="9" cy="13.5" r="0.8" fill={c}/></svg>);
    default:
      return (<svg viewBox="0 0 18 18" fill="none"><path d="M9 2l1.8 3.6L15 6.3l-3 2.9.7 4.1L9 11.4l-3.7 1.9.7-4.1L3 6.3l4.2-.7L9 2z" stroke={c} strokeWidth="1.4" strokeLinejoin="round"/></svg>);
  }
};

const CheckIcon = () => (
  <svg viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5l2 2 4-4" stroke="var(--site-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

const Certifications = () => {
  const { currentLang, isArabic } = useLanguage();
  const [certifications, setCertifications] = useState(() => getDefaultCertifications(currentLang).data || []);
  const [designType, setDesignType] = useState('classic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { fetchCertifications(); }, [currentLang]);

  const fetchCertifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await certificationApi.getCertifications(currentLang);
      if (response.success && response.data) {
        setCertifications([...response.data].sort((a, b) => a.order - b.order));
        if (response.design_type) setDesignType(response.design_type);
      } else {
        setError('failed');
      }
    } catch (err) {
      console.error('Certifications error:', err);
      setError('failed');
    } finally {
      setLoading(false);
    }
  };

  const infiniteItems = certifications.length > 0
    ? [...certifications, ...certifications].map((cert, index) => ({
        ...cert,
        uniqueKey: `cert-${cert.id}-${index}`,
      }))
    : [];

  if (loading) {
    return (
      <section className="certifications" aria-label="Certified Credentials">
        <div className="certifications-loading">
          <Loader2 className="spinner" />
          <p>{isArabic ? 'جاري تحميل الشهادات...' : 'Loading certifications...'}</p>
        </div>
      </section>
    );
  }

  if (error || certifications.length === 0) return null;

  if (designType === 'dots') return <CertDesign2 certifications={certifications} isArabic={isArabic} />;
  if (designType === 'medals') return <CertDesign3 certifications={certifications} isArabic={isArabic} />;
  if (designType === 'shields') return <CertDesign4 certifications={certifications} isArabic={isArabic} />;

  // Classic (default)
  return (
    <section className="certifications" aria-label="Certified Credentials" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="certifications-slider">
        <div className={`slider-track${isArabic ? ' slider-track--rtl' : ''}`} role="marquee" aria-live="polite">
          {infiniteItems.map((cert) => (
            <div key={cert.uniqueKey} className="cert-card" role="button" tabIndex={0}
              aria-label={`${isArabic ? 'معتمد من' : 'Certified by'} ${cert.organization} - ${cert.title}`}>
              <div className="cert-icon">{getIconSVG(cert.icon)}</div>
              <div className="cert-info">
                <p className="cert-label">{isArabic ? 'معتمد من' : 'Trusted by'}</p>
                <h4 title={cert.organization}>{cert.organization}</h4>
                <p className="cert-title" title={cert.title}>{cert.title}</p>
              </div>
              <div className="cert-check" aria-hidden="true"><CheckIcon /></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
