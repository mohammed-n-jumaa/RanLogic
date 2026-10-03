import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import SEO from '../components/common/SEO/SEO';
import './NotFound.scss';

// Coach lines unlock as the visitor "lifts" the 404 barbell
const COACH_LINES = [
  { at: 0, ar: 'اضغط على البار وارفعه… يمكن تلاقي الصفحة تحته 😉', en: 'Tap the bar and lift it… maybe the page is under it 😉' },
  { at: 1, ar: 'عدّة وحدة! ولسا ما في صفحة.', en: 'One rep! Still no page.' },
  { at: 3, ar: 'كمّل… العضلة بتتعب قبل ما تستسلم.', en: 'Keep going… muscles tire before they quit.' },
  { at: 6, ar: 'يا وحش! الصفحة مش هون، بس الفورمة صارت أحلى 💪', en: 'Beast mode! The page isn\'t here, but your form looks great 💪' },
  { at: 10, ar: 'خلص، هاد تمرين كامل. يلا نرجع للمسار 👇', en: 'That\'s a full set. Let\'s get you back on track 👇' },
];

const RECOVERY_WORKOUT = [
  { to: '/calorie-calculator', sets: '3×10', ar: 'احسب سعراتك اليومية', en: 'Calculate your daily calories' },
  { to: '/meal-calculator',    sets: '3×12', ar: 'احسب سعرات وجبتك',     en: 'Calculate your meal macros' },
  { to: '/faq',                sets: '2×15', ar: 'الأسئلة الشائعة',       en: 'Frequently asked questions' },
  { to: '/contact',            sets: '1×1',  ar: 'احكي مع الفريق',        en: 'Talk to our team' },
];

const Plate = ({ x, label, big = false }) => {
  const h = big ? 150 : 120;
  const w = big ? 64 : 52;
  return (
    <g transform={`translate(${x - w / 2} ${100 - h / 2})`}>
      <rect width={w} height={h} rx={big ? 14 : 12} className="nf-plate" />
      <rect x={w / 2 - 4} y={10} width={8} height={h - 20} rx={4} className="nf-plate__groove" />
      <text x={w / 2} y={h / 2} dy="0.35em" textAnchor="middle" className="nf-plate__label">
        {label}
      </text>
    </g>
  );
};

const NotFound = () => {
  const navigate = useNavigate();
  const { isArabic } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [reps, setReps] = useState(0);
  const [lifting, setLifting] = useState(false);

  const t = (ar, en) => (isArabic ? ar : en);
  const coachLine = [...COACH_LINES].reverse().find(l => reps >= l.at);

  const lift = () => {
    if (lifting) return;
    setLifting(true);
    setReps(r => r + 1);
  };

  return (
    <>
      <SEO
        title={t('الصفحة غير موجودة | RanLogic', 'Page Not Found | RanLogic')}
        description={t('الصفحة التي تبحث عنها غير موجودة.', 'The page you are looking for does not exist.')}
        noindex={true}
      />

      <main className="nf" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="nf__glow" aria-hidden="true" />
        <div className="nf__inner">

        <section className="nf__stage">
          <p className="nf__eyebrow">{t('خطأ 404 · الصفحة غير موجودة', 'Error 404 · Page not found')}</p>

          <button
            type="button"
            className="nf__bar-btn"
            onClick={lift}
            aria-label={t('ارفع البار', 'Lift the bar')}
          >
            <motion.svg
              viewBox="0 0 520 200"
              className="nf__barbell"
              role="img"
              aria-label="404"
              animate={lifting && !reduceMotion ? { y: [0, -46, 0], rotate: [0, -1.5, 0] } : { y: 0 }}
              transition={{ duration: 0.7, ease: [0.34, 1.3, 0.64, 1] }}
              onAnimationComplete={() => setLifting(false)}
            >
              <rect x="20" y="92" width="480" height="16" rx="8" className="nf-bar" />
              <rect x="20" y="88" width="34" height="24" rx="6" className="nf-bar__end" />
              <rect x="466" y="88" width="34" height="24" rx="6" className="nf-bar__end" />
              <Plate x={110} label="4" />
              <Plate x={260} label="0" big />
              <Plate x={410} label="4" />
            </motion.svg>
            <span className="nf__floor" aria-hidden="true" />
          </button>

          <div className="nf__counter" aria-live="polite">
            <span className="nf__counter-num">{reps}</span>
            <span className="nf__counter-label">{t('عدّات', 'reps')}</span>
          </div>

          <h1 className="nf__title">{t('هاي الصفحة ما حضرت التمرين اليوم', 'This page skipped today\'s workout')}</h1>
          <motion.p
            key={coachLine.at}
            className="nf__coach"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {t(coachLine.ar, coachLine.en)}
          </motion.p>

          <div className="nf__actions">
            <Link to="/" className="nf__btn nf__btn--primary">
              {t('الرجوع للرئيسية', 'Back to home')}
            </Link>
            <button type="button" className="nf__btn nf__btn--ghost" onClick={() => navigate(-1)}>
              {t('الصفحة السابقة', 'Go back')}
            </button>
          </div>
        </section>

        <section className="nf__workout" aria-labelledby="nf-workout-title">
          <div className="nf__workout-head">
            <h2 id="nf-workout-title">{t('تمرين الرجوع للمسار', 'Get-back-on-track workout')}</h2>
            <span>{t('4 تمارين · بدون أعذار', '4 exercises · no excuses')}</span>
          </div>
          <ol className="nf__exercises">
            {RECOVERY_WORKOUT.map((ex, i) => (
              <li key={ex.to}>
                <Link to={ex.to} className="nf__exercise">
                  <span className="nf__exercise-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="nf__exercise-name">{t(ex.ar, ex.en)}</span>
                  <span className="nf__exercise-sets">{ex.sets}</span>
                  <span className="nf__exercise-arrow" aria-hidden="true">{isArabic ? '←' : '→'}</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
        </div>
      </main>
    </>
  );
};

export default NotFound;
