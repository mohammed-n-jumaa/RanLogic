import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import subscriptionApi from '../../api/subscriptionApi';
import { Landmark, Upload, CheckCircle, X, Image } from 'lucide-react';


const BankTransferPayment = ({
  planId,
  duration,
  planName,
  displayAmount,
  displayCurrency,
  onSuccess,
  onCancel,
  currentLang,
}) => {
  const [receiptImage, setReceiptImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sym = displayCurrency?.symbol || '$';

  const bankDetails = {
    bank_name: 'بنك الاتحاد',
    account_name: 'Randa Nimer',
    iban: 'JO73UBSI6700000670166682715101',
  };

  // ── Image handlers ────────────────────────────────────────────────────────

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      Swal.fire({
        title: currentLang === 'ar' ? 'خطأ' : 'Error',
        text: currentLang === 'ar' ? 'يرجى رفع صورة فقط' : 'Please upload an image only',
        icon: 'error',
        confirmButtonColor: '#FDB813',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: currentLang === 'ar' ? 'خطأ' : 'Error',
        text: currentLang === 'ar'
          ? 'حجم الصورة يجب أن يكون أقل من 5 ميجابايت'
          : 'Image size must be less than 5MB',
        icon: 'error',
        confirmButtonColor: '#FDB813',
      });
      return;
    }

    setReceiptImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setReceiptImage(null);
    setImagePreview(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      title: currentLang === 'ar' ? 'تم النسخ!' : 'Copied!',
      text: currentLang === 'ar' ? 'تم نسخ النص إلى الحافظة' : 'Text copied to clipboard',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      iconColor: '#FDB813',
    });
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!receiptImage) {
      Swal.fire({
        title: currentLang === 'ar' ? 'تحذير' : 'Warning',
        text: currentLang === 'ar'
          ? 'يرجى رفع صورة الإيصال'
          : 'Please upload the receipt image',
        icon: 'warning',
        confirmButtonColor: '#FDB813',
      });
      return;
    }

    setIsSubmitting(true);

    try {

      await subscriptionApi.createBankTransferSubscription({
        plan_type: planId,
        duration: duration,
        payment_method: 'bank_transfer',  
        notes: currentLang === 'ar' ? 'تحويل بنكي' : 'Bank transfer',
      });

      if (!subscriptionResponse.success) {
        throw new Error('Failed to create subscription');
      }

      const uploadResponse = await subscriptionApi.uploadBankReceipt(
        subscriptionResponse.data.subscription_id,
        { transferNumber: '', receipt: receiptImage },
      );

      if (!uploadResponse.success) {
        throw new Error('Failed to upload receipt');
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
        confirmButtonColor: '#FDB813',
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

      {/* Upload section */}
      <div className="upload-section">
        <h4>{currentLang === 'ar' ? 'إثبات التحويل' : 'Transfer Proof'}</h4>

        <div className="form-group">
          <label>{currentLang === 'ar' ? 'صورة الإيصال *' : 'Receipt Image *'}</label>

          {!imagePreview ? (
            <label className="upload-area">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isSubmitting}
                hidden
              />
              <Upload className="upload-icon" />
              <span className="upload-text">
                {currentLang === 'ar' ? 'انقر لرفع صورة الإيصال' : 'Click to upload receipt image'}
              </span>
              <span className="upload-hint">
                {currentLang === 'ar' ? 'PNG, JPG, JPEG (حتى 5 ميجابايت)' : 'PNG, JPG, JPEG (up to 5MB)'}
              </span>
            </label>
          ) : (
            <div className="image-preview-container">
              <div className="image-preview">
                <img src={imagePreview} alt="Receipt preview" />
                <button
                  className="remove-image"
                  onClick={handleRemoveImage}
                  disabled={isSubmitting}
                  type="button"
                >
                  <X />
                </button>
              </div>
              <div className="image-info">
                <Image />
                <span>{receiptImage?.name}</span>
              </div>
            </div>
          )}
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
