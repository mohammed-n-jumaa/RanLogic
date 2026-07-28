import React, { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';
import certificationApi from '../../api/certificationApi';
import './Certifications.scss';

// ── أيقونات SVG ───────────────────────────────────────────────────────────────
const getIconSVG = (icon) => {
  const c = '#1C1C1C';
  switch (icon) {

    case '🎖️':
    case '⭐':
      return (
        <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 2l1.8 3.6L15 6.3l-3 2.9.7 4.1L9 11.4l-3.7 1.9.7-4.1L3 6.3l4.2-.7L9 2z"
            stroke={c} strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      );

    case '🏆':
      return (
        <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 3h8v6a4 4 0 01-8 0V3z" stroke={c} strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M5 6H3a2 2 0 002 2M13 6h2a2 2 0 01-2 2" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M9 13v2M6 15h6" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );

    case '🥇':
      return (
        <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="9" cy="10" r="5" stroke={c} strokeWidth="1.4" />
          <path d="M9 8v4M8 8h2" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M6 5L4 3M12 5l2-3" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );

    case '🎓':
      return (
        <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 4L2 8l7 4 7-4-7-4z" stroke={c} strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M5 10v4c1.2 1 2.2 1.3 4 1.3S13 15 14 14v-4" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 8v4" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );

    case '🧘':
      return (
        <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="9" cy="4" r="2" stroke={c} strokeWidth="1.4" />
          <path d="M6 9c0-1.66 1.34-3 3-3s3 1.34 3 3l-3 6-3-6z" stroke={c} strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      );

    case '💪':
      return (
        <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 13c0 1.1.9 2 2 2h2a2 2 0 002-2v-1l2-4-2-1-1 2V5a1 1 0 00-2 0v3H8V5a1 1 0 00-2 0v8z"
            stroke={c} strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      );

    case '🏋️':
      return (
        <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="8" width="3" height="2" rx="1" fill={c} />
          <rect x="14" y="8" width="3" height="2" rx="1" fill={c} />
          <rect x="4" y="6" width="2" height="6" rx="1" fill={c} />
          <rect x="12" y="6" width="2" height="6" rx="1" fill={c} />
          <rect x="6" y="8" width="6" height="2" rx="1" fill={c} />
        </svg>
      );

    case '🚴':
      return (
        <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="4.5" cy="12" r="2.5" stroke={c} strokeWidth="1.4" />
          <circle cx="13.5" cy="12" r="2.5" stroke={c} strokeWidth="1.4" />
          <path d="M4.5 12L9 6l4.5 6" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9" cy="4" r="1.2" fill={c} />
        </svg>
      );

    case '🏃':
      return (
        <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="4" r="1.5" fill={c} />
          <path d="M9 7l-2 4 2 3M9 7l3 2 2-1M7 11l-2 3" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case '🥊':
      return (
        <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="6" width="8" height="7" rx="3" stroke={c} strokeWidth="1.4" />
          <path d="M8 6V4a2 2 0 014 0v2" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M4 10h10" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );

    case '🏊':
      return (
        <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 11c2-2 4 0 6 0s4-2 6 0" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M2 14c2-2 4 0 6 0s4-2 6 0" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="12" cy="5" r="1.5" fill={c} />
          <path d="M12 7l-4 2" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );

    case '🍎':
      return (
        <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 5c-3 0-5 2.5-5 5.5C4 14 6 16 9 16s5-2 5-5.5C14 7.5 12 5 9 5z"
            stroke={c} strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M9 5V3M9 3c0 0 1-2 3-1" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );

    case '⚡':
      return (
        <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 2L5 10h5l-3 6 8-9h-5l1-5z"
            stroke={c} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      );

    case '🥗':
      return (
        <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 7h12l-1.5 6H4.5L3 7z" stroke={c} strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M6 7c0-2 1-3 3-3s3 1 3 3" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M7 10l1 2M11 10l-1 2" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );

    case '💉':
      return (
        <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 3l2 2-8 8-3 1 1-3 8-8z" stroke={c} strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M11 5l2 2" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M3 15l2-2" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );

    case '📱':
      return (
        <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="2" width="10" height="14" rx="2" stroke={c} strokeWidth="1.4" />
          <circle cx="9" cy="13.5" r="0.8" fill={c} />
          <path d="M7 5h4" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );

    case '🎯':
      return (
        <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="9" cy="9" r="7" stroke={c} strokeWidth="1.4" />
          <circle cx="9" cy="9" r="4" stroke={c} strokeWidth="1.2" />
          <circle cx="9" cy="9" r="1.5" fill={c} />
        </svg>
      );

    case '🔬':
      return (
        <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 2v8l-4 5h12l-4-5V2" stroke={c} strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M6 2h6" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M7 7h4" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );

    case '🧠':
      return (
        <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 4c-3.5 0-5 2-5 4.5 0 3 2 5.5 5 5.5s5-2.5 5-5.5C14 6 12.5 4 9 4z"
            stroke={c} strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M9 4V3M6 7c0-1.5 1-2.5 2-2.5M12 8c0 1-1 2-2 2"
            stroke={c} strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );

    case '🌿':
      return (
        <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 15V8c0-4 4-6 6-6-2 4-4 6-6 6" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 15c0-4-3-7-6-7 1 3 3 5 6 7" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case '❤️':
      return (
        <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 14s-6-4-6-8a4 4 0 018 0 4 4 0 018 0c0 4-6 8-6 8h-4z"
            stroke={c} strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      );

    case '🔥':
      return (
        <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 2c0 3-3 4-3 7a3 3 0 006 0c0-1-.5-2-1-3 0 2-2 2-2 0V2z"
            stroke={c} strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      );

    case '📊':
      return (
        <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="10" width="3" height="6" rx="1" fill={c} />
          <rect x="7" y="7"  width="3" height="9" rx="1" fill={c} />
          <rect x="12" y="4" width="3" height="12" rx="1" fill={c} />
        </svg>
      );

    case '🏅':
      return (
        <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="9" cy="11" r="5" stroke={c} strokeWidth="1.4" />
          <path d="M6 3l3 4 3-4" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 10l.8.8 2-2" stroke={c} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case '🌍':
      return (
        <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="9" cy="9" r="7" stroke={c} strokeWidth="1.4" />
          <path d="M2 9h14M9 2c-2 2-3 4-3 7s1 5 3 7M9 2c2 2 3 4 3 7s-1 5-3 7"
            stroke={c} strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 2l1.8 3.6L15 6.3l-3 2.9.7 4.1L9 11.4l-3.7 1.9.7-4.1L3 6.3l4.2-.7L9 2z"
            stroke={c} strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      );
  }
};

// ── CheckIcon ─────────────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.5 4.5l2 2 4-4" stroke="#FDB813" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── Certifications ────────────────────────────────────────────────────────────
const Certifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);
  const { currentLang, isArabic }           = useLanguage();

  useEffect(() => { fetchCertifications(); }, [currentLang]);

  const fetchCertifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await certificationApi.getCertifications(currentLang);
      if (response.success && response.data) {
        setCertifications([...response.data].sort((a, b) => a.order - b.order));
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
          <FaSpinner className="spinner" />
          <p>{isArabic ? 'جاري تحميل الشهادات...' : 'Loading certifications...'}</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="certifications" aria-label="Certified Credentials">
        <div className="certifications-error">
          <p>{isArabic ? 'عذراً، حدث خطأ في تحميل الشهادات' : 'Sorry, error loading certifications'}</p>
          <button className="retry-btn" onClick={fetchCertifications}>
            {isArabic ? 'إعادة المحاولة' : 'Try Again'}
          </button>
        </div>
      </section>
    );
  }

  if (certifications.length === 0) {
    return (
      <section className="certifications" aria-label="Certified Credentials">
        <div className="no-certifications">
          <p>{isArabic ? 'لا توجد شهادات متاحة حالياً' : 'No certifications available at the moment'}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="certifications"
      aria-label="Certified Credentials"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="certifications-slider">
        <div
          className={`slider-track${isArabic ? ' slider-track--rtl' : ''}`}
          role="marquee"
          aria-live="polite"
        >
          {infiniteItems.map((cert) => (
            <div
              key={cert.uniqueKey}
              className="cert-card"
              role="button"
              tabIndex={0}
              aria-label={`${isArabic ? 'معتمد من' : 'Certified by'} ${cert.organization} - ${cert.title}`}
            >
              <div className="cert-icon">
                {getIconSVG(cert.icon)}
              </div>
              <div className="cert-info">
                <p className="cert-label">
                  {isArabic ? 'معتمد من' : 'Trusted by'}
                </p>
                <h4 title={cert.organization}>{cert.organization}</h4>
                <p className="cert-title" title={cert.title}>{cert.title}</p>
              </div>
              <div className="cert-check" aria-hidden="true">
                <CheckIcon />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;