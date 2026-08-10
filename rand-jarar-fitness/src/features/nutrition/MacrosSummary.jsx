import { memo } from "react";
import { motion } from 'framer-motion';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';
import { Flame, Dumbbell, Apple, Zap } from 'lucide-react';

const MacrosSummary = ({ macros }) => {
  const { t } = useProfileLanguage();

  const macroCards = [
    { icon: Flame, labelAr: 'السعرات', labelEn: 'Calories', value: macros.totalCalories || 0, type: 'calories' },
    { icon: Dumbbell, labelAr: 'البروتين', labelEn: 'Protein', value: `${Math.round(macros.protein || 0)}g`, type: 'protein' },
    { icon: Apple, labelAr: 'الكربوهيدرات', labelEn: 'Carbs', value: `${Math.round(macros.carbs || 0)}g`, type: 'carbs' },
    { icon: Zap, labelAr: 'الدهون', labelEn: 'Fats', value: `${Math.round(macros.fats || 0)}g`, type: 'fats' }
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

export default memo(MacrosSummary);