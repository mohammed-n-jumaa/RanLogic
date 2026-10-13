// Lightweight i18n for the admin panel.
// Arabic source text is the translation key, so any string without an English
// entry simply falls back to Arabic. The language is read once at startup;
// switching language persists the choice and reloads the app so that module-level
// labels (sidebar, charts, alerts…) are re-evaluated in the new language.
import en from './en/index.js';

const STORAGE_KEY = 'admin_lang';
export const LANGUAGES = ['ar', 'en'];

const readLang = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'ar';
  } catch {
    return 'ar';
  }
};

export const lang = readLang();
export const isRTL = lang === 'ar';
export const dir = isRTL ? 'rtl' : 'ltr';

// Apply direction/lang to the document as early as possible
if (typeof document !== 'undefined') {
  document.documentElement.lang = lang;
  document.documentElement.dir = dir;
  document.documentElement.classList.toggle('lang-en', !isRTL);
  document.documentElement.classList.toggle('lang-ar', isRTL);
}

const lookup = (key) => {
  if (lang === 'ar' || typeof key !== 'string') return key;
  if (en[key] !== undefined) return en[key];
  // keep surrounding whitespace / punctuation-free variants working
  const m = key.match(/^(\s*)([\s\S]*?)(\s*)$/);
  if (en[m[2]] !== undefined) return m[1] + en[m[2]] + m[3];
  return key;
};

/**
 * Translate an Arabic source string.
 * Positional placeholders {0}, {1}… are replaced with the extra arguments.
 */
export function t(key, ...args) {
  const str = lookup(key);
  if (!args.length || typeof str !== 'string') return str;
  return str.replace(/\{(\d+)\}/g, (m, i) => (args[i] !== undefined && args[i] !== null ? args[i] : ''));
}

/** Locale for Intl/date formatting — keeps the original Arabic locale in Arabic mode. */
export const loc = (arLocale = 'ar-EG') => (lang === 'ar' ? arLocale : 'en-US');

export function setLang(next) {
  if (!LANGUAGES.includes(next) || next === lang) return;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* ignore */
  }
  document.documentElement.classList.add('lang-switching');
  setTimeout(() => window.location.reload(), 250);
}

export const toggleLang = () => setLang(lang === 'ar' ? 'en' : 'ar');
