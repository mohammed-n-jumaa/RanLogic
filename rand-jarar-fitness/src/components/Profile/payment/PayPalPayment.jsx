import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPaypal, FaCheckCircle, FaExclamationTriangle, FaLock } from 'react-icons/fa';
import { useProfileLanguage } from '../../../contexts/ProfileLanguageContext';
import subscriptionApi from '../../../api/subscriptionApi';
import Swal from 'sweetalert2';

const PayPalPayment = ({ planType, duration, amount, originalAmount, discountPercentage, onSuccess, onCancel }) => {
  const { t } = useProfileLanguage();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayPalPayment = async () => {
    setIsProcessing(true);

    try {
      const subscriptionData = {
        plan_type: planType,
        duration: duration,
        amount: parseFloat(amount),
        original_amount: parseFloat(originalAmount),
        discount_percentage: discountPercentage,
        payment_method: 'paypal'
      };

      const response = await subscriptionApi.createPayPalPayment(subscriptionData);
      
      if (response.success && response.data.approval_url) {
        window.location.href = response.data.approval_url;
      } else {
        throw new Error('Failed to create PayPal payment');
      }
    } catch (error) {
      setIsProcessing(false);
      console.error('PayPal payment error:', error);
      
      Swal.fire({
        title: t('فشل الدفع', 'Payment Failed'),
        text: error.response?.data?.message || t('حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى', 'An error occurred while processing payment. Please try again'),
        icon: 'error',
        confirmButtonText: t('حسناً', 'OK'),
        confirmButtonColor: '#FDB813'
      });
    }
  };

  return (
    <div className="paypal-payment">
      <div className="payment-info">
        <div className="amount-display">
          <span className="amount-label">{t('المبلغ المطلوب:', 'Amount Due:')}</span>
          <span className="amount-value">${amount}</span>
        </div>

        <div className="payment-note">
          <FaExclamationTriangle />
          <p>
            {t('سيتم توجيهك إلى صفحة PayPal الآمنة', "You will be redirected to PayPal's secure page")}
          </p>
        </div>
      </div>

      <motion.button
        className={`paypal-button ${isProcessing ? 'processing' : ''}`}
        onClick={handlePayPalPayment}
        disabled={isProcessing}
        whileHover={!isProcessing ? { scale: 1.02 } : {}}
        whileTap={!isProcessing ? { scale: 0.98 } : {}}
      >
        {isProcessing ? (
          <>
            <div className="spinner"></div>
            {t('جاري المعالجة...', 'Processing...')}
          </>
        ) : (
          <>
            <FaPaypal className="paypal-icon" />
            {t('ادفع عبر PayPal', 'Pay with PayPal')}
          </>
        )}
      </motion.button>

      <div className="payment-security">
        <FaLock />
        <span>{t('دفع آمن محمي بواسطة PayPal', 'Secure payment protected by PayPal')}</span>
      </div>

      <button className="back-btn" onClick={onCancel} disabled={isProcessing}>
        {t('رجوع', 'Back')}
      </button>
    </div>
  );
};

export default PayPalPayment;