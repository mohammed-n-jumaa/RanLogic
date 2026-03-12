import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';
import './SuccessMessage.scss';

const SuccessMessage = ({ message, isVisible, onClose }) => {
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
    <div className="success-message-overlay">
      <div className="success-message">
        <div className="message-content">
          <CheckCircle className="success-icon" size={24} />
          <div className="message-text">
            <strong>تم بنجاح!</strong>
            <p>{message}</p>
          </div>
        </div>
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default SuccessMessage;