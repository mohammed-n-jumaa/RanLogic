import { memo, useState } from 'react';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';
import { LayoutGrid } from 'lucide-react';

const HeatmapCard = ({ heatmap }) => {
  const { t } = useProfileLanguage();
  const [tooltip, setTooltip] = useState(null);

  const maxCount = Math.max(...Object.values(heatmap), 1);

  const getLevel = (count) => {
    if (!count) return 0;
    const ratio = count / maxCount;
    if (ratio <= 0.25) return 1;
    if (ratio <= 0.5) return 2;
    if (ratio <= 0.75) return 3;
    return 4;
  };

  const levelLabels = {
    ar: ['لا شيء', 'قليل', 'متوسط', 'جيد', 'ممتاز'],
    en: ['None', 'Low', 'Medium', 'Good', 'Excellent'],
  };

  const cells = [];
  for (let i = 89; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const count = heatmap[key] || 0;
    cells.push({ date: key, count, level: getLevel(count) });
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('ar-EG', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="dash-card">
      <div className="dash-card-title">
        <LayoutGrid />
        <span>{t('خريطة الالتزام — آخر 3 أشهر', 'Consistency — last 3 months')}</span>
      </div>

      <div className="heatmap-grid">
        {cells.map((c, i) => (
          <div
            key={i}
            className={`heatmap-cell level-${c.level}`}
            onMouseEnter={() => setTooltip(i)}
            onMouseLeave={() => setTooltip(null)}
            style={{ position: 'relative' }}
          >
            {tooltip === i && (
              <span className="dash-tooltip">
                {formatDate(c.date)} — {c.count} {t('تمرين', 'exercises')}
                <br />
                {t(levelLabels.ar[c.level], levelLabels.en[c.level])}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="heatmap-legend">
        <span>{t('أقل', 'Less')}</span>
        {[0, 1, 2, 3, 4].map(l => (
          <div key={l} className={`heatmap-cell level-${l} legend`} />
        ))}
        <span>{t('أكثر', 'More')}</span>
      </div>
    </div>
  );
};

export default memo(HeatmapCard);