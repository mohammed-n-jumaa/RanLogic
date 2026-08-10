import { memo } from "react";
import { motion } from 'framer-motion';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';
import { Trophy, Flame, Zap } from 'lucide-react';

const AchievementsCard = ({ delay }) => {
  const { t } = useProfileLanguage();

  const achievements = [
    { icon: Trophy, textAr: 'أسبوع كامل', textEn: 'Full Week', unlocked: true },
    { icon: Flame, textAr: '5 أيام متتالية', textEn: '5 Day Streak', unlocked: true },
    { icon: Zap, textAr: 'شهر كامل', textEn: 'Full Month', unlocked: false },
    { icon: Trophy, textAr: 'هدف مثالي', textEn: 'Perfect Goal', unlocked: false }
  ];

  return (
    <motion.div
      className="achievements-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
    >
      <div className="card-header">
        <h3>{t('الإنجازات', 'Achievements')}</h3>
        <Trophy fill="currentColor" className="header-icon" />
      </div>

      <div className="achievements-grid">
        {achievements.map((achievement, index) => (
          <motion.div
            key={index}
            className={`achievement ${achievement.unlocked ? 'unlocked' : 'locked'}`}
            whileHover={achievement.unlocked ? { scale: 1.05 } : {}}
          >
            <achievement.icon />
            {t(achievement.textAr, achievement.textEn)}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default memo(AchievementsCard);