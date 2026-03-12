import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaClock, FaChevronDown, FaImage } from 'react-icons/fa';
import { useProfileLanguage } from '../../../contexts/ProfileLanguageContext';

const MealCard = ({ meal, index, isSelected, onToggle, dayNumber, onToggleMealItem }) => {
  const { t } = useProfileLanguage();

  const handleCheckToggle = (e) => {
    e.stopPropagation();
    // Toggle all items in this meal
    if (meal.fullMealData?.items) {
      meal.fullMealData.items.forEach(item => {
        onToggleMealItem(item.id);
      });
    }
  };

  const getMealTypeLabel = (type) => {
    const types = {
      'breakfast': { ar: 'إفطار', en: 'Breakfast' },
      'snack1': { ar: 'وجبة خفيفة 1', en: 'Snack 1' },
      'lunch': { ar: 'غداء', en: 'Lunch' },
      'snack2': { ar: 'وجبة خفيفة 2', en: 'Snack 2' },
      'dinner': { ar: 'عشاء', en: 'Dinner' }
    };
    const label = types[type] || { ar: type, en: type };
    return t(label.ar, label.en);
  };

  const mealImageUrl = meal.meal_image 
    ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/storage/${meal.meal_image}`
    : null;

  return (
    <motion.div
      className={`meal-card ${meal.checked ? 'checked' : ''} ${isSelected ? 'expanded' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="meal-header" onClick={onToggle}>
        <div className="meal-main">
          <button
            className={`check-btn ${meal.checked ? 'checked' : ''}`}
            onClick={handleCheckToggle}
          >
            {meal.checked && <FaCheckCircle />}
          </button>
          <div className="meal-info">
            <h4>{getMealTypeLabel(meal.name)}</h4>
            <span className="meal-time">
              <FaClock /> {meal.time}
            </span>
          </div>
        </div>
        <div className="meal-summary">
          <span className="calories">{meal.calories} {t('سعرة', 'kcal')}</span>
          <FaChevronDown
            className="expand-icon"
            style={{ transform: isSelected ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </div>
      </div>

      <AnimatePresence>
        {isSelected && (
          <motion.div
            className="meal-details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {mealImageUrl && (
              <div className="meal-image-container">
                <img src={mealImageUrl} alt={getMealTypeLabel(meal.name)} className="meal-image" />
              </div>
            )}

            <div className="macros-row">
              <div className="macro-item">
                <span className="macro-label">{t('البروتين', 'Protein')}</span>
                <span className="macro-value">{Math.round(meal.protein)}g</span>
              </div>
              <div className="macro-item">
                <span className="macro-label">{t('الكربوهيدرات', 'Carbs')}</span>
                <span className="macro-value">{Math.round(meal.carbs)}g</span>
              </div>
              <div className="macro-item">
                <span className="macro-label">{t('الدهون', 'Fats')}</span>
                <span className="macro-value">{Math.round(meal.fats)}g</span>
              </div>
            </div>

            <div className="meal-items">
              <h5>{t('المكونات:', 'Ingredients:')}</h5>
              <ul>
                {meal.items && meal.items.length > 0 ? (
                  meal.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))
                ) : (
                  <li>{t('لا توجد مكونات', 'No ingredients')}</li>
                )}
              </ul>
            </div>

            {meal.instructions && (
              <div className="meal-instructions">
                <h5>{t('تعليمات التحضير:', 'Preparation Instructions:')}</h5>
                <p>{meal.instructions}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MealCard;