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

// ─── helpers ──────────────────────────────────────────────────────────────────

const DEFAULT_AVATAR = 'https://i.postimg.cc/WpqHf2CH/download.png';

const getSubStatus = (user) => {
  if (!user.active_subscription) return 'none';
  return new Date(user.active_subscription.ends_at) >= new Date() ? 'active' : 'expired';
};

const STATUS_META = {
  active:  { label: 'اشتراك نشط',   cls: 'active',  Icon: UserCheck },
  expired: { label: 'اشتراك منتهي', cls: 'expired', Icon: UserX    },
  none:    { label: 'بدون اشتراك',  cls: 'none',    Icon: Clock    },
};

const GOAL_MAP = {
  'weight-loss': 'خسارة وزن',
  'muscle-gain': 'بناء عضلات',
  toning:        'تحسين القوام',
  fitness:       'لياقة عامة',
};

const PLAN_MAP = {
  basic:     'Basic',
  nutrition: 'Nutrition',
  elite:     'Elite',
  vip:       'VIP',
};

const DURATION_MAP = {
  '1month':  'شهر واحد',
  '3months': '3 أشهر',
  '6months': '6 أشهر',
};

const PAYMENT_MAP = {
  paypal:        'PayPal',
  bank_transfer: 'تحويل بنكي',
};

