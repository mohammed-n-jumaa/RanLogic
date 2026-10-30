import { useState } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import subscriptionApi from '../../api/subscriptionApi';
import { Landmark, CheckCircle } from 'lucide-react';


const BankTransferPayment = ({
  planId,
  duration,
  planName,
  displayAmount,
  displayCurrency,
  couponCode,
  onSuccess,
  onCancel,
  currentLang,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sym = displayCurrency?.symbol || '$';

  const bankDetails = {
    bank_name: 'بنك الاتحاد',
    account_name: 'Randa Nimer',
    iban: 'JO73UBSI6700000670166682715101',
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      title: currentLang === 'ar' ? 'تم النسخ!' : 'Copied!',
      text: currentLang === 'ar' ? 'تم نسخ النص إلى الحافظة' : 'Text copied to clipboard',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      iconColor: 'var(--site-primary)',
    });
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {

      const subscriptionResponse = await subscriptionApi.createBankTransferSubscription({
        plan_type: planId,
        duration: duration,
        payment_method: 'bank_transfer',  
        notes: currentLang === 'ar' ? 'تحويل بنكي' : 'Bank transfer',
        coupon_code: couponCode || undefined,
      });

      if (!subscriptionResponse.success) {
        throw new Error('Failed to create subscription');
      }

      onSuccess();

    } catch (error) {
      setIsSubmitting(false);
      console.error('Bank transfer error:', error);

      Swal.fire({
        title: currentLang === 'ar' ? 'فشل الإرسال' : 'Submission Failed',
        text: currentLang === 'ar'
          ? 'حدث خطأ أثناء إرسال البيانات. يرجى المحاولة مرة أخرى'
          : 'An error occurred while sending data. Please try again',
        icon: 'error',
        confirmButtonColor: 'var(--site-primary)',
      });
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="bank-transfer-payment plans-version">

      {/* Bank details */}
      <div className="bank-details-card">
        <div className="card-header">
          <Landmark className="bank-icon" />
          <h3>{currentLang === 'ar' ? 'معلومات الحساب البنكي' : 'Bank Account Information'}</h3>
        </div>

        <div className="bank-info">
          <div className="info-row">
            <span className="label">{currentLang === 'ar' ? 'اسم البنك:' : 'Bank Name:'}</span>
            <span className="value">{bankDetails.bank_name}</span>
          </div>

          <div className="info-row">
            <span className="label">{currentLang === 'ar' ? 'اسم الحساب:' : 'Account Name:'}</span>
            <span className="value">{bankDetails.account_name}</span>
          </div>

          <div className="info-row clickable" onClick={() => copyToClipboard(bankDetails.iban)}>
            <span className="label">{currentLang === 'ar' ? 'رقم الآيبان:' : 'IBAN Number:'}</span>
            <span className="value copy-value">
              {bankDetails.iban}
              <span className="copy-hint">
                {currentLang === 'ar' ? 'انقر للنسخ' : 'Click to copy'}
              </span>
            </span>
          </div>


          <div className="amount-row">
            <span className="label">{currentLang === 'ar' ? 'المبلغ المطلوب:' : 'Required Amount:'}</span>
            <span className="amount">{sym}{displayAmount}</span>
          </div>

          <div className="plan-row">
            <span className="label">{currentLang === 'ar' ? 'الخطة:' : 'Plan:'}</span>
            <span className="value">{planName}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="action-buttons">
        <motion.button
          className="cancel-button"
          onClick={onCancel}
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
        >
          {currentLang === 'ar' ? 'رجوع' : 'Back'}
        </motion.button>

        <motion.button
          className="submit-button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          whileHover={!isSubmitting ? { scale: 1.02 } : {}}
          whileTap={!isSubmitting ? { scale: 0.98 } : {}}
          type="button"
        >
          {isSubmitting ? (
            <>
              <div className="spinner" />
              <span>{currentLang === 'ar' ? 'جاري الإرسال...' : 'Sending...'}</span>
            </>
          ) : (
            <>
              <CheckCircle />
              <span>{currentLang === 'ar' ? 'إرسال الطلب' : 'Submit Request'}</span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default BankTransferPayment;
