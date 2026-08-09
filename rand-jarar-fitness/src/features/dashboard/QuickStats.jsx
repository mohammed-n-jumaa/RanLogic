import { FaWeight, FaFire, FaTint, FaDumbbell, FaTrophy, FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';

const QuickStats = ({ data }) => {
  const { t } = useProfileLanguage();

  const weights = data.weight_chart;
  const firstW = weights[0]?.weight;
  const lastW = weights[weights.length - 1]?.weight;
  const change = firstW && lastW ? (parseFloat(lastW) - parseFloat(firstW)).toFixed(1) : null;
  const earnedBadges = data.badges.filter(b => b.earned).length;
  const totalBadges = data.badges.length;

  const stats = [
    {
      icon: <FaWeight />,
      value: lastW ? `${lastW}` : '--',
      unit: t('كغ', 'kg'),
      label: t('الوزن الحالي', 'Current weight'),
      sub: change ? `${change > 0 ? '+' : ''}${change}` : null,
      subIcon: change < 0 ? <FaArrowDown /> : change > 0 ? <FaArrowUp /> : null,
      subColor: change < 0 ? '#639922' : change > 0 ? '#e24b4a' : '#888',
      color: '#993556',
      bg: '#FBEAF0',
    },
    {
      icon: <FaFire />,
      value: `${data.streak.count}`,
      unit: t('يوم', 'days'),
      label: t('التزام متتالي', 'Streak'),
      color: '#f59e0b',
      bg: '#FAEEDA',
    },
    {
      icon: <FaDumbbell />,
      value: `${data.weekly_report.exercise_rate}%`,
      label: t('التزام الأسبوع', 'Weekly rate'),
      color: '#534AB7',
      bg: '#EEEDFE',
    },
    {
      icon: <FaTint />,
      value: `${data.water.cups}/${data.water.goal}`,
      label: t('المي اليوم', 'Water today'),
      color: '#185FA5',
      bg: '#E6F1FB',
    },
    {
      icon: <FaTrophy />,
      value: `${earnedBadges}/${totalBadges}`,
      label: t('الشارات', 'Badges'),
      color: '#854F0B',
      bg: '#FAEEDA',
    },
  ];

  return (
    <div className="quick-stats">
      {stats.map((s, i) => (
        <div key={i} className="qs-item">
          <div className="qs-icon" style={{ background: s.bg, color: s.color }}>
            {s.icon}
          </div>
          <div className="qs-value">
            {s.value}
            {s.unit && <span className="qs-unit">{s.unit}</span>}
          </div>
          {s.sub && (
            <div className="qs-sub" style={{ color: s.subColor }}>
              {s.subIcon} {s.sub}
            </div>
          )}
          <div className="qs-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;