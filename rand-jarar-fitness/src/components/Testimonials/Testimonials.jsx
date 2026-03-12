import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuoteRight, FaStar, FaChevronLeft, FaChevronRight, FaSpinner } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';
import testimonialApi from '../../api/testimonialApi';
import './Testimonials.scss';

const Testimonials = () => {
  const [testimonialData, setTestimonialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const { currentLang, isArabic } = useLanguage();

  useEffect(() => {
    fetchTestimonials();
  }, [currentLang]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await testimonialApi.getTestimonials(currentLang);
      
      if (response.success && response.data) {
        setTestimonialData(response.data);
        setCurrentIndex(0);
      } else {
        setError('Failed to load testimonials');
      }
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError('Error loading testimonials');
    } finally {
      setLoading(false);
    }
  };

  const getCardsToShow = () => {
    if (windowWidth <= 768) return 1;
    if (windowWidth <= 1024) return 2;
    return 3;
  };

  const cardsToShow = getCardsToShow();

  const handleNext = () => {
    if (!testimonialData?.testimonials) return;
    
    setDirection(1);
    setCurrentIndex((prev) => 
      prev + cardsToShow >= testimonialData.testimonials.length ? 0 : prev + 1
    );
  };

  const handlePrev = () => {
    if (!testimonialData?.testimonials) return;
    
    setDirection(-1);
    setCurrentIndex((prev) => 
      prev === 0 ? testimonialData.testimonials.length - cardsToShow : prev - 1
    );
  };

  const getVisibleTestimonials = () => {
    if (!testimonialData?.testimonials) return [];
    
    const visible = [];
    for (let i = 0; i < cardsToShow; i++) {
      const index = (currentIndex + i) % testimonialData.testimonials.length;
      visible.push({
        ...testimonialData.testimonials[index],
        uniqueKey: `${testimonialData.testimonials[index].id}-${i}`
      });
    }
    return visible;
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  // معالجة خطأ الصورة
  const handleImageError = (e) => {
    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(e.target.alt || 'Client')}&background=random&color=fff&size=200`;
  };

  // عرض حالة التحميل
  if (loading) {
    return (
      <section className="testimonials" id="testimonials">
        <div className="testimonials-container">
          <div className="testimonials-loading">
            <FaSpinner className="spinner" />
            <p>{isArabic ? 'جاري تحميل الآراء...' : 'Loading testimonials...'}</p>
          </div>
        </div>
      </section>
    );
  }

  // عرض حالة الخطأ
  if (error || !testimonialData) {
    return (
      <section className="testimonials" id="testimonials">
        <div className="testimonials-container">
          <div className="testimonials-error">
            <p>{isArabic ? 'عذراً، حدث خطأ في تحميل الآراء' : 'Sorry, error loading testimonials'}</p>
            <button 
              className="retry-btn"
              onClick={fetchTestimonials}
            >
              {isArabic ? 'إعادة المحاولة' : 'Try Again'}
            </button>
          </div>
        </div>
      </section>
    );
  }

  const { section, testimonials = [] } = testimonialData;

  // إذا لم توجد آراء
  if (testimonials.length === 0) {
    return (
      <section className="testimonials" id="testimonials">
        <div className="testimonials-container">
          <div className="no-testimonials">
            <p>{isArabic ? 'لا توجد آراء متاحة حالياً' : 'No testimonials available at the moment'}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="testimonials" id="testimonials">
      <div className="testimonials-container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          key={currentLang}
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          <span className="section-tag">{section?.badge || ''}</span>
          <h2 className="section-title">{section?.title || ''}</h2>
          <p className="section-description">{section?.description || ''}</p>
        </motion.div>

        <div className="testimonials-slider">
          <button 
            className="slider-btn slider-btn-prev" 
            onClick={handlePrev}
            aria-label={isArabic ? 'الآراء السابقة' : 'Previous testimonials'}
            disabled={testimonials.length <= cardsToShow}
          >
            <FaChevronLeft />
          </button>

          <div className="testimonials-track">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={`slide-${Math.floor(currentIndex / cardsToShow)}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="testimonials-grid"
              >
                {getVisibleTestimonials().map((testimonial) => (
                  <motion.div
                    key={testimonial.uniqueKey}
                    className="testimonial-card"
                    whileHover={{ y: -10 }}
                    transition={{ duration: 0.3 }}
                    dir={isArabic ? 'rtl' : 'ltr'}
                  >
                    <div className="quote-icon">
                      <FaQuoteRight />
                    </div>

                    <div className="card-header">
                      <img 
                        src={testimonial.image_url} 
                        alt={testimonial.name}
                        className="testimonial-image"
                        onError={handleImageError}
                        loading="lazy"
                      />
                      <div className="testimonial-info">
                        <h4 className="testimonial-name">{testimonial.name}</h4>
                        <p className="testimonial-profession">{testimonial.title}</p>
                      </div>
                    </div>

                    <div className="rating">
                      {[...Array(testimonial.rating || 5)].map((_, starIndex) => (
                        <FaStar key={`star-${testimonial.id}-${starIndex}`} className="star" />
                      ))}
                    </div>

                    <p className="testimonial-feedback">
                      {testimonial.text}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <button 
            className="slider-btn slider-btn-next" 
            onClick={handleNext}
            aria-label={isArabic ? 'الآراء التالية' : 'Next testimonials'}
            disabled={testimonials.length <= cardsToShow}
          >
            <FaChevronRight />
          </button>
        </div>

        {/* Pagination Dots */}
        {testimonials.length > cardsToShow && (
          <div className="pagination-dots">
            {Array.from({ length: Math.ceil(testimonials.length / cardsToShow) }).map((_, index) => (
              <button
                key={`dot-${index}`}
                className={`dot ${Math.floor(currentIndex / cardsToShow) === index ? 'active' : ''}`}
                onClick={() => {
                  setDirection(index > Math.floor(currentIndex / cardsToShow) ? 1 : -1);
                  setCurrentIndex(index * cardsToShow);
                }}
                aria-label={isArabic ? 
                  `الانتقال إلى المجموعة ${index + 1}` : 
                  `Go to testimonial group ${index + 1}`
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Decorative Background */}
      <div className="testimonials-bg">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
      </div>
    </section>
  );
};

export default Testimonials;