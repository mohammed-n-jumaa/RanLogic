import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaPaypal, FaUniversity, FaStar } from 'react-icons/fa';
import PayPalPayment from './PayPalPayment';
import BankTransferPayment from './BankTransferPayment';
import { useProfileLanguage } from '../../../contexts/ProfileLanguageContext';
import subscriptionApi from '../../../api/subscriptionApi';
import Swal from 'sweetalert2';

const RenewalCard = ({ userData, delay }) => {
  const { t } = useProfileLanguage();
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [selectedPlan, setSelectedPlan] = useState('elite'); // Default to elite
  const [selectedDuration, setSelectedDuration] = useState('1month');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await subscriptionApi.getPlans();
      if (response.success) {
        setPlans(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysLeft = () => {
    if (!userData.subscription_end_date) return 0;
    
    const endDate = new Date(userData.subscription_end_date);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  const handleRenewalSuccess = () => {
    setShowPayment(false);
    setPaymentMethod('paypal');
    window.location.reload();
  };

  const handleContinue = () => {
    setShowPayment(true);
  };

  const handleBack = () => {
    if (showPayment) {
      setShowPayment(false);
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

  const daysLeft = calculateDaysLeft();
  const isExpiringSoon = daysLeft <= 7;

  // خطط الاشتراك
  const availablePlans = [
    { value: 'basic', labelAr: 'خطة Basic', labelEn: 'Basic Plan', price: 39, icon: '💪' },
    { value: 'nutrition', labelAr: 'خطة Nutrition', labelEn: 'Nutrition Plan', price: 49, icon: '🥗' },
    { value: 'elite', labelAr: 'خطة Elite', labelEn: 'Elite Plan', price: 79, icon: '⭐', popular: true },
    { value: 'vip', labelAr: 'خطة VIP', labelEn: 'VIP Plan', price: 149, icon: '👑' }
  ];

  // مدد الاشتراك
  const durations = [
    { value: '1month', labelAr: 'شهر واحد', labelEn: '1 Month', discount: 0 },
    { value: '3months', labelAr: '3 أشهر', labelEn: '3 Months', discount: 5 },
    { value: '6months', labelAr: '6 أشهر', labelEn: '6 Months', discount: 10 }
  ];

  // حساب السعر
  const selectedPlanData = availablePlans.find(p => p.value === selectedPlan);
  const selectedDurationData = durations.find(d => d.value === selectedDuration);
  
  const basePrice = selectedPlanData?.price || 79;
  const durationMultiplier = selectedDuration === '3months' ? 3 : selectedDuration === '6months' ? 6 : 1;
  const subtotal = basePrice * durationMultiplier;
  const discount = selectedDurationData?.discount || 0;
  const totalAmount = (subtotal * (100 - discount) / 100).toFixed(2);

  return (
    <motion.div 
      className="renewal-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
    >
      <div className="card-header">
        <h3>{t('تجديد الاشتراك', 'Renew Subscription')}</h3>
        <FaBell className={`header-icon ${isExpiringSoon ? 'warning' : ''}`} />
      </div>
      
      <AnimatePresence mode="wait">
        {!showPayment ? (
          <motion.div 
            className="renewal-content"
            key="renewal-info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="renewal-info">
              <p>{t('سينتهي اشتراكك في', 'Your subscription will expire on')} <strong>{formatDate(userData.subscription_end_date)}</strong></p>
              <p className="days-remaining">
                <strong className={isExpiringSoon ? 'warning' : ''}>{daysLeft}</strong> {t('يوم متبقي', 'days remaining')}
              </p>
              <p className="reminder">
                💡 {t('جدد اشتراكك الآن واحصل على خصم يصل إلى', 'Renew your subscription now and get up to')} <strong>10%</strong> {t('خصم', 'discount')}
              </p>
            </div>

            {/* اختيار الخطة */}
            <div className="plan-selection">
              <label className="section-label">{t('اختر خطتك:', 'Choose Your Plan:')}</label>
              <div className="plans-grid">
                {availablePlans.map(plan => (
                  <button
                    key={plan.value}
                    className={`plan-option ${selectedPlan === plan.value ? 'selected' : ''} ${plan.popular ? 'popular' : ''}`}
                    onClick={() => setSelectedPlan(plan.value)}
                  >
                    {plan.popular && (
                      <div className="popular-badge">
                        <FaStar /> {t('الأكثر شعبية', 'Most Popular')}
                      </div>
                    )}
                    <div className="plan-icon">{plan.icon}</div>
                    <div className="plan-name">{t(plan.labelAr, plan.labelEn)}</div>
                    <div className="plan-price">${plan.price}/{t('شهر', 'month')}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* اختيار المدة */}
            <div className="duration-selection">
              <label className="section-label">{t('اختر المدة:', 'Choose Duration:')}</label>
              <div className="duration-options">
                {durations.map(duration => (
                  <button
                    key={duration.value}
                    className={`duration-option ${selectedDuration === duration.value ? 'selected' : ''}`}
                    onClick={() => setSelectedDuration(duration.value)}
                  >
                    <div className="duration-name">{t(duration.labelAr, duration.labelEn)}</div>
                    {duration.discount > 0 && (
                      <div className="duration-discount">
                        {t('وفر', 'Save')} {duration.discount}%
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* ملخص السعر */}
            <div className="renewal-pricing">
              <div className="price-item">
                <span>{t('السعر الأساسي:', 'Base Price:')}</span>
                <span>${basePrice} × {durationMultiplier} {t('شهر', 'month(s)')}</span>
              </div>
              <div className="price-item">
                <span>{t('المجموع الفرعي:', 'Subtotal:')}</span>
                <span>${subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="price-item discount">
                  <span>{t('الخصم', 'Discount')} ({discount}%):</span>
                  <span className="discount-amount">-${(subtotal * discount / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="price-item total">
                <span>{t('المجموع النهائي:', 'Total:')}</span>
                <span className="total-price">${totalAmount}</span>
              </div>
            </div>

            {/* اختيار طريقة الدفع */}
            <div className="payment-method-section">
              <label className="section-label">{t('اختر طريقة الدفع:', 'Choose Payment Method:')}</label>
              
              <div className="payment-toggle-buttons">
                <button
                  className={`payment-toggle-btn paypal ${paymentMethod === 'paypal' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('paypal')}
                >
                  <FaPaypal className="btn-icon" />
                  <div className="btn-content">
                    <span className="btn-title">PayPal</span>
                    <span className="btn-subtitle">{t('دفع فوري وآمن', 'Instant & secure payment')}</span>
                  </div>
                </button>

                <button
                  className={`payment-toggle-btn bank ${paymentMethod === 'bank' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('bank')}
                >
                  <FaUniversity className="btn-icon" />
                  <div className="btn-content">
                    <span className="btn-title">{t('تحويل بنكي', 'Bank Transfer')}</span>
                    <span className="btn-subtitle">{t('خلال 48 ساعة', 'Within 48 hours')}</span>
                  </div>
                </button>
              </div>
            </div>

            <motion.button
              className="renew-btn"
              onClick={handleContinue}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {t('متابعة إلى الدفع', 'Continue to Payment')}
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            className="payment-section"
            key="payment"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {paymentMethod === 'paypal' ? (
              <PayPalPayment
                planType={selectedPlan}
                duration={selectedDuration}
                amount={totalAmount}
                originalAmount={subtotal}
                discountPercentage={discount}
                onSuccess={handleRenewalSuccess}
                onCancel={handleBack}
              />
            ) : (
              <BankTransferPayment
                planType={selectedPlan}
                duration={selectedDuration}
                amount={totalAmount}
                originalAmount={subtotal}
                discountPercentage={discount}
                onSuccess={handleRenewalSuccess}
                onCancel={handleBack}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RenewalCard;