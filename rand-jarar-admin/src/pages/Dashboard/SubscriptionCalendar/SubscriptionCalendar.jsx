import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Dumbbell, FileText, MessageCircle, Search, X,
  Phone, CheckCircle2, XCircle, Loader2, RefreshCw, ChevronDown, Users,
} from 'lucide-react';
import trainingApi from '../../../api/trainingApi';
import { t, loc, isRTL } from '../../../i18n';
import {
  startOfDay, dayKey, sameDay, daysBetween, statusOf, imageUrl, initials, byUrgency,
} from './calendarUtils';
import './SubscriptionCalendar.scss';

// Western digits in both languages keep the grid easy to scan
const LOCALE = `${loc('ar-EG')}-u-nu-latn`;
const fmtMonth = new Intl.DateTimeFormat(LOCALE, { month: 'long', year: 'numeric' });
const fmtDay = new Intl.DateTimeFormat(LOCALE, { weekday: 'long', day: 'numeric', month: 'long' });
const fmtShort = new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'short' });
const fmtWeekday = new Intl.DateTimeFormat(LOCALE, { weekday: 'short' });

// Arabic week starts on Saturday, English on Sunday
const WEEK_START = isRTL ? 6 : 0;
const WEEKDAYS = Array.from({ length: 7 }, (_, i) => fmtWeekday.format(new Date(2026, 0, 4 + ((WEEK_START + i) % 7)))); // 4 Jan 2026 is a Sunday

const weekStartOf = (d) => {
  const offset = (d.getDay() - WEEK_START + 7) % 7;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() - offset);
};

const daysLeftLabel = (daysLeft) => {
  if (daysLeft === null) return t('بدون اشتراك');
  if (daysLeft < 0) return t('انتهى منذ {0} يوم', Math.abs(daysLeft));
  if (daysLeft === 0) return t('ينتهي اليوم');
  if (daysLeft === 1) return t('ينتهي غداً');
  return t('باقي {0} يوم', daysLeft);
};

const isPhone = () => typeof window !== 'undefined' && window.matchMedia?.('(max-width: 767px)').matches;

const FILTERS = [
  { id: 'all', label: () => t('الكل') },
  { id: 'soon', label: () => t('ينتهي خلال 7 أيام') },
  { id: 'active', label: () => t('أكثر من أسبوع') },
];

const Avatar = ({ client, size = 32 }) => {
  const [broken, setBroken] = useState(false);
  const src = imageUrl(client.avatar);
  return (
    <span className="sc-avatar" style={{ width: size, height: size }}>
      {src && !broken
        ? <img src={src} alt="" loading="lazy" onError={() => setBroken(true)} />
        : <span>{initials(client.name)}</span>}
    </span>
  );
};

