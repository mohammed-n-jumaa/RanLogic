import { memo } from 'react';
import { Calendar } from 'lucide-react';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';

const WEEK = {
  ar: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  en: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
};

const WorkoutCalendar = ({ calendar }) => {
  const { t, currentLang } = useProfileLanguage();
  if (!calendar) return null;

  const { year, month, workout_dates: workoutDates = [] } = calendar;
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const today = new Date();
  const isThisMonth = today.getFullYear() === year && today.getMonth() + 1 === month;
  const monthName = new Date(year, month - 1).toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : 'en-US', { month: 'long' });
  const dateKey = d => `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <section className="pf-card">
      <div className="pf-card__head">
        <h3 className="pf-card__title"><span className="pf-card__icon"><Calendar /></span>{t(`تقويم ${monthName}`, `${monthName} calendar`)}</h3>
      </div>
      <div className="db-cal">
        {(WEEK[currentLang] || WEEK.ar).map((d, i) => <span key={`h${i}`} className="db-cal__head">{d}</span>)}
        {cells.map((d, i) => (
          <span
            key={i}
            className={`db-cal__day ${!d ? 'is-blank' : workoutDates.includes(dateKey(d)) ? 'is-workout' : ''} ${isThisMonth && d === today.getDate() ? 'is-today' : ''}`}
          >
            <span className="pf-num">{d || ''}</span>
          </span>
        ))}
      </div>
      <div className="db-cal__legend">
        <span><i className="is-workout" /> {t('يوم تمرين', 'Workout day')}</span>
        <span><i className="is-today" /> {t('اليوم', 'Today')}</span>
      </div>
    </section>
  );
};

export default memo(WorkoutCalendar);
