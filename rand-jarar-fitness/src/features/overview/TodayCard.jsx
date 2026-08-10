import { memo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';
import profileApi from '../../api/profileApi';
import { Zap, Flame, Apple, Dumbbell } from 'lucide-react';

const TodayCard = ({ delay }) => {
  const { t } = useProfileLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayStats();
  }, []);

  const fetchTodayStats = async () => {
    try {
      setLoading(true);
      const response = await profileApi.getTodayStats();
      
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching today stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const todayStats = [
    { 
      icon: Flame, 
      labelAr: 'السعرات', 
      labelEn: 'Calories', 
      value: loading ? '--' : `${stats?.nutrition?.completed_items || 0} / ${stats?.nutrition?.total_items || 0}`,
      type: 'calories' 
    },
    { 
      icon: Apple, 
      labelAr: 'الوجبات', 
      labelEn: 'Meals', 
      value: loading ? '--' : `${stats?.nutrition?.completed_items || 0} / ${stats?.nutrition?.total_items || 0}`,
      type: 'meals' 
    },
    { 
      icon: Dumbbell, 
      labelAr: 'التمارين', 
      labelEn: 'Workouts', 
      value: loading ? '--' : `${stats?.workout?.completed_exercises || 0} / ${stats?.workout?.total_exercises || 0}`,
      type: 'workout' 
    }
  ];

  return (
    <motion.div
      className="today-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
    >
      <div className="card-header">
        <h3>{t('ملخص اليوم', "Today's Summary")}</h3>
        <Zap fill="currentColor" className="header-icon" />
      </div>

      <div className="today-stats">
        {todayStats.map((stat, index) => (
          <motion.div
            key={index}
            className="today-item"
            whileHover={{ scale: 1.02 }}
          >
            <div className={`today-icon ${stat.type}`}>
              <stat.icon />
            </div>
            <div className="today-info">
              <span className="today-value">{stat.value}</span>
              <span className="today-label">{t(stat.labelAr, stat.labelEn)}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default memo(TodayCard);