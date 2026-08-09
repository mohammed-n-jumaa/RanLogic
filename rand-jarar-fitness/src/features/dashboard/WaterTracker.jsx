import { useState } from 'react';
import { FaTint, FaCheck } from 'react-icons/fa';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';
import dashboardApi from '../../api/dashboardApi';

const WaterTracker = ({ water }) => {
  const { t } = useProfileLanguage();
  const [cups, setCups] = useState(water.cups);
  const [saving, setSaving] = useState(false);
  const [tooltip, setTooltip] = useState(null);

  const goal = water.goal;
  const pct = goal > 0 ? Math.round((cups / goal) * 100) : 0;
  const isDone = cups >= goal;

  const handleTap = async (cupIndex) => {
    if (saving) return;
    const newCups = cupIndex + 1 === cups ? cupIndex : cupIndex + 1;
    setCups(newCups);
    setSaving(true);
    try {
      await dashboardApi.logWater(newCups);
    } catch (err) {
      setCups(cups); // rollback
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dash-card">
      <div className="dash-card-title">
        <FaTint />
        <span>{t('متتبع المي', 'Water tracker')}</span>
      </div>

      <div className="water-row">
        <div className="water-cups">
          {Array.from({ length: goal }).map((_, i) => (
            <div
              key={i}
              className={`water-cup ${i < cups ? 'filled' : ''}`}
              onClick={() => handleTap(i)}
              onMouseEnter={() => setTooltip(i)}
              onMouseLeave={() => setTooltip(null)}
              style={{ position: 'relative' }}
            >
              <FaTint />
              {tooltip === i && (
                <span className="dash-tooltip">
                  {t(`كوب ${i + 1}`, `Cup ${i + 1}`)}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="water-stat">
          <span className="water-num">{cups}/{goal}</span>
          <span className="water-label">{t('أكواب', 'cups')}</span>
          <div className="water-pct-bar">
            <div className="water-pct-fill" style={{ width: `${Math.min(pct, 100)}%` }} />
          </div>
          <span className="water-pct-text">{pct}%</span>
        </div>
      </div>

      {isDone && (
        <div className="water-done">
          <FaCheck /> {t('أكملت هدف اليوم!', 'Daily goal reached!')}
        </div>
      )}
    </div>
  );
};

export default WaterTracker;