import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Search,
  Filter,
  RefreshCw,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import Swal from 'sweetalert2';
import subscriptionsApi from '../../api/subscriptionsApi';
import SubscriptionCard from '../../components/SubscriptionCard/SubscriptionCard';
import SubscriptionFormModal from '../../components/SubscriptionFormModal/SubscriptionFormModal';
import ApprovalModal from '../../components/ApprovalModal/ApprovalModal';
import './BankTransferSubscriptions.scss';

const BankTransferSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [approvalAction, setApprovalAction] = useState('approve');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    expired: 0
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
      const response = await subscriptionsApi.getBankTransferSubscriptions();
      
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
    const pending = data.filter(s => s.status === 'pending').length;
    const approved = data.filter(s => s.status === 'approved' && new Date(s.ends_at) > now).length;
    const rejected = data.filter(s => s.status === 'rejected').length;
    const expired = data.filter(s => 
      s.status === 'approved' && 
      new Date(s.ends_at) <= now
    ).length;

    setStats({
      total: data.length,
      pending,
      approved,
      rejected,
      expired
    });
  };

  const applyFilters = () => {
    let filtered = [...subscriptions];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(sub =>
        sub.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.bank_transfer_number?.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleApprove = (subscription) => {
    setSelectedSubscription(subscription);
    setApprovalAction('approve');
    setIsApprovalModalOpen(true);
  };

  const handleReject = (subscription) => {
    setSelectedSubscription(subscription);
    setApprovalAction('reject');
    setIsApprovalModalOpen(true);
  };

  const handleApprovalSubmit = async (data) => {
    try {
      let response;
      
      if (approvalAction === 'approve') {
        response = await subscriptionsApi.approveBankTransfer(selectedSubscription.id, data);
      } else {
        response = await subscriptionsApi.rejectBankTransfer(selectedSubscription.id, data);
      }

      if (response.success) {
        Swal.fire({
          title: 'نجح',
          text: approvalAction === 'approve' ? 'تم تفعيل الاشتراك بنجاح' : 'تم رفض الاشتراك',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });

        setIsApprovalModalOpen(false);
        fetchSubscriptions();
      }
    } catch (error) {
      console.error('Error processing subscription:', error);
      Swal.fire({
        title: 'خطأ',
        text: error.response?.data?.message || 'فشل معالجة الطلب',
        icon: 'error',
        confirmButtonColor: '#e91e63'
      });
    }
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

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedSubscription(null);
  };

  const handleSuccess = () => {
    fetchSubscriptions();
  };

  const exportData = () => {
    Swal.fire({
      title: 'قريباً',
      text: 'ميزة التصدير قيد التطوير',
      icon: 'info',
      confirmButtonColor: '#e91e63'
    });
  };

  // Group subscriptions by status
  const groupedSubscriptions = () => {
    const groups = {
      pending: [],
      approved: [],
      rejected: [],
      expired: []
    };

    const now = new Date();

    filteredSubscriptions.forEach(sub => {
      if (sub.status === 'approved' && new Date(sub.ends_at) <= now) {
        groups.expired.push(sub);
      } else {
        groups[sub.status]?.push(sub);
      }
    });

    return groups;
  };

  const getStatusName = (status) => {
    const names = {
      pending: 'طلبات قيد الانتظار',
      approved: 'اشتراكات نشطة',
      rejected: 'طلبات مرفوضة',
      expired: 'اشتراكات منتهية'
    };
    return names[status] || status;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      approved: '✅',
      rejected: '❌',
      expired: '⏰'
    };
    return icons[status] || '📦';
  };

  if (isLoading) {
    return (
      <div className="bank-transfer-subscriptions">
        <div className="bank-transfer-subscriptions__loading">
          <div className="spinner-large"></div>
          <p>جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  const groups = groupedSubscriptions();

  return (
    <div className="bank-transfer-subscriptions">
      {/* Header */}
      <motion.div
        className="bank-transfer-subscriptions__header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bank-transfer-subscriptions__header-content">
          <div className="bank-transfer-subscriptions__title-section">
            <h1 className="bank-transfer-subscriptions__title">
              <Building2 size={32} />
              اشتراكات التحويل البنكي
            </h1>
            <p className="bank-transfer-subscriptions__subtitle">
              إدارة طلبات الاشتراك عبر التحويل البنكي والموافقة عليها
            </p>
          </div>

          <div className="bank-transfer-subscriptions__actions">
            <button
              className="bank-transfer-subscriptions__action-btn"
              onClick={() => fetchSubscriptions()}
            >
              <RefreshCw size={18} />
              <span>تحديث</span>
            </button>

            <button
              className="bank-transfer-subscriptions__action-btn"
              onClick={exportData}
            >
              <Download size={18} />
              <span>تصدير</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="bank-transfer-subscriptions__stats"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="stat-card stat-card--blue">
          <div className="stat-card__icon">
            <Building2 size={24} />
          </div>
          <div className="stat-card__content">
            <div className="stat-card__value">{stats.total}</div>
            <div className="stat-card__label">إجمالي الطلبات</div>
          </div>
        </div>

        <div className="stat-card stat-card--warning">
          <div className="stat-card__icon">
            <Clock size={24} />
          </div>
          <div className="stat-card__content">
            <div className="stat-card__value">{stats.pending}</div>
            <div className="stat-card__label">قيد الانتظار</div>
          </div>
        </div>

        <div className="stat-card stat-card--success">
          <div className="stat-card__icon">
            <CheckCircle size={24} />
          </div>
          <div className="stat-card__content">
            <div className="stat-card__value">{stats.approved}</div>
            <div className="stat-card__label">مفعلة</div>
          </div>
        </div>

        <div className="stat-card stat-card--danger">
          <div className="stat-card__icon">
            <XCircle size={24} />
          </div>
          <div className="stat-card__content">
            <div className="stat-card__value">{stats.rejected}</div>
            <div className="stat-card__label">مرفوضة</div>
          </div>
        </div>

        <div className="stat-card stat-card--secondary">
          <div className="stat-card__icon">
            <AlertCircle size={24} />
          </div>
          <div className="stat-card__content">
            <div className="stat-card__value">{stats.expired}</div>
            <div className="stat-card__label">منتهية</div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="bank-transfer-subscriptions__filters"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="bank-transfer-subscriptions__search">
          <Search size={20} />
          <input
            type="text"
            placeholder="ابحث عن متدرب، بريد إلكتروني، أو رقم تحويل..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button
          className="bank-transfer-subscriptions__filter-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} />
          <span>فلاتر</span>
        </button>
      </motion.div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="bank-transfer-subscriptions__filter-panel"
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
                <option value="pending">قيد الانتظار</option>
                <option value="approved">مفعل</option>
                <option value="rejected">مرفوض</option>
                <option value="expired">منتهي</option>
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

      {/* Subscriptions by Status */}
      <div className="bank-transfer-subscriptions__content">
        {Object.entries(groups).map(([status, subs]) => {
          if (subs.length === 0) return null;

          return (
            <motion.div
              key={status}
              className="status-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="status-section__header">
                <h2 className="status-section__title">
                  <span className="status-section__icon">{getStatusIcon(status)}</span>
                  {getStatusName(status)}
                  <span className="status-section__count">({subs.length})</span>
                </h2>
              </div>

              <div className="status-section__grid">
                <AnimatePresence>
                  {subs.map(subscription => (
                    <SubscriptionCard
                      key={subscription.id}
                      subscription={subscription}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onApprove={handleApprove}
                      onReject={handleReject}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}

        {filteredSubscriptions.length === 0 && (
          <motion.div
            className="bank-transfer-subscriptions__empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Building2 size={64} />
            <h3>لا توجد طلبات</h3>
            <p>لم يتم العثور على طلبات مطابقة للفلاتر المحددة</p>
          </motion.div>
        )}
      </div>

      {/* Edit Modal */}
      <SubscriptionFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        subscription={selectedSubscription}
        onSuccess={handleSuccess}
        paymentMethod="bank_transfer"
      />

      {/* Approval Modal */}
      <ApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        subscription={selectedSubscription}
        action={approvalAction}
        onSubmit={handleApprovalSubmit}
      />
    </div>
  );
};

export default BankTransferSubscriptions;