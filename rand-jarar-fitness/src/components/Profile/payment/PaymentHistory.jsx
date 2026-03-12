import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHistory, FaPaypal, FaCheckCircle, FaCalendarAlt, FaUniversity } from 'react-icons/fa';
import { useProfileLanguage } from '../../../contexts/ProfileLanguageContext';
import subscriptionApi from '../../../api/subscriptionApi';

const PaymentHistory = ({ userData, delay }) => {
  const { t } = useProfileLanguage();
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      const response = await subscriptionApi.getUserSubscriptions();
      
      if (response.success) {
        setPaymentHistory(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '--';
    const date = new Date(dateString);
    return date.toLocaleDateString(t('ar-SA', 'en-US'), { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getPaymentMethodIcon = (method) => {
    return method === 'paypal' ? <FaPaypal /> : <FaUniversity />;
  };

  const getPaymentMethodLabel = (method) => {
    return method === 'paypal' 
      ? 'PayPal' 
      : t('تحويل بنكي', 'Bank Transfer');
  };

  return (
    <motion.div
      className="payment-history-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
    >
      <div className="card-header">
        <h3>{t('سجل المدفوعات', 'Payment History')}</h3>
        <FaHistory className="header-icon" />
      </div>

      <div className="history-list">
        {loading ? (
          <div className="loading-history">
            <div className="spinner"></div>
            <p>{t('جاري التحميل...', 'Loading...')}</p>
          </div>
        ) : paymentHistory.length > 0 ? (
          paymentHistory.slice(0, 5).map((payment, index) => (
            <motion.div
              key={payment.id}
              className="history-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + index * 0.1 }}
            >
              <div className="payment-icon">
                {getPaymentMethodIcon(payment.payment_method)}
              </div>

              <div className="payment-details">
                <h5>{payment.plan_name || t('اشتراك', 'Subscription')}</h5>
                <div className="payment-meta">
                  <span>
                    <FaCalendarAlt /> {formatDate(payment.created_at)}
                  </span>
                  <span>
                    {getPaymentMethodLabel(payment.payment_method)}
                  </span>
                </div>
              </div>

              <div className="payment-amount-status">
                <span className="amount">${payment.amount}</span>
                <span className={`status ${payment.status}`}>
                  <FaCheckCircle /> {payment.status === 'approved' ? t('مكتمل', 'Completed') : t('قيد المراجعة', 'Pending')}
                </span>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="no-history">
            <FaHistory />
            <p>{t('لا يوجد سجل دفعات', 'No payment history')}</p>
          </div>
        )}
      </div>

      {paymentHistory.length > 5 && (
        <button className="view-all-btn">
          {t('عرض جميع المدفوعات', 'View All Payments')}
        </button>
      )}
    </motion.div>
  );
};

export default PaymentHistory;