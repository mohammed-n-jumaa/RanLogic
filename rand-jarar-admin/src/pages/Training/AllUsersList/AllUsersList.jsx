import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Search, Filter, RefreshCw, ChevronLeft,
  ChevronDown, ChevronRight, ChevronLeft as ChevronPrev,
  UserCheck, UserX, Clock, Mail, Phone, Calendar,
  Loader, X, MapPin, Target, Ruler, Weight,
  CreditCard, Activity, FileText, Hash,
} from 'lucide-react';
import apiClient from '../../../api/apiClient';
import Swal from 'sweetalert2';
import './AllUsersList.scss';
import { t, loc } from '../../../i18n';

// ─── helpers ──────────────────────────────────────────────────────────────────

const DEFAULT_AVATAR = 'https://i.postimg.cc/WpqHf2CH/download.png';

const getSubStatus = (user) => {
  if (!user.active_subscription) return 'none';
  return new Date(user.active_subscription.ends_at) >= new Date() ? 'active' : 'expired';
};

const STATUS_META = {
  active:  { label: t('اشتراك نشط'),   cls: 'active',  Icon: UserCheck },
  expired: { label: t('اشتراك منتهي'), cls: 'expired', Icon: UserX    },
  none:    { label: t('بدون اشتراك'),  cls: 'none',    Icon: Clock    },
};

const GOAL_MAP = {
  'weight-loss': t('خسارة وزن'),
  'muscle-gain': t('بناء عضلات'),
  toning:        t('تحسين القوام'),
  fitness:       t('لياقة عامة'),
};

const PLAN_MAP = {
  basic:     'Basic',
  nutrition: 'Nutrition',
  elite:     'Elite',
  vip:       'VIP',
};

const DURATION_MAP = {
  '1month':  t('شهر واحد'),
  '3months': t('3 أشهر'),
  '6months': t('6 أشهر'),
};

const PAYMENT_MAP = {
  paypal:        'PayPal',
  bank_transfer: t('تحويل بنكي'),
};

