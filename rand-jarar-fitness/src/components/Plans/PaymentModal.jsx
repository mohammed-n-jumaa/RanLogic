import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPaypal, FaUniversity, FaCheckCircle, FaExclamationTriangle, FaArrowLeft, FaCalendarAlt, FaTag } from 'react-icons/fa';
import Swal from 'sweetalert2';
import BankTransferPayment from './BankTransferPayment';
import subscriptionApi from '../../api/subscriptionApi';

const PaymentModal = ({ plan, duration, onClose, onSuccess, currentLang }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState('method');
  const [paymentMethod, setPaymentMethod] = useState(null);

  const handleSelectMethod = (method) => {
    setPaymentMethod(method);
    if (method === 'paypal') {
      setStep('paypal-confirm');
    } else if (method === 'bank') {
      setStep('bank-transfer');
    }
  };

  const handlePayPalPayment = async () => {
    setIsProcessing(true);
    setStep('processing');

    try {
      const selectedPricing = plan.pricing[duration];
      
      // Create subscription via API
      const subscriptionData = {
        plan_type: plan.id,
        duration: duration,
        amount: selectedPricing.price,
        original_amount: selectedPricing.originalPrice,
        discount_percentage: selectedPricing.discount,
        payment_method: 'paypal',
      };

      const createResponse = await subscriptionApi.createPayPalPayment(subscriptionData);
      
      if (createResponse.success) {
        // Redirect to PayPal
        window.location.href = createResponse.data.approval_url;
      } else {
        throw new Error('Failed to create PayPal payment');
      }

    } catch (error) {
      setIsProcessing(false);
      setStep('paypal-confirm');
      
      Swal.fire({
        title: currentLang === 'ar' ? 'فشل الدفع' : 'Payment Failed',
        text: currentLang === 'ar' 
          ? 'حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى' 
          : 'An error occurred while processing payment. Please try again',
        icon: 'error',
        confirmButtonText: currentLang === 'ar' ? 'حسناً' : 'OK',
        confirmButtonColor: '#FDB813'
      });
    }
  };

  const handleBankTransferSuccess = () => {
    setStep('success');
    
    setTimeout(() => {
      Swal.fire({
        title: currentLang === 'ar' ? 'تم الإرسال بنجاح! 🎉' : 'Sent Successfully! 🎉',
        html: currentLang === 'ar' 
          ? `
            <p>تم استلام طلب الاشتراك الخاص بك</p>
            <p style="color: #666; font-size: 0.9rem; margin-top: 1rem;">
              سيتم مراجعة التحويل وتفعيل اشتراكك خلال 48 ساعة
            </p>
          `
          : `
            <p>Your subscription request has been received</p>
            <p style="color: #666; font-size: 0.9rem; margin-top: 1rem;">
              The transfer will be reviewed and your subscription activated within 48 hours
            </p>
          `,
        icon: 'success',
        confirmButtonText: currentLang === 'ar' ? 'ممتاز' : 'Great',
        confirmButtonColor: '#FDB813'
      }).then(() => {
        onSuccess();
      });
    }, 1000);
  };

  const handleBack = () => {
    if (step === 'paypal-confirm' || step === 'bank-transfer') {
      setStep('method');
      setPaymentMethod(null);
    }
  };

  const selectedPricing = plan.pricing[duration];
  const hasDiscount = selectedPricing.discount > 0;
  const durationLabel = duration === '1month' ? (currentLang === 'ar' ? '1 شهر' : '1 Month') : 
                        duration === '3months' ? (currentLang === 'ar' ? '3 أشهر' : '3 Months') : 
                        (currentLang === 'ar' ? '6 أشهر' : '6 Months');

  return (
    <AnimatePresence>
      <motion.div 
        className="payment-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="payment-modal"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {step === 'method' && (
            <>
              <div className="modal-header">
                <h2>{currentLang === 'ar' ? 'اختر طريقة الدفع' : 'Choose Payment Method'}</h2>
                <button className="close-button" onClick={onClose}>
                  <FaTimes />
                </button>
              </div>

              <div className="modal-body">
                <div className="plan-summary">
                  <div className="summary-header">
                    <span className="plan-icon">{plan.icon}</span>
                    <div>
                      <h3>{plan.name}</h3>
                      <p>{plan.subtitle}</p>
                    </div>
                  </div>

                  <div className="pricing-details">
                    <div className="duration-display">
                      <FaCalendarAlt />
                      <span>{durationLabel}</span>
                    </div>

                    {hasDiscount && (
                      <div className="price-row">
                        <span>{currentLang === 'ar' ? 'السعر الأصلي:' : 'Original Price:'}</span>
                        <span className="original-price">
                          ${selectedPricing.originalPrice}
                        </span>
                      </div>
                    )}
                    
                    {hasDiscount && (
                      <div className="price-row discount-row">
                        <span>
                          <FaTag className="tag-icon" />
                          {currentLang === 'ar' ? 'الخصم' : 'Discount'} ({selectedPricing.discount}%):
                        </span>
                        <span className="discount">
                          -${(selectedPricing.originalPrice - selectedPricing.price).toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div className="price-row total-row">
                      <span>{currentLang === 'ar' ? 'المجموع:' : 'Total:'}</span>
                      <span className="final-price">${selectedPricing.price}</span>
                    </div>

                    {hasDiscount && (
                      <div className="savings-highlight">
                        <FaCheckCircle />
                        <span>
                          {currentLang === 'ar' 
                            ? `وفرت $${(selectedPricing.originalPrice - selectedPricing.price).toFixed(2)} مع هذه الخطة!`
                            : `You save $${(selectedPricing.originalPrice - selectedPricing.price).toFixed(2)} with this plan!`
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="payment-methods-selection">
                  <h3>{currentLang === 'ar' ? 'اختر طريقة الدفع:' : 'Choose your payment method:'}</h3>
                  
                  <div className="methods-grid">
                    <motion.button
                      className="method-card paypal-method"
                      onClick={() => handleSelectMethod('paypal')}
                      whileHover={{ scale: 1.03, y: -5 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <FaPaypal className="method-icon" />
                      <h4>PayPal</h4>
                      <p>{currentLang === 'ar' ? 'دفع فوري وآمن' : 'Instant and secure payment'}</p>
                      <span className="method-badge">
                        {currentLang === 'ar' ? 'موصى به' : 'Recommended'}
                      </span>
                    </motion.button>

                    <motion.button
                      className="method-card bank-method"
                      onClick={() => handleSelectMethod('bank')}
                      whileHover={{ scale: 1.03, y: -5 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <FaUniversity className="method-icon" />
                      <h4>{currentLang === 'ar' ? 'تحويل بنكي' : 'Bank Transfer'}</h4>
                      <p>{currentLang === 'ar' ? 'تفعيل خلال 48 ساعة' : 'Activation within 48 hours'}</p>
                      <span className="method-badge">
                        {currentLang === 'ar' ? 'متاح' : 'Available'}
                      </span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 'paypal-confirm' && (
            <>
              <div className="modal-header">
                <div className="header-with-back">
                  <button className="back-button" onClick={handleBack}>
                    <FaArrowLeft />
                  </button>
                  <h2>{currentLang === 'ar' ? 'تأكيد الدفع - PayPal' : 'Payment Confirmation - PayPal'}</h2>
                </div>
                <button className="close-button" onClick={onClose}>
                  <FaTimes />
                </button>
              </div>

              <div className="modal-body">
                <div className="plan-summary">
                  <div className="summary-header">
                    <span className="plan-icon">{plan.icon}</span>
                    <div>
                      <h3>{plan.name}</h3>
                      <p>{durationLabel}</p>
                    </div>
                  </div>

                  <div className="pricing-details">
                    {hasDiscount && (
                      <div className="discount-highlight">
                        <FaTag />
                        <span>{selectedPricing.discount}% {currentLang === 'ar' ? 'خصم مطبق' : 'Discount Applied'}</span>
                      </div>
                    )}

                    <div className="price-row total-row">
                      <span>{currentLang === 'ar' ? 'المجموع:' : 'Total:'}</span>
                      <span className="final-price">${selectedPricing.price}</span>
                    </div>
                  </div>
                </div>

                <div className="payment-info">
                  <div className="info-item">
                    <FaExclamationTriangle />
                    <p>{currentLang === 'ar' 
                      ? 'سيتم توجيهك إلى صفحة PayPal الآمنة' 
                      : 'You will be redirected to PayPal\'s secure page'
                    }</p>
                  </div>
                  <div className="info-item">
                    <FaCheckCircle />
                    <p>{currentLang === 'ar' 
                      ? 'جميع المعاملات مشفرة ومحمية' 
                      : 'All transactions are encrypted and protected'
                    }</p>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  className="cancel-button"
                  onClick={handleBack}
                >
                  {currentLang === 'ar' ? 'رجوع' : 'Back'}
                </button>
                <button 
                  className="paypal-button"
                  onClick={handlePayPalPayment}
                  disabled={isProcessing}
                >
                  <FaPaypal />
                  {currentLang === 'ar' ? 'ادفع' : 'Pay'} ${selectedPricing.price}
                </button>
              </div>
            </>
          )}

          {step === 'bank-transfer' && (
            <>
              <div className="modal-header">
                <div className="header-with-back">
                  <button className="back-button" onClick={handleBack}>
                    <FaArrowLeft />
                  </button>
                  <h2>{currentLang === 'ar' ? 'تحويل بنكي' : 'Bank Transfer'}</h2>
                </div>
                <button className="close-button" onClick={onClose}>
                  <FaTimes />
                </button>
              </div>

              <div className="modal-body">
                <BankTransferPayment
                  amount={selectedPricing.price}
                  planName={`${plan.name} - ${durationLabel}`}
                  discount={hasDiscount ? selectedPricing.discount : 0}
                  originalPrice={hasDiscount ? selectedPricing.originalPrice : null}
                  onSuccess={handleBankTransferSuccess}
                  onCancel={handleBack}
                  currentLang={currentLang}
                  planId={plan.id}
                  duration={duration}
                />
              </div>
            </>
          )}

          {step === 'processing' && (
            <div className="processing-state">
              <div className="spinner-large"></div>
              <h3>{currentLang === 'ar' ? 'جاري معالجة الدفع...' : 'Processing payment...'}</h3>
              <p>{currentLang === 'ar' ? 'يرجى الانتظار وعدم إغلاق هذه النافذة' : 'Please wait and do not close this window'}</p>
            </div>
          )}

          {step === 'success' && (
            <div className="success-state">
              <motion.div 
                className="success-icon"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <FaCheckCircle />
              </motion.div>
              <h3>{currentLang === 'ar' ? 'نجاح!' : 'Success!'}</h3>
              <p>{currentLang === 'ar' ? 'جاري تفعيل اشتراكك...' : 'Activating your subscription...'}</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentModal;