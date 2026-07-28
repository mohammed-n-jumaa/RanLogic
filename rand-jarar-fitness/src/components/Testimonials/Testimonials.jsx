import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuoteRight, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';
import testimonialApi from '../../api/testimonialApi';
import './Testimonials.scss';

const DEFAULT_AVATAR = 'https://i.postimg.cc/WpqHf2CH/download.png';

// ─── Static fallback (مطابق للصور) ──────────────────────────────────────────
const getStaticTestimonials = (isArabic) => ({
  section: {
    badge:       isArabic ? 'آراء العملاء'                                              : 'Client Reviews',
    title:       isArabic ? 'قصص نجاح ملهمة'                                           : 'Inspiring Success Stories',
    description: isArabic ? 'استمع إلى تجارب عملائنا وكيف غيروا حياتهم للأفضل'         : "Listen to our clients' experiences and how they changed their lives for the better",
  },
  testimonials: [
    {
      id: 1,
      name:      isArabic ? 'محمد جمعة'   : 'Mohammed Juma',
      title:     isArabic ? 'طالب جامعي'  : 'Student',
      rating:    5,
      image_url: DEFAULT_AVATAR,
      text: isArabic
        ? 'بصراحة تجربتي كانت ممتازة جداً. من أول ما اشتركت حسّيت بالاهتمام والمتابعة الحقيقية. الخطة كانت واضحة ومناسبة لهدفي، والنتائج بدأت تظهر بشكل ملحوظ خلال فترة قصيرة. أنصح أي شخص حاب يطور من نفسه ويشوف نتائج فعلية إنه يجرب بدون تردد.'
        : 'Honestly, my experience was excellent from start to finish. From the moment I subscribed, I felt real support and genuine follow-up. The plan was clear and perfectly tailored to my goals, and I started seeing noticeable results in a short time. I highly recommend it to anyone who wants real progress and meaningful results.',
    },
    {
      id: 2,
      name:      isArabic ? 'ليلى حميد' : 'Layla Hameed',
      title:     isArabic ? 'ام لطفلين' : 'Mom of two',
      rating:    5,
      image_url: DEFAULT_AVATAR,
      text: isArabic
        ? 'بعد الولادة الثانية، حسيت إني ما رح أرجع لوزني الطبيعي أبداً. راند صممتلي خطة تناسب وقتي المحدود كأم، وبـ 4 شهور رجعت أحسن من قبل! المتابعة المستمرة والدعم النفسي كانوا أهم شي. أنصح كل أم بتعاني بعد الحمل تجرب RanLogic.'
        : "After my second pregnancy, I felt like I'd never get back to my normal weight. Rand designed a plan that fits my limited time as a mom, and in 4 months I came back better than before! The continuous follow-up and emotional support were the most important thing. I recommend every mom struggling after pregnancy to try RanLogic.",
    },
    {
      id: 3,
      name:      isArabic ? 'ليان ناصر'    : 'Layan Nasser',
      title:     isArabic ? 'موظفة ادارية' : 'Admin Staff',
      rating:    5,
      image_url: DEFAULT_AVATAR,
      text: isArabic
        ? 'بصراحة، الكوتش غيرت حياتي كلياً. كنت دايماً أبدأ دايت وأوقف بعد أسبوعين، بس مع المتابعة المستمرة والخطة المخصصة إلي، قدرت أخسر 12 كيلو بـ 3 شهور. الشي الأهم إني تعلمت أعيش حياة صحية مش بس دايت مؤقت. النتائج باقية معي لليوم والطاقة يلي صرت فيها ما بتنوصف!'
        : 'Honestly, the coach completely changed my life. I used to always start a diet and stop after two weeks, but with the continuous follow-up and personalized plan, I was able to lose 12 kg in 3 months. The most important thing is that I learned to live a healthy life, not just a temporary diet. The results are still with me today and the energy I have now is indescribable!',
    },
    {
      id: 4,
      name:      isArabic ? 'خالد'           : 'Khaled',
      title:     isArabic ? 'موظف مبيعات'    : 'Sales Employee',
      rating:    5,
      image_url: DEFAULT_AVATAR,
      text: isArabic
        ? 'كنت دايماً أقول "ما عندي وقت للرياضة"، لكن راند أثبتتلي إنه الموضوع مش بالوقت، بالتنظيم والإرادة. تمارين 30 دقيقة بس 4 مرات بالأسبوع، ونظام أكل بسيط وواقعي. النتيجة؟ خسرت 10 كيلو، زادت طاقتي، وصرت أنجز بشغلي ضعف!'
        : 'I always used to say "I don\'t have time for exercise," but Rand proved to me that it\'s not about time, it\'s about organization and willpower. Just 30-minute workouts 4 times a week, and a simple and realistic eating plan. The result? I lost 10 kg, my energy increased, and I\'m now accomplishing twice as much at work!',
    },
  ],
});

