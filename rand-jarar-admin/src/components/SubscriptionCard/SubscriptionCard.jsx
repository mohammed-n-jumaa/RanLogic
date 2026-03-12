import React from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Calendar,
  DollarSign,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  Edit2,
  Trash2,
  Image as ImageIcon,
  FileText
} from 'lucide-react';
import './SubscriptionCard.scss';

const SubscriptionCard = ({ 
  subscription, 
  onEdit, 
  onDelete, 
  onApprove, 
  onReject,
  showActions = true 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'danger';
      case 'cancelled':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={16} />;
      case 'pending':
        return <Clock size={16} />;
      case 'rejected':
      case 'cancelled':
        return <XCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'approved':
        return 'نشط';
      case 'pending':
        return 'قيد الانتظار';
      case 'rejected':
        return 'مرفوض';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

  const getPlanColor = (planType) => {
    switch (planType) {
      case 'basic':
        return 'blue';
      case 'nutrition':
        return 'green';
      case 'elite':
        return 'pink';
      case 'vip':
        return 'gold';
      default:
        return 'blue';
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isExpired = subscription.ends_at && new Date(subscription.ends_at) < new Date();

  // ✅ نفس منطق الهيدر/السبسكربشن: استبدال default-avatar-male/female بصور الهيدر
  const getDefaultAvatar = (user) => {
    const fallback = 'https://i.postimg.cc/WpqHf2CH/download.png';
    if (!user) return fallback;

    const avatarUrl = user.avatar_url || '';

    // لو صورة مرفوعة فعلًا (مو default-avatar)
    const isServerDefault = !avatarUrl || String(avatarUrl).includes('default-avatar');
    const hasCustomAvatar = avatarUrl && !isServerDefault;

    if (hasCustomAvatar) return avatarUrl;

    // إذا كانت ديفولت سيرفر male/female نبدّلها بصور الهيدر
    if (avatarUrl && String(avatarUrl).includes('default-avatar-male')) {
      return 'https://i.postimg.cc/VNmvRfK2/0b90cfaf-8167-4730-8de0-8872054ff0c5.jpg';
    }
    if (avatarUrl && String(avatarUrl).includes('default-avatar-female')) {
      return 'https://i.postimg.cc/bvmy9QDq/fee021a6-b60e-4456-abc4-6febcb2353c4.jpg';
    }

    return fallback;
  };

  return (
    <motion.div
      className={`subscription-card subscription-card--${getPlanColor(subscription.plan_type)} ${
        isExpired ? 'subscription-card--expired' : ''
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      {/* Header */}
      <div className="subscription-card__header">
        <div className="subscription-card__user">
          <div className="subscription-card__avatar">
            <img
              src={getDefaultAvatar(subscription.user)}
              alt={subscription.user?.name || 'User'}
              onError={(e) => {
                e.target.src = 'https://i.postimg.cc/WpqHf2CH/download.png';
              }}
            />
          </div>
          <div className="subscription-card__user-info">
            <h3 className="subscription-card__user-name">
              <User size={16} />
              {subscription.user?.name || 'غير محدد'}
            </h3>
            <p className="subscription-card__user-email">{subscription.user?.email}</p>
          </div>
        </div>

        <div className={`subscription-card__status subscription-card__status--${getStatusColor(subscription.status)}`}>
          {getStatusIcon(subscription.status)}
          <span>{getStatusLabel(subscription.status)}</span>
        </div>
      </div>

      {/* Plan Info */}
      <div className="subscription-card__plan">
        <div className="subscription-card__plan-badge">
          {subscription.plan_name}
        </div>
        <div className="subscription-card__duration">
          {subscription.duration_name}
        </div>
      </div>

      {/* Details */}
      <div className="subscription-card__details">
        <div className="subscription-card__detail">
          <DollarSign size={16} />
          <span className="subscription-card__detail-label">المبلغ:</span>
          <span className="subscription-card__detail-value">
            ${subscription.amount}
            {subscription.discount_percentage > 0 && (
              <span className="subscription-card__discount">
                ({subscription.discount_percentage}% خصم)
              </span>
            )}
          </span>
        </div>

        <div className="subscription-card__detail">
          <CreditCard size={16} />
          <span className="subscription-card__detail-label">طريقة الدفع:</span>
          <span className="subscription-card__detail-value">
            {subscription.payment_method_name}
          </span>
        </div>

        {subscription.starts_at && (
          <div className="subscription-card__detail">
            <Calendar size={16} />
            <span className="subscription-card__detail-label">تاريخ البداية:</span>
            <span className="subscription-card__detail-value">
              {formatDate(subscription.starts_at)}
            </span>
          </div>
        )}

        {subscription.ends_at && (
          <div className="subscription-card__detail">
            <Calendar size={16} />
            <span className="subscription-card__detail-label">تاريخ الانتهاء:</span>
            <span className="subscription-card__detail-value">
              {formatDate(subscription.ends_at)}
              {isExpired && <span className="subscription-card__expired-badge">منتهي</span>}
            </span>
          </div>
        )}

        {subscription.bank_transfer_number && (
          <div className="subscription-card__detail">
            <FileText size={16} />
            <span className="subscription-card__detail-label">رقم التحويل:</span>
            <span className="subscription-card__detail-value">
              {subscription.bank_transfer_number}
            </span>
          </div>
        )}

        {subscription.bank_receipt_url && (
          <div className="subscription-card__receipt">
            <a 
              href={subscription.bank_receipt_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="subscription-card__receipt-link"
            >
              <ImageIcon size={16} />
              <span>عرض إيصال التحويل</span>
            </a>
          </div>
        )}

        {subscription.notes && (
          <div className="subscription-card__notes">
            <p>{subscription.notes}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="subscription-card__actions">
          {subscription.status === 'pending' && subscription.payment_method === 'bank_transfer' && (
            <>
              <button
                className="subscription-card__action-btn subscription-card__action-btn--success"
                onClick={() => onApprove?.(subscription)}
              >
                <CheckCircle size={16} />
                <span>تفعيل</span>
              </button>
              <button
                className="subscription-card__action-btn subscription-card__action-btn--danger"
                onClick={() => onReject?.(subscription)}
              >
                <XCircle size={16} />
                <span>رفض</span>
              </button>
            </>
          )}
          
          <button
            className="subscription-card__action-btn"
            onClick={() => onEdit?.(subscription)}
          >
            <Edit2 size={16} />
            <span>تعديل</span>
          </button>
          
          <button
            className="subscription-card__action-btn subscription-card__action-btn--danger"
            onClick={() => onDelete?.(subscription)}
          >
            <Trash2 size={16} />
            <span>حذف</span>
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default SubscriptionCard;
