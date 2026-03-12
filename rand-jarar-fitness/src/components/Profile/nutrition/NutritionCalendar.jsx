import { motion } from 'framer-motion';
import { FaFire, FaDumbbell, FaAppleAlt, FaBolt, FaEye, FaCalendarDay, FaStar } from 'react-icons/fa';
import { useProfileLanguage } from '../../../contexts/ProfileLanguageContext';

const NutritionCalendar = ({ days, selectedDay, setSelectedDay, setViewMode }) => {
  const { t } = useProfileLanguage();

  const getCurrentDayOfMonth = () => {
    const today = new Date();
    return today.getDate();
  };

  const currentDayNumber = getCurrentDayOfMonth();

  const handleViewDay = (dayNumber) => {
    setSelectedDay(dayNumber);
    setViewMode('daily');
  };

  console.log('🔍 Current day number:', currentDayNumber);
  console.log('🔍 Days array:', days);

  return (
    <div className="nutrition-calendar">
      <div className="calendar-header">
        <h3>{t('نظرة عامة على التغذية لـ 10 أيام', '10-Day Nutrition Overview')}</h3>
        <p>{t('انقر على أي يوم لعرض خطة الوجبات التفصيلية', 'Click on any day to view detailed meal plan')}</p>
      </div>

      <div className="calendar-grid">
        {days.map((day, index) => {
          const isSelected = selectedDay === index + 1;
          const isToday = day.day === currentDayNumber;

          console.log(`Day ${day.day}: isToday = ${isToday}, currentDayNumber = ${currentDayNumber}`);

          return (
            <motion.div
              key={day.day}
              className={`calendar-day-card ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Today Badge في أعلى الكارد */}
              {isToday && (
                <motion.div 
                  className="today-badge"
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 500,
                    delay: 0.3 
                  }}
                >
                  <FaStar className="star-icon" />
                  <span>{t('اليوم', 'Today')}</span>
                </motion.div>
              )}

              <div className="day-header">
                <div className="day-number-badge">
                  {isToday && (
                    <motion.span 
                      className="today-indicator"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
                    >
                      <FaCalendarDay />
                    </motion.span>
                  )}
                  {t('يوم', 'Day')} {day.day}
                </div>
                <div className="day-date">{day.date}</div>
              </div>

              <div className="day-macros-grid">
                <div className="macro-mini calories">
                  <FaFire />
                  <div className="macro-mini-info">
                    <span className="macro-mini-value">{day.totalCalories}</span>
                    <span className="macro-mini-label">{t('سعرة', 'kcal')}</span>
                  </div>
                </div>

                <div className="macro-mini protein">
                  <FaDumbbell />
                  <div className="macro-mini-info">
                    <span className="macro-mini-value">{Math.round(day.protein)}g</span>
                    <span className="macro-mini-label">{t('بروتين', 'Protein')}</span>
                  </div>
                </div>

                <div className="macro-mini carbs">
                  <FaAppleAlt />
                  <div className="macro-mini-info">
                    <span className="macro-mini-value">{Math.round(day.carbs)}g</span>
                    <span className="macro-mini-label">{t('كربوهيدرات', 'Carbs')}</span>
                  </div>
                </div>

                <div className="macro-mini fats">
                  <FaBolt />
                  <div className="macro-mini-info">
                    <span className="macro-mini-value">{Math.round(day.fats)}g</span>
                    <span className="macro-mini-label">{t('دهون', 'Fats')}</span>
                  </div>
                </div>
              </div>

              <div className="day-meals-summary">
                <h5>{t('الوجبات', 'Meals')} ({day.meals.length})</h5>
                <ul>
                  {day.meals.slice(0, 3).map((meal, mealIndex) => (
                    <li key={mealIndex}>
                      <span className="meal-name">{meal.name}</span>
                      <span className="meal-calories">{meal.calories} {t('سعرة', 'kcal')}</span>
                    </li>
                  ))}
                  {day.meals.length > 3 && (
                    <li className="more-meals">+{day.meals.length - 3} {t('وجبات أخرى', 'more meals')}</li>
                  )}
                </ul>
              </div>

              <button
                className="view-day-btn"
                onClick={() => handleViewDay(index + 1)}
              >
                <FaEye />
                <span>{t('عرض اليوم الكامل', 'View Full Day')}</span>
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default NutritionCalendar;