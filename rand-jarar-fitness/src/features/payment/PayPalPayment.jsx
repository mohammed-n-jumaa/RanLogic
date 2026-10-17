import { useState } from 'react';
import { Lock, ExternalLink, Loader2 } from 'lucide-react';
import { FaPaypal } from '@/components/common/SocialIcons';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';
import { useProfileFeedback } from '../profile/shell/feedbackContext';
import subscriptionApi from '../../api/subscriptionApi';

const PayPalPayment = ({ planType, duration, amount, originalAmount, discountPercentage, onCancel }) => {
  const { t } = useProfileLanguage();
  const { toast } = useProfileFeedback();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayPalPayment = async () => {
    setIsProcessing(true);
    try {
      const response = await subscriptionApi.createPayPalPayment({
        plan_type: planType,
        duration,
        amount: parseFloat(amount),
        original_amount: parseFloat(originalAmount),
        discount_percentage: discountPercentage,
        payment_method: 'paypal',
      });

      if (response.success && response.data.approval_url) {
        window.location.href = response.data.approval_url;       // PayPal brings the user back afterwards
      } else {
        throw new Error('Failed to create PayPal payment');
      }
    } catch (error) {
      console.error('PayPal payment error:', error);
      setIsProcessing(false);
      toast(error.response?.data?.message
        || t('حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى', 'Something went wrong with the payment. Please try again'), 'error');
    }
  };

  return (
    <div className="pay-step">
      <div className="pay-step__amount">
        <span>{t('المبلغ المطلوب', 'Amount due')}</span>
        <strong className="pf-num">${amount}</strong>
      </div>

      <p className="pay-step__note"><ExternalLink /> {t('رح ننقلك لصفحة PayPal الآمنة لإتمام الدفع، وبترجع هون بعدها.', "You'll be taken to PayPal's secure page, then brought back here.")}</p>

      <button type="button" className="pay-paypal-btn" onClick={handlePayPalPayment} disabled={isProcessing}>
        {isProcessing ? <Loader2 className="pf-spin" /> : <FaPaypal />}
        {isProcessing ? t('جاري التحويل…', 'Redirecting…') : t('ادفع عبر PayPal', 'Pay with PayPal')}
      </button>

      <p className="pay-step__secure"><Lock /> {t('دفع آمن محمي بواسطة PayPal', 'Secure payment protected by PayPal')}</p>

      <button type="button" className="pf-btn pf-btn--ghost pf-btn--block" onClick={onCancel} disabled={isProcessing}>
        {t('رجوع', 'Back')}
      </button>
    </div>
  );
};

export default PayPalPayment;
