import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity,
  TrendingUp,
  Dumbbell,
  Apple,
  Calendar,
  Award,
  Flame,
  Loader
} from 'lucide-react';
import trainingApi from '../../../api/trainingApi';
import './ProgressTracker.scss';

const ProgressTracker = ({ clientId, year, month }) => {
  const [progressData, setProgressData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchProgressStats();
  }, [clientId, year, month]);
  
  const fetchProgressStats = async () => {
    setIsLoading(true);
    try {
      const response = await trainingApi.getProgress(clientId, year, month);
      
      if (response.data.success) {
        setProgressData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getAchievements = () => {
    if (!progressData) return [];
    
    const achievements = [];
    const { nutrition, workout } = progressData;
    
    if (workout.completed_exercises >= 10) {
      achievements.push({
        id: 1,
        title: 'محارب مبتدئ',
        description: `أكمل ${workout.completed_exercises} تمرين`,
        icon: '💪',
        color: '#4caf50'
      });
    }
    
    if (nutrition.completed_items >= 20) {
      achievements.push({
        id: 2,
        title: 'خبير تغذية',
        description: `أكمل ${nutrition.completed_items} وجبة صحية`,
        icon: '🥗',
        color: '#ff9800'
      });
    }
    
    if (workout.completion_percentage === 100) {
      achievements.push({
        id: 3,
        title: 'البطل الشهري',
        description: 'أكمل جميع التمارين الشهرية',
        icon: '🏆',
        color: '#e91e63'
      });
    }
    
    if (nutrition.completion_percentage === 100) {
      achievements.push({
        id: 4,
        title: 'نظام متكامل',
        description: 'التزم بالنظام الغذائي بالكامل',
        icon: '⭐',
        color: '#2196f3'
      });
    }
    
    if (workout.completion_percentage >= 80 && nutrition.completion_percentage >= 80) {
      achievements.push({
        id: 5,
        title: 'الشهر الذهبي',
        description: 'التزام ممتاز بالبرنامج',
        icon: '🌟',
        color: '#ffc107'
      });
    }
    
    return achievements;
  };
  
  if (isLoading) {
    return (
      <div className="progress-tracker">
        <div className="progress-tracker__loading">
          <Loader size={48} className="spinner" />
          <p>جاري تحميل الإحصائيات...</p>
        </div>
      </div>
    );
  }
  
  if (!progressData) {
    return (
      <div className="progress-tracker">
        <div className="progress-tracker__error">
          <h3>لا توجد بيانات متاحة</h3>
        </div>
      </div>
    );
  }
  
  const achievements = getAchievements();
  const overallProgress = Math.round(
    (progressData.nutrition.completion_percentage + progressData.workout.completion_percentage) / 2
  );
  
  return (
    <div className="progress-tracker">
      <div className="progress-tracker__header">
        <h2 className="progress-tracker__title">
          <Activity size={24} />
          التقدم والإنجازات
        </h2>
      </div>
      
      {/* Overall Progress */}
      <motion.div
        className="weekly-overview-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="weekly-overview-card__title">نظرة عامة على الشهر</h3>
        
        <div className="weekly-overview-card__progress">
          <div className="weekly-overview-card__progress-header">
            <span>التقدم الإجمالي</span>
            <span className="weekly-overview-card__percentage">{overallProgress}%</span>
          </div>
          <div className="weekly-overview-card__progress-bar">
            <motion.div
              className="weekly-overview-card__progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
        </div>
        
        <div className="weekly-overview-card__stats">
          <div className="weekly-stat">
            <div className="weekly-stat__icon weekly-stat__icon--workout">
              <Dumbbell size={24} />
            </div>
            <div className="weekly-stat__content">
              <span className="weekly-stat__value">
                {progressData.workout.completed_exercises}/{progressData.workout.total_exercises}
              </span>
              <span className="weekly-stat__label">تمارين مكتملة</span>
            </div>
          </div>
          
          <div className="weekly-stat">
            <div className="weekly-stat__icon weekly-stat__icon--nutrition">
              <Apple size={24} />
            </div>
            <div className="weekly-stat__content">
              <span className="weekly-stat__value">
                {progressData.nutrition.completed_items}/{progressData.nutrition.total_items}
              </span>
              <span className="weekly-stat__label">وجبات مكتملة</span>
            </div>
          </div>
          
          <div className="weekly-stat">
            <div className="weekly-stat__icon weekly-stat__icon--calories">
              <Flame size={24} />
            </div>
            <div className="weekly-stat__content">
              <span className="weekly-stat__value">
                {Math.round(progressData.nutrition.total_calories / new Date(year, month, 0).getDate())}
              </span>
              <span className="weekly-stat__label">متوسط السعرات/يوم</span>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Progress Details */}
      <motion.div
        className="progress-details"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="progress-card">
          <div className="progress-card__header">
            <Dumbbell size={20} />
            <h3>البرنامج التدريبي</h3>
          </div>
          <div className="progress-card__content">
            <div className="progress-ring">
              <svg viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="var(--bg-hover)"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e91e63"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                  animate={{ 
                    strokeDashoffset: 2 * Math.PI * 45 * (1 - progressData.workout.completion_percentage / 100)
                  }}
                  transition={{ duration: 1, delay: 0.5 }}
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
              </svg>
              <div className="progress-ring__text">
                {progressData.workout.completion_percentage}%
              </div>
            </div>
            <div className="progress-card__stats">
              <div className="stat-item">
                <span className="stat-item__label">إجمالي التمارين</span>
                <span className="stat-item__value">{progressData.workout.total_exercises}</span>
              </div>
              <div className="stat-item">
                <span className="stat-item__label">المكتملة</span>
                <span className="stat-item__value">{progressData.workout.completed_exercises}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="progress-card">
          <div className="progress-card__header">
            <Apple size={20} />
            <h3>النظام الغذائي</h3>
          </div>
          <div className="progress-card__content">
            <div className="progress-ring">
              <svg viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="var(--bg-hover)"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#4caf50"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                  animate={{ 
                    strokeDashoffset: 2 * Math.PI * 45 * (1 - progressData.nutrition.completion_percentage / 100)
                  }}
                  transition={{ duration: 1, delay: 0.5 }}
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
              </svg>
              <div className="progress-ring__text">
                {progressData.nutrition.completion_percentage}%
              </div>
            </div>
            <div className="progress-card__stats">
              <div className="stat-item">
                <span className="stat-item__label">إجمالي العناصر</span>
                <span className="stat-item__value">{progressData.nutrition.total_items}</span>
              </div>
              <div className="stat-item">
                <span className="stat-item__label">المكتملة</span>
                <span className="stat-item__value">{progressData.nutrition.completed_items}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Achievements */}
      {achievements.length > 0 && (
        <motion.div
          className="achievements-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="achievements-section__title">
            <Award size={24} />
            الإنجازات المحققة
          </h3>
          
          <div className="achievements-grid">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                className="achievement-card"
                style={{ '--achievement-color': achievement.color }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <div className="achievement-card__icon">{achievement.icon}</div>
                <h4 className="achievement-card__title">{achievement.title}</h4>
                <p className="achievement-card__description">{achievement.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProgressTracker;