import { motion } from 'framer-motion';
import { FaTrophy, FaFire, FaBolt } from 'react-icons/fa';
import { useProfileLanguage } from '../../../contexts/ProfileLanguageContext';

const AchievementsCard = ({ delay }) => {
  const { t } = useProfileLanguage();

  const achievements = [
    { icon: FaTrophy, textAr: 'أسبوع كامل', textEn: 'Full Week', unlocked: true },
    { icon: FaFire, textAr: '5 أيام متتالية', textEn: '5 Day Streak', unlocked: true },
    { icon: FaBolt, textAr: 'شهر كامل', textEn: 'Full Month', unlocked: false },
    { icon: FaTrophy, textAr: 'هدف مثالي', textEn: 'Perfect Goal', unlocked: false }
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
        <FaTrophy className="header-icon" />
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

export default AchievementsCard;