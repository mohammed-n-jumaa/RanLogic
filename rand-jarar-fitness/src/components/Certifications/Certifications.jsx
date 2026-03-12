import React, { useEffect, useState, useRef } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';
import certificationApi from '../../api/certificationApi';
import './Certifications.scss';

const getIconComponent = (icon) => {
  switch(icon) {
    case '🎖️': return '🎖️';
    case '🏆': return '🏆';
    case '🥇': return '🥇';
    case '⭐': return '⭐';
    case '🎓': return '🎓';
    case '🧘': return '🧘';
    case '💪': return '💪';
    case '🏋️': return '🏋️';
    case '🚴': return '🚴';
    case '🏃': return '🏃';
    case '🥊': return '🥊';
    case '🏊': return '🏊';
    default: return '🏆';
  }
};

const Certifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sliderRef = useRef(null);
  const { currentLang, isArabic } = useLanguage();

  useEffect(() => {
    fetchCertifications();
  }, [currentLang]);

  const fetchCertifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await certificationApi.getCertifications(currentLang);
      
      if (response.success && response.data) {

        const sortedCerts = [...response.data].sort((a, b) => a.order - b.order);
        setCertifications(sortedCerts);
      } else {
        setError('Failed to load certifications');
      }
    } catch (err) {
      console.error('Error fetching certifications:', err);
      setError('Error loading certifications');
    } finally {
      setLoading(false);
    }
  };

  const createInfiniteItems = () => {
    if (certifications.length === 0) return [];
    
    let infiniteItems = [];
    
    const numberOfCopies = 8; 
    
    for (let copyIndex = 0; copyIndex < numberOfCopies; copyIndex++) {
      certifications.forEach((cert, certIndex) => {
        infiniteItems.push({
          ...cert,
          uniqueKey: `cert-${cert.id}-${copyIndex}-${certIndex}`,
          copyIndex: copyIndex
        });
      });
    }
    
    return infiniteItems;
  };

  const infiniteItems = createInfiniteItems();

  const handleCardClick = (cert) => {
    console.log(`Clicked on certification: ${cert.organization} - ${cert.title}`);
  };

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
          <button 
            className="retry-btn"
            onClick={fetchCertifications}
          >
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
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="certifications-slider" ref={sliderRef}>
        <div 
          className="slider-track" 
          role="marquee"
          aria-live="polite"
          style={{
            animation: `scroll-left ${isArabic ? '90s' : '90s'} linear infinite`
          }}
        >
          {infiniteItems.map((cert) => (
            <div 
              key={cert.uniqueKey}
              className="cert-card"
              onClick={() => handleCardClick(cert)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleCardClick(cert);
                  e.preventDefault();
                }
              }}
              aria-label={`${isArabic ? 'معتمد من' : 'Certified by'} ${cert.organization} - ${cert.title}`}
            >
              <div 
                className="cert-icon"
                style={{
                  background: `linear-gradient(135deg, #FDB813, #F9A825)`
                }}
              >
                <span className="icon-symbol">{getIconComponent(cert.icon)}</span>
              </div>
              <div className="cert-info">
                <p className="cert-label">
                  {isArabic ? 'معتمد من' : 'Trusted by'}
                </p>
                <h4 title={cert.organization}>
                  {cert.organization}
                </h4>
                <p className="cert-title" title={cert.title}>
                  {cert.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;