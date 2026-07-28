import { useState } from 'react';
import { FaAward, FaLock, FaFire, FaTrophy, FaTint, FaMedal, FaBullseye, FaCamera } from 'react-icons/fa';
import { useProfileLanguage } from '../../../contexts/ProfileLanguageContext';

const BADGE_ICONS = {
  flame:    <FaFire />,
  trophy:   <FaTrophy />,
  droplet:  <FaTint />,
  award:    <FaMedal />,
  target:   <FaBullseye />,
  camera:   <FaCamera />,
};

const BadgesCard = ({ badges }) => {
  const { t, currentLang } = useProfileLanguage();
  const [tooltip, setTooltip] = useState(null);

  return (
    <div className="dash-card">
      <div className="dash-card-title">
        <FaAward />
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
              {b.earned ? (BADGE_ICONS[b.icon] || <FaTrophy />) : <FaLock />}
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

export default BadgesCard;