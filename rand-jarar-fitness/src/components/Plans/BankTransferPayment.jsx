import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUniversity, FaUpload, FaCheckCircle, FaTimes, FaImage } from 'react-icons/fa';
import Swal from 'sweetalert2';
import subscriptionApi from '../../api/subscriptionApi';

const BankTransferPayment = ({ 
  amount, 
  planName, 
  discount, 
  originalPrice, 
  onSuccess, 
  onCancel, 
  currentLang, 
  planId, 
  duration 
}) => {
  const [transferNumber, setTransferNumber] = useState('');
  const [receiptImage, setReceiptImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bankDetails, setBankDetails] = useState(null);

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const response = await subscriptionApi.getBankDetails();
        if (response.success) {
          setBankDetails(response.data);
        }
      } catch (error) {
        console.error('Error fetching bank details:', error);
      }
    };

    fetchBankDetails();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          title: currentLang === 'ar' ? 'خطأ' : 'Error',
          text: currentLang === 'ar' ? 'يرجى رفع صورة فقط' : 'Please upload an image only',
          icon: 'error',
          confirmButtonText: currentLang === 'ar' ? 'حسناً' : 'OK',
          confirmButtonColor: '#FDB813'
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          title: currentLang === 'ar' ? 'خطأ' : 'Error',
          text: currentLang === 'ar' ? 'حجم الصورة يجب أن يكون أقل من 5 ميجابايت' : 'Image size must be less than 5MB',
          icon: 'error',
          confirmButtonText: currentLang === 'ar' ? 'حسناً' : 'OK',
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
        title: currentLang === 'ar' ? 'تحذير' : 'Warning',
        text: currentLang === 'ar' ? 'يرجى إدخال رقم التحويل' : 'Please enter the transfer number',
        icon: 'warning',
        confirmButtonText: currentLang === 'ar' ? 'حسناً' : 'OK',
        confirmButtonColor: '#FDB813'
      });
      return;
    }

    if (!receiptImage) {
      Swal.fire({
        title: currentLang === 'ar' ? 'تحذير' : 'Warning',
        text: currentLang === 'ar' ? 'يرجى رفع صورة الإيصال' : 'Please upload the receipt image',
        icon: 'warning',
        confirmButtonText: currentLang === 'ar' ? 'حسناً' : 'OK',
        confirmButtonColor: '#FDB813'
      });
      return;
    }

    setIsSubmitting(true);

    try {

      const subscriptionData = {
        plan_type: planId,
        duration: duration,
        amount: amount,
        original_amount: originalPrice || amount,
        discount_percentage: discount || 0,
        payment_method: 'bank_transfer',
        bank_transfer_number: transferNumber,
        notes: currentLang === 'ar' ? 'تحويل بنكي' : 'Bank transfer'
      };

      const subscriptionResponse = await subscriptionApi.createBankTransferSubscription(subscriptionData);

      if (subscriptionResponse.success) {
        // رفع صورة الإيصال
        const uploadResponse = await subscriptionApi.uploadBankReceipt(
          subscriptionResponse.data.subscription_id,
          {
            transferNumber: transferNumber,
            receipt: receiptImage
          }
        );

        if (uploadResponse.success) {
          onSuccess();
        } else {
          throw new Error('Failed to upload receipt');
        }
      } else {
        throw new Error('Failed to create subscription');
      }

    } catch (error) {
      setIsSubmitting(false);
      console.error('Bank transfer error:', error);

      Swal.fire({
        title: currentLang === 'ar' ? 'فشل الإرسال' : 'Submission Failed',
        text: currentLang === 'ar'
          ? 'حدث خطأ أثناء إرسال البيانات. يرجى المحاولة مرة أخرى'
          : 'An error occurred while sending data. Please try again',
        icon: 'error',
        confirmButtonText: currentLang === 'ar' ? 'حسناً' : 'OK',
        confirmButtonColor: '#FDB813'
      });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      title: currentLang === 'ar' ? 'تم النسخ!' : 'Copied!',
      text: currentLang === 'ar' ? 'تم نسخ النص إلى الحافظة' : 'Text copied to clipboard',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      iconColor: '#FDB813'
    });
  };

  if (!bankDetails) {
    return (
      <div className="bank-transfer-payment plans-version">
        <div className="loading-bank-details">
          <div className="spinner"></div>
          <p>{currentLang === 'ar' ? 'جاري تحميل تفاصيل البنك...' : 'Loading bank details...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bank-transfer-payment plans-version">
      <div className="bank-details-card">
        <div className="card-header">
          <FaUniversity className="bank-icon" />
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
            <span className="amount">${amount}</span>
          </div>

          <div className="plan-row">
            <span className="label">{currentLang === 'ar' ? 'الخطة:' : 'Plan:'}</span>
            <span className="value">{planName}</span>
          </div>
        </div>

        <div className="transfer-note">
          <FaCheckCircle />
          <p>
            {currentLang === 'ar'
              ? 'بعد إتمام التحويل، يرجى رفع صورة الإيصال وإدخال رقم التحويل'
              : 'After completing the transfer, please upload the receipt image and enter the transfer number'
            }
          </p>
        </div>
      </div>

      <div className="upload-section">
        <h4>{currentLang === 'ar' ? 'إثبات التحويل' : 'Transfer Proof'}</h4>

        <div className="form-group">
          <label>{currentLang === 'ar' ? 'رقم التحويل *' : 'Transfer Number *'}</label>
          <input
            type="text"
            value={transferNumber}
            onChange={(e) => setTransferNumber(e.target.value)}
            placeholder={currentLang === 'ar' ? 'أدخل رقم التحويل البنكي' : 'Enter bank transfer number'}
            className="transfer-input"
            disabled={isSubmitting}
          />
        </div>

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
              <FaUpload className="upload-icon" />
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
          {currentLang === 'ar' ? 'رجوع' : 'Back'}
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
              <span>{currentLang === 'ar' ? 'جاري الإرسال...' : 'Sending...'}</span>
            </>
          ) : (
            <>
              <FaCheckCircle />
              <span>{currentLang === 'ar' ? 'إرسال الطلب' : 'Submit Request'}</span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default BankTransferPayment;
