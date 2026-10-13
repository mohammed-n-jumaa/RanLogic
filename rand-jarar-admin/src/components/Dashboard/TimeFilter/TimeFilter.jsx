import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import './TimeFilter.scss';
import { t } from '../../../i18n';

const TimeFilter = ({ value, onChange }) => {
  const options = [
    { value: 'this_week', label: t('هذا الأسبوع') },
    { value: 'this_month', label: t('هذا الشهر') },
    { value: 'last_3_months', label: t('آخر 3 أشهر') }
  ];

  return (
    <div className="time-filter">
      <div className="time-filter__header">
        <Calendar size={20} />
        <span>{t('الفترة الزمنية:')}</span>
      </div>
      
      <div className="time-filter__options">
        {options.map((option) => (
          <motion.button
            key={option.value}
            className={`time-filter__option ${value === option.value ? 'active' : ''}`}
            onClick={() => onChange(option.value)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {option.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default TimeFilter;