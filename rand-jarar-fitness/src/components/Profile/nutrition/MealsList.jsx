import { motion } from 'framer-motion';
import { FaUtensils, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';
import { useProfileLanguage } from '../../../contexts/ProfileLanguageContext';
import MealCard from './MealCard';

const MealsList = ({ meals, selectedMeal, setSelectedMeal, dayNumber, onToggleMealItem }) => {
  const { t } = useProfileLanguage();

  // إذا لم يكن هناك وجبات، نعرض رسالة مميزة
  if (!meals || meals.length === 0) {
    return (
      <motion.div 
        className="meals-list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="no-meals-container">
          <motion.div 
            className="no-meals-animation"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.6,
              type: "spring",
              stiffness: 100
            }}
          >
            <div className="plate-container">
              <motion.div 
                className="plate"
                animate={{ 
                  rotate: [0, -5, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <div className="plate-inner"></div>
                <motion.div 
                  className="fork left"
                  animate={{ x: [-2, 0, -2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                ></motion.div>
                <motion.div 
                  className="knife right"
                  animate={{ x: [2, 0, 2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                ></motion.div>
              </motion.div>
              <motion.div 
                className="empty-icon"
                animate={{ 
                  y: [0, -10, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <FaUtensils />
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            className="no-meals-content"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h3>{t('لا توجد وجبات لهذا اليوم', 'No Meals for This Day')}</h3>
            <p>{t('لم يتم تحديد أي وجبات لهذا اليوم بعد. يرجى اختيار يوم آخر أو التحقق من خطة التغذية الخاصة بك.', 'No meals have been set for this day yet. Please select another day or check your nutrition plan.')}</p>
            
            <div className="no-meals-suggestions">
              <motion.div 
                className="suggestion-item"
                whileHover={{ scale: 1.05, x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaCalendarAlt />
                <span>{t('جرب يوماً آخر', 'Try another day')}</span>
              </motion.div>
              <motion.div 
                className="suggestion-item"
                whileHover={{ scale: 1.05, x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaInfoCircle />
                <span>{t('تواصل مع مدربك', 'Contact your trainer')}</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="meals-list">
      {meals.map((meal, index) => (
        <MealCard
          key={meal.id}
          meal={meal}
          index={index}
          isSelected={selectedMeal === meal.id}
          onToggle={() => setSelectedMeal(selectedMeal === meal.id ? null : meal.id)}
          dayNumber={dayNumber}
          onToggleMealItem={onToggleMealItem}
        />
      ))}
    </div>
  );
};

export default MealsList;