const PLACE_MAP = { home: 'المنزل', gym: 'الجيم' };

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

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
            <h4 className="exp-title"><Activity size={14} /> المعلومات الجسدية</h4>
            <div className="exp-grid">
              {user.age         && <div className="exp-item"><span className="exp-label">العمر</span><span className="exp-val">{user.age} سنة</span></div>}
              {user.height      && <div className="exp-item"><span className="exp-label">الطول</span><span className="exp-val">{user.height} سم</span></div>}
              {user.weight      && <div className="exp-item"><span className="exp-label">الوزن</span><span className="exp-val">{user.weight} كغ</span></div>}
              {user.waist       && <div className="exp-item"><span className="exp-label">الخصر</span><span className="exp-val">{user.waist} سم</span></div>}
              {user.hips        && <div className="exp-item"><span className="exp-label">الأرداف</span><span className="exp-val">{user.hips} سم</span></div>}
              {user.program     && <div className="exp-item"><span className="exp-label">البرنامج</span><span className="exp-val">{user.program}</span></div>}
            </div>
            {user.health_notes && (
              <div className="exp-notes">
                <span className="exp-label">ملاحظات صحية:</span>
                <span>{user.health_notes}</span>
              </div>
            )}
          </div>

          {/* تفاصيل الاشتراك */}
          {sub && (
            <div className="exp-section">
              <h4 className="exp-title">
                <CreditCard size={14} />
                {user.active_subscription ? 'الاشتراك النشط' : 'آخر اشتراك'}
              </h4>
              <div className="exp-grid">
                <div className="exp-item"><span className="exp-label">الخطة</span><span className="exp-val plan">{PLAN_MAP[sub.plan_type] ?? sub.plan_type}</span></div>
                <div className="exp-item"><span className="exp-label">المدة</span><span className="exp-val">{DURATION_MAP[sub.duration] ?? sub.duration}</span></div>
                <div className="exp-item"><span className="exp-label">المبلغ</span><span className="exp-val amount">{fmtAmount(sub.amount, sub.currency)}</span></div>
                {sub.original_amount && sub.original_amount !== sub.amount && (
                  <div className="exp-item"><span className="exp-label">قبل الخصم</span><span className="exp-val original">{fmtAmount(sub.original_amount, sub.currency)}</span></div>
                )}
                {sub.discount_percentage > 0 && (
                  <div className="exp-item"><span className="exp-label">الخصم</span><span className="exp-val discount">{sub.discount_percentage}%</span></div>
                )}
                <div className="exp-item"><span className="exp-label">طريقة الدفع</span><span className="exp-val">{PAYMENT_MAP[sub.payment_method] ?? sub.payment_method}</span></div>
                <div className="exp-item"><span className="exp-label">يبدأ</span><span className="exp-val">{fmtDate(sub.starts_at)}</span></div>
                <div className="exp-item"><span className="exp-label">ينتهي</span><span className="exp-val">{fmtDate(sub.ends_at)}</span></div>
                {sub.bank_transfer_number && (
                  <div className="exp-item"><span className="exp-label">رقم التحويل</span><span className="exp-val">{sub.bank_transfer_number}</span></div>
                )}
              </div>
              {sub.notes && (
                <div className="exp-notes">
                  <span className="exp-label">ملاحظات:</span>
                  <span>{sub.notes}</span>
                </div>
              )}
            </div>
          )}

          <div className="exp-meta">
            <span><Hash size={12} /> إجمالي الاشتراكات: {user.subscriptions_count}</span>
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
            {user.gender && <span className={`tag gender-${user.gender}`}>{user.gender === 'female' ? 'أنثى' : 'ذكر'}</span>}
            {user.goal && <span className="tag goal">{GOAL_MAP[user.goal] ?? user.goal}</span>}
            {user.workout_place && <span className="tag place">{PLACE_MAP[user.workout_place] ?? user.workout_place}</span>}
          </div>
        </td>
        <td className="col-sub">
          <span className={`status-badge ${cls}`}><Icon size={12} />{label}</span>
          {sub && (
            <>
              {sub.plan_type && <div className="sub-plan">{PLAN_MAP[sub.plan_type] ?? sub.plan_type}</div>}
              <div className="sub-end">ينتهي: {fmtDate(sub.ends_at)}</div>
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
              {sub.ends_at ? ` · ينتهي ${fmtDate(sub.ends_at)}` : ''}
            </span>
          </div>
        )}
        <div className="uc-row"><Calendar size={13} /><span>تاريخ التسجيل: {fmtDate(user.created_at)}</span></div>
      </div>

      {/* Tags */}
      <div className="uc-tags">
        {user.gender && <span className={`tag gender-${user.gender}`}>{user.gender === 'female' ? 'أنثى' : 'ذكر'}</span>}
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
                <span className="uce-label"><Activity size={12} /> المعلومات الجسدية</span>
                <div className="uce-grid">
                  {user.age    && <div className="uce-item"><span>العمر</span><strong>{user.age} سنة</strong></div>}
                  {user.height && <div className="uce-item"><span>الطول</span><strong>{user.height} سم</strong></div>}
                  {user.weight && <div className="uce-item"><span>الوزن</span><strong>{user.weight} كغ</strong></div>}
                  {user.waist  && <div className="uce-item"><span>الخصر</span><strong>{user.waist} سم</strong></div>}
                  {user.hips   && <div className="uce-item"><span>الأرداف</span><strong>{user.hips} سم</strong></div>}
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
                  {user.active_subscription ? 'الاشتراك النشط' : 'آخر اشتراك'}
                </span>
                <div className="uce-grid">
                  <div className="uce-item"><span>الخطة</span><strong>{PLAN_MAP[sub.plan_type] ?? sub.plan_type}</strong></div>
                  <div className="uce-item"><span>المدة</span><strong>{DURATION_MAP[sub.duration] ?? sub.duration}</strong></div>
                  <div className="uce-item"><span>المبلغ</span><strong>{fmtAmount(sub.amount, sub.currency)}</strong></div>
                  <div className="uce-item"><span>الدفع</span><strong>{PAYMENT_MAP[sub.payment_method] ?? sub.payment_method}</strong></div>
                  {sub.discount_percentage > 0 && (
                    <div className="uce-item"><span>الخصم</span><strong>{sub.discount_percentage}%</strong></div>
                  )}
                  {sub.bank_transfer_number && (
                    <div className="uce-item"><span>رقم التحويل</span><strong>{sub.bank_transfer_number}</strong></div>
                  )}
                </div>
                {sub.notes && <div className="uce-notes"><FileText size={12} /> {sub.notes}</div>}
              </div>
            )}

            <div className="uce-footer">
              <Hash size={11} /> إجمالي الاشتراكات: {user.subscriptions_count}
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
      Swal.fire({ icon: 'error', title: 'خطأ', text: 'حدث خطأ أثناء جلب البيانات', confirmButtonText: 'حسناً' });
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, filterGender, filterGoal, filterStatus]);

  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchUsers(1); }, 400);
    return () => clearTimeout(t);
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
    <div className="loading-state"><Loader size={34} className="spinner" /><p>جاري التحميل...</p></div>
  ) : users.length === 0 ? (
    <div className="empty-state">
      <Users size={52} /><h3>لا يوجد مستخدمون</h3><p>لم يتم العثور على نتائج مطابقة</p>
      {hasFilters && <button className="btn-outline" onClick={clearFilters}>مسح الفلاتر</button>}
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
                <ChevronLeft size={15} /><span>لوحة التحكم</span>
                <span className="sep">/</span><span className="active-crumb">جميع المستخدمين</span>
              </div>
              <h1 className="page-title"><Users size={26} />جميع المستخدمين</h1>
              <p className="page-sub">عرض كامل لجميع المسجلين — اضغط على أي صف لرؤية التفاصيل الكاملة</p>
            </div>
            <motion.button className="btn-refresh" onClick={() => fetchUsers(page)}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <RefreshCw size={15} />تحديث
            </motion.button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container">
        <motion.div className="stats-grid"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {[
            { label: 'إجمالي المستخدمين', value: stats.total,   mod: 'primary', Icon: Users     },
            { label: 'اشتراك نشط',         value: stats.active,  mod: 'success', Icon: UserCheck },
            { label: 'اشتراك منتهي',       value: stats.expired, mod: 'danger',  Icon: UserX     },
            { label: 'بدون اشتراك',        value: stats.none,    mod: 'warning', Icon: Clock     },
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
              <input type="text" placeholder="ابحث بالاسم أو البريد أو الهاتف..."
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              {searchTerm && <button className="clear-btn" onClick={() => setSearchTerm('')}><X size={13} /></button>}
            </div>
            <button className={`filter-toggle ${isFiltersOpen ? 'open' : ''}`}
              onClick={() => setIsFiltersOpen((v) => !v)}>
              <Filter size={15} />تصفية
              {hasFilters && <span className="filter-dot" />}
              <ChevronDown size={13} className={`chevron ${isFiltersOpen ? 'open' : ''}`} />
            </button>
            {hasFilters && (
              <button className="clear-filters-btn" onClick={clearFilters}><X size={13} />مسح</button>
            )}
          </div>

          <AnimatePresence>
            {isFiltersOpen && (
              <motion.div className="filters-panel"
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                <div className="filters-row">
                  <div className="filter-item">
                    <label>الجنس</label>
                    <select value={filterGender} onChange={(e) => setFilterGender(e.target.value)}>
                      <option value="">الكل</option><option value="female">أنثى</option><option value="male">ذكر</option>
                    </select>
                  </div>
                  <div className="filter-item">
                    <label>الهدف</label>
                    <select value={filterGoal} onChange={(e) => setFilterGoal(e.target.value)}>
                      <option value="">الكل</option>
                      <option value="weight-loss">خسارة وزن</option>
                      <option value="muscle-gain">بناء عضلات</option>
                      <option value="toning">تحسين القوام</option>
                      <option value="fitness">لياقة عامة</option>
                    </select>
                  </div>
                  <div className="filter-item">
                    <label>حالة الاشتراك</label>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                      <option value="">الكل</option>
                      <option value="active">نشط</option>
                      <option value="expired">منتهي</option>
                      <option value="none">بدون اشتراك</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="results-line">
            عرض <strong>{users.length}</strong> من أصل <strong>{meta.total}</strong> مستخدم
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
                  <th>المستخدم</th><th>التواصل</th><th>التفاصيل</th>
                  <th>الاشتراك</th><th>تاريخ التسجيل</th><th></th>
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
              <ChevronRight size={15} /> السابق
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
              التالي <ChevronPrev size={15} />
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AllUsersList;