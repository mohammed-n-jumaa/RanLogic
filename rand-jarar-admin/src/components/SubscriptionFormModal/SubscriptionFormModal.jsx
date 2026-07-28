import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  CreditCard,
  Calendar,
  DollarSign,
  FileText,
  Search,
  Loader
} from 'lucide-react';
import Swal from 'sweetalert2';
import subscriptionsApi from '../../api/subscriptionsApi';
import './SubscriptionFormModal.scss';

const SubscriptionFormModal = ({ 
  isOpen, 
  onClose, 
  subscription = null, 
  onSuccess,
  paymentMethod = 'paypal' 
}) => {
  const [formData, setFormData] = useState({
    user_id: '',
    plan_type: 'basic',
    duration: '1month',
    amount: 0,
    original_amount: 0,
    discount_percentage: 0,
    starts_at: '',
    ends_at: '',
    notes: ''
  });

  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // ✅ نفس منطق الهيدر: ديفولت حسب الجنس (لكن هنا نستنتج الجنس من default-avatar-*.png)
  const getDefaultAvatar = (user) => {
    const fallback = 'https://i.postimg.cc/WpqHf2CH/download.png';
    if (!user) return fallback;

    const avatarUrl = user.avatar_url;

    // لو أفاتار مرفوع فعليًا (مو default-avatar)
    const isServerDefault = !avatarUrl || String(avatarUrl).includes('default-avatar');
    const hasCustomAvatar = avatarUrl && !isServerDefault;

    if (hasCustomAvatar) return avatarUrl;

    // ✅ استنتاج الجنس من رابط الديفولت القادم من السيرفر
    if (avatarUrl && String(avatarUrl).includes('default-avatar-male')) {
      return 'https://i.postimg.cc/VNmvRfK2/0b90cfaf-8167-4730-8de0-8872054ff0c5.jpg';
    }

    if (avatarUrl && String(avatarUrl).includes('default-avatar-female')) {
      return 'https://i.postimg.cc/bvmy9QDq/fee021a6-b60e-4456-abc4-6febcb2353c4.jpg';
    }

    return fallback;
  };

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      fetchPlans();
      
      if (subscription) {
        setFormData({
          user_id: subscription.user_id || '',
          plan_type: subscription.plan_type || 'basic',
          duration: subscription.duration || '1month',
          amount: subscription.amount || 0,
          original_amount: subscription.original_amount || 0,
          discount_percentage: subscription.discount_percentage || 0,
          starts_at: subscription.starts_at ? subscription.starts_at.split(' ')[0] : '',
          ends_at: subscription.ends_at ? subscription.ends_at.split(' ')[0] : '',
          notes: subscription.notes || ''
        });
        
        if (subscription.user) {
          setSelectedUser(subscription.user);
        }
      } else {
        resetForm();
      }
    }
  }, [isOpen, subscription]);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await subscriptionsApi.getUsers(searchQuery);
      if (response.success) {
        setUsers(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchPlans = async () => {
    setIsLoadingPlans(true);
    try {
      const response = await subscriptionsApi.getPlans('ar');
      if (response.success) {
        setPlans(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setIsLoadingPlans(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isOpen) {
        fetchUsers();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (formData.plan_type && formData.duration) {
      updatePricing();
    }
  }, [formData.plan_type, formData.duration, plans]);

  const updatePricing = () => {
    const selectedPlan = plans.find(p => p.id === formData.plan_type);
    if (selectedPlan && selectedPlan.pricing[formData.duration]) {
      const pricing = selectedPlan.pricing[formData.duration];
      setFormData(prev => ({
        ...prev,
        amount: pricing.price,
        original_amount: pricing.originalPrice,
        discount_percentage: pricing.discount
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      user_id: '',
      plan_type: 'basic',
      duration: '1month',
      amount: 0,
      original_amount: 0,
      discount_percentage: 0,
      starts_at: '',
      ends_at: '',
      notes: ''
    });
    setSelectedUser(null);
    setSearchQuery('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.user_id) {
      Swal.fire({
        title: 'تنبيه',
        text: 'يرجى اختيار المستخدم',
        icon: 'warning',
        confirmButtonColor: '#e91e63'
      });
      return;
    }

    if (!formData.starts_at || !formData.ends_at) {
      Swal.fire({
        title: 'تنبيه',
        text: 'يرجى تحديد تاريخ البداية والانتهاء',
        icon: 'warning',
        confirmButtonColor: '#e91e63'
      });
      return;
    }

    setIsSaving(true);

    try {
      const data = {
        ...formData,
        payment_method: paymentMethod
      };

      let response;
      if (subscription) {
        response = await subscriptionsApi.updateSubscription(subscription.id, data);
      } else {
        response = await subscriptionsApi.createPayPalSubscription(data);
      }

      if (response.success) {
        Swal.fire({
          title: 'نجح',
          text: subscription ? 'تم تحديث الاشتراك بنجاح' : 'تم إضافة الاشتراك بنجاح',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });

        onSuccess?.();
        onClose();
      }
    } catch (error) {
      console.error('Error saving subscription:', error);
      Swal.fire({
        title: 'خطأ',
        text: error.response?.data?.message || 'فشل حفظ الاشتراك',
        icon: 'error',
        confirmButtonColor: '#e91e63'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setFormData(prev => ({ ...prev, user_id: user.id }));
    setSearchQuery('');
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="subscription-modal-overlay" onClick={onClose}>
        <motion.div
          className="subscription-modal"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="subscription-modal__header">
            <h2 className="subscription-modal__title">
              <CreditCard size={24} />
              {subscription ? 'تعديل الاشتراك' : 'إضافة اشتراك جديد'}
            </h2>
            <button className="subscription-modal__close" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <form className="subscription-modal__body" onSubmit={handleSubmit}>
            {/* User Selection */}
            <div className="form-group">
              <label className="form-label">
                <User size={16} />
                اختر المتدرب *
              </label>
              
              {selectedUser ? (
                <div className="selected-user">
                  <div className="selected-user__info">
                    <div className="selected-user__avatar">
                      {/* ✅ هنا التعديل: نفس منطق الهيدر */}
                      <img
                        src={getDefaultAvatar(selectedUser)}
                        alt={selectedUser.name}
                        onError={(e) => {
                          e.target.src = 'https://i.postimg.cc/WpqHf2CH/download.png';
                        }}
                      />
                    </div>
                    <div>
                      <div className="selected-user__name">{selectedUser.name}</div>
                      <div className="selected-user__email">{selectedUser.email}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="selected-user__remove"
                    onClick={() => {
                      setSelectedUser(null);
                      setFormData(prev => ({ ...prev, user_id: '' }));
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="user-search">
                  <div className="user-search__input">
                    <Search size={18} />
                    <input
                      type="text"
                      placeholder="ابحث عن متدرب..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  {searchQuery && (
                    <div className="user-search__results">
                      {isLoadingUsers ? (
                        <div className="user-search__loading">
                          <Loader className="spinner" size={20} />
                          <span>جاري البحث...</span>
                        </div>
                      ) : filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                          <div
                            key={user.id}
                            className="user-search__item"
                            onClick={() => handleUserSelect(user)}
                          >
                            <div className="user-search__avatar">
                              {/* ✅ هنا التعديل: نفس منطق الهيدر */}
                              <img
                                src={getDefaultAvatar(user)}
                                alt={user.name}
                                onError={(e) => {
                                  e.target.src = 'https://i.postimg.cc/WpqHf2CH/download.png';
                                }}
                              />
                            </div>
                            <div className="user-search__info">
                              <div className="user-search__name">{user.name}</div>
                              <div className="user-search__email">{user.email}</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="user-search__empty">
                          لا توجد نتائج
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Plan Type */}
            <div className="form-group">
              <label className="form-label">نوع الخطة *</label>
              <select
                className="form-select"
                value={formData.plan_type}
                onChange={(e) => setFormData({ ...formData, plan_type: e.target.value })}
                required
              >
                {plans.map(plan => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div className="form-group">
              <label className="form-label">المدة *</label>
              <select
                className="form-select"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
              >
                <option value="1month">شهر واحد</option>
                <option value="3months">3 أشهر</option>
                <option value="6months">6 أشهر</option>
              </select>
            </div>

            {/* Pricing */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <DollarSign size={16} />
                  المبلغ *
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">المبلغ الأصلي</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.original_amount}
                  onChange={(e) => setFormData({ ...formData, original_amount: parseFloat(e.target.value) })}
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label className="form-label">نسبة الخصم %</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.discount_percentage}
                  onChange={(e) => setFormData({ ...formData, discount_percentage: parseInt(e.target.value) })}
                  min="0"
                  max="100"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <Calendar size={16} />
                  تاريخ البداية *
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.starts_at}
                  onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Calendar size={16} />
                  تاريخ الانتهاء *
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.ends_at}
                  onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Notes */}
            <div className="form-group">
              <label className="form-label">
                <FileText size={16} />
                ملاحظات (اختياري)
              </label>
              <textarea
                className="form-textarea"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows="3"
                placeholder="أضف أي ملاحظات..."
              />
            </div>

            {/* Actions */}
            <div className="subscription-modal__actions">
              <button
                type="button"
                className="btn btn--secondary"
                onClick={onClose}
                disabled={isSaving}
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="btn btn--primary"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader className="spinner" size={18} />
                    <span>جاري الحفظ...</span>
                  </>
                ) : (
                  <span>{subscription ? 'تحديث' : 'إضافة'}</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SubscriptionFormModal;