// Small info card for one trainee; plan status is fetched only when opened
const ClientRow = ({ client, today, isOpen, onToggle, details, onLoadDetails }) => {
  const navigate = useNavigate();
  const status = statusOf(client.daysLeft);

  useEffect(() => {
    if (isOpen && !details) onLoadDetails(client.id);
  }, [isOpen, details, client.id, onLoadDetails]);

  const hasRange = client.start && client.end;
  const total = hasRange ? Math.max(daysBetween(client.start, client.end), 1) : null;
  const used = hasRange ? Math.min(Math.max(daysBetween(client.start, today), 0), total) : null;
  const pct = total ? Math.round((used / total) * 100) : null;
  const ready = details && !details.loading && !details.error;

  const go = (tab) => navigate(`/training/client/${client.id}${tab ? `?tab=${tab}` : ''}`);

  return (
    <div className={`sc-client sc-client--${status} ${isOpen ? 'is-open' : ''}`}>
      <button type="button" className="sc-client__head" onClick={onToggle} aria-expanded={isOpen}>
        <span className="sc-client__ava"><Avatar client={client} size={38} /></span>
        <span className="sc-client__main">
          <strong>{client.name}</strong>
          <small>
            {client.program || t('بدون برنامج')}
            {client.end && <> · {fmtShort.format(client.end)}</>}
          </small>
        </span>
        <span className={`sc-badge sc-badge--${status}`}>{daysLeftLabel(client.daysLeft)}</span>
        <ChevronDown size={16} className="sc-client__chev" />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="sc-client__body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <div className="sc-client__inner">
              {pct !== null && (
                <div className="sc-progress">
                  <div className="sc-progress__labels">
                    <span>{fmtShort.format(client.start)}</span>
                    <span>{pct}%</span>
                    <span>{fmtShort.format(client.end)}</span>
                  </div>
                  <div className="sc-progress__track">
                    <div className="sc-progress__fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )}

              {client.phone && (
                <a className="sc-client__phone" href={`tel:${client.phone}`} dir="ltr">
                  <Phone size={13} /> {client.phone}
                </a>
              )}

              <div className="sc-checks">
                {!details || details.loading ? (
                  <span className="sc-checks__loading"><Loader2 size={14} className="ds-spin" /> {t('جاري التحقق من الخطط...')}</span>
                ) : details.error ? (
                  <span className="sc-checks__loading">{t('تعذر تحميل حالة الخطط')}</span>
                ) : (
                  <>
                    <span className={`sc-check ${details.hasWorkout ? 'ok' : 'missing'}`}>
                      {details.hasWorkout ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                      {details.hasWorkout ? t('خطة تمارين هذا الشهر') : t('لا توجد تمارين هذا الشهر')}
                    </span>
                    <span className={`sc-check ${details.hasPdf ? 'ok' : 'missing'}`}>
                      {details.hasPdf ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                      {details.hasPdf ? t('PDF التغذية مرفوع') : t('لا يوجد PDF تغذية')}
                    </span>
                  </>
                )}
              </div>

              <div className="sc-actions">
                <button type="button" className={`sc-action ${ready && !details.hasWorkout ? 'sc-action--hot' : ''}`} onClick={() => go('workout')}>
                  <Dumbbell size={14} /> {ready && !details.hasWorkout ? t('إضافة تمارين') : t('التمارين')}
                </button>
                <button type="button" className={`sc-action ${ready && !details.hasPdf ? 'sc-action--hot' : ''}`} onClick={() => go('nutrition')}>
                  <FileText size={14} /> {ready && !details.hasPdf ? t('رفع PDF التغذية') : t('التغذية')}
                </button>
                <button type="button" className="sc-action sc-action--icon" onClick={() => navigate(`/chat/${client.id}`)} aria-label={t('محادثة')} title={t('محادثة')}>
                  <MessageCircle size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Subscription end dates on a calendar, plus the full trainee list.
 * Week view (default on phones) or month view; trainees come from the dashboard.
 */
const SubscriptionCalendar = ({ clients = [], loading = false, failed = false, onRetry }) => {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [view, setView] = useState(() => (isPhone() ? 'week' : 'month'));
  const [anchor, setAnchor] = useState(today); // any day inside the visible week / month
  const [selected, setSelected] = useState(null); // null = show every trainee
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState(null);
  const [details, setDetails] = useState({});

  const loadDetails = useCallback(async (id) => {
    setDetails((prev) => ({ ...prev, [id]: { loading: true } }));
    try {
      const response = await trainingApi.getTraineeDetails(id, today.getFullYear(), today.getMonth() + 1);
      const data = response.data?.data || {};
      setDetails((prev) => ({
        ...prev,
        [id]: {
          hasWorkout: !!(data.workout_plan && (data.workout_plan.exercises?.length ?? 1) > 0),
          hasPdf: !!data.nutrition_plan?.pdf_file,
        },
      }));
    } catch {
      setDetails((prev) => ({ ...prev, [id]: { error: true } }));
    }
  }, [today]);

  // trainees grouped by their end date
  const byDay = useMemo(() => {
    const map = new Map();
    clients.forEach((c) => {
      if (!c.end) return;
      const key = dayKey(c.end);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(c);
    });
    return map;
  }, [clients]);

  const cells = useMemo(() => {
    if (view === 'week') {
      const first = weekStartOf(anchor);
      return Array.from({ length: 7 }, (_, i) => new Date(first.getFullYear(), first.getMonth(), first.getDate() + i));
    }
    const monthStart = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
    const first = weekStartOf(monthStart);
    return Array.from({ length: 42 }, (_, i) => new Date(first.getFullYear(), first.getMonth(), first.getDate() + i));
  }, [view, anchor]);

  const counts = useMemo(() => {
    const c = { all: clients.length, expired: 0, soon: 0, active: 0 };
    clients.forEach((x) => { const s = statusOf(x.daysLeft); if (c[s] !== undefined) c[s] += 1; });
    return c;
  }, [clients]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = selected ? byDay.get(dayKey(selected)) || [] : clients;
    return base
      .filter((c) => selected || filter === 'all' || statusOf(c.daysLeft) === filter)
      .filter((c) => !q || c.name?.toLowerCase().includes(q) || c.phone?.includes(q))
      .slice()
      .sort(byUrgency);
  }, [clients, byDay, selected, filter, query]);

  const shift = (delta) => setAnchor((a) => (view === 'week'
    ? new Date(a.getFullYear(), a.getMonth(), a.getDate() + delta * 7)
    : new Date(a.getFullYear(), a.getMonth() + delta, 1)));

  const goToday = () => {
    setAnchor(today);
    setSelected(today);
    setOpenId(null);
  };

  const pick = (d) => {
    setOpenId(null);
    setSelected((cur) => (sameDay(cur, d) ? null : d)); // tap again to go back to everyone
    if (view === 'month' && d.getMonth() !== anchor.getMonth()) setAnchor(d);
  };

  const showAll = () => { setSelected(null); setOpenId(null); };

  const title = view === 'week'
    ? `${fmtShort.format(cells[0])} – ${fmtShort.format(cells[6])}`
    : fmtMonth.format(anchor);

  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <div className="ds-glass sc">
      <div className="sc-body">
        {/* Calendar */}
        <div className="sc-cal">
          <div className="sc-cal__nav">
            <button type="button" className="sc-nav-btn" onClick={() => shift(-1)} aria-label={t('السابق')}><PrevIcon size={16} /></button>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={title}
                className="sc-cal__month"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.15 }}
              >
                {title}
              </motion.span>
            </AnimatePresence>
            <button type="button" className="sc-nav-btn" onClick={() => shift(1)} aria-label={t('التالي')}><NextIcon size={16} /></button>
          </div>

          <div className="sc-cal__tools">
            <div className="sc-view" role="tablist" aria-label={t('طريقة العرض')}>
              <button type="button" role="tab" aria-selected={view === 'week'} className={view === 'week' ? 'is-active' : ''} onClick={() => setView('week')}>{t('أسبوع')}</button>
              <button type="button" role="tab" aria-selected={view === 'month'} className={view === 'month' ? 'is-active' : ''} onClick={() => setView('month')}>{t('شهر')}</button>
            </div>
            <button type="button" className="sc-today-btn" onClick={goToday}>{t('اليوم')}</button>
          </div>

          {view === 'month' && (
            <div className="sc-grid sc-grid--head">
              {WEEKDAYS.map((w) => <span key={w}>{w}</span>)}
            </div>
          )}

          <div className={`sc-grid sc-grid--${view}`}>
            {cells.map((d) => {
              const dayList = byDay.get(dayKey(d)) || [];
              const outside = view === 'month' && d.getMonth() !== anchor.getMonth();
              const isToday = sameDay(d, today);
              const isSelected = sameDay(d, selected);
              const worst = dayList.length ? statusOf(Math.min(...dayList.map((c) => c.daysLeft))) : null;
              return (
                <button
                  type="button"
                  key={dayKey(d)}
                  className={[
                    'sc-day',
                    outside && 'sc-day--outside',
                    isToday && 'sc-day--today',
                    isSelected && 'sc-day--selected',
                    worst && `sc-day--${worst}`,
                  ].filter(Boolean).join(' ')}
                  onClick={() => pick(d)}
                  aria-label={`${fmtDay.format(d)}${dayList.length ? ` — ${t('{0} اشتراك ينتهي', dayList.length)}` : ''}`}
                  aria-pressed={isSelected}
                >
                  {view === 'week' && <span className="sc-day__wd">{fmtWeekday.format(d)}</span>}
                  <span className="sc-day__num">{d.getDate()}</span>
                  {dayList.length > 0 && (view === 'week' ? (
                    <span className="sc-day__count">{dayList.length}</span>
                  ) : (
                    <span className="sc-day__people">
                      {dayList.slice(0, 2).map((c) => <Avatar key={c.id} client={c} size={18} />)}
                      {dayList.length > 2 && <span className="sc-day__more">+{dayList.length - 2}</span>}
                    </span>
                  ))}
                  {isToday && <span className="sc-day__pulse" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Trainees */}
        <div className="sc-panel">
          <div className="sc-panel__head">
            {selected ? (
              <>
                <div>
                  <strong>{sameDay(selected, today) ? t('ينتهي اليوم') : fmtDay.format(selected)}</strong>
                  <small>{t('{0} اشتراك ينتهي', list.length)}</small>
                </div>
                <button type="button" className="sc-all-btn" onClick={showAll}>
                  <Users size={14} /> {t('عرض الكل')}
                </button>
              </>
            ) : (
              <div>
                <strong>{t('الاشتراكات الفعّالة')}</strong>
                <small>{t('مرتبين حسب أقرب انتهاء')}</small>
              </div>
            )}
          </div>

          {!selected && (
            <div className="sc-filters" role="tablist">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={filter === f.id}
                  className={`sc-filter sc-filter--${f.id} ${filter === f.id ? 'is-active' : ''}`}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label()} <b>{counts[f.id]}</b>
                </button>
              ))}
            </div>
          )}

          {clients.length > 5 && (
            <label className="sc-search">
              <Search size={15} />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('ابحث عن متدرب...')}
                aria-label={t('ابحث عن متدرب...')}
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} aria-label={t('مسح')}><X size={14} /></button>
              )}
            </label>
          )}

          <div className="sc-panel__list">
            {loading ? (
              Array.from({ length: 4 }, (_, i) => <div key={i} className="sc-skeleton" />)
            ) : failed ? (
              <div className="sc-empty">
                <p>{t('تعذر تحميل المتدربين')}</p>
                {onRetry && <button type="button" className="ds-retry" onClick={onRetry}><RefreshCw size={14} /> {t('إعادة المحاولة')}</button>}
              </div>
            ) : list.length === 0 ? (
              <div className="sc-empty">
                <CheckCircle2 size={22} />
                <p>{query ? t('لا توجد نتائج') : selected ? t('لا اشتراكات تنتهي بهذا اليوم') : t('لا يوجد اشتراكات فعّالة')}</p>
              </div>
            ) : (
              list.map((c) => (
                <ClientRow
                  key={c.id}
                  client={c}
                  today={today}
                  isOpen={openId === c.id}
                  onToggle={() => setOpenId((id) => (id === c.id ? null : c.id))}
                  details={details[c.id]}
                  onLoadDetails={loadDetails}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCalendar;
