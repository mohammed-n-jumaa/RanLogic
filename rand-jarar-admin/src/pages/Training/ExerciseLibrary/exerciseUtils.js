import { t } from '../../../i18n';

export const DEFAULT_FILTERS = { exercise_date: '', sets: '', reps: '', sort: 'newest' };

export const getYoutubeId = (url) => {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  );
  return match ? match[1] : null;
};

export const youtubeThumb = (url) => {
  const id = getYoutubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
};

export const youtubeEmbed = (url) => {
  const id = getYoutubeId(url);
  return id ? `https://www.youtube.com/embed/${id}?rel=0` : null;
};

// "2026-04-30T00:00:00Z" → "2026-04-30"
export const formatDate = (value) => (value ? String(value).split('T')[0] : '');

const DAY_NAMES = () => [t('الأحد'), t('الإثنين'), t('الثلاثاء'), t('الأربعاء'), t('الخميس'), t('الجمعة'), t('السبت')];

export const dayName = (value) => {
  const d = formatDate(value);
  if (!d) return '';
  return DAY_NAMES()[new Date(`${d}T12:00:00`).getDay()]; // noon avoids timezone day-shift
};

// "2026-04-30" → "04/30"
export const shortDate = (value) => formatDate(value).slice(5).replace('-', '/');

export const initials = (name = '') =>
  name.trim().split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '?';

// Stable gradient per exercise for cards without a thumbnail
const ART = [
  ['#e91e63', '#9c27b0'], ['#6366f1', '#8b5cf6'], ['#f59e0b', '#f97316'], ['#10b981', '#14b8a6'],
  ['#ec4899', '#f43f5e'], ['#3b82f6', '#6366f1'], ['#a855f7', '#ec4899'],
];
export const artFor = (id = 0) => {
  const [a, b] = ART[Math.abs(Number(id) || 0) % ART.length];
  return `radial-gradient(circle at 30% 20%, ${a}, ${b})`;
};

export const toIsoDate = (date) => {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const relativeIso = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return toIsoDate(d);
};
