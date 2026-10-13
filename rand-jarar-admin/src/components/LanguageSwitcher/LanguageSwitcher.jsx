import React, { useState } from 'react';
import { Languages, Check } from 'lucide-react';
import { lang, setLang } from '../../i18n';
import './LanguageSwitcher.scss';

const OPTIONS = [
  { code: 'ar', short: 'ع', label: 'العربية' },
  { code: 'en', short: 'EN', label: 'English' },
];

/**
 * Language switcher.
 *  - variant="header": one prominent pill that switches to the other language.
 *  - variant="sidebar": a large segmented control showing both languages.
 */
const LanguageSwitcher = ({ variant = 'header' }) => {
  const [pending, setPending] = useState(null);

  const choose = (code) => {
    if (code === lang || pending) return;
    setPending(code);
    setLang(code);
  };

  if (variant === 'sidebar') {
    return (
      <div className="lang-seg" role="radiogroup" aria-label="Language / اللغة">
        <div className="lang-seg__head">
          <Languages size={15} />
          <span>اللغة · Language</span>
        </div>
        <div className={`lang-seg__track lang-seg__track--${pending || lang}`}>
          <span className="lang-seg__thumb" aria-hidden="true" />
          {OPTIONS.map((o) => {
            const active = (pending || lang) === o.code;
            return (
              <button
                key={o.code}
                type="button"
                role="radio"
                aria-checked={active}
                lang={o.code}
                className={`lang-seg__opt ${active ? 'lang-seg__opt--on' : ''}`}
                onClick={() => choose(o.code)}
              >
                <span className="lang-seg__badge">{o.short}</span>
                <span className="lang-seg__label">{o.label}</span>
                {active && <Check size={14} className="lang-seg__check" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const next = OPTIONS.find((o) => o.code !== lang);
  return (
    <button
      type="button"
      className={`lang-pill ${pending ? 'lang-pill--busy' : ''}`}
      onClick={() => choose(next.code)}
      lang={next.code}
      title={next.code === 'en' ? 'Switch to English' : 'التبديل إلى العربية'}
      aria-label={next.code === 'en' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      <span className="lang-pill__icon">
        <Languages size={17} />
      </span>
      <span className="lang-pill__label">{next.label}</span>
      <span className="lang-pill__badge">{next.short}</span>
    </button>
  );
};

export default LanguageSwitcher;
