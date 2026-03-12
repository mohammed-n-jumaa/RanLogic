import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle,
  XCircle,
  Calendar,
  FileText,
  Loader,
  Image as ImageIcon
} from 'lucide-react';
import './ApprovalModal.scss';

const ApprovalModal = ({ 
  isOpen, 
  onClose, 
  subscription, 
  action = 'approve',
  onSubmit 
}) => {
  const [formData, setFormData] = useState({
    starts_at: new Date().toISOString().split('T')[0],
    ends_at: '',
    notes: ''
  });

  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (isOpen && subscription) {
      // Calculate end date based on duration
      const startDate = new Date();
      let endDate = new Date(startDate);

      switch (subscription.duration) {
        case '3months':
          endDate.setMonth(endDate.getMonth() + 3);
          break;
        case '6months':
          endDate.setMonth(endDate.getMonth() + 6);
          break;
        default:
          endDate.setMonth(endDate.getMonth() + 1);
      }

      setFormData({
        starts_at: startDate.toISOString().split('T')[0],
        ends_at: endDate.toISOString().split('T')[0],
        notes: ''
      });
    }
  }, [isOpen, subscription]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await onSubmit(formData);
      setIsSaving(false);
    } catch (error) {
      setIsSaving(false);
    }
  };

  if (!isOpen || !subscription) return null;

  const isApprove = action === 'approve';

  return (
    <AnimatePresence>
      <div className="approval-modal-overlay" onClick={onClose}>
        <motion.div
          className="approval-modal"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`approval-modal__header approval-modal__header--${isApprove ? 'success' : 'danger'}`}>
            <h2 className="approval-modal__title">
              {isApprove ? (
                <>
                  <CheckCircle size={24} />
                  تفعيل الاشتراك
                </>
              ) : (
                <>
                  <XCircle size={24} />
                  رفض الاشتراك
                </>
              )}
            </h2>
            <button className="approval-modal__close" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <form className="approval-modal__body" onSubmit={handleSubmit}>
            {/* Subscription Info */}
            <div className="approval-modal__info">
              <div className="approval-modal__info-item">
                <span className="label">المتدرب:</span>
                <span className="value">{subscription.user?.name}</span>
              </div>
              <div className="approval-modal__info-item">
                <span className="label">الخطة:</span>
                <span className="value">{subscription.plan_name}</span>
              </div>
              <div className="approval-modal__info-item">
                <span className="label">المدة:</span>
                <span className="value">{subscription.duration_name}</span>
              </div>
              <div className="approval-modal__info-item">
                <span className="label">المبلغ:</span>
                <span className="value">${subscription.amount}</span>
              </div>
              {subscription.bank_transfer_number && (
                <div className="approval-modal__info-item">
                  <span className="label">رقم التحويل:</span>
                  <span className="value">{subscription.bank_transfer_number}</span>
                </div>
              )}
            </div>

            {/* Receipt */}
            {subscription.bank_receipt_url && (
              <div className="approval-modal__receipt">
                <h3 className="approval-modal__section-title">
                  <ImageIcon size={18} />
                  إيصال التحويل البنكي
                </h3>
                <a 
                  href={subscription.bank_receipt_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="approval-modal__receipt-link"
                >
                  <img 
                    src={subscription.bank_receipt_url} 
                    alt="Bank Receipt" 
                    className="approval-modal__receipt-image"
                  />
                  <div className="approval-modal__receipt-overlay">
                    <ImageIcon size={32} />
                    <span>انقر لعرض الصورة كاملة</span>
                  </div>
                </a>
              </div>
            )}

            {isApprove && (
              <>
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
              </>
            )}

            {/* Notes */}
            <div className="form-group">
              <label className="form-label">
                <FileText size={16} />
                ملاحظات {!isApprove && '(سبب الرفض)'}
              </label>
              <textarea
                className="form-textarea"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows="3"
                placeholder={isApprove ? 'أضف أي ملاحظات...' : 'اذكر سبب رفض الاشتراك...'}
                required={!isApprove}
              />
            </div>

            {/* Actions */}
            <div className="approval-modal__actions">
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
                className={`btn ${isApprove ? 'btn--success' : 'btn--danger'}`}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader className="spinner" size={18} />
                    <span>جاري المعالجة...</span>
                  </>
                ) : (
                  <span>{isApprove ? 'تفعيل الاشتراك' : 'رفض الاشتراك'}</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ApprovalModal;