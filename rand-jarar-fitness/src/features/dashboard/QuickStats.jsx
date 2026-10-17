import { memo } from 'react';
import { Scale, Flame, Dumbbell, Trophy } from 'lucide-react';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';

const QuickStats = ({ data }) => {
  const { t } = useProfileLanguage();

  const weights = data.weight_chart || [];
  const firstW = parseFloat(weights[0]?.weight);
  const lastW = parseFloat(weights[weights.length - 1]?.weight);
  const change = firstW && lastW ? +(lastW - firstW).toFixed(1) : null;
  const earned = (data.badges || []).filter(b => b.earned).length;

  const tiles = [
    {
      Icon: Scale,
      label: t('الوزن الحالي', 'Current weight'),
      value: lastW ? <>{lastW}<small> {t('كغ', 'kg')}</small></> : '--',
      sub: change ? `${change > 0 ? '+' : ''}${change} ${t('كغ منذ البداية', 'kg since start')}` : null,
      tone: change < 0 ? 'good' : change > 0 ? 'bad' : null,
    },
    {
      Icon: Flame,
      label: t('التزام متتالي', 'Streak'),
      value: <>{data.streak?.count ?? 0}<small> {t('يوم', 'days')}</small></>,
    },
    {
      Icon: Dumbbell,
      label: t('التزام الأسبوع', 'Weekly rate'),
      value: `${data.weekly_report?.exercise_rate ?? 0}%`,
    },
    {
      Icon: Trophy,
      label: t('الشارات', 'Badges'),
      value: <>{earned}<small> / {(data.badges || []).length}</small></>,
    },
  ];

  return (
    <div className="pf-grid pf-grid--4">
      {tiles.map(({ Icon, label, value, sub, tone }) => (
        <div key={label} className="pf-card db-stat">
          <div className="db-stat__label"><span className="pf-card__icon"><Icon /></span>{label}</div>
          <div className="db-stat__value pf-num">{value}</div>
          {sub && <div className={`db-stat__sub ${tone ? `is-${tone}` : ''}`}>{sub}</div>}
        </div>
      ))}
    </div>
  );
};

export default memo(QuickStats);