const PLACE_MAP = { home: t('المنزل'), gym: t('الجيم') };

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString(loc('ar-EG'), { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

const fmtAmount = (amount, currency = 'USD') =>
  amount ? `${parseFloat(amount).toFixed(2)} ${currency}` : '—';

// ─── ExpandedRow — تفاصيل كاملة عند الضغط (desktop) ─────────────────────────

const ExpandedRow = ({ user }) => {
  const sub = user.active_subscription || user.last_subscription;

  return (
    <motion.tr
      className="expanded-row"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <td colSpan={6}>
        <div className="expanded-content">

          {/* المعلومات الجسدية */}
          <div className="exp-section">
            <h4 className="exp-title"><Activity size={14} /> {t('المعلومات الجسدية')}</h4>
            <div className="exp-grid">
              {user.age         && <div className="exp-item"><span className="exp-label">{t('العمر')}</span><span className="exp-val">{user.age} {t('سنة')}</span></div>}
              {user.height      && <div className="exp-item"><span className="exp-label">{t('الطول')}</span><span className="exp-val">{user.height} {t('سم')}</span></div>}
              {user.weight      && <div className="exp-item"><span className="exp-label">{t('الوزن')}</span><span className="exp-val">{user.weight} {t('كغ')}</span></div>}
              {user.waist       && <div className="exp-item"><span className="exp-label">{t('الخصر')}</span><span className="exp-val">{user.waist} {t('سم')}</span></div>}
              {user.hips        && <div className="exp-item"><span className="exp-label">{t('الأرداف')}</span><span className="exp-val">{user.hips} {t('سم')}</span></div>}
              {user.program     && <div className="exp-item"><span className="exp-label">{t('البرنامج')}</span><span className="exp-val">{user.program}</span></div>}
            </div>
            {user.health_notes && (
              <div className="exp-notes">
                <span className="exp-label">{t('ملاحظات صحية:')}</span>
                <span>{user.health_notes}</span>
              </div>
            )}
          </div>

          {/* تفاصيل الاشتراك */}
          {sub && (
            <div className="exp-section">
              <h4 className="exp-title">
                <CreditCard size={14} />
                {user.active_subscription ? t('الاشتراك النشط') : t('آخر اشتراك')}
              </h4>
              <div className="exp-grid">
                <div className="exp-item"><span className="exp-label">{t('الخطة')}</span><span className="exp-val plan">{PLAN_MAP[sub.plan_type] ?? sub.plan_type}</span></div>
                <div className="exp-item"><span className="exp-label">{t('المدة')}</span><span className="exp-val">{DURATION_MAP[sub.duration] ?? sub.duration}</span></div>
                <div className="exp-item"><span className="exp-label">{t('المبلغ')}</span><span className="exp-val amount">{fmtAmount(sub.amount, sub.currency)}</span></div>
                {sub.original_amount && sub.original_amount !== sub.amount && (
                  <div className="exp-item"><span className="exp-label">{t('قبل الخصم')}</span><span className="exp-val original">{fmtAmount(sub.original_amount, sub.currency)}</span></div>
                )}
                {sub.discount_percentage > 0 && (
                  <div className="exp-item"><span className="exp-label">{t('الخصم')}</span><span className="exp-val discount">{sub.discount_percentage}%</span></div>
                )}
                <div className="exp-item"><span className="exp-label">{t('طريقة الدفع')}</span><span className="exp-val">{PAYMENT_MAP[sub.payment_method] ?? sub.payment_method}</span></div>
                <div className="exp-item"><span className="exp-label">{t('يبدأ')}</span><span className="exp-val">{fmtDate(sub.starts_at)}</span></div>
                <div className="exp-item"><span className="exp-label">{t('ينتهي')}</span><span className="exp-val">{fmtDate(sub.ends_at)}</span></div>
                {sub.bank_transfer_number && (
                  <div className="exp-item"><span className="exp-label">{t('رقم التحويل')}</span><span className="exp-val">{sub.bank_transfer_number}</span></div>
                )}
              </div>
              {sub.notes && (
                <div className="exp-notes">
                  <span className="exp-label">{t('ملاحظات:')}</span>
                  <span>{sub.notes}</span>
                </div>
              )}
            </div>
          )}

          <div className="exp-meta">
            <span><Hash size={12} /> {t('إجمالي الاشتراكات:')} {user.subscriptions_count}</span>
          </div>

        </div>
      </td>
    </motion.tr>
  );
};

// ─── UserRow (desktop) ────────────────────────────────────────────────────────

const UserRow = ({ user, index }) => {
  const [expanded, setExpanded] = useState(false);
  const status = getSubStatus(user);
  const { label, cls, Icon } = STATUS_META[status];
  const sub = user.active_subscription;

  return (
    <>
      <motion.tr
        className={`user-row ${expanded ? 'expanded' : ''}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03 }}
        onClick={() => setExpanded(v => !v)}
      >
        <td className="col-user">
          <div className="user-info">
            <div className={`avatar ${user.gender === 'female' ? 'female' : 'male'}`}>
              <img
                src={user.avatar_url || DEFAULT_AVATAR}
                alt={user.name}
                onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
              />
            </div>
            <div className="user-meta">
              <span className="user-name">{user.name}</span>
              <span className="user-id">#{user.id}</span>
            </div>
          </div>
        </td>
        <td className="col-contact">
          <div className="contact-stack">
            <span><Mail size={12} />{user.email}</span>
            {user.phone && <span><Phone size={12} />{user.phone}</span>}
          </div>
        </td>
        <td className="col-tags">
          <div className="tag-row">
            {user.gender && <span className={`tag gender-${user.gender}`}>{user.gender === 'female' ? t('أنثى') : t('ذكر')}</span>}
            {user.goal && <span className="tag goal">{GOAL_MAP[user.goal] ?? user.goal}</span>}
            {user.workout_place && <span className="tag place">{PLACE_MAP[user.workout_place] ?? user.workout_place}</span>}
          </div>
        </td>
        <td className="col-sub">
          <span className={`status-badge ${cls}`}><Icon size={12} />{label}</span>
          {sub && (
            <>
              {sub.plan_type && <div className="sub-plan">{PLAN_MAP[sub.plan_type] ?? sub.plan_type}</div>}
              <div className="sub-end">{t('ينتهي:')} {fmtDate(sub.ends_at)}</div>
            </>
          )}
        </td>
        <td className="col-date">
          <span className="date-val"><Calendar size={12} />{fmtDate(user.created_at)}</span>
        </td>
        <td className="col-expand">
          <ChevronDown size={15} className={`expand-icon ${expanded ? 'open' : ''}`} />
        </td>
      </motion.tr>

      <AnimatePresence>
        {expanded && <ExpandedRow key="exp" user={user} />}
      </AnimatePresence>
    </>
  );
};

// ─── UserCard (mobile) ────────────────────────────────────────────────────────

const UserCard = ({ user, index }) => {
  const [expanded, setExpanded] = useState(false);
  const status = getSubStatus(user);
  const { label, cls, Icon } = STATUS_META[status];
  const sub = user.active_subscription || user.last_subscription;

  return (
    <motion.div
      className="user-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      {/* Header */}
      <div className="uc-header" onClick={() => setExpanded(v => !v)}>
        <div className="uc-avatar-wrap">
          <div className={`uc-avatar ${user.gender === 'female' ? 'female' : 'male'}`}>
            <img
              src={user.avatar_url || DEFAULT_AVATAR}
              alt={user.name}
              onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
            />
          </div>
        </div>
        <div className="uc-identity">
          <span className="uc-name">{user.name}</span>
          <span className="uc-id">#{user.id}</span>
        </div>
        <div className="uc-header-right">
          <span className={`uc-badge ${cls}`}><Icon size={11} />{label}</span>
          <ChevronDown size={14} className={`expand-icon ${expanded ? 'open' : ''}`} />
        </div>
      </div>

      {/* Basic info always visible */}
      <div className="uc-body">
        <div className="uc-row"><Mail size={13} /><span>{user.email}</span></div>
        {user.phone && <div className="uc-row"><Phone size={13} /><span>{user.phone}</span></div>}
        {sub && (
          <div className="uc-row">
            <CreditCard size={13} />
            <span>
              {PLAN_MAP[sub.plan_type] ?? sub.plan_type}
              {sub.ends_at ? t(' · ينتهي {0}', fmtDate(sub.ends_at)) : ''}
            </span>
          </div>
        )}
        <div className="uc-row"><Calendar size={13} /><span>{t('تاريخ التسجيل:')} {fmtDate(user.created_at)}</span></div>
      </div>

      {/* Tags */}
      <div className="uc-tags">
        {user.gender && <span className={`tag gender-${user.gender}`}>{user.gender === 'female' ? t('أنثى') : t('ذكر')}</span>}
        {user.goal && <span className="tag goal"><Target size={10} />{GOAL_MAP[user.goal] ?? user.goal}</span>}
        {user.workout_place && <span className="tag place"><MapPin size={10} />{PLACE_MAP[user.workout_place] ?? user.workout_place}</span>}
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="uc-expanded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* المعلومات الجسدية */}
            {(user.age || user.height || user.weight || user.waist || user.hips) && (
              <div className="uce-section">
                <span className="uce-label"><Activity size={12} /> {t('المعلومات الجسدية')}</span>
                <div className="uce-grid">
                  {user.age    && <div className="uce-item"><span>{t('العمر')}</span><strong>{user.age} {t('سنة')}</strong></div>}
                  {user.height && <div className="uce-item"><span>{t('الطول')}</span><strong>{user.height} {t('سم')}</strong></div>}
                  {user.weight && <div className="uce-item"><span>{t('الوزن')}</span><strong>{user.weight} {t('كغ')}</strong></div>}
                  {user.waist  && <div className="uce-item"><span>{t('الخصر')}</span><strong>{user.waist} {t('سم')}</strong></div>}
                  {user.hips   && <div className="uce-item"><span>{t('الأرداف')}</span><strong>{user.hips} {t('سم')}</strong></div>}
                </div>
                {user.health_notes && (
                  <div className="uce-notes"><FileText size={12} /> {user.health_notes}</div>
                )}
              </div>
            )}

            {/* تفاصيل الاشتراك */}
            {sub && (
              <div className="uce-section">
                <span className="uce-label">
                  <CreditCard size={12} />
                  {user.active_subscription ? t('الاشتراك النشط') : t('آخر اشتراك')}
                </span>
                <div className="uce-grid">
                  <div className="uce-item"><span>{t('الخطة')}</span><strong>{PLAN_MAP[sub.plan_type] ?? sub.plan_type}</strong></div>
                  <div className="uce-item"><span>{t('المدة')}</span><strong>{DURATION_MAP[sub.duration] ?? sub.duration}</strong></div>
                  <div className="uce-item"><span>{t('المبلغ')}</span><strong>{fmtAmount(sub.amount, sub.currency)}</strong></div>
                  <div className="uce-item"><span>{t('الدفع')}</span><strong>{PAYMENT_MAP[sub.payment_method] ?? sub.payment_method}</strong></div>
                  {sub.discount_percentage > 0 && (
                    <div className="uce-item"><span>{t('الخصم')}</span><strong>{sub.discount_percentage}%</strong></div>
                  )}
                  {sub.bank_transfer_number && (
                    <div className="uce-item"><span>{t('رقم التحويل')}</span><strong>{sub.bank_transfer_number}</strong></div>
                  )}
                </div>
                {sub.notes && <div className="uce-notes"><FileText size={12} /> {sub.notes}</div>}
              </div>
            )}

            <div className="uce-footer">
              <Hash size={11} /> {t('إجمالي الاشتراكات:')} {user.subscriptions_count}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── AllUsersList ─────────────────────────────────────────────────────────────

const AllUsersList = () => {
  const [users, setUsers]                 = useState([]);
  const [meta, setMeta]                   = useState({ total: 0, last_page: 1, current_page: 1 });
  const [isLoading, setIsLoading]         = useState(true);
  const [page, setPage]                   = useState(1);
  const [searchTerm, setSearchTerm]       = useState('');
  const [filterGender, setFilterGender]   = useState('');
  const [filterGoal, setFilterGoal]       = useState('');
  const [filterStatus, setFilterStatus]   = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const fetchUsers = useCallback(async (pg = 1) => {
    setIsLoading(true);
    try {
      const params = { page: pg };
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (filterGender)      params.gender = filterGender;
      if (filterGoal)        params.goal   = filterGoal;

      const res = await apiClient.get('/admin/users/all', { params });

      if (res.data.success) {
        let data = res.data.data;
        if (filterStatus) data = data.filter((u) => getSubStatus(u) === filterStatus);
        setUsers(data);
        setMeta(res.data.meta ?? { total: data.length, last_page: 1, current_page: pg });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: t('خطأ'), text: t('حدث خطأ أثناء جلب البيانات'), confirmButtonText: t('حسناً') });
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, filterGender, filterGoal, filterStatus]);

  useEffect(() => {
    const tItem = setTimeout(() => { setPage(1); fetchUsers(1); }, 400);
    return () => clearTimeout(tItem);
  }, [searchTerm, filterGender, filterGoal, filterStatus]);

  useEffect(() => { fetchUsers(page); }, [page]); // eslint-disable-line

  const stats = {
    total:   meta.total,
    active:  users.filter((u) => getSubStatus(u) === 'active').length,
    expired: users.filter((u) => getSubStatus(u) === 'expired').length,
    none:    users.filter((u) => getSubStatus(u) === 'none').length,
  };

  const hasFilters = searchTerm || filterGender || filterGoal || filterStatus;

  const clearFilters = () => {
    setSearchTerm(''); setFilterGender(''); setFilterGoal(''); setFilterStatus('');
    setIsFiltersOpen(false);
  };

  const pageNumbers = () => {
    const total = meta.last_page;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = [];
    const delta = 2;
    for (let i = Math.max(1, page - delta); i <= Math.min(total, page + delta); i++) pages.push(i);
    if (pages[0] > 2) pages.unshift('…');
    if (pages[0] !== 1) pages.unshift(1);
    if (pages[pages.length - 1] < total - 1) pages.push('…');
    if (pages[pages.length - 1] !== total) pages.push(total);
    return pages;
  };

  const listContent = isLoading ? (
    <div className="loading-state"><Loader size={34} className="spinner" /><p>{t('جاري التحميل...')}</p></div>
  ) : users.length === 0 ? (
    <div className="empty-state">
      <Users size={52} /><h3>{t('لا يوجد مستخدمون')}</h3><p>{t('لم يتم العثور على نتائج مطابقة')}</p>
      {hasFilters && <button className="btn-outline" onClick={clearFilters}>{t('مسح الفلاتر')}</button>}
    </div>
  ) : null;

  return (
    <div className="all-users-list">

      {/* Header */}
      <div className="all-users-list__header">
        <div className="container">
          <div className="header-content">
            <div className="title-section">
              <div className="breadcrumb">
                <ChevronLeft size={15} /><span>{t('لوحة التحكم')}</span>
                <span className="sep">/</span><span className="active-crumb">{t('جميع المستخدمين')}</span>
              </div>
              <h1 className="page-title"><Users size={26} />{t('جميع المستخدمين')}</h1>
              <p className="page-sub">{t('عرض كامل لجميع المسجلين — اضغط على أي صف لرؤية التفاصيل الكاملة')}</p>
            </div>
            <motion.button className="btn-refresh" onClick={() => fetchUsers(page)}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <RefreshCw size={15} />{t('تحديث')}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container">
        <motion.div className="stats-grid"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {[
            { label: t('إجمالي المستخدمين'), value: stats.total,   mod: 'primary', Icon: Users     },
            { label: t('اشتراك نشط'),         value: stats.active,  mod: 'success', Icon: UserCheck },
            { label: t('اشتراك منتهي'),       value: stats.expired, mod: 'danger',  Icon: UserX     },
            { label: t('بدون اشتراك'),        value: stats.none,    mod: 'warning', Icon: Clock     },
          ].map(({ label, value, mod, Icon }) => (
            <div key={label} className={`stat-card stat-card--${mod}`}>
              <div className="stat-icon"><Icon size={20} /></div>
              <div className="stat-body">
                <span className="stat-label">{label}</span>
                <span className="stat-value">{value}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Toolbar */}
      <div className="container">
        <motion.div className="toolbar"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="toolbar-row">
            <div className="search-box">
              <Search size={16} className="search-ico" />
              <input type="text" placeholder={t('ابحث بالاسم أو البريد أو الهاتف...')}
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              {searchTerm && <button className="clear-btn" onClick={() => setSearchTerm('')}><X size={13} /></button>}
            </div>
            <button className={`filter-toggle ${isFiltersOpen ? 'open' : ''}`}
              onClick={() => setIsFiltersOpen((v) => !v)}>
              <Filter size={15} />{t('تصفية')}
              {hasFilters && <span className="filter-dot" />}
              <ChevronDown size={13} className={`chevron ${isFiltersOpen ? 'open' : ''}`} />
            </button>
            {hasFilters && (
              <button className="clear-filters-btn" onClick={clearFilters}><X size={13} />{t('مسح')}</button>
            )}
          </div>

          <AnimatePresence>
            {isFiltersOpen && (
              <motion.div className="filters-panel"
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                <div className="filters-row">
                  <div className="filter-item">
                    <label>{t('الجنس')}</label>
                    <select value={filterGender} onChange={(e) => setFilterGender(e.target.value)}>
                      <option value="">{t('الكل')}</option><option value="female">{t('أنثى')}</option><option value="male">{t('ذكر')}</option>
                    </select>
                  </div>
                  <div className="filter-item">
                    <label>{t('الهدف')}</label>
                    <select value={filterGoal} onChange={(e) => setFilterGoal(e.target.value)}>
                      <option value="">{t('الكل')}</option>
                      <option value="weight-loss">{t('خسارة وزن')}</option>
                      <option value="muscle-gain">{t('بناء عضلات')}</option>
                      <option value="toning">{t('تحسين القوام')}</option>
                      <option value="fitness">{t('لياقة عامة')}</option>
                    </select>
                  </div>
                  <div className="filter-item">
                    <label>{t('حالة الاشتراك')}</label>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                      <option value="">{t('الكل')}</option>
                      <option value="active">{t('نشط')}</option>
                      <option value="expired">{t('منتهي')}</option>
                      <option value="none">{t('بدون اشتراك')}</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="results-line">
            {t('عرض')} <strong>{users.length}</strong> {t('من أصل')} <strong>{meta.total}</strong> {t('مستخدم')}
          </div>
        </motion.div>
      </div>

      {/* Desktop Table */}
      <div className="container desktop-only">
        <motion.div className="table-wrapper"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          {listContent ?? (
            <table className="users-table">
              <thead>
                <tr>
                  <th>{t('المستخدم')}</th><th>{t('التواصل')}</th><th>{t('التفاصيل')}</th>
                  <th>{t('الاشتراك')}</th><th>{t('تاريخ التسجيل')}</th><th></th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {users.map((user, i) => <UserRow key={user.id} user={user} index={i} />)}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </motion.div>
      </div>

      {/* Mobile Cards */}
      <div className="container mobile-only">
        <motion.div className="cards-wrapper"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          {listContent ?? (
            <div className="cards-grid">
              <AnimatePresence>
                {users.map((user, i) => <UserCard key={user.id} user={user} index={i} />)}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>

      {/* Pagination */}
      {meta.last_page > 1 && (
        <div className="container">
          <motion.div className="pagination"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <button className="pag-btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              <ChevronRight size={15} /> {t('السابق')}
            </button>
            <div className="pag-pages">
              {pageNumbers().map((p, i) =>
                p === '…'
                  ? <span key={`e-${i}`} className="pag-ellipsis">…</span>
                  : <button key={p} className={`pag-btn pag-num ${p === page ? 'active' : ''}`}
                      onClick={() => setPage(p)}>{p}</button>
              )}
            </div>
            <button className="pag-btn" disabled={page >= meta.last_page} onClick={() => setPage((p) => p + 1)}>
              {t('التالي')} <ChevronPrev size={15} />
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AllUsersList;