import React from 'react';
import { t } from '../../../i18n';

/**
 * Number picker with +/− and quick presets.
 * `allowEmpty` lets the value be '' (shown as "الكل"), used by the filters.
 */
const Stepper = ({ label, value, onChange, presets = [], min = 1, max = 1000, allowEmpty = false, onClear }) => {
  const num = Number(value) || 0;
  const step = (delta) => {
    const next = num + delta;
    if (allowEmpty && next < min) { onChange(''); return; }
    onChange(String(Math.min(max, Math.max(min, next || min))));
  };
  const isEmpty = value === '' || value === null || value === undefined;

  return (
    <div className={`exs-stepper ${!isEmpty ? 'has-value' : ''}`}>
      <div className="exs-stepper__title">
        <span>{label}</span>
        {allowEmpty && !isEmpty && <button type="button" onClick={onClear || (() => onChange(''))}>{t('مسح')}</button>}
      </div>
      <div className="exs-stepper__row">
        <button type="button" onClick={() => step(1)} aria-label={t('زيادة')}>+</button>
        <span key={String(value)} className={`exs-stepper__val ${isEmpty ? 'is-empty' : 'bump'}`}>
          {isEmpty ? t('الكل') : value}
        </span>
        <button type="button" onClick={() => step(-1)} aria-label={t('إنقاص')}>−</button>
      </div>
      {presets.length > 0 && (
        <div className="exs-stepper__presets">
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              className={String(value) === String(p) ? 'is-active' : ''}
              onClick={() => onChange(allowEmpty && String(value) === String(p) ? '' : String(p))}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Stepper;
