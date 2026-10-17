import { memo } from 'react';
import { FileBarChart } from 'lucide-react';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';

const WeeklyReport = ({ report }) => {
  const { t } = useProfileLanguage();
  if (!report) return null;

  const change = report.weight_change;
  const items = [
    { value: `${report.exercise_rate}%`, label: t('التزام التمارين', 'Exercise rate'), hint: t('نسبة التمارين المكتملة من المطلوبة', 'Completed vs assigned exercises') },
    { value: `${report.workout_days}/7`, label: t('أيام التمرين', 'Workout days'), hint: t('عدد الأيام اللي تمرنت فيها', 'Days you worked out') },
    { value: `${report.avg_water}`, label: t('معدل المي يومياً', 'Avg daily water'), hint: t('معدل الأكواب باليوم', 'Average cups per day') },
    {
      value: change !== null && change !== undefined ? `${change > 0 ? '+' : ''}${change} ${t('كغ', 'kg')}` : '--',
      label: t('تغيير الوزن', 'Weight change'),
      hint: t('الفرق بين أول وآخر وزن بالأسبوع', 'First vs last weigh-in this week'),
      tone: change < 0 ? 'good' : change > 0 ? 'bad' : null,
    },
  ];

  return (
    <section className="pf-card">
      <div className="pf-card__head">
        <h3 className="pf-card__title"><span className="pf-card__icon"><FileBarChart /></span>{t('تقرير الأسبوع', 'Weekly report')}</h3>
      </div>
      <div className="db-report">
        {items.map(it => (
          <div key={it.label} className="db-report__item" title={it.hint}>
            <strong className={`pf-num ${it.tone ? `is-${it.tone}` : ''}`}>{it.value}</strong>
            <small>{it.label}</small>
          </div>
        ))}
      </div>
    </section>
  );
};

export default memo(WeeklyReport);
