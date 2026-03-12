import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import './TimeFilter.scss';

const TimeFilter = ({ value, onChange }) => {
  const options = [
    { value: 'this_week', label: 'هذا الأسبوع' },
    { value: 'this_month', label: 'هذا الشهر' },
    { value: 'last_3_months', label: 'آخر 3 أشهر' }
  ];

  return (
    <div className="time-filter">
      <div className="time-filter__header">
        <Calendar size={20} />
        <span>الفترة الزمنية:</span>
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