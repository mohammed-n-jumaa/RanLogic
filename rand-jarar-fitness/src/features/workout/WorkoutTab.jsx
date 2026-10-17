import { useState, useEffect, useMemo } from 'react';
import { Loader2, Calendar, FileDown, ChevronDown, Check } from 'lucide-react';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';
import profileApi from '../../api/profileApi';
import { toDateKey, normalizeDate, periodOf, isRestDay, STORAGE_URL } from '../profile/shell/profileShared';
import useExerciseToggle from './useExerciseToggle';
import ExerciseCheckRow from './ExerciseCheckRow';
import './Workout.scss';

const DAY_NAMES = {
  ar: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
};
const DAY_SHORT = {
  ar: ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};

const WorkoutTab = () => {
  const { t, currentLang } = useProfileLanguage();
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPeriod, setCurrentPeriod] = useState(1);
  const [openDay, setOpenDay] = useState(null);       // day of month
  const { toggleExercise, busyId } = useExerciseToggle(setWorkoutPlan);

  // Once, when the plan loads: open today's period, expand today if it's a workout day, scroll to it
  const jumpToToday = (plan) => {
    const now = new Date();
    const base = plan.plan?.month_start_date ? new Date(plan.plan.month_start_date) : now;
    if (base.getFullYear() !== now.getFullYear() || base.getMonth() !== now.getMonth()) return;

    const todayRows = plan.exercises.filter(e => normalizeDate(e.exercise_date) === toDateKey(now));
    setCurrentPeriod(periodOf(now.getDate()));
    setOpenDay(todayRows.length && !isRestDay(todayRows) ? now.getDate() : null);
    setTimeout(() => {
      document.querySelector('.wk-day.is-today')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  };

  useEffect(() => {
    const now = new Date();
    profileApi.getMyWorkoutPlan(now.getFullYear(), now.getMonth() + 1)
      .then(res => {
        const plan = res?.success && res.data ? res.data : null;
        setWorkoutPlan(plan);
        if (plan?.exercises?.length) jumpToToday(plan);
      })
      .catch(err => { console.error('Error fetching workout plan:', err); setWorkoutPlan(null); })
      .finally(() => setLoading(false));
  }, []);

  const monthStart = useMemo(() => {
    const base = workoutPlan?.plan?.month_start_date ? new Date(workoutPlan.plan.month_start_date) : new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  }, [workoutPlan]);

  const rowsByDate = useMemo(() => {
    const map = {};
    (workoutPlan?.exercises || []).forEach(ex => {
      const key = normalizeDate(ex.exercise_date);
      (map[key] = map[key] || []).push(ex);
    });
    return map;
  }, [workoutPlan]);

  const pdfUrl = workoutPlan?.plan?.pdf_file ? `${STORAGE_URL}/${workoutPlan.plan.pdf_file}` : null;
  const hasExercises = !!workoutPlan?.exercises?.length;

  if (loading) {
    return (
      <div className="pf-card pf-state">
        <span className="pf-state__icon"><Loader2 className="pf-spin" /></span>
        <p className="pf-card__sub">{t('جاري تحميل خطة التمارين...', 'Loading workout plan...')}</p>
      </div>
    );
  }

  if (!hasExercises) {
    return (
      <div className="pf-card pf-state">
        <span className="pf-state__icon">{pdfUrl ? <FileDown /> : <Calendar />}</span>
        <h3>{pdfUrl ? t('خطة التمارين متوفرة بصيغة PDF', 'Workout plan available as PDF') : t('لا توجد خطة تمارين', 'No workout plan')}</h3>
        <p className="pf-card__sub">
          {pdfUrl
            ? t('ما في تمارين مضافة بالنظام حالياً، بتقدر تعرض أو تحمّل ملف الخطة الشهرية.', 'No exercises in the system yet — you can view or download the monthly plan PDF.')
            : t('لم يتم إنشاء خطة تمارين لهذا الشهر بعد', 'No workout plan has been created for this month yet')}
        </p>
        {pdfUrl && <a className="pf-btn pf-btn--primary" href={pdfUrl} target="_blank" rel="noopener noreferrer"><FileDown /> {t('عرض PDF', 'View PDF')}</a>}
      </div>
    );
  }

  const daysInMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate();
  const start = (currentPeriod - 1) * 10 + 1;
  const end = currentPeriod === 3 ? daysInMonth : currentPeriod * 10;
  const todayKey = toDateKey(new Date());

  return (
    <div>
      <div className="pf-toolbar">
        <div className="pf-segmented">
          {[1, 2, 3].map(p => (
            <button
              key={p}
              type="button"
              className={p === currentPeriod ? 'is-active' : ''}
              onClick={() => { setCurrentPeriod(p); setOpenDay(null); }}
            >
              {t('أيام', 'Days')} <span className="pf-num">{(p - 1) * 10 + 1}-{p === 3 ? daysInMonth : p * 10}</span>
            </button>
          ))}
        </div>
        {pdfUrl && (
          <a className="pf-btn pf-btn--ghost" href={pdfUrl} target="_blank" rel="noopener noreferrer"><FileDown /> {t('عرض PDF', 'View PDF')}</a>
        )}
      </div>

      <div className="wk-days">
        {Array.from({ length: end - start + 1 }, (_, i) => {
          const day = start + i;
          const date = new Date(monthStart.getFullYear(), monthStart.getMonth(), day);
          const key = toDateKey(date);
          return (
            <DayCard
              key={key}
              date={date}
              rows={rowsByDate[key] || []}
              isToday={key === todayKey}
              isPast={key < todayKey}
              isOpen={openDay === day}
              onToggleOpen={() => setOpenDay(openDay === day ? null : day)}
              onToggleExercise={ex => toggleExercise(ex, rowsByDate[key] || [])}
              busyId={busyId}
              names={{ long: DAY_NAMES[currentLang] || DAY_NAMES.ar, short: DAY_SHORT[currentLang] || DAY_SHORT.ar }}
            />
          );
        })}
      </div>
    </div>
  );
};

const DayCard = ({ date, rows, isToday, isPast, isOpen, onToggleOpen, onToggleExercise, busyId, names }) => {
  const { t } = useProfileLanguage();
  const dateBox = (
    <div className="wk-day__date">
      <strong className="pf-num">{date.getDate()}</strong>
      <small>{names.short[date.getDay()]}</small>
    </div>
  );
  const todayPill = isToday && <span className="pf-pill pf-pill--primary">{t('اليوم', 'Today')}</span>;

  // Nothing uploaded for this date — different from a rest day
  if (!rows.length) {
    return (
      <article className={`wk-day is-empty ${isToday ? 'is-today' : ''}`}>
        <div className="wk-day__head is-static">
          {dateBox}
          <div className="wk-day__body">
            <div className="wk-day__title">{names.long[date.getDay()]} {todayPill}</div>
            <div className="wk-day__sub">{t('لسا ما انضاف تمرين لهذا اليوم', 'No workout added for this day yet')}</div>
          </div>
        </div>
      </article>
    );
  }

  // Rest day = a row named "راحة" (from the Excel import), shown with the coach's notes
  if (isRestDay(rows)) {
    const notes = rows.map(r => r.notes).filter(Boolean).join(' · ');
    return (
      <article className={`wk-day is-rest ${isToday ? 'is-today' : ''}`}>
        <div className="wk-day__head is-static">
          {dateBox}
          <div className="wk-day__body">
            <div className="wk-day__title">{names.long[date.getDay()]} {todayPill}</div>
            <div className="wk-day__sub">{notes || t('يوم راحة 🌿 — نوم كويس ومي كفاية', 'Rest day 🌿 — sleep well and hydrate')}</div>
          </div>
          <span className="pf-pill pf-pill--ok">🌿 {t('راحة', 'Rest')}</span>
        </div>
      </article>
    );
  }

  const done = rows.filter(r => r.completed).length;
  const pct = Math.round((done / rows.length) * 100);
  const status = done === rows.length
    ? <span className="pf-pill pf-pill--ok">{t('مكتمل ✓', 'Done ✓')}</span>
    : isPast && done === 0 ? <span className="pf-pill pf-pill--bad">{t('فاتك', 'Missed')}</span> : null;

  return (
    <article className={`wk-day ${isToday ? 'is-today' : ''} ${isOpen ? 'is-open' : ''}`}>
      <button type="button" className="wk-day__head" onClick={onToggleOpen} aria-expanded={isOpen}>
        {dateBox}
        <div className="wk-day__body">
          <div className="wk-day__title">{names.long[date.getDay()]} {todayPill} {status}</div>
          <div className="wk-day__sub"><span className="pf-num">{rows.length}</span> {t('تمارين', 'exercises')}</div>
        </div>
        <div className="wk-day__progress">
          <small className="pf-num">{done}/{rows.length}</small>
          <div className="pf-bar"><span style={{ width: `${pct}%` }} /></div>
        </div>
        <ChevronDown className="pf-chev wk-day__chev" />
      </button>

      <div className={`pf-collapse ${isOpen ? 'is-open' : ''}`}>
        <div>
          <ol className="ex-list wk-exercises">
            {rows.map(ex => (
              <ExerciseCheckRow key={ex.id} exercise={ex} onToggle={() => onToggleExercise(ex)} busy={busyId === ex.id} />
            ))}
          </ol>
        </div>
      </div>
    </article>
  );
};

export default WorkoutTab;
