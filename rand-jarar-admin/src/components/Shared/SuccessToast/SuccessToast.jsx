import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';
import './SuccessToast.scss';
import { t } from '../../../i18n';

const SuccessToast = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="success-toast">
      <div className="toast-content">
        <CheckCircle size={24} />
        <div className="toast-message">
          <strong>{t('تم!')}</strong>
          <p>{message}</p>
        </div>
      </div>
      <button className="toast-close" onClick={onClose}>
        <X size={20} />
      </button>
    </div>
  );
};

export default SuccessToast;