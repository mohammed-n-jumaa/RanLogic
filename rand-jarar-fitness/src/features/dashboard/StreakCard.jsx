import { memo } from "react";
import { Flame, Check, X } from 'lucide-react';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';

const dayNames = {
  ar: ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};

const StreakCard = ({ streak }) => {
  const { t, currentLang } = useProfileLanguage();
  const names = dayNames[currentLang] || dayNames.ar;

  return (
    <div className="dash-card">
      <div className="dash-card-header">
        <div className="dash-card-title">
          <Flame fill="currentColor" />
          <span>{t('الالتزام الأسبوعي', 'Weekly streak')}</span>
        </div>
        <span className="streak-count">{streak.count} {t('يوم', 'days')}</span>
      </div>

      <div className="streak-grid">
        {streak.days.map((day, i) => (
          <div key={i} className={`streak-day ${day.status}`}>
            {day.status === 'done' && <Check />}
            {day.status === 'missed' && <X />}
            {day.status === 'today' && t('اليوم', 'Today')}
          </div>
        ))}
      </div>
      <div className="streak-labels">
        {names.map((n, i) => <span key={i}>{n}</span>)}
      </div>
    </div>
  );
};

export default memo(StreakCard);