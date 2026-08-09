import { useState } from 'react';
import { FaChartBar, FaShareAlt } from 'react-icons/fa';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';

const WeeklyReport = ({ report }) => {
  const { t } = useProfileLanguage();
  const [tooltip, setTooltip] = useState(null);

  const stats = [
    {
      value: `${report.exercise_rate}%`,
      label: t('التزام التمارين', 'Exercise rate'),
      color: '#639922',
      tip: t('نسبة التمارين المكتملة من المطلوبة', 'Completed exercises vs assigned'),
    },
    {
      value: `${report.workout_days}/7`,
      label: t('أيام التمرين', 'Workout days'),
      color: '#185FA5',
      tip: t('عدد الأيام اللي تمرنت فيها', 'Days you worked out'),
    },
    {
      value: `${report.avg_water}`,
      label: t('معدل المي يومياً', 'Avg daily water'),
      color: '#534AB7',
      tip: t('معدل الأكواب اللي شربتها يومياً', 'Average cups per day'),
    },
    {
      value: report.weight_change !== null
        ? `${report.weight_change > 0 ? '+' : ''}${report.weight_change} ${t('كغ', 'kg')}`
        : '--',
      label: t('تغيير الوزن', 'Weight change'),
      color: '#854F0B',
      tip: t('الفرق بين أول وآخر وزن بالأسبوع', 'Difference between first and last weigh-in'),
    },
  ];

  const handleShare = () => {
    const text = stats.map(s => `${s.label}: ${s.value}`).join('\n');
    const shareText = `${t('تقرير أسبوعي', 'Weekly Report')}\n${text}`;

    if (navigator.share) {
      navigator.share({ title: t('تقدمي', 'My Progress'), text: shareText }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        alert(t('تم النسخ!', 'Copied!'));
      });
    }
  };

  return (
    <div className="dash-card">
      <div className="dash-card-title">
        <FaChartBar />
        <span>{t('تقرير الأسبوع', 'Weekly report')}</span>
      </div>

      <div className="report-grid">
        {stats.map((s, i) => (
          <div
            key={i}
            className="report-item"
            onMouseEnter={() => setTooltip(i)}
            onMouseLeave={() => setTooltip(null)}
            style={{ position: 'relative' }}
          >
            <span className="report-num" style={{ color: s.color }}>{s.value}</span>
            <span className="report-label">{s.label}</span>
            {tooltip === i && <span className="dash-tooltip">{s.tip}</span>}
          </div>
        ))}
      </div>

    </div>
  );
};

export default WeeklyReport;