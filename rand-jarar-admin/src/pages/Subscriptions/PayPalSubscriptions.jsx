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
  Calendar
} from 'lucide-react';
import Swal from 'sweetalert2';
import subscriptionsApi from '../../api/subscriptionsApi';
import SubscriptionCard from '../../components/SubscriptionCard/SubscriptionCard';
import SubscriptionFormModal from '../../components/SubscriptionFormModal/SubscriptionFormModal';
import './PayPalSubscriptions.scss';

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
    totalRevenue: 0
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

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
      Swal.fire({
        title: 'خطأ',
        text: 'فشل تحميل البيانات',
        icon: 'error',
        confirmButtonColor: '#e91e63'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (data) => {
    const now = new Date();
    const active = data.filter(s => 
      s.status === 'approved' && 
      new Date(s.ends_at) > now
    ).length;
    
    const expired = data.filter(s => 
      s.status === 'approved' && 
      new Date(s.ends_at) <= now
    ).length;

    const totalRevenue = data
      .filter(s => s.status === 'approved')
      .reduce((sum, s) => sum + parseFloat(s.amount || 0), 0);

    setStats({
      total: data.length,
      active,
      expired,
      totalRevenue: totalRevenue.toFixed(2)
    });
  };

  const applyFilters = () => {
    let filtered = [...subscriptions];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(sub =>
        sub.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.paypal_order_id?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'expired') {
        filtered = filtered.filter(sub => 
          sub.status === 'approved' && 
          new Date(sub.ends_at) <= new Date()
        );
      } else {
        filtered = filtered.filter(sub => sub.status === statusFilter);
      }
    }

    // Plan filter
    if (planFilter !== 'all') {
      filtered = filtered.filter(sub => sub.plan_type === planFilter);
    }

    setFilteredSubscriptions(filtered);
  };

  const handleEdit = (subscription) => {
    setSelectedSubscription(subscription);
    setIsModalOpen(true);
  };

  const handleDelete = async (subscription) => {
    const result = await Swal.fire({
      title: 'تأكيد الحذف',
      text: 'هل أنت متأكد من حذف هذا الاشتراك؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e91e63',
      cancelButtonColor: '#607d8b',
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء'
    });

    if (!result.isConfirmed) return;

    try {
      const response = await subscriptionsApi.deleteSubscription(subscription.id);

      if (response.success) {
        Swal.fire({
          title: 'تم الحذف',
          text: 'تم حذف الاشتراك بنجاح',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });

        fetchSubscriptions();
      }
    } catch (error) {
      console.error('Error deleting subscription:', error);
      Swal.fire({
        title: 'خطأ',
        text: 'فشل حذف الاشتراك',
        icon: 'error',
        confirmButtonColor: '#e91e63'
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
    // Export functionality
    Swal.fire({
      title: 'قريباً',
      text: 'ميزة التصدير قيد التطوير',
      icon: 'info',
      confirmButtonColor: '#e91e63'
    });
  };

  // Group subscriptions by plan
  const groupedSubscriptions = () => {
    const groups = {
      basic: [],
      nutrition: [],
      elite: [],
      vip: [],
      expired: []
    };

    const now = new Date();

    filteredSubscriptions.forEach(sub => {
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
      basic: 'الخطة الأساسية',
      nutrition: 'خطة التغذية',
      elite: 'الخطة المتميزة',
      vip: 'الخطة VIP',
      expired: 'اشتراكات منتهية'
    };
    return names[type] || type;
  };

  const getPlanIcon = (type) => {
    const icons = {
      basic: '💪',
      nutrition: '🥗',
      elite: '🔥',
      vip: '👑',
      expired: '⏰'
    };
    return icons[type] || '📦';
  };

  if (isLoading) {
    return (
      <div className="paypal-subscriptions">
        <div className="paypal-subscriptions__loading">
          <div className="spinner-large"></div>
          <p>جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  const groups = groupedSubscriptions();

  return (
    <div className="paypal-subscriptions">
      {/* Header */}
      <motion.div
        className="paypal-subscriptions__header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="paypal-subscriptions__header-content">
          <div className="paypal-subscriptions__title-section">
            <h1 className="paypal-subscriptions__title">
              <CreditCard size={32} />
              اشتراكات PayPal
            </h1>
            <p className="paypal-subscriptions__subtitle">
              إدارة جميع اشتراكات PayPal والمدفوعات
            </p>
          </div>

          <div className="paypal-subscriptions__actions">
            <button
              className="paypal-subscriptions__action-btn"
              onClick={() => fetchSubscriptions()}
            >
              <RefreshCw size={18} />
              <span>تحديث</span>
            </button>

            <button
              className="paypal-subscriptions__action-btn"
              onClick={exportData}
            >
              <Download size={18} />
              <span>تصدير</span>
            </button>

            <button
              className="paypal-subscriptions__add-btn"
              onClick={handleAddNew}
            >
              <Plus size={18} />
              <span>إضافة اشتراك</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="paypal-subscriptions__stats"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="stat-card stat-card--blue">
          <div className="stat-card__icon">
            <CreditCard size={24} />
          </div>
          <div className="stat-card__content">
            <div className="stat-card__value">{stats.total}</div>
            <div className="stat-card__label">إجمالي الاشتراكات</div>
          </div>
        </div>

        <div className="stat-card stat-card--success">
          <div className="stat-card__icon">
            <CheckCircle size={24} />
          </div>
          <div className="stat-card__content">
            <div className="stat-card__value">{stats.active}</div>
            <div className="stat-card__label">اشتراكات نشطة</div>
          </div>
        </div>

        <div className="stat-card stat-card--warning">
          <div className="stat-card__icon">
            <Clock size={24} />
          </div>
          <div className="stat-card__content">
            <div className="stat-card__value">{stats.expired}</div>
            <div className="stat-card__label">اشتراكات منتهية</div>
          </div>
        </div>

        <div className="stat-card stat-card--pink">
          <div className="stat-card__icon">
            <Calendar size={24} />
          </div>
          <div className="stat-card__content">
            <div className="stat-card__value">${stats.totalRevenue}</div>
            <div className="stat-card__label">إجمالي الإيرادات</div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="paypal-subscriptions__filters"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="paypal-subscriptions__search">
          <Search size={20} />
          <input
            type="text"
            placeholder="ابحث عن متدرب، بريد إلكتروني، أو رقم طلب..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button
          className="paypal-subscriptions__filter-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} />
          <span>فلاتر</span>
        </button>
      </motion.div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="paypal-subscriptions__filter-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="filter-group">
              <label>الحالة:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">الكل</option>
                <option value="approved">نشط</option>
                <option value="pending">قيد الانتظار</option>
                <option value="expired">منتهي</option>
                <option value="cancelled">ملغي</option>
              </select>
            </div>

            <div className="filter-group">
              <label>نوع الخطة:</label>
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
              >
                <option value="all">الكل</option>
                <option value="basic">الخطة الأساسية</option>
                <option value="nutrition">خطة التغذية</option>
                <option value="elite">الخطة المتميزة</option>
                <option value="vip">الخطة VIP</option>
              </select>
            </div>

            <button
              className="filter-reset"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setPlanFilter('all');
              }}
            >
              إعادة تعيين
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subscriptions by Plan */}
      <div className="paypal-subscriptions__content">
        {Object.entries(groups).map(([planType, subs]) => {
          if (subs.length === 0) return null;

          return (
            <motion.div
              key={planType}
              className="plan-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="plan-section__header">
                <h2 className="plan-section__title">
                  <span className="plan-section__icon">{getPlanIcon(planType)}</span>
                  {getPlanName(planType)}
                  <span className="plan-section__count">({subs.length})</span>
                </h2>
              </div>

              <div className="plan-section__grid">
                <AnimatePresence>
                  {subs.map(subscription => (
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
            className="paypal-subscriptions__empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <CreditCard size={64} />
            <h3>لا توجد اشتراكات</h3>
            <p>لم يتم العثور على اشتراكات مطابقة للفلاتر المحددة</p>
            <button
              className="paypal-subscriptions__empty-btn"
              onClick={handleAddNew}
            >
              <Plus size={18} />
              إضافة اشتراك جديد
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