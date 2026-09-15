import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import BankTransferPayment from './BankTransferPayment';
import subscriptionApi from '../../api/subscriptionApi';
import { throttle } from '@/utils/debounce';
import { X, Landmark, CheckCircle, AlertTriangle, ArrowLeft, Calendar, Tag, Ticket, Loader2 } from 'lucide-react';
import { FaPaypal } from '@/components/common/SocialIcons';

const PaymentModal = ({ plan, duration, onClose, onSuccess, currentLang, currency }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState('method');

  // ── Coupon state ────────────────────────────────────────────────────────
  const [couponCode, setCouponCode]       = useState('');
  const [couponData, setCouponData]       = useState(null);   // validated coupon info
  const [couponError, setCouponError]     = useState('');
  const [isValidating, setIsValidating]   = useState(false);

  const selectedPricing = plan.pricing[duration];
  const hasDiscount = selectedPricing.discount > 0;
  const sym = currency?.symbol || '$';
  const code = currency?.code || 'USD';

  const usdPrice    = selectedPricing.usd_price ?? selectedPricing.price;
  const usdOriginal = selectedPricing.usd_original ?? selectedPricing.originalPrice;

  // ── Coupon-adjusted prices ────────────────────────────────────────────
  const usdFinalPrice = couponData ? couponData.final_price : usdPrice;
  let displayPrice    = selectedPricing.price;
  let couponDiscount  = 0;

  
  if (couponData && couponData.original_price > 0) {
    const ratio    = couponData.final_price / couponData.original_price;
    displayPrice   = +(selectedPricing.price * ratio).toFixed(2);
    couponDiscount = +(selectedPricing.price - displayPrice).toFixed(2);
  }

  const durationLabel =
    duration === '1month'  ? (currentLang === 'ar' ? '1 شهر'   : '1 Month') :
    duration === '3months' ? (currentLang === 'ar' ? '3 أشهر'  : '3 Months') :
                             (currentLang === 'ar' ? '6 أشهر'  : '6 Months');

  // ── Coupon handlers ───────────────────────────────────────────────────
  const handleApplyCoupon = async () => {
    const trimmed = couponCode.trim();
    if (!trimmed) return;

    setIsValidating(true);
    setCouponError('');
    setCouponData(null);

    const res = await subscriptionApi.validateCoupon(trimmed, plan.id, duration);

    if (res.success) {
      setCouponData(res.data);
      setCouponError('');
    } else {
      setCouponError(res.message);
      setCouponData(null);
    }

    setIsValidating(false);
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setCouponData(null);
    setCouponError('');
  };

  // ── Navigation ────────────────────────────────────────────────────────
  const handleSelectMethod = (method) => {
    if (method === 'paypal') setStep('paypal-confirm');
    else if (method === 'bank') setStep('bank-transfer');
  };

  const handleBack = () => setStep('method');

  // ── PayPal ────────────────────────────────────────────────────────────
  const handlePayPalPayment = throttle(async () => {
    setIsProcessing(true);
    setStep('processing');

    try {
      const payload = {
        plan_type: plan.id,
        duration: duration,
        payment_method: 'paypal',
      };
      if (couponData) payload.coupon_code = couponData.code;

      const createResponse = await subscriptionApi.createPayPalPayment(payload);

      if (createResponse.success) {
        window.location.href = createResponse.data.approval_url;
      } else {
        throw new Error('Failed to create PayPal payment');
      }
    } catch {
      setIsProcessing(false);
      setStep('paypal-confirm');

      Swal.fire({
        title: currentLang === 'ar' ? 'فشل الدفع' : 'Payment Failed',
        text: currentLang === 'ar'
          ? 'حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى'
          : 'An error occurred while processing payment. Please try again',
        icon: 'error',
        confirmButtonText: currentLang === 'ar' ? 'حسناً' : 'OK',
        confirmButtonColor: 'var(--site-primary)',
      });
    }
  }, 3000);

  // ── Bank transfer success ─────────────────────────────────────────────
  const handleBankTransferSuccess = () => {
    setStep('success');

    setTimeout(() => {
      Swal.fire({
        title: currentLang === 'ar' ? 'تم الإرسال بنجاح! 🎉' : 'Sent Successfully! 🎉',
        html: currentLang === 'ar'
          ? `<p>تم استلام طلب الاشتراك الخاص بك</p>
             <p style="color:#666;font-size:0.9rem;margin-top:1rem;">
               سيتم مراجعة التحويل وتفعيل اشتراكك خلال 48 ساعة
             </p>`
          : `<p>Your subscription request has been received</p>
             <p style="color:#666;font-size:0.9rem;margin-top:1rem;">
               The transfer will be reviewed and your subscription activated within 48 hours
             </p>`,
        icon: 'success',
        confirmButtonText: currentLang === 'ar' ? 'ممتاز' : 'Great',
        confirmButtonColor: 'var(--site-primary)',
      }).then(() => onSuccess());
    }, 800);
  };

  // ── Coupon input UI (reused in method step) ───────────────────────────
  const renderCouponSection = () => (
    <div className="coupon-section">
      <div className="coupon-header">
        <Ticket size={16} />
        <span>{currentLang === 'ar' ? 'كود خصم' : 'Discount Code'}</span>
      </div>

      {couponData ? (
        // Applied state
        <div className="coupon-applied">
          <div className="coupon-applied__info">
            <CheckCircle size={16} />
            <span>
              <strong>{couponData.code}</strong>
              {' — '}
              {couponData.discount_type === 'percentage'
                ? `${couponData.discount_value}%`
                : `$${couponData.discount_value}`}
              {' '}
              {currentLang === 'ar' ? 'خصم' : 'off'}
            </span>
          </div>
          <button className="coupon-applied__remove" onClick={handleRemoveCoupon}>
            <X size={14} />
          </button>
        </div>
      ) : (
        // Input state
        <>
          <div className="coupon-input-row">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
              placeholder={currentLang === 'ar' ? 'أدخل كود الخصم' : 'Enter discount code'}
              className="coupon-input"
              onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
              disabled={isValidating}
            />
            <button
              className="coupon-apply-btn"
              onClick={handleApplyCoupon}
              disabled={isValidating || !couponCode.trim()}
            >
              {isValidating
                ? <Loader2 size={16} className="spin-icon" />
                : (currentLang === 'ar' ? 'تطبيق' : 'Apply')
              }
            </button>
          </div>
          {couponError && <p className="coupon-error">{couponError}</p>}
        </>
      )}
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────
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
          onClick={e => e.stopPropagation()}
        >

          {/* ── Step: method ──────────────────────────── */}
          {step === 'method' && (
            <>
              <div className="modal-header">
                <h2>{currentLang === 'ar' ? 'اختر طريقة الدفع' : 'Choose Payment Method'}</h2>
                <button className="close-button" onClick={onClose}><X /></button>
              </div>

              <div className="modal-body">
                {/* Plan summary */}
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
                      <Calendar />
                      <span>{durationLabel}</span>
                    </div>

                    {hasDiscount && (
                      <div className="price-row">
                        <span>{currentLang === 'ar' ? 'السعر الأصلي:' : 'Original Price:'}</span>
                        <span className="original-price">{sym}{selectedPricing.originalPrice}</span>
                      </div>
                    )}

                    {hasDiscount && (
                      <div className="price-row discount-row">
                        <span>
                          <Tag fill="currentColor" className="tag-icon" />
                          {currentLang === 'ar' ? 'الخصم' : 'Discount'} ({selectedPricing.discount}%):
                        </span>
                        <span className="discount">
                          -{sym}{(selectedPricing.originalPrice - selectedPricing.price).toFixed(2)}
                        </span>
                      </div>
                    )}

                    {/* Coupon discount row */}
                    {couponData && (
                      <div className="price-row discount-row coupon-discount-row">
                        <span>
                          <Ticket size={14} className="tag-icon" />
                          {currentLang === 'ar' ? 'كود الخصم' : 'Coupon'} ({couponData.code}):
                        </span>
                        <span className="discount">
                          -{sym}{couponDiscount}
                        </span>
                      </div>
                    )}

                    <div className="price-row total-row">
                      <span>{currentLang === 'ar' ? 'المجموع:' : 'Total:'}</span>
                      <span className="final-price">
                        {sym}{displayPrice}
                        <small style={{ opacity: 0.6, marginLeft: 4 }}>{code}</small>
                      </span>
                    </div>

                    {(hasDiscount || couponData) && (
                      <div className="savings-highlight">
                        <CheckCircle />
                        <span>
                          {currentLang === 'ar'
                            ? `وفرت ${sym}${(selectedPricing.originalPrice - displayPrice).toFixed(2)} مع هذه الخطة!`
                            : `You save ${sym}${(selectedPricing.originalPrice - displayPrice).toFixed(2)} with this plan!`
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Coupon input ── */}
                {renderCouponSection()}

                {/* Method selection */}
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
                      <Landmark className="method-icon" />
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

          {/* ── Step: paypal-confirm ───────────────────── */}
          {step === 'paypal-confirm' && (
            <>
              <div className="modal-header">
                <div className="header-with-back">
                  <button className="back-button" onClick={handleBack}><ArrowLeft /></button>
                  <h2>{currentLang === 'ar' ? 'تأكيد الدفع - PayPal' : 'Payment Confirmation - PayPal'}</h2>
                </div>
                <button className="close-button" onClick={onClose}><X /></button>
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
                    {(hasDiscount || couponData) && (
                      <div className="discount-highlight">
                        <Tag fill="currentColor" />
                        <span>
                          {hasDiscount && `${selectedPricing.discount}% `}
                          {hasDiscount && couponData && '+ '}
                          {couponData && `${currentLang === 'ar' ? 'كود' : 'Code'} ${couponData.code} `}
                          {currentLang === 'ar' ? 'خصم مطبق' : 'Discount Applied'}
                        </span>
                      </div>
                    )}

                    <div className="price-row total-row">
                      <span>{currentLang === 'ar' ? 'المجموع:' : 'Total:'}</span>
                      <span className="final-price">
                        {sym}{displayPrice}
                        <small style={{ opacity: 0.6, marginLeft: 4 }}>{code}</small>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="payment-info">
                  <div className="info-item">
                    <AlertTriangle />
                    <p>{currentLang === 'ar'
                      ? 'سيتم توجيهك إلى صفحة PayPal الآمنة'
                      : "You will be redirected to PayPal's secure page"
                    }</p>
                  </div>
                  <div className="info-item">
                    <CheckCircle />
                    <p>{currentLang === 'ar'
                      ? 'جميع المعاملات مشفرة ومحمية'
                      : 'All transactions are encrypted and protected'
                    }</p>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="cancel-button" onClick={handleBack}>
                  {currentLang === 'ar' ? 'رجوع' : 'Back'}
                </button>
                <button
                  className="paypal-button"
                  onClick={handlePayPalPayment}
                  disabled={isProcessing}
                >
                  <FaPaypal />
                  {currentLang === 'ar' ? 'ادفع' : 'Pay'} ${usdFinalPrice} USD
                </button>
              </div>
            </>
          )}

          {/* ── Step: bank-transfer ────────────────────── */}
          {step === 'bank-transfer' && (
            <>
              <div className="modal-header">
                <div className="header-with-back">
                  <button className="back-button" onClick={handleBack}><ArrowLeft /></button>
                  <h2>{currentLang === 'ar' ? 'تحويل بنكي' : 'Bank Transfer'}</h2>
                </div>
                <button className="close-button" onClick={onClose}><X /></button>
              </div>

              <div className="modal-body">
                <BankTransferPayment
                  planId={plan.id}
                  duration={duration}
                  planName={`${plan.name} - ${durationLabel}`}
                  displayAmount={displayPrice}
                  displayCurrency={currency}
                  couponCode={couponData?.code || null}
                  onSuccess={handleBankTransferSuccess}
                  onCancel={handleBack}
                  currentLang={currentLang}
                />
              </div>
            </>
          )}

          {/* ── Step: processing ───────────────────────── */}
          {step === 'processing' && (
            <div className="processing-state">
              <div className="spinner-large" />
              <h3>{currentLang === 'ar' ? 'جاري معالجة الدفع...' : 'Processing payment...'}</h3>
              <p>{currentLang === 'ar'
                ? 'يرجى الانتظار وعدم إغلاق هذه النافذة'
                : 'Please wait and do not close this window'
              }</p>
            </div>
          )}

          {/* ── Step: success ──────────────────────────── */}
          {step === 'success' && (
            <div className="success-state">
              <motion.div
                className="success-icon"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <CheckCircle />
              </motion.div>
              <h3>{currentLang === 'ar' ? 'نجاح!' : 'Success!'}</h3>
              <p>{currentLang === 'ar'
                ? 'جاري تفعيل اشتراكك...'
                : 'Activating your subscription...'
              }</p>
            </div>
          )}

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentModal;
