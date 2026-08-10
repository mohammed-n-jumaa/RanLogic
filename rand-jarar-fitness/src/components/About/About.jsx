import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import aboutApi from '../../api/aboutApi';
import './About.scss';
import { CheckCircle } from 'lucide-react';
import DOMPurify from 'dompurify';

// ─── Icon map ─────────────────────────────────────────────────────────────────
const getIconComponent = (icon) => {
  const icons = {
    '👥': '👥', '🤝': '🤝', '🫶': '🫶', '💬': '💬', '📞': '📞',
    '📩': '📩', '📣': '📣', '💪': '💪', '🏋️': '🏋️', '🏋️‍♀️': '🏋️‍♀️',
    '🏋️‍♂️': '🏋️‍♂️', '🏃': '🏃', '🏃‍♀️': '🏃‍♀️', '🏃‍♂️': '🏃‍♂️',
    '🤸': '🤸', '🤸‍♀️': '🤸‍♀️', '🤸‍♂️': '🤸‍♂️', '🔥': '🔥', '⚡': '⚡',
    '🎯': '🎯', '🏆': '🏆', '🥇': '🥇', '🏅': '🏅', '🍎': '🍎',
    '🥗': '🥗', '🍽️': '🍽️', '🍗': '🍗', '🥑': '🥑', '🍓': '🍓',
    '🥦': '🥦', '🥚': '🥚', '🍞': '🍞', '🥛': '🥛', '💧': '💧',
    '📈': '📈', '📊': '📊', '🚀': '🚀', '🌟': '🌟', '✨': '✨',
    '✅': '✅', '☑️': '☑️', '📌': '📌', '📍': '📍', '⏰': '⏰',
    '⌛': '⌛', '🕒': '🕒', '📅': '📅', '🗓️': '🗓️', '❤️': '❤️',
    '🫀': '🫀', '🧠': '🧠', '🧘': '🧘', '🧘‍♀️': '🧘‍♀️', '🧘‍♂️': '🧘‍♂️',
    '🌿': '🌿', '😌': '😌', '💻': '💻', '🖥️': '🖥️', '📱': '📱',
    '🌐': '🌐', '📡': '📡', '🎥': '🎥', '🎦': '🎦', '📹': '📹',
    '📷': '📷', '👩‍🏫': '👩‍🏫', '👨‍🏫': '👨‍🏫', '🧑‍🏫': '🧑‍🏫',
    '👩‍💻': '👩‍💻', '👨‍💻': '👨‍💻', '🧑‍💻': '🧑‍💻', '👩‍💼': '👩‍💼',
    '👨‍💼': '👨‍💼', '🧑‍💼': '🧑‍💼', '👩‍⚕️': '👩‍⚕️', '👨‍⚕️': '👨‍⚕️',
    '🧑‍⚕️': '🧑‍⚕️', '👩‍🎓': '👩‍🎓', '👨‍🎓': '👨‍🎓', '🧑‍🎓': '🧑‍🎓',
    '📚': '📚', '📖': '📖', '📝': '📝', '✍️': '✍️', '🎓': '🎓',
    '🏫': '🏫', '💎': '💎', '🔒': '🔒', '🔑': '🔑', '🌈': '🌈',
    '🦋': '🦋', '💡': '💡', '🎉': '🎉', '⭐': '⭐',
  };
  return icons[icon] || '✨';
};

// ─── Stats (ثابتة دائماً — مطابقة للصور) ────────────────────────────────────
const STATS = [
  { value: '200+', labelEn: 'Clients',      labelAr: 'متدرب سعيد'   },
  { value: '+4',   labelEn: 'Experience',   labelAr: 'سنوات خبرة'   },
  { value: '98%',  labelEn: 'Satisfaction', labelAr: ' نسبة النجاح' },
];

