import { memo } from 'react';
import { Flame, Check, X } from 'lucide-react';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';

const DAY_NAMES = {
  ar: ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};

const StreakCard = ({ streak }) => {
  const { t, currentLang } = useProfileLanguage();
  const names = DAY_NAMES[currentLang] || DAY_NAMES.ar;
  const days = streak?.days || [];

  return (
    <section className="pf-card">
      <div className="pf-card__head">
        <h3 className="pf-card__title"><span className="pf-card__icon"><Flame /></span>{t('الالتزام المتتالي', 'Streak')}</h3>
      </div>
      <div className="db-streak">
        <div className="db-streak__flame"><Flame /></div>
        <div>
          <div className="db-streak__num pf-num">{streak?.count ?? 0}</div>
          <div className="pf-card__sub">{t('أيام ورا بعض 🔥', 'days in a row 🔥')}</div>
        </div>
      </div>
      <div className="db-week">
        {days.map((day, i) => (
          <div key={i} className={`db-week__day is-${day.status}`}>
            <span>
              {day.status === 'done' && <Check />}
              {day.status === 'missed' && <X />}
            </span>
            {names[i]}
          </div>
        ))}
      </div>
    </section>
  );
};

export default memo(StreakCard);
