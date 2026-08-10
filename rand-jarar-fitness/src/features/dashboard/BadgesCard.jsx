import { memo, useState } from 'react';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';
import { Award, Lock, Flame, Trophy, Droplets, Medal, Target, Camera } from 'lucide-react';

const BADGE_ICONS = {
  flame:    <Flame fill="currentColor" />,
  trophy:   <Trophy fill="currentColor" />,
  droplet:  <Droplets fill="currentColor" />,
  award:    <Medal fill="currentColor" />,
  target:   <Target />,
  camera:   <Camera />,
};

const BadgesCard = ({ badges }) => {
  const { t, currentLang } = useProfileLanguage();
  const [tooltip, setTooltip] = useState(null);

  return (
    <div className="dash-card">
      <div className="dash-card-title">
        <Award fill="currentColor" />
        <span>{t('الشارات', 'Badges')}</span>
      </div>

      <div className="badges-grid">
        {badges.map((b, i) => (
          <div
            key={b.key}
            className={`badge-item ${b.earned ? 'earned' : 'locked'}`}
            onMouseEnter={() => setTooltip(i)}
            onMouseLeave={() => setTooltip(null)}
            style={{ position: 'relative' }}
          >
            <div className="badge-icon">
              {b.earned ? (BADGE_ICONS[b.icon] || <Trophy fill="currentColor" />) : <Lock />}
            </div>
            <span className="badge-name">
              {currentLang === 'ar' ? b.name_ar : b.name_en}
            </span>
            {tooltip === i && (
              <span className="dash-tooltip">
                {b.earned
                  ? t('مكتسبة ✓', 'Earned ✓')
                  : t('لم تُكتسب بعد', 'Not earned yet')}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(BadgesCard);