// ─── Static fallback (مطابق للصور) ──────────────────────────────────────────
const getStaticAbout = (isArabic) => ({
  badge: isArabic ? 'من نحن' : 'About Us',
  title: isArabic
    ? 'فريق RanLogic - <strong class="gold-word">مدربون معتمدون</strong> وأخصائية تغذية، نصمم برامج تدريبية وغذائية <strong class="gold-word">مخصصة</strong> تناسب <strong class="gold-word">أهدافك</strong> وأسلوب حياتك.'
    : 'RanLogic Team - <strong class="gold-word">certified trainers</strong> and <strong class="gold-word">nutrition specialist</strong> designing <strong class="gold-word">personalized</strong> fitness and nutrition programs tailored to your <strong class="gold-word">goals and lifestyle</strong>.',
  main_description: isArabic
    ? 'في RanLogic، نوفر لك <strong class="gold-word">متابعة شاملة</strong> تجمع بين التدريب الرياضي والتغذية السليمة. برامجنا مصممة بعناية لتحقيق <strong class="gold-word">نتائج مستدامة</strong>، مع <strong class="gold-word">دعم مستمر</strong> من فريق متخصص يرافقك في كل خطوة من رحلتك نحو أفضل نسخة منك.'
    : 'At RanLogic, we provide <strong class="gold-word">comprehensive support</strong> that combines fitness training with proper nutrition. Our programs are carefully designed to achieve <strong class="gold-word">sustainable results</strong>, with <strong class="gold-word">continuous support</strong> from a specialized team that accompanies you every step of the way toward a better version of yourself.',
  highlight_text: isArabic
    ? 'معنا، لن تحصل على مجرد جدول تمارين، بل على رفيق يدعمك في كل خطوة.'
    : "With us, you don't just get a workout plan; you get a partner who supports you every step of the way.",
  image_url: '/coach.png',
  features: [
    {
      id: 1, icon: '🏋️‍♀️',
      title:       isArabic ? 'تدريب شخصي أونلاين'              : 'Online Personal Training',
      description: isArabic ? 'جلسات تدريب متنوعة ومتابعة يومية'  : 'Diverse daily training and follow-up sessions',
    },
    {
      id: 2, icon: '🍎',
      title:       isArabic ? 'أنظمة غذائية وعلاجية مختصة'     : 'Specialized Medical Nutrition Programs',
      description: isArabic ? 'خطط تغذية مصممة خصيصاً لك'        : 'Nutrition plans designed especially for you',
    },
    {
      id: 3, icon: '💪',
      title:       isArabic ? 'تنشيف، نحت، زيادة عضل'        : 'Cutting, Sculpting, Muscle Gain',
      description: isArabic ? 'برامج شاملة لتحقيق أهدافك'       : 'Comprehensive programs to achieve your goals',
    },
    {
      id: 4, icon: '📊',
      title:       isArabic ? 'متابعة مستمرة'                  : 'Continuous Follow-up',
      description: isArabic ? 'دعم ومتابعة على مدار الأسبوع'     : 'Support and follow-up throughout the week',
    },
  ],
});

// ─── Keyword highlighter للـ API data ────────────────────────────────────────
const formatDescription = (html) => {
  if (!html) return '';
  return html
    .replace(/certified trainers?/gi,                                          '<strong class="gold-word">$&</strong>')
    .replace(/nutrition specialist/gi,                                         '<strong class="gold-word">$&</strong>')
    .replace(/goals and lifestyle/gi,                                          '<strong class="gold-word">$&</strong>')
    .replace(/تمكين|empower/gi,                                                '<strong class="gold-word">$&</strong>')
    .replace(/إمكانياتهم|potential/gi,                                         '<strong class="gold-word">$&</strong>')
    .replace(/نهج مختلف|unique approach/gi,                                    '<strong class="gold-word">$&</strong>')
    .replace(/برامج متكاملة|comprehensive programs/gi,                         '<strong class="gold-word">$&</strong>')
    .replace(/4 سنوات|four years/gi,                                           '<strong class="gold-word">$&</strong>')
    .replace(/200 مترب ومتدربة|200 clients/gi,                                 '<strong class="gold-word">$&</strong>')
    .replace(/مدربون معتمدون|certified coaches/gi,                             '<strong class="gold-word">$&</strong>')
    .replace(/مخصصة|personalized/gi,                                           '<strong class="gold-word">$&</strong>')
    .replace(/أهدافك|your goals/gi,                                            '<strong class="gold-word">$&</strong>')
    .replace(/متابعة شاملة|comprehensive support|comprehensive follow-up/gi,   '<strong class="gold-word">$&</strong>')
    .replace(/نتائج مستدامة|sustainable results/gi,                            '<strong class="gold-word">$&</strong>')
    .replace(/دعم مستمر|continuous support/gi,                                 '<strong class="gold-word">$&</strong>');
};

