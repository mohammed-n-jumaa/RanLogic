import { memo } from 'react';
import { CalendarDays } from 'lucide-react';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';
import { toDateKey } from '../profile/shell/profileShared';

const DAYS = 91;   // 13 full weeks

const HeatmapCard = ({ heatmap = {} }) => {
  const { t, currentLang } = useProfileLanguage();
  const maxCount = Math.max(...Object.values(heatmap), 1);
  const level = count => (!count ? 0 : Math.min(4, Math.ceil((count / maxCount) * 4)));
  const locale = currentLang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US';

  // Columns are weeks (Sun → Sat), so pad the start to a Sunday
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - (DAYS - 1));
  start.setDate(start.getDate() - start.getDay());

  const cells = [];
  for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
    const key = toDateKey(d);
    const count = heatmap[key] || 0;
    cells.push({ key, count, level: level(count), label: d.toLocaleDateString(locale, { month: 'short', day: 'numeric' }) });
  }

  return (
    <section className="pf-card">
      <div className="pf-card__head">
        <h3 className="pf-card__title"><span className="pf-card__icon"><CalendarDays /></span>{t('خريطة الالتزام — آخر 3 أشهر', 'Consistency — last 3 months')}</h3>
      </div>
      <div className="db-heat">
        {cells.map(c => (
          <span key={c.key} data-l={c.level} title={`${c.label} — ${c.count} ${t('تمرين', 'exercises')}`} />
        ))}
      </div>
      <div className="db-heat__legend">
        {t('أقل', 'Less')}
        {[0, 1, 2, 3, 4].map(l => <span key={l} data-l={l} />)}
        {t('أكثر', 'More')}
      </div>
    </section>
  );
};

export default memo(HeatmapCard);
