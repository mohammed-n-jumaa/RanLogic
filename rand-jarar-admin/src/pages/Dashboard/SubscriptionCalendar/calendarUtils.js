import { BACKEND_URL } from '../../../config';

export const DAY_MS = 24 * 60 * 60 * 1000;
export const SOON_DAYS = 7;

// "2026-10-24" or "2026-10-24T00:00:00Z" → local midnight (avoids timezone shifts)
export const parseDate = (value) => {
  if (!value) return null;
  const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
};

export const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const dayKey = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
export const sameDay = (a, b) => !!a && !!b && dayKey(a) === dayKey(b);
export const daysBetween = (from, to) => Math.round((startOfDay(to) - startOfDay(from)) / DAY_MS);

export const statusOf = (daysLeft) => {
  if (daysLeft === null || daysLeft === undefined) return 'none';
  if (daysLeft < 0) return 'expired';
  if (daysLeft <= SOON_DAYS) return 'soon';
  return 'active';
};

/** True when the trainee has a subscription that hasn't ended yet. */
export const isRunning = (c) => c.daysLeft !== null && c.daysLeft >= 0;

/**
 * All trainees, enriched with start/end Date objects and daysLeft.
 * Trainees without an end date keep end = null and daysLeft = null.
 */
export const enrichClients = (list = [], today = startOfDay(new Date())) =>
  list.map((c) => {
    const end = parseDate(c.subscription_end_date);
    return {
      ...c,
      end,
      start: parseDate(c.subscription_start_date),
      daysLeft: end ? daysBetween(today, end) : null,
    };
  });

/** Soonest-ending first; trainees without a subscription last. */
export const byUrgency = (a, b) => {
  if (a.daysLeft === null) return b.daysLeft === null ? 0 : 1;
  if (b.daysLeft === null) return -1;
  return a.daysLeft - b.daysLeft;
};

export const imageUrl = (path) => {
  if (!path || String(path).includes('default-avatar')) return null;
  return String(path).startsWith('http') ? path : `${BACKEND_URL}/storage/${path}`;
};

export const initials = (name = '') =>
  name.trim().split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '?';
