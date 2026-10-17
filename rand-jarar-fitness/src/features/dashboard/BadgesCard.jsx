import { memo } from 'react';
import { Award, Lock, Flame, Trophy, Droplets, Medal, Target, Camera } from 'lucide-react';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';

const BADGE_ICONS = { flame: Flame, trophy: Trophy, droplet: Droplets, award: Medal, target: Target, camera: Camera };

const BadgesCard = ({ badges = [] }) => {
  const { t, currentLang } = useProfileLanguage();
  const earned = badges.filter(b => b.earned).length;

  return (
    <section className="pf-card">
      <div className="pf-card__head">
        <h3 className="pf-card__title"><span className="pf-card__icon"><Award /></span>{t('الشارات', 'Badges')}</h3>
        <span className="pf-card__sub pf-num">{earned} / {badges.length}</span>
      </div>
      <div className="db-badges">
        {badges.map(b => {
          const Icon = b.earned ? (BADGE_ICONS[b.icon] || Trophy) : Lock;
          const name = currentLang === 'ar' ? b.name_ar : b.name_en;
          return (
            <div key={b.key} className={`db-badge ${b.earned ? '' : 'is-locked'}`} title={b.earned ? t('مكتسبة ✓', 'Earned ✓') : t('لم تُكتسب بعد', 'Not earned yet')}>
              <span className="db-badge__icon"><Icon /></span>
              {name}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default memo(BadgesCard);