// ─── Component ────────────────────────────────────────────────────────────────
const About = () => {
  const [aboutData, setAboutData] = useState(() => getStaticAbout(true));
  const [isMobile,  setIsMobile]  = useState(false);
  const [isTablet,  setIsTablet]  = useState(false);
  const { currentLang, isArabic } = useLanguage();
  const navigate = useNavigate();

  // ── Responsive detection ─────────────────────────────────────────────────────
  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth <= 1024 && window.innerWidth > 768);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── جلب الـ API + تحديث اللغة في useEffect واحد ─────────────────────────────
  useEffect(() => {
    // حدّث الـ static للغة الحالية فوراً (إذا API ما وصل بعد)
    setAboutData(prev => prev._fromApi ? prev : getStaticAbout(isArabic));

    // اجلب الـ API في الخلفية — يبدّل الـ static بعد ما يرجع
    let cancelled = false;
    aboutApi.getAboutCoach(currentLang).then(res => {
      if (!cancelled && res?.success && res?.data) {
        setAboutData({ ...res.data, _fromApi: true });
      }
    });
    return () => { cancelled = true; };
  }, [currentLang]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Framer Motion variants ───────────────────────────────────────────────────
  const containerVariants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };

  const fadeUp = isMobile
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } } };

  const fadeRight = isMobile
    ? { hidden: { opacity: 1, x: 0 }, visible: { opacity: 1, x: 0 } }
    : { hidden: { opacity: 0, x: 36 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } } };

  const { badge, title, main_description, highlight_text, image_url, features = [] } = aboutData;

  // الـ title: الـ static جاهز فيه gold-word، الـ API data يمر على formatDescription
  const renderedTitle = aboutData._fromApi ? formatDescription(title) : title;

  return (
    <section className="about" id="about">

      {/* ── Decorative background shapes ── */}
      <div className="about-shape about-shape--1" aria-hidden="true" />
      <div className="about-shape about-shape--2" aria-hidden="true" />
      <div className="about-shape about-shape--3" aria-hidden="true" />

      <div className="about-container">
        <motion.div
          className="about-content"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: isMobile ? 0.05 : 0.15 }}
          key={currentLang}
        >

          {/* ════ LEFT — text + features ════ */}
          <motion.div
            className="about-details"
            variants={fadeUp}
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            {/* Eyebrow */}
            <div
              className={`section-eyebrow ${isArabic ? 'section-eyebrow--rtl' : ''}`}
              style={isArabic ? { justifyContent: 'flex-end' } : {}}
            >
              <span className="eyebrow-line" />
              <span className="eyebrow-pill">{badge}</span>
            </div>

            {/* Title */}
            <h2
              className="section-title"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(renderedTitle) }}
            />

            {/* Golden divider */}
            <div className="title-divider" aria-hidden="true" />

            {/* Description */}
            <div
              className="experience-text"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(formatDescription(main_description)) }}
              dir={isArabic ? 'rtl' : 'ltr'}
              style={{
                fontFamily: isArabic ? 'Tajawal, sans-serif' : 'Poppins, sans-serif',
                textAlign:  isArabic ? 'right' : 'left',
              }}
            />

            {/* Stats strip */}
            <div className="stats-strip">
              {STATS.map((s, i) => (
                <React.Fragment key={s.value}>
                  <div className="stat-block">
                    <span className="stat-value">{s.value}</span>
                    <span className="stat-label">{isArabic ? s.labelAr : s.labelEn}</span>
                  </div>
                  {i < STATS.length - 1 && <div className="stat-sep" aria-hidden="true" />}
                </React.Fragment>
              ))}
            </div>

            {/* Feature cards */}
            {features.length > 0 && (
              <div className="services-grid">
                {features.map((feature, index) => (
                  <motion.div
                    key={`feature-${index}`}
                    className="service-card"
                    variants={fadeUp}
                    whileHover={!isMobile ? { y: -4, transition: { duration: 0.18 } } : {}}
                    whileTap={isMobile ? { scale: 0.97 } : {}}
                    dir={isArabic ? 'rtl' : 'ltr'}
                    style={{ fontFamily: isArabic ? 'Tajawal, sans-serif' : 'Poppins, sans-serif' }}
                  >
                    <div className="service-icon">
                      <span className="icon-symbol">{getIconComponent(feature.icon)}</span>
                    </div>
                    <div className="service-content">
                      <h4>{feature.title}</h4>
                      <p>{feature.description}</p>
                    </div>
                    <div className="service-arrow" aria-hidden="true">›</div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* CTA */}
            <div className="about-cta">
              <motion.button
                className="cta-button"
                whileHover={!isMobile ? { scale: 1.04 } : {}}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate('/auth')}
                style={{
                  fontFamily:  isArabic ? 'Tajawal, sans-serif' : 'Poppins, sans-serif',
                  opacity:     1,
                  visibility:  'visible',
                  display:     'block',
                }}
              >
                {isArabic ? 'ابدأ رحلتك الآن' : 'Start Your Journey Now'}
              </motion.button>
            </div>
          </motion.div>

          {/* ════ RIGHT — photo + quote ════ */}
          <motion.div
            className="trainer-profile"
            variants={isTablet ? fadeUp : fadeRight}
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            <div className="profile-image-wrapper">

              {/* Certified badge */}
              <div className="cert-corner-badge">
                <CheckCircle />
                <span>{isArabic ? 'معتمدة' : 'Certified'}</span>
              </div>

              <img
                src={image_url || '/coach.png'}
                alt={isArabic ? 'رند جرار — مدربة لياقة بدنية' : 'Rand Jarar — Fitness Coach'}
                className="profile-image"
                width="400"
                height="533"
                loading="lazy"
                onError={(e) => { e.target.src = '/coach.png'; }}
              />

              <div className="profile-overlay" aria-hidden="true" />

              {/* Name pill */}
              <div className="profile-name-pill">
                <div className="name-pill-dot" />
                <span className="name-pill-name">Rand Jarar</span>
                <span className="name-pill-role">
                  {isArabic ? 'مدربة رئيسية' : 'Head Coach'}
                </span>
              </div>
            </div>

            {/* Quote */}
            <div
              className={`trainer-quote ${isArabic ? 'trainer-quote--rtl' : ''}`}
              style={{ fontFamily: isArabic ? 'Tajawal, sans-serif' : 'Poppins, sans-serif' }}
            >
              <span className="quote-mark" aria-hidden="true">"</span>
              <p className="quote-text">{highlight_text}</p>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default About;