// ─── Component ────────────────────────────────────────────────────────────────
const Testimonials = ({ onDataStatus }) => {
  const [testimonialData, setTestimonialData] = useState(() => getStaticTestimonials(true));
  const [currentIndex,    setCurrentIndex]    = useState(0);
  const [direction,       setDirection]       = useState(0);
  const [windowWidth,     setWindowWidth]     = useState(0);
  const { currentLang, isArabic } = useLanguage();

  // ── Responsive ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getCardsToShow = useCallback(() => {
    if (windowWidth <= 768)  return 1;
    if (windowWidth <= 1024) return 2;
    return 3;
  }, [windowWidth]);

  const cardsToShow = getCardsToShow();

  // ── جلب الـ API + تحديث اللغة ────────────────────────────────────────────────
  useEffect(() => {
    // حدّث الـ static للغة الحالية فوراً
    setTestimonialData(prev => prev._fromApi ? prev : getStaticTestimonials(isArabic));
    setCurrentIndex(0);

    let cancelled = false;
    testimonialApi.getTestimonials(currentLang).then(res => {
      if (!cancelled && res?.success && res?.data) {
        const list = Array.isArray(res.data?.testimonials) ? res.data.testimonials : [];
        setTestimonialData({ ...res.data, _fromApi: true });
        setCurrentIndex(0);
        onDataStatus?.(list.length > 0);
      }
    });
    return () => { cancelled = true; };
  }, [currentLang]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Navigation ───────────────────────────────────────────────────────────────
  const testimonials = Array.isArray(testimonialData?.testimonials) ? testimonialData.testimonials : [];

  const handleNext = () => {
    if (!testimonials.length) return;
    setDirection(1);
    setCurrentIndex(prev => prev + cardsToShow >= testimonials.length ? 0 : prev + 1);
  };

  const handlePrev = () => {
    if (!testimonials.length) return;
    setDirection(-1);
    setCurrentIndex(prev => prev === 0 ? Math.max(testimonials.length - cardsToShow, 0) : prev - 1);
  };

  const getVisibleTestimonials = () => {
    if (!testimonials.length) return [];
    const visible = [];
    for (let i = 0; i < cardsToShow; i++) {
      const index = (currentIndex + i) % testimonials.length;
      visible.push({ ...testimonials[index], uniqueKey: `${testimonials[index].id}-${i}` });
    }
    return visible;
  };

  const slideVariants = {
    enter:  (dir) => ({ x: dir > 0 ?  1000 : -1000, opacity: 0 }),
    center:           ({ x: 0, opacity: 1 }),
    exit:   (dir) => ({ x: dir < 0 ?  1000 : -1000, opacity: 0 }),
  };

  const handleImageError = (e) => {
    e.target.src = DEFAULT_AVATAR;
  };

  if (!testimonials.length) return null;

  const { section } = testimonialData;
  const totalGroups = Math.ceil(testimonials.length / cardsToShow);
  const activeGroup = Math.floor(currentIndex / cardsToShow);

  return (
    <section className="testimonials" id="testimonials">

      {/* Decorative Background */}
      <div className="testimonials-bg">
        <div className="bg-shape shape-1" />
        <div className="bg-shape shape-2" />
      </div>

      <div className="testimonials-container">

        {/* ── Section Header ── */}
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

        {/* ── Stats Row ── */}
        <motion.div
          className="stats-row"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="testimonials-stat-item">
            <span className="testimonials-stat-number">98%</span>
            <span className="testimonials-stat-label">{isArabic ? 'رضا العملاء' : 'Satisfaction'}</span>
          </div>
          <div className="testimonials-stat-divider" />
          <div className="testimonials-stat-item">
            <span className="testimonials-stat-number">96%</span>
            <span className="testimonials-stat-label">{isArabic ? 'يوصون بنا' : 'Would recommend'}</span>
          </div>
          <div className="testimonials-stat-divider" />
          <div className="testimonials-stat-item">
            <span className="testimonials-stat-number">4.9</span>
            <span className="testimonials-stat-label">{isArabic ? 'متوسط التقييم' : 'Avg rating'}</span>
          </div>
        </motion.div>

        {/* ── Slider ── */}
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
                key={`slide-${activeGroup}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x:       { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="testimonials-grid"
              >
                {getVisibleTestimonials().map((testimonial, idx) => (
                  <motion.div
                    key={testimonial.uniqueKey}
                    className={`testimonial-card${idx === 0 ? ' testimonial-card--featured' : ''}`}
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                    dir={isArabic ? 'rtl' : 'ltr'}
                  >
                    <div className="quote-icon">
                      <FaQuoteRight />
                    </div>

                    <div className="rating">
                      {[...Array(testimonial.rating || 5)].map((_, starIndex) => (
                        <FaStar key={`star-${testimonial.id}-${starIndex}`} className="star" />
                      ))}
                    </div>

                    <p className="testimonial-feedback">{testimonial.text}</p>

                    <div className="card-footer">
                      <img
                        src={testimonial.image_url || DEFAULT_AVATAR}
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

        {/* ── Pagination ── */}
        {testimonials.length > cardsToShow && (
          <div className="pagination-nav">
            <div className="pagination-dots">
              {Array.from({ length: totalGroups }).map((_, index) => (
                <button
                  key={`dot-${index}`}
                  className={`dot ${activeGroup === index ? 'active' : ''}`}
                  onClick={() => {
                    setDirection(index > activeGroup ? 1 : -1);
                    setCurrentIndex(index * cardsToShow);
                  }}
                  aria-label={
                    isArabic
                      ? `الانتقال إلى المجموعة ${index + 1}`
                      : `Go to testimonial group ${index + 1}`
                  }
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default Testimonials;