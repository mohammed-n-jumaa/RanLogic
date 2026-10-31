import React, { useState, useEffect, useRef } from 'react';
import { X, RotateCcw, SlidersHorizontal, Sparkles, CalendarDays, ListOrdered } from 'lucide-react';
import exerciseLibraryApi from '../../../api/exerciseLibraryApi';
import ExSheet from './ExSheet';
import Stepper from './Stepper';
import { relativeIso, DEFAULT_FILTERS } from './exerciseUtils';
import { t } from '../../../i18n';

const SORTS = [
  { value: 'newest', icon: Sparkles, label: () => t('الأحدث') },
  { value: 'date', icon: CalendarDays, label: () => t('حسب التاريخ') },
  { value: 'order', icon: ListOrdered, label: () => t('حسب الترتيب') },
];

const QUICK_DATES = [
  { offset: 0, label: () => t('اليوم') },
  { offset: -1, label: () => t('أمس') },
  { offset: 1, label: () => t('بكرة') },
];

const cleanParams = (params) => {
  const out = { ...params };
  Object.keys(out).forEach((k) => { if (out[k] === '' || out[k] === null || out[k] === undefined) delete out[k]; });
  return out;
};

// Mounted only while the sheet is open, so the draft starts from the applied filters
const FilterBody = ({ filters, search, onClose, onApply }) => {
  const [local, setLocal] = useState(filters);
  const [count, setCount] = useState(null);
  const [countBump, setCountBump] = useState(false);
  const reqId = useRef(0);

  // Live result count for the current draft (debounced, silent on errors)
  useEffect(() => {
    const id = ++reqId.current;
    const timer = setTimeout(async () => {
      try {
        const res = await exerciseLibraryApi.getAll(
          cleanParams({ ...local, search, page: 1, per_page: 1 }),
          { silent: true },
        );
        if (id !== reqId.current) return;
        const total = res.data?.data?.total;
        if (typeof total === 'number') {
          setCount(total);
          setCountBump(true);
          setTimeout(() => setCountBump(false), 250);
        }
      } catch {
        if (id === reqId.current) setCount(null);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [local, search]);

  const set = (key, value) => setLocal((prev) => ({ ...prev, [key]: value }));

  return (
    <>
      <div className="exs__head">
        <span className="exs__head-icon"><SlidersHorizontal size={18} /></span>
        <div>
          <h2 id="exf-title">{t('فلترة التمارين')}</h2>
          <p>{t('اختاري اللي بدك تشوفيه بس')}</p>
        </div>
        <button type="button" className="exs__close" onClick={onClose} aria-label={t('إغلاق')}><X size={18} /></button>
      </div>

      <div className="exs__body">
        <div className="exs-group">
          <div className="exs-group__label"><span><i>🔃</i> {t('الترتيب')}</span></div>
          <div className="exs-sort">
            {SORTS.map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                type="button"
                className={local.sort === value ? 'is-active' : ''}
                onClick={() => set('sort', value)}
              >
                <Icon size={20} />
                {label()}
              </button>
            ))}
          </div>
        </div>

        <div className="exs-group">
          <div className="exs-group__label">
            <span><i>📅</i> {t('تاريخ التمرين')}</span>
            {local.exercise_date && <button type="button" onClick={() => set('exercise_date', '')}>{t('مسح')}</button>}
          </div>
          <div className="exs-quick">
            {QUICK_DATES.map((q) => {
              const iso = relativeIso(q.offset);
              return (
                <button
                  key={q.offset}
                  type="button"
                  className={`exs-qchip ${local.exercise_date === iso ? 'is-active' : ''}`}
                  onClick={() => set('exercise_date', local.exercise_date === iso ? '' : iso)}
                >
                  {q.label()}
                </button>
              );
            })}
          </div>
          <input
            type="date"
            className="exs-input exs-input--date"
            value={local.exercise_date}
            onChange={(e) => set('exercise_date', e.target.value)}
            aria-label={t('تاريخ محدد')}
          />
        </div>

        <div className="exs-group">
          <div className="exs-group__label"><span><i>💪</i> {t('المجموعات والتكرارات')}</span></div>
          <div className="exs-steppers">
            <Stepper label={t('🧱 المجموعات')} value={local.sets} onChange={(v) => set('sets', v)} presets={[3, 4, 5]} max={100} allowEmpty />
            <Stepper label={t('🔁 التكرارات')} value={local.reps} onChange={(v) => set('reps', v)} presets={[8, 10, 12, 15]} allowEmpty />
          </div>
        </div>
      </div>

      <div className="exs__foot">
        <button type="button" className="exs-btn" onClick={() => setLocal(DEFAULT_FILTERS)}>
          <RotateCcw size={16} /> {t('إعادة تعيين')}
        </button>
        <button type="button" className="exs-btn exs-btn--brand exs-btn--grow exs-btn--shine" onClick={() => onApply(local)}>
          {t('عرض النتائج')}
          {count !== null && <b className={`exs-count ${countBump ? 'bump' : ''}`}>{count}</b>}
        </button>
      </div>
    </>
  );
};

const FilterSheet = ({ isOpen, onClose, ...rest }) => (
  <ExSheet isOpen={isOpen} onClose={onClose} size="sm" labelledBy="exf-title">
    <FilterBody onClose={onClose} {...rest} />
  </ExSheet>
);

export default FilterSheet;
