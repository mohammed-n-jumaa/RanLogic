import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import usePageTitle from '@/hooks/usePageTitle';
import './NotFound.scss';

const NotFound = () => {
  usePageTitle('الصفحة غير موجودة', 'Page Not Found', isArabic ? 'ar' : 'en');
  const navigate = useNavigate();
  const { isArabic } = useLanguage();

  const t = (ar, en) => (isArabic ? ar : en);

  return (
    <div className="nf" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Animated Grid Background */}
      <div className="nf__grid" />

      {/* Floating Particles */}
      <div className="nf__particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="nf__particle"
            style={{
              '--x': `${Math.random() * 100}%`,
              '--y': `${Math.random() * 100}%`,
              '--size': `${Math.random() * 4 + 2}px`,
              '--duration': `${Math.random() * 8 + 4}s`,
              '--delay': `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Glowing Orbs */}
      <div className="nf__orb nf__orb--1" />
      <div className="nf__orb nf__orb--2" />
      <div className="nf__orb nf__orb--3" />

      <div className="nf__content">
        {/* Animated 404 */}
        <div className="nf__hero">
          <motion.div
            className="nf__number-wrap"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Big 404 with Kettlebell */}
            <div className="nf__big-number">
              <span className="nf__digit">4</span>

              <div className="nf__kettlebell">
                <svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M40 8C30 8 22 14 20 22H60C58 14 50 8 40 8Z"
                    stroke="#FDB813"
                    strokeWidth="3"
                    fill="none"
                    className="nf__kb-handle"
                  />
                  <circle cx="40" cy="62" r="32" fill="url(#kbGrad)" stroke="#FDB813" strokeWidth="2.5" />
                  <circle cx="40" cy="62" r="22" fill="rgba(10,10,10,0.4)" stroke="rgba(253,184,19,0.3)" strokeWidth="1" />
                  <text x="40" y="68" textAnchor="middle" fill="#FDB813" fontSize="18" fontWeight="800">0</text>
                  <defs>
                    <radialGradient id="kbGrad" cx="35%" cy="35%">
                      <stop offset="0%" stopColor="rgba(253,184,19,0.2)" />
                      <stop offset="100%" stopColor="rgba(253,184,19,0.05)" />
                    </radialGradient>
                  </defs>
                </svg>
              </div>

              <span className="nf__digit">4</span>
            </div>
          </motion.div>

          {/* Heartbeat Line */}
          <motion.div
            className="nf__heartbeat-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <svg className="nf__heartbeat" viewBox="0 0 400 60" preserveAspectRatio="none">
              <path
                d="M0 30 L80 30 L100 30 L120 10 L140 50 L160 5 L180 55 L200 30 L220 30 L400 30"
                fill="none"
                stroke="#FDB813"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="nf__heartbeat-line"
              />
            </svg>
          </motion.div>
        </div>

        {/* Text */}
        <motion.div
          className="nf__text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="nf__badge">
            <span className="nf__badge-dot" />
            {t('صفحة مفقودة', 'Page Not Found')}
          </div>

          <h1 className="nf__title">
            {t('أوبس! ضعت عن المسار', 'Oops! You went off track')}
          </h1>

          <p className="nf__subtitle">
            {t(
              'هذه الصفحة غير موجودة — لكن رحلتك الرياضية لسا مستمرة. خلينا نرجعك للتمرين!',
              "This page doesn't exist — but your fitness journey continues. Let's get you back on track!"
            )}
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          className="nf__stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="nf__stat">
            <span className="nf__stat-number">100%</span>
            <span className="nf__stat-label">{t('النظام يعمل', 'System Online')}</span>
          </div>
          <div className="nf__stat-line" />
          <div className="nf__stat">
            <span className="nf__stat-number">24/7</span>
            <span className="nf__stat-label">{t('الدعم متاح', 'Support Active')}</span>
          </div>
          <div className="nf__stat-line" />
          <div className="nf__stat">
            <span className="nf__stat-number">0</span>
            <span className="nf__stat-label">{t('أعذار اليوم', 'Excuses Today')}</span>
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="nf__actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <button className="nf__btn nf__btn--primary" onClick={() => navigate('/')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            {t('العودة للرئيسية', 'Back to Home')}
          </button>

          <button className="nf__btn nf__btn--ghost" onClick={() => navigate(-1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            {t('الصفحة السابقة', 'Go Back')}
          </button>
        </motion.div>

        {/* Motivational Quote */}
        <motion.p
          className="nf__quote"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          {t(
            '"الفشل ليس السقوط، بل رفض النهوض" — مجهول',
            '"Failure is not falling down, but refusing to get up" — Unknown'
          )}
        </motion.p>
      </div>
    </div>
  );
};

export default NotFound;