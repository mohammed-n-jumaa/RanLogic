import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  X,
  ChevronDown
} from 'lucide-react';
import notify from '../../lib/notify';
import subscriptionsApi from '../../api/subscriptionsApi';
import SubscriptionCard from '../../components/SubscriptionCard/SubscriptionCard';
import SubscriptionFormModal from '../../components/SubscriptionFormModal/SubscriptionFormModal';
import './PayPalSubscriptions.scss';
import { t } from '../../i18n';

const PayPalSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    totalRevenue: 0,
  });

  const [searchQuery, setSearchQuery] = useState('');
const [statusFilter, setStatusFilter] = useState('approved');
  const [planFilter, setPlanFilter] = useState('all');
  const [expandedPlan, setExpandedPlan] = useState(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [subscriptions, searchQuery, statusFilter, planFilter]);

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    try {
      const response = await subscriptionsApi.getPayPalSubscriptions();
      if (response.success) {
        setSubscriptions(response.data || []);
        calculateStats(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      notify.fire({
        title: t('خطأ'),
        text: t('فشل تحميل البيانات'),
        icon: 'error',
        confirmButtonColor: '#e91e63',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (data) => {
    const now = new Date();
    const active = data.filter(
      (s) => s.status === 'approved' && new Date(s.ends_at) > now
    ).length;
    const expired = data.filter(
      (s) => s.status === 'approved' && new Date(s.ends_at) <= now
    ).length;
    const totalRevenue = data
      .filter((s) => s.status === 'approved')
      .reduce((sum, s) => sum + parseFloat(s.amount || 0), 0);

    setStats({
      total: data.length,
      active,
      expired,
      totalRevenue: totalRevenue.toFixed(2),
    });
  };

  const applyFilters = () => {
    let filtered = [...subscriptions];

    if (searchQuery) {
      filtered = filtered.filter(
        (sub) =>
          sub.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.paypal_order_id?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'expired') {
        filtered = filtered.filter(
          (sub) =>
            sub.status === 'approved' && new Date(sub.ends_at) <= new Date()
        );
      } else {
        filtered = filtered.filter((sub) => sub.status === statusFilter);
      }
    }

    if (planFilter !== 'all') {
      filtered = filtered.filter((sub) => sub.plan_type === planFilter);
    }

    setFilteredSubscriptions(filtered);
  };

  const handleEdit = (subscription) => {
    setSelectedSubscription(subscription);
    setIsModalOpen(true);
  };

  const handleDelete = async (subscription) => {
    const result = await notify.fire({
      title: t('تأكيد الحذف'),
      text: t('هل أنت متأكد من حذف هذا الاشتراك؟'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e91e63',
      cancelButtonColor: '#607d8b',
      confirmButtonText: t('نعم، احذف'),
      cancelButtonText: t('إلغاء'),
    });

    if (!result.isConfirmed) return;

    try {
      const response = await subscriptionsApi.deleteSubscription(
        subscription.id
      );
      if (response.success) {
        notify.fire({
          title: t('تم الحذف'),
          text: t('تم حذف الاشتراك بنجاح'),
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
        fetchSubscriptions();
      }
    } catch (error) {
      console.error('Error deleting subscription:', error);
      notify.fire({
        title: t('خطأ'),
        text: t('فشل حذف الاشتراك'),
        icon: 'error',
        confirmButtonColor: '#e91e63',
      });
    }
  };

  const handleAddNew = () => {
    setSelectedSubscription(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedSubscription(null);
  };

  const handleSuccess = () => {
    fetchSubscriptions();
  };

  const exportData = () => {
    notify.fire({
      title: t('قريباً'),
      text: t('ميزة التصدير قيد التطوير'),
      icon: 'info',
      confirmButtonColor: '#e91e63',
    });
  };

  const groupedSubscriptions = () => {
    const groups = {
      elite: [],
      vip: [],
      nutrition: [],
      basic: [],
      expired: [],
    };

    const now = new Date();

    filteredSubscriptions.forEach((sub) => {
      if (sub.status === 'approved' && new Date(sub.ends_at) <= now) {
        groups.expired.push(sub);
      } else {
        groups[sub.plan_type]?.push(sub);
      }
    });

    return groups;
  };

  const getPlanName = (type) => {
    const names = {
      basic: t('الخطة الأساسية'),
      nutrition: t('خطة التغذية'),
      elite: t('الخطة المتميزة'),
      vip: t('الخطة VIP'),
      expired: t('اشتراكات منتهية'),
    };
    return names[type] || type;
  };

  const getPlanIcon = (type) => {
    const icons = {
      basic: '💪',
      nutrition: '🥗',
      elite: '🔥',
      vip: '👑',
      expired: '⏰',
    };
    return icons[type] || '📦';
  };

  const pct = (n) =>
    stats.total > 0 ? Math.round((n / stats.total) * 100) : 0;

  if (isLoading) {
    return (
      <div className="pp">
        <div className="pp__loader">
          <div className="pp__loader-spin" />
          <span>{t('جاري تحميل الاشتراكات...')}</span>
        </div>
      </div>
    );
  }

  const groups = groupedSubscriptions();
  const hasFilters =
    searchQuery || statusFilter !== 'all' || planFilter !== 'all';

  return (
    <div className="pp">
      {/* ── Top Bar ── */}
      <div className="pp__topbar">
        <div>
          <h1 className="pp__title">{t('اشتراكات PayPal')}</h1>
          <p className="pp__desc">{t('إدارة الاشتراكات والمدفوعات')}</p>
        </div>
        <div className="pp__topbar-acts">
          <button className="pp__icon-btn" onClick={fetchSubscriptions} title={t('تحديث')}>
            <RefreshCw size={15} />
          </button>
          <button className="pp__icon-btn" onClick={exportData} title={t('تصدير')}>
            <Download size={15} />
          </button>
          <motion.button
            className="pp__add"
            onClick={handleAddNew}
            whileTap={{ scale: 0.97 }}
          >
            <Plus size={16} />
            <span>{t('إضافة اشتراك')}</span>
          </motion.button>
        </div>
      </div>

      {/* ── Stats Strip ── */}
      <div className="pp__stats">
        <div className="pp__stat">
          <CreditCard size={18} className="pp__stat-ic pp__stat-ic--blue" />
          <span className="pp__stat-num">{stats.total}</span>
          <span className="pp__stat-label">{t('إجمالي')}</span>
        </div>
        <div className="pp__stat-sep" />
        <div className="pp__stat">
          <CheckCircle size={18} className="pp__stat-ic pp__stat-ic--green" />
          <span className="pp__stat-num">{stats.active}</span>
          <span className="pp__stat-label">{t('نشط')}</span>
          <span className="pp__stat-pct pp__stat-pct--green">{pct(stats.active)}%</span>
        </div>
        <div className="pp__stat-sep" />
        <div className="pp__stat">
          <Clock size={18} className="pp__stat-ic pp__stat-ic--yellow" />
          <span className="pp__stat-num">{stats.expired}</span>
          <span className="pp__stat-label">{t('منتهي')}</span>
          <span className="pp__stat-pct pp__stat-pct--yellow">{pct(stats.expired)}%</span>
        </div>
        <div className="pp__stat-sep" />
        <div className="pp__stat">
          <DollarSign size={18} className="pp__stat-ic pp__stat-ic--pink" />
          <span className="pp__stat-num">${stats.totalRevenue}</span>
          <span className="pp__stat-label">{t('إيرادات')}</span>
        </div>
      </div>

      {/* ── Search + Filters ── */}
      <div className="pp__toolbar">
        <div className="pp__search">
          <Search size={16} className="pp__search-ic" />
          <input
            type="text"
            placeholder={t('ابحث بالاسم أو البريد أو رقم الطلب...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="pp__search-x" onClick={() => setSearchQuery('')}>
              <X size={14} />
            </button>
          )}
        </div>

        <select
          className="pp__select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">{t('كل الحالات')}</option>
          <option value="approved">{t('نشط')}</option>
          <option value="pending">{t('قيد الانتظار')}</option>
          <option value="expired">{t('منتهي')}</option>
          <option value="cancelled">{t('ملغي')}</option>
        </select>

        <select
          className="pp__select"
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
        >
          <option value="all">{t('كل الخطط')}</option>
          <option value="basic">{t('الأساسية')}</option>
          <option value="nutrition">{t('التغذية')}</option>
          <option value="elite">{t('المتميزة')}</option>
          <option value="vip">VIP</option>
        </select>

        {hasFilters && (
          <button
            className="pp__clear-filters"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setPlanFilter('all');
            }}
          >
            <X size={14} /> {t('مسح الفلاتر')}
          </button>
        )}
      </div>

      {/* ── Plan Groups ── */}
      <div className="pp__plans">
        {Object.entries(groups).map(([planType, subs]) => {
          if (subs.length === 0) return null;

          return (
            <motion.div
              key={planType}
              className="pp__plan"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="pp__plan-head">
                <span className="pp__plan-emoji">{getPlanIcon(planType)}</span>
                <span className="pp__plan-name">{getPlanName(planType)}</span>
                <span className="pp__plan-count">{subs.length}</span>
              </div>

              <div className="pp__plan-grid">
                <AnimatePresence>
                  {subs.map((subscription) => (
                    <SubscriptionCard
                      key={subscription.id}
                      subscription={subscription}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}

        {filteredSubscriptions.length === 0 && (
          <motion.div
            className="pp__empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <CreditCard size={40} />
            <h3>{t('لا توجد اشتراكات')}</h3>
            <p>{t('لم يتم العثور على اشتراكات مطابقة')}</p>
            <button className="pp__empty-btn" onClick={handleAddNew}>
              <Plus size={16} /> {t('إضافة اشتراك جديد')}
            </button>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <SubscriptionFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        subscription={selectedSubscription}
        onSuccess={handleSuccess}
        paymentMethod="paypal"
      />
    </div>
  );
};

export default PayPalSubscriptions;