import { memo } from "react";
import { Calendar } from 'lucide-react';
import { useProfileLanguage } from "../../contexts/ProfileLanguageContext";

const monthNamesAr = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

const WorkoutCalendar = ({ calendar }) => {
  const { t, currentLang } = useProfileLanguage();
  const { year, month, workout_dates } = calendar;

  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const monthName = currentLang === 'ar'
    ? monthNamesAr[month - 1]
    : new Date(year, month - 1).toLocaleString('en', { month: 'long' });

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isWorkout = (day) => {
    if (!day) return false;
    const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    return workout_dates.includes(dateStr);
  };

  return (
    <div className="dash-card">
      <div className="dash-card-title">
        <Calendar />
        <span>{t(`تقويم التمارين — ${monthName}`, `Workout calendar — ${monthName}`)}</span>
      </div>

      <div className="cal-grid">
        {cells.map((day, i) => (
          <div key={i} className={`cal-day ${!day ? 'empty' : isWorkout(day) ? 'workout' : 'rest'}`}>
            {day || ''}
          </div>
        ))}
      </div>

      <div className="cal-legend">
        <span><span className="cal-dot workout" /> {t('تمرين', 'Workout')}</span>
        <span><span className="cal-dot rest" /> {t('راحة', 'Rest')}</span>
      </div>
    </div>
  );
};

export default memo(WorkoutCalendar);