import { t, loc } from '../../../i18n';

const rtf = typeof Intl.RelativeTimeFormat === 'function'
  ? new Intl.RelativeTimeFormat(`${loc('ar')}-u-nu-latn`, { numeric: 'auto' })
  : null;

/** "منذ 3 ساعات" / "3 hours ago" */
export const timeAgo = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime()) || !rtf) return '';
  const minutes = Math.round((date - Date.now()) / 60000);
  if (Math.abs(minutes) < 1) return t('الآن');
  if (Math.abs(minutes) < 60) return rtf.format(minutes, 'minute');
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return rtf.format(hours, 'hour');
  return rtf.format(Math.round(hours / 24), 'day');
};
