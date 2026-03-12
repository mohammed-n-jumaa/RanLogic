import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUniversity, FaUpload, FaCheckCircle, FaTimes, FaImage } from 'react-icons/fa';
import { useProfileLanguage } from '../../../contexts/ProfileLanguageContext';
import subscriptionApi from '../../../api/subscriptionApi';
import Swal from 'sweetalert2';

const BankTransferPayment = ({ planType, duration, amount, originalAmount, discountPercentage, onSuccess, onCancel }) => {
  const { t } = useProfileLanguage();
  const [transferNumber, setTransferNumber] = useState('');
  const [receiptImage, setReceiptImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bankDetails = {
    bankName: 'National Commercial Bank',
    accountName: 'Rand Jarrar',
    accountNumber: 'SA1234567890123456789012',
    iban: 'SA1234567890123456789012'
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          title: t('خطأ', 'Error'),
          text: t('يرجى رفع صورة فقط', 'Please upload images only'),
          icon: 'error',
          confirmButtonText: t('حسناً', 'OK'),
          confirmButtonColor: '#FDB813'
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          title: t('خطأ', 'Error'),
          text: t('حجم الصورة يجب أن يكون أقل من 5 ميجابايت', 'Image size must be less than 5 MB'),
          icon: 'error',
          confirmButtonText: t('حسناً', 'OK'),
          confirmButtonColor: '#FDB813'
        });
        return;
      }

      setReceiptImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setReceiptImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    if (!transferNumber.trim()) {
      Swal.fire({
        title: t('تحذير', 'Warning'),
        text: t('يرجى إدخال رقم التحويل', 'Please enter the transfer number'),
        icon: 'warning',
        confirmButtonText: t('حسناً', 'OK'),
        confirmButtonColor: '#FDB813'
      });
      return;
    }

    if (!receiptImage) {
      Swal.fire({
        title: t('تحذير', 'Warning'),
        text: t('يرجى رفع صورة الإيصال', 'Please upload receipt image'),
        icon: 'warning',
        confirmButtonText: t('حسناً', 'OK'),
        confirmButtonColor: '#FDB813'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const subscriptionData = {
        plan_type: planType,
        duration: duration,
        amount: parseFloat(amount),
        original_amount: parseFloat(originalAmount),
        discount_percentage: discountPercentage,
        payment_method: 'bank_transfer',
        bank_transfer_number: transferNumber
      };

      const subscriptionResponse = await subscriptionApi.createBankTransferSubscription(subscriptionData);

      if (subscriptionResponse.success) {
        const uploadResponse = await subscriptionApi.uploadBankReceipt(
          subscriptionResponse.data.subscription_id,
          {
            transferNumber: transferNumber,
            receipt: receiptImage
          }
        );

        if (uploadResponse.success) {
          Swal.fire({
            title: t('تم الإرسال بنجاح! 🎉', 'Submitted Successfully! 🎉'),
            html: t(
              `<p>تم استلام طلب التجديد الخاص بك</p>
               <p style="color: #666; font-size: 0.9rem; margin-top: 1rem;">
                 سيتم مراجعة التحويل وتفعيل اشتراكك خلال 48 ساعة
               </p>`,
              `<p>Your renewal request has been received</p>
               <p style="color: #666; font-size: 0.9rem; margin-top: 1rem;">
                 The transfer will be reviewed and your subscription activated within 48 hours
               </p>`
            ),
            icon: 'success',
            confirmButtonText: t('ممتاز', 'Great'),
            confirmButtonColor: '#FDB813'
          }).then(() => {
            onSuccess();
          });
        } else {
          throw new Error('Failed to upload receipt');
        }
      } else {
        throw new Error('Failed to create subscription');
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error('Bank transfer error:', error);
      
      const errorMessage = error.response?.data?.message || t('حدث خطأ أثناء إرسال البيانات. يرجى المحاولة مرة أخرى', 'An error occurred while sending data. Please try again');
      
      Swal.fire({
        title: t('فشل الإرسال', 'Submission Failed'),
        text: errorMessage,
        icon: 'error',
        confirmButtonText: t('حسناً', 'OK'),
        confirmButtonColor: '#FDB813'
      });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      title: t('تم النسخ!', 'Copied!'),
      text: t('تم نسخ النص إلى الحافظة', 'Text copied to clipboard'),
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      iconColor: '#FDB813'
    });
  };

  return (
    <div className="bank-transfer-payment">
      <div className="bank-details-card">
        <div className="card-header">
          <FaUniversity className="bank-icon" />
          <h3>{t('معلومات الحساب البنكي', 'Bank Account Details')}</h3>
        </div>

        <div className="bank-info">
          <div className="info-row">
            <span className="label">{t('اسم البنك:', 'Bank Name:')}</span>
            <span className="value">{bankDetails.bankName}</span>
          </div>
          
          <div className="info-row">
            <span className="label">{t('اسم الحساب:', 'Account Name:')}</span>
            <span className="value">{bankDetails.accountName}</span>
          </div>
          
          <div className="info-row clickable" onClick={() => copyToClipboard(bankDetails.iban)}>
            <span className="label">{t('رقم الآيبان:', 'IBAN Number:')}</span>
            <span className="value copy-value">
              {bankDetails.iban}
              <span className="copy-hint">{t('انقر للنسخ', 'Click to copy')}</span>
            </span>
          </div>

          <div className="amount-row">
            <span className="label">{t('المبلغ المطلوب:', 'Amount Due:')}</span>
            <span className="amount">${amount}</span>
          </div>
        </div>

        <div className="transfer-note">
          <FaCheckCircle />
          <p>{t('بعد إتمام التحويل، يرجى رفع صورة الإيصال وإدخال رقم التحويل', 'After completing the transfer, please upload receipt image and enter transfer number')}</p>
        </div>
      </div>

      <div className="upload-section">
        <h4>{t('إثبات التحويل', 'Transfer Proof')}</h4>

        <div className="form-group">
          <label>{t('رقم التحويل *', 'Transfer Number *')}</label>
          <input
            type="text"
            value={transferNumber}
            onChange={(e) => setTransferNumber(e.target.value)}
            placeholder={t('أدخل رقم التحويل البنكي', 'Enter bank transfer number')}
            className="transfer-input"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label>{t('صورة الإيصال *', 'Receipt Image *')}</label>
          
          {!imagePreview ? (
            <label className="upload-area">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isSubmitting}
                hidden
              />
              <FaUpload className="upload-icon" />
              <span className="upload-text">{t('انقر لرفع صورة الإيصال', 'Click to upload receipt image')}</span>
              <span className="upload-hint">{t('PNG, JPG, JPEG (حتى 5 ميجابايت)', 'PNG, JPG, JPEG (up to 5MB)')}</span>
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
                  <FaTimes />
                </button>
              </div>
              <div className="image-info">
                <FaImage />
                <span>{receiptImage?.name}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="action-buttons">
        <motion.button
          className="cancel-button"
          onClick={onCancel}
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {t('رجوع', 'Back')}
        </motion.button>

        <motion.button
          className="submit-button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          whileHover={!isSubmitting ? { scale: 1.02 } : {}}
          whileTap={!isSubmitting ? { scale: 0.98 } : {}}
        >
          {isSubmitting ? (
            <>
              <div className="spinner"></div>
              <span>{t('جاري الإرسال...', 'Submitting...')}</span>
            </>
          ) : (
            <>
              <FaCheckCircle />
              <span>{t('إرسال الطلب', 'Submit Request')}</span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default BankTransferPayment;