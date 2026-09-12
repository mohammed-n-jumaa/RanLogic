import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  LayoutDashboard, Users, UserPlus, Wallet, Ticket, RefreshCw,
  Minus, AlertTriangle, Bell, BarChart3, ArrowUpRight, ArrowDownRight,
  CreditCard
} from 'lucide-react';
import dashboardAPI from '../../api/dashboardApi';
import authApi from '../../api/authApi';
import './Dashboard.scss';

const fmt = {
  currency: (v) => `$${Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
  number:   (v) => Number(v || 0).toLocaleString('en-US'),
};

const MiniStat = ({ icon: Icon, label, value, change, color }) => (
  <motion.div className="ds-mini" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
    <div className={`ds-mini__icon ds-mini__icon--${color}`}><Icon size={18} /></div>
    <div className="ds-mini__body">
      <span className="ds-mini__label">{label}</span>
      <span className="ds-mini__value">{value}</span>
    </div>
    <div className={`ds-mini__pct ${change > 0 ? 'up' : change < 0 ? 'dn' : 'flat'}`}>
      {change > 0 ? <ArrowUpRight size={13} /> : change < 0 ? <ArrowDownRight size={13} /> : <Minus size={13} />}
      {Math.abs(change || 0)}%
    </div>
  </motion.div>
);

const Notif = ({ color, text, time }) => (
  <div className="ds-notif">
    <div className={`ds-notif__dot ds-notif__dot--${color}`} />
    <div>
      <div className="ds-notif__text">{text}</div>
      {time && <div className="ds-notif__time">{time}</div>}
    </div>
  </div>
);

const PlanBar = ({ name, pct, color }) => (
  <div className="ds-plan__row">
    <div className="ds-plan__dot" style={{ background: color }} />
    <div className="ds-plan__name">{name}</div>
    <div className="ds-plan__track">
      <div className="ds-plan__fill" style={{ width: `${pct}%`, background: color }} />
    </div>
    <div className="ds-plan__num">{pct}%</div>
  </div>
);

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
    <p>{text || 'لا توجد بيانات'}</p>
    {onRefresh && (
      <button className="ds-retry" onClick={onRefresh}>
        <RefreshCw size={14} /> تحديث
      </button>
    )}
  </div>
);

const PERIODS = [
  { value: 'this_week', label: 'هذا الأسبوع' },
  { value: 'this_month', label: 'الشهر' },
  { value: 'last_3_months', label: '3 أشهر' },
];

const COMPLETION_COLORS = ['#e91e63', '#6366f1', '#34d399', '#fb923c'];

const Dashboard = () => {
  const [period, setPeriod] = useState('this_week');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);
  const controllerRef = useRef(null);
  const mountedRef = useRef(true);

  const loadData = useCallback(async (p, refresh = false) => {
    if (controllerRef.current) controllerRef.current.abort();
    controllerRef.current = new AbortController();

    try {
      if (refresh) setIsRefreshing(true); else setIsLoading(true);
      setError(null);

      const storedUser = authApi.getUser();
      if (storedUser) setUser(storedUser);
      try {
        const r = await authApi.me();
        if (r.success) setUser(r.data);
      } catch {}

      const result = await dashboardAPI.getAllDashboardData(p);
      if (!mountedRef.current) return;

      setData(result);
      setLastRefresh(new Date());
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message || 'فشل تحميل البيانات');
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

  const handleRefresh = () => loadData(period, true);

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

  const completionData = (data?.completion || []).filter(c => (c.completion || c.rate || 0) > 0);

  const notifications = (data?.alerts || [])
    .filter(a => (a.count || 0) > 0)
    .map((a, i) => ({
      id: a.id || i,
      text: `${a.title} (${a.count})`,
      time: '',
      color: a.type === 'warning' ? 'y' : a.type === 'danger' ? 'r' : a.type === 'success' ? 'g' : 'b',
    }));

  if (isLoading && !data) {
    return (
      <div className="ds ds--loading">
        <div className="ds-loader">
          <RefreshCw size={28} className="ds-spin" />
          <p>جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="ds ds--error">
        <AlertTriangle size={40} />
        <h3>حدث خطأ</h3>
        <p>{error}</p>
        <button className="ds-retry" onClick={handleRefresh}>
          <RefreshCw size={16} /> إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="ds">
      <div className="ds-glow ds-glow--1" />
      <div className="ds-glow ds-glow--2" />

      {/* Header */}
      <div className="ds-header">
        <div className="ds-header__right">
          <div className="ds-header__greeting">
            مرحباً، <strong>{user?.name || 'Admin'}</strong>
          </div>
          <h1 className="ds-header__title">
            <LayoutDashboard size={20} /> لوحة التحكم
          </h1>
        </div>
        <div className="ds-header__actions">
          <div className="ds-pills">
            {PERIODS.map(p => (
              <button
                key={p.value}
                className={`ds-pill ${period === p.value ? 'ds-pill--active' : ''}`}
                onClick={() => setPeriod(p.value)}
              >
                {p.label}
              </button>
            ))}
          </div>
          <button className="ds-pill ds-pill--icon" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw size={14} className={isRefreshing ? 'ds-spin' : ''} />
          </button>
          {lastRefresh && (
            <span className="ds-header__time">
              {lastRefresh.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>

      {/* Refresh overlay */}
      <AnimatePresence>
        {isRefreshing && (
          <motion.div className="ds-refreshing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <RefreshCw size={20} className="ds-spin" /> جاري التحديث...
          </motion.div>
        )}
      </AnimatePresence>

      {data && (
        <>
          {/* Row 1: Hero + Side stats */}
          <div className="ds-row1">
            <motion.div className="ds-hero" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="ds-hero__top">
                <div className="ds-hero__label"><Wallet size={15} /> إجمالي الدخل هذا الشهر</div>
                <div className="ds-hero__amount">{fmt.currency(m.totalRevenue)}<small>USD</small></div>
              </div>

              <div className="ds-hero__chart">
                {revenueChart.length > 1 ? (
                  <ResponsiveContainer width="100%" height={70}>
                    <AreaChart data={revenueChart} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#e91e63" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#e91e63" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="revenue" stroke="#e91e63" strokeWidth={2} fill="url(#revGrad)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="ds-hero__no-chart">
                    <BarChart3 size={20} />
                    <span>بيانات غير كافية للرسم البياني</span>
                  </div>
                )}
              </div>

              <div className="ds-hero__stats">
                <div className="ds-hero__stat">
                  <span>هذا الأسبوع</span>
                  <span className={pChange.revenue > 0 ? 'up' : ''}>{fmt.currency(m.weeklyRevenue || m.totalRevenue)}</span>
                </div>
                <div className="ds-hero__stat">
                  <span>النمو</span>
                  <span className={pChange.revenue > 0 ? 'up' : pChange.revenue < 0 ? 'dn' : ''}>
                    {pChange.revenue > 0 ? '+' : ''}{Math.round(pChange.revenue || 0)}%
                  </span>
                </div>
                <div className="ds-hero__stat">
                  <span>متوسط المدة</span>
                  <span>{Number(m.avgSubscriptionDuration || 0).toFixed(1)} شهر</span>
                </div>
              </div>
            </motion.div>

            <div className="ds-side">
              <MiniStat icon={Users} label="اشتراكات نشطة" value={fmt.number(m.totalSubscriptions)} change={pChange.subscriptions} color="indigo" />
              <MiniStat icon={UserPlus} label="مستخدمين جدد" value={fmt.number(m.newRegistrations)} change={pChange.registrations} color="emerald" />
              <MiniStat icon={Ticket} label="كوبونات مستخدمة" value={fmt.number(m.couponsUsed || 0)} change={0} color="amber" />
            </div>
          </div>

          {/* Row 2: Charts */}
          <div className="ds-row2">
            <motion.div className="ds-glass" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
              <div className="ds-glass__head">
                <div className="ds-glass__title"><BarChart3 size={16} /> الاشتراكات حسب الفترة</div>
                <span className="ds-glass__tag">آخر 6 فترات</span>
              </div>
              <div className="ds-glass__chart">
                {growthChart.length > 0 ? (
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={growthChart} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip content={<CTooltip />} />
                      <Bar dataKey="count" name="الاشتراكات" fill="#e91e63" radius={[6, 6, 0, 0]} maxBarSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <NoData icon={BarChart3} onRefresh={handleRefresh} />
                )}
              </div>
            </motion.div>

            <motion.div className="ds-glass" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
              <div className="ds-glass__head">
                <div className="ds-glass__title"><CreditCard size={16} /> توزيع البرامج</div>
              </div>
              <div className="ds-plan">
                {planData.length > 0 ? (
                  planData.map((p, i) => <PlanBar key={i} name={p.name} pct={p.pct} color={p.color} />)
                ) : (
                  <NoData icon={BarChart3} onRefresh={handleRefresh} />
                )}
              </div>
            </motion.div>
          </div>

          {/* Row 3: Alerts + Completion */}
          <div className="ds-row3">
            <motion.div className="ds-glass" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="ds-glass__head">
                <div className="ds-glass__title"><Bell size={16} /> التنبيهات والأحداث</div>
              </div>
              <div className="ds-notifs">
                {notifications.length > 0 ? (
                  notifications.map(n => <Notif key={n.id} {...n} />)
                ) : (
                  <NoData icon={Bell} text="لا توجد تنبيهات" onRefresh={handleRefresh} />
                )}
              </div>
            </motion.div>

            <motion.div className="ds-glass" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <div className="ds-glass__head">
                <div className="ds-glass__title"><BarChart3 size={16} /> إنجاز البرامج</div>
              </div>
              <div className="ds-plan">
                {completionData.length > 0 ? (
                  completionData.map((c, i) => (
                    <PlanBar
                      key={i}
                      name={c.program || c.name || '?'}
                      pct={Math.round(c.completion || c.rate || 0)}
                      color={COMPLETION_COLORS[i % COMPLETION_COLORS.length]}
                    />
                  ))
                ) : (
                  <NoData icon={BarChart3} onRefresh={handleRefresh} />
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;