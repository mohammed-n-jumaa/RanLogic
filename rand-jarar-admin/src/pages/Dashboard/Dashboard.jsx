import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Users, UserPlus, Wallet, Ticket, RefreshCw, Minus, AlertTriangle,
  BarChart3, ArrowUpRight, ArrowDownRight, PieChart, Zap, CalendarDays, TrendingUp, Activity,
} from 'lucide-react';
import dashboardAPI from '../../api/dashboardApi';
import trainingApi from '../../api/trainingApi';
import subscriptionsApi from '../../api/subscriptionsApi';
import { getConversations } from '../../api/chatApi';
import { useAuth } from '../../contexts/AuthContext';
import TodayHero, { QuickActions } from './Hero/TodayHero';
import ActionCenter from './Widgets/ActionCenter';
import SubscriptionCalendar from './SubscriptionCalendar/SubscriptionCalendar';
import { enrichClients, isRunning, SOON_DAYS } from './SubscriptionCalendar/calendarUtils';
import './Dashboard.scss';
import { t } from '../../i18n';

const fmt = {
  currency: (v) => `$${Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
  number:   (v) => Number(v || 0).toLocaleString('en-US'),
};

const Change = ({ value }) => {
  const v = Math.round(value || 0);
  const dir = v > 0 ? 'up' : v < 0 ? 'dn' : 'flat';
  return (
    <span className={`ds-change ds-change--${dir}`}>
      {v > 0 ? <ArrowUpRight size={12} /> : v < 0 ? <ArrowDownRight size={12} /> : <Minus size={12} />}
      {Math.abs(v)}%
    </span>
  );
};

const KpiCard = ({ icon: Icon, label, value, change, note, color, children, delay = 0 }) => (
  <motion.div
    className={`ds-kpi ds-kpi--${color}`}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    <Icon className="ds-kpi__mark" size={92} aria-hidden="true" />
    <div className="ds-kpi__top">
      <span className="ds-kpi__icon"><Icon size={18} /></span>
      {change !== undefined && <Change value={change} />}
    </div>
    <div className="ds-kpi__label">{label}</div>
    <div className="ds-kpi__value">{value}</div>
    {children}
    {note && <div className="ds-kpi__note">{note}</div>}
  </motion.div>
);

const Section = React.forwardRef(({ icon: Icon, title, subtitle, aside, children }, ref) => (
  <section className="ds-section" ref={ref}>
    <div className="ds-section__head">
      <div className="ds-section__title">
        <span className="ds-section__badge"><Icon size={17} /></span>
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      {aside}
    </div>
    {children}
  </section>
));
Section.displayName = 'Section';

// Program split as a donut with a legend
const ProgramDonut = ({ items, total }) => {
  const r = 52;
  const c = 2 * Math.PI * r;
  // each segment starts where the previous one ended
  const segments = items.reduce((acc, p) => {
    const start = acc.length ? acc[acc.length - 1].start + acc[acc.length - 1].len : 0;
    return [...acc, { name: p.name, color: p.color, len: (p.pct / 100) * c, start }];
  }, []);
  return (
    <div className="ds-donut">
      <div className="ds-donut__chart">
        <svg viewBox="0 0 140 140" aria-hidden="true">
          <circle className="ds-donut__track" cx="70" cy="70" r={r} />
          {segments.map((s) => (
            <circle
              key={s.name}
              cx="70" cy="70" r={r}
              stroke={s.color}
              strokeDasharray={`${Math.max(s.len - 3, 0)} ${c}`}
              strokeDashoffset={-s.start}
            />
          ))}
        </svg>
        <div className="ds-donut__center">
          <b>{total}</b>
          <small>{t('متدرب')}</small>
        </div>
      </div>
      <ul className="ds-donut__legend">
        {items.map((p) => (
          <li key={p.name}>
            <i style={{ background: p.color }} />
            <span>{p.name}</span>
            <b>{p.pct}%</b>
          </li>
        ))}
      </ul>
    </div>
  );
};

const CTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="ds-tooltip">
      <div className="ds-tooltip__label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="ds-tooltip__row">
          <span style={{ color: p.stroke || p.fill }}>{p.name}</span>
          <strong>{Number(p.value).toLocaleString()}</strong>
        </div>
      ))}
    </div>
  );
};

const NoData = ({ icon: Icon, text, onRefresh }) => (
  <div className="ds-no-data">
    <Icon size={24} />
    <p>{text || t('لا توجد بيانات')}</p>
    {onRefresh && (
      <button className="ds-retry" onClick={onRefresh}>
        <RefreshCw size={14} /> {t('تحديث')}
      </button>
    )}
  </div>
);

const PERIODS = [
  { value: 'this_week', label: t('أسبوع') },
  { value: 'this_month', label: t('شهر') },
  { value: 'last_3_months', label: t('3 أشهر') },
];

// Subscriptions-per-period chart is hidden until its data is checked; set to true to bring it back
const SHOW_GROWTH_CHART = false;

const ALERT_COLOR = { warning: 'amber', danger: 'red', success: 'green' };
const EMPTY_LIST = { items: [], loading: true, failed: false };

/* Lists shared by the hero, action center and calendar.
   Loaded one after another (after the stats) to stay under the API rate limit. */
const useCoachLists = () => {
  const [trainees, setTrainees] = useState(EMPTY_LIST);
  const [transfers, setTransfers] = useState(EMPTY_LIST);
  const [chats, setChats] = useState(EMPTY_LIST);

  const loadTrainees = useCallback(async () => {
    setTrainees((s) => ({ ...s, loading: true, failed: false }));
    try {
      const response = await trainingApi.getAllTrainees();
      setTrainees({ items: enrichClients(response.data?.success ? response.data.data : []), loading: false, failed: false });
    } catch {
      setTrainees({ items: [], loading: false, failed: true });
    }
  }, []);

  const loadTransfers = useCallback(async () => {
    setTransfers((s) => ({ ...s, loading: true, failed: false }));
    try {
      const response = await subscriptionsApi.getBankTransferSubscriptions();
      const items = (response?.success ? response.data || [] : [])
        .filter((s) => s.status === 'pending')
        .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
      setTransfers({ items, loading: false, failed: false });
    } catch {
      setTransfers({ items: [], loading: false, failed: true });
    }
  }, []);

  const loadChats = useCallback(async () => {
    setChats((s) => ({ ...s, loading: true, failed: false }));
    try {
      const response = await getConversations();
      const items = (response?.success ? response.data || [] : []).filter((c) => Number(c.unread_count) > 0);
      setChats({ items, loading: false, failed: false });
    } catch {
      setChats({ items: [], loading: false, failed: true });
    }
  }, []);

  const loadAll = useCallback(async () => {
    await loadTransfers();
    await loadChats();
    await loadTrainees();
  }, [loadTransfers, loadChats, loadTrainees]);

  return { trainees, transfers, chats, loadAll, loadTrainees, loadTransfers, loadChats };
};

const Dashboard = () => {
  const [period, setPeriod] = useState('this_week');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [actionTab, setActionTab] = useState(null);
  const controllerRef = useRef(null);
  const mountedRef = useRef(true);
  const actionsRef = useRef(null);
  const calendarRef = useRef(null);

  const lists = useCoachLists();
  const { loadAll } = lists;

  const loadData = useCallback(async (p, refresh = false) => {
    if (controllerRef.current) controllerRef.current.abort();
    controllerRef.current = new AbortController();

    try {
      if (refresh) setIsRefreshing(true); else setIsLoading(true);
      setError(null);

      const result = await dashboardAPI.getAllDashboardData(p);
      if (!mountedRef.current) return;

      setData(result);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message || t('فشل تحميل البيانات'));
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    loadData(period);
    return () => {
      mountedRef.current = false;
      controllerRef.current?.abort();
    };
  }, [period, loadData]);

  // lists don't depend on the period: load once after the first stats arrive
  const listsStarted = useRef(false);
  useEffect(() => {
    if (data && !listsStarted.current) {
      listsStarted.current = true;
      loadAll();
    }
  }, [data, loadAll]);

  const handleRefresh = async () => {
    await loadData(period, true);
    loadAll();
  };

  const m = data?.metrics || {};
  const pChange = m.previousPeriodChange || {};

  const planRaw = (data?.programTypes || []).filter(p => (p.value || 0) > 0);
  const planTotal = planRaw.reduce((sum, p) => sum + (p.value || 0), 0);
  const planData = planRaw.map(p => ({
    name: p.name || '?',
    pct: planTotal > 0 ? Math.round((p.value / planTotal) * 100) : 0,
    color: p.color || '#6366f1',
  }));

  const revenueChart = (data?.revenue || []).map(r => ({
    name: r.day || r.date || r.month || '',
    revenue: Math.round(r.revenue || r.total || 0),
  }));

  const growthChart = (data?.growth || []).map(g => ({
    name: g.date || g.month || '',
    count: g.subscriptions || g.count || 0,
  }));

  const alerts = (data?.alerts || [])
    .filter(a => (a.count || 0) > 0)
    .map((a, i) => ({ id: a.id || i, title: a.title, count: a.count, color: ALERT_COLOR[a.type] || 'blue' }));

  const clients = lists.trainees.items;
  // calendar + list only show trainees whose subscription is still running
  const activeClients = useMemo(() => clients.filter(isRunning), [clients]);
  const counts = useMemo(() => ({
    transfers: lists.transfers.items.length,
    chats: lists.chats.items.length,
    endingToday: clients.filter((c) => c.daysLeft === 0).length,
  }), [lists.transfers.items, lists.chats.items, clients]);

  const health = useMemo(() => {
    const running = clients.filter(isRunning);
    if (!running.length) return null;
    return Math.round((running.filter((c) => c.daysLeft > SOON_DAYS).length / running.length) * 100);
  }, [clients]);

  const listsReady = !lists.transfers.loading && !lists.chats.loading && !lists.trainees.loading;

  // open the tab that actually needs attention (until the coach picks one)
  const tab = actionTab || (counts.transfers ? 'transfers' : counts.chats ? 'chats' : alerts.length ? 'alerts' : 'transfers');

  const jump = (target) => {
    if (target === 'calendar') {
      calendarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    setActionTab(target);
    actionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (isLoading && !data) {
    return (
      <div className="ds ds--loading">
        <div className="ds-loader">
          <RefreshCw size={28} className="ds-spin" />
          <p>{t('جاري تحميل لوحة التحكم...')}</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="ds ds--error">
        <AlertTriangle size={40} />
        <h3>{t('حدث خطأ')}</h3>
        <p>{error}</p>
        <button className="ds-retry" onClick={handleRefresh}>
          <RefreshCw size={16} /> {t('إعادة المحاولة')}
        </button>
      </div>
    );
  }

  const axisTick = { fill: 'var(--text-muted)', fontSize: 10 };

  return (
    <div className="ds">
      <TodayHero
        name={user?.name || 'Admin'}
        counts={counts}
        health={health}
        ready={listsReady}
        onJump={jump}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
      />

      <QuickActions />

      <AnimatePresence>
        {isRefreshing && (
          <motion.div className="ds-refreshing" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <RefreshCw size={14} className="ds-spin" /> {t('جاري التحديث...')}
          </motion.div>
        )}
      </AnimatePresence>

      {data && (
        <>
          {/* Needs attention */}
          <Section ref={actionsRef} icon={Zap} title={t('يحتاج انتباهك')} subtitle={t('خلّصي هدول وارتاحي')}>
            <ActionCenter
              tab={tab}
              onTabChange={setActionTab}
              transfers={lists.transfers}
              chats={lists.chats}
              alerts={alerts}
              onRetryTransfers={lists.loadTransfers}
              onRetryChats={lists.loadChats}
            />
          </Section>

          {/* Numbers */}
          <Section
            icon={Activity}
            title={t('الأرقام')}
            subtitle={t('أداؤك بالأرقام')}
            aside={(
              <div className="ds-segment" role="tablist" aria-label={t('الفترة')}>
                {PERIODS.map(p => (
                  <button
                    key={p.value}
                    type="button"
                    role="tab"
                    aria-selected={period === p.value}
                    className={period === p.value ? 'is-active' : ''}
                    onClick={() => setPeriod(p.value)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          >
            <div className="ds-kpis">
              <KpiCard
                icon={Wallet}
                color="pink"
                label={t('إجمالي الدخل هذا الشهر')}
                value={fmt.currency(m.totalRevenue)}
                change={pChange.revenue}
                note={m.weeklyRevenue != null ? `${t('هذا الأسبوع')}: ${fmt.currency(m.weeklyRevenue)}` : null}
              >
                {revenueChart.length > 1 && (
                  <div className="ds-kpi__spark">
                    <ResponsiveContainer width="100%" height={36}>
                      <AreaChart data={revenueChart} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="kpiRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#e91e63" stopOpacity={0.35} />
                            <stop offset="100%" stopColor="#e91e63" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="revenue" stroke="#e91e63" strokeWidth={2} fill="url(#kpiRev)" dot={false} isAnimationActive={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </KpiCard>
              <KpiCard
                icon={Users}
                color="indigo"
                label={t('اشتراكات نشطة')}
                value={fmt.number(m.totalSubscriptions)}
                change={pChange.subscriptions}
                note={m.avgSubscriptionDuration ? `${t('متوسط المدة')}: ${Number(m.avgSubscriptionDuration).toFixed(1)} ${t('شهر')}` : null}
                delay={0.05}
              />
              <KpiCard
                icon={UserPlus}
                color="emerald"
                label={t('مستخدمين جدد')}
                value={fmt.number(m.newRegistrations)}
                change={pChange.registrations}
                delay={0.1}
              />
              <KpiCard
                icon={Ticket}
                color="amber"
                label={t('كوبونات مستخدمة')}
                value={fmt.number(m.couponsUsed || 0)}
                delay={0.15}
              />
            </div>
          </Section>

          {/* Subscriptions calendar */}
          <Section ref={calendarRef} icon={CalendarDays} title={t('تقويم الاشتراكات')} subtitle={t('المشتركين حالياً ومواعيد انتهاء اشتراكاتهم')}>
            <SubscriptionCalendar
              clients={activeClients}
              loading={lists.trainees.loading}
              failed={lists.trainees.failed}
              onRetry={lists.loadTrainees}
            />
          </Section>

          {/* Analytics */}
          <Section icon={TrendingUp} title={t('التحليلات')} subtitle={SHOW_GROWTH_CHART ? t('نمو الاشتراكات وتوزيع البرامج') : t('توزيع المتدربين على البرامج')}>
            <div className={`ds-grid-analytics ${SHOW_GROWTH_CHART ? '' : 'ds-grid-analytics--single'}`}>
              {SHOW_GROWTH_CHART && (
              <div className="ds-glass">
                <div className="ds-glass__head">
                  <div className="ds-glass__title"><BarChart3 size={16} /> {t('الاشتراكات حسب الفترة')}</div>
                </div>
                <div className="ds-glass__chart">
                  {growthChart.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={growthChart} margin={{ top: 5, right: 4, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f472b6" />
                            <stop offset="100%" stopColor="#9c27b0" />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--ds-grid)" vertical={false} />
                        <XAxis dataKey="name" tick={axisTick} axisLine={false} tickLine={false} />
                        <YAxis tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip content={<CTooltip />} cursor={{ fill: 'var(--ds-grid)' }} />
                        <Bar dataKey="count" name={t('الاشتراكات')} fill="url(#growthGrad)" radius={[10, 10, 4, 4]} maxBarSize={30} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <NoData icon={BarChart3} onRefresh={handleRefresh} />
                  )}
                </div>
              </div>
              )}

              <div className="ds-glass">
                <div className="ds-glass__head">
                  <div className="ds-glass__title"><PieChart size={16} /> {t('توزيع البرامج')}</div>
                </div>
                {planData.length > 0 ? (
                  <ProgramDonut items={planData} total={planTotal} />
                ) : (
                  <NoData icon={PieChart} onRefresh={handleRefresh} />
                )}
              </div>
            </div>
          </Section>
        </>
      )}
    </div>
  );
};

export default Dashboard;
