import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, SlidersHorizontal } from 'lucide-react';
import './FilterSheet.scss';
import { t } from '../../../i18n';

const FilterSheet = ({ isOpen, filters, onClose, onApply, onReset }) => {
  const [local, setLocal] = useState(filters);

  // Sync with parent filters when opened
  useEffect(() => {
    if (isOpen) setLocal(filters);
  }, [isOpen, filters]);

  const set = (key, value) => setLocal((prev) => ({ ...prev, [key]: value }));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="filter-sheet__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className="filter-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            dir="rtl"
          >
            {/* Handle */}
            <div className="filter-sheet__handle" />

            {/* Header */}
            <div className="filter-sheet__header">
              <div className="filter-sheet__title">
                <SlidersHorizontal size={18} />
                <span>{t('الفلاتر')}</span>
              </div>
              <button className="filter-sheet__close" onClick={onClose}>
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="filter-sheet__body">

              {/* Date */}
              <div className="filter-sheet__field">
                <label className="filter-sheet__label">{t('📅 تاريخ التمرين')}</label>
                <input
                  type="date"
                  className="filter-sheet__input"
                  value={local.exercise_date}
                  onChange={(e) => set('exercise_date', e.target.value)}
                />
              </div>

              {/* Sets */}
              <div className="filter-sheet__field">
                <label className="filter-sheet__label">{t('🧱 عدد المجموعات')}</label>
                <input
                  type="number"
                  className="filter-sheet__input"
                  placeholder={t('مثال: 3')}
                  min={1}
                  max={100}
                  value={local.sets}
                  onChange={(e) => set('sets', e.target.value)}
                />
              </div>

              {/* Reps */}
              <div className="filter-sheet__field">
                <label className="filter-sheet__label">{t('🔁 عدد التكرارات')}</label>
                <input
                  type="number"
                  className="filter-sheet__input"
                  placeholder={t('مثال: 12')}
                  min={1}
                  max={1000}
                  value={local.reps}
                  onChange={(e) => set('reps', e.target.value)}
                />
              </div>

              {/* Sort */}
              <div className="filter-sheet__field">
                <label className="filter-sheet__label">{t('🔃 الترتيب')}</label>
                <div className="filter-sheet__radio-group">
                  {[
                    { value: 'newest', label: t('الأحدث أولاً') },
                    { value: 'date', label: t('حسب تاريخ التمرين') },
                    { value: 'order', label: t('حسب الترتيب') },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`filter-sheet__radio-chip ${local.sort === opt.value ? 'active' : ''}`}
                    >
                      <input
                        type="radio"
                        name="sort"
                        value={opt.value}
                        checked={local.sort === opt.value}
                        onChange={() => set('sort', opt.value)}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="filter-sheet__footer">
              <button className="filter-sheet__btn filter-sheet__btn--reset" onClick={onReset}>
                <RotateCcw size={14} />
                {t('إعادة تعيين')}
              </button>
              <button className="filter-sheet__btn filter-sheet__btn--apply" onClick={() => onApply(local)}>
                {t('تطبيق الفلاتر')}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterSheet;