import { motion } from 'framer-motion';
import { FaFire, FaDumbbell, FaAppleAlt, FaBolt } from 'react-icons/fa';
import { useProfileLanguage } from '../../../contexts/ProfileLanguageContext';

const MacrosSummary = ({ macros }) => {
  const { t } = useProfileLanguage();

  const macroCards = [
    { icon: FaFire, labelAr: 'السعرات', labelEn: 'Calories', value: macros.totalCalories || 0, type: 'calories' },
    { icon: FaDumbbell, labelAr: 'البروتين', labelEn: 'Protein', value: `${Math.round(macros.protein || 0)}g`, type: 'protein' },
    { icon: FaAppleAlt, labelAr: 'الكربوهيدرات', labelEn: 'Carbs', value: `${Math.round(macros.carbs || 0)}g`, type: 'carbs' },
    { icon: FaBolt, labelAr: 'الدهون', labelEn: 'Fats', value: `${Math.round(macros.fats || 0)}g`, type: 'fats' }
  ];

  return (
    <div className="macros-summary">
      {macroCards.map((macro, index) => (
        <motion.div
          key={index}
          className="macro-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className={`macro-icon ${macro.type}`}>
            <macro.icon />
          </div>
          <div className="macro-info">
            <div className="macro-value">{macro.value}</div>
            <div className="macro-label">{t(macro.labelAr, macro.labelEn)}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MacrosSummary;