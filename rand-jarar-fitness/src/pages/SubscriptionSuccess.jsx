import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaArrowRight, FaTimes } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header/Header';
import { useLanguage } from '../contexts/LanguageContext';
import subscriptionApi from '../api/subscriptionApi';
import authApi from '../api/authApi'; 
import './SubscriptionSuccess.scss';

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState('loading');
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const { isArabic } = useLanguage();

  const didCaptureRef = useRef(false);

  const REDIRECT_SECONDS = 60;
  const [countdown, setCountdown] = useState(REDIRECT_SECONDS);
  const redirectTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  const clearTimers = () => {
    if (redirectTimerRef.current) {
      clearTimeout(redirectTimerRef.current);
      redirectTimerRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  };

  useEffect(() => {
    const capturePayment = async () => {
      if (didCaptureRef.current) return;
      didCaptureRef.current = true;

      const token = searchParams.get('token'); 
      const subscriptionId = searchParams.get('subscription_id');
      const payerId = searchParams.get('PayerID'); 

      if (!token || !subscriptionId) {
        console.error('Missing parameters:', { token, subscriptionId, payerId });
        setErrorMessage(isArabic ? 'بيانات الدفع غير مكتملة في الرابط.' : 'Missing payment parameters in the URL.');
        setStatus('error');
        return;
      }

      try {
        console.log('Capturing payment with:', { token, subscriptionId, payerId });

        const response = await subscriptionApi.capturePayPalPayment(token, subscriptionId);

        console.log('Capture response:', response);

        if (response?.success) {
          setStatus('success');
          setSubscriptionData(response?.data?.subscription || null);

     
          try {
            await authApi.refreshUser();
          } catch (e) {
            console.warn('refreshUser failed (non-blocking):', e);
          }

          setCountdown(REDIRECT_SECONDS);
          clearTimers();

          countdownIntervalRef.current = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) return 0;
              return prev - 1;
            });
          }, 1000);

          redirectTimerRef.current = setTimeout(() => {
            clearTimers();
            navigate('/profile');
          }, REDIRECT_SECONDS * 1000);
        } else {
          const msg =
            response?.message ||
            (isArabic ? 'فشل تأكيد الدفع. حاول مرة أخرى.' : 'Payment capture failed. Please try again.');
          setErrorMessage(msg);
          console.error('Capture failed:', response);
          setStatus('error');
        }
      } catch (error) {
        console.error('Payment capture error:', error);

        const serverMsg =
          error?.response?.data?.message ||
          error?.response?.data?.paypal_error ||
          error?.message;

        console.error('Error details:', error?.response?.data);

        setErrorMessage(
          serverMsg ||
            (isArabic
              ? 'حدث خطأ أثناء تأكيد الدفع. يرجى المحاولة مرة أخرى.'
              : 'An error occurred while confirming your payment. Please try again.')
        );
        setStatus('error');
      }
    };

    capturePayment();


    return () => clearTimers();

  }, [searchParams, navigate, isArabic]);

  const goToProfileNow = async () => {

    try {
      await authApi.refreshUser();
    } catch (e) {}
    clearTimers();
    navigate('/profile');
  };

  return (
    <div className="subscription-success-page">
      <Header />

      <section className="success-section">
        <div className="container">
          {status === 'loading' && (
            <motion.div
              className="status-card loading"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="spinner-large"></div>
              <h2>{isArabic ? 'جاري التحقق من الدفع...' : 'Verifying payment...'}</h2>
              <p>{isArabic ? 'يرجى الانتظار، لا تغلق هذه الصفحة' : 'Please wait, do not close this page'}</p>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div
              className="status-card success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <motion.div
                className="success-icon"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <FaCheckCircle />
              </motion.div>

              <h2>{isArabic ? 'تم الدفع بنجاح! 🎉' : 'Payment Successful! 🎉'}</h2>

              <p className="success-message">
                {isArabic
                  ? 'تم تفعيل اشتراكك بنجاح. يمكنك الآن قراءة تفاصيل الفاتورة قبل التحويل للملف الشخصي.'
                  : 'Your subscription has been activated. You can read the invoice details before being redirected.'}
              </p>

              {subscriptionData && (
                <div className="subscription-details">
                  <div className="detail-card">
                    <div className="detail-item">
                      <span className="label">{isArabic ? 'الخطة:' : 'Plan:'}</span>
                      <span className="value plan-name">{subscriptionData.plan_name}</span>
                    </div>

                    <div className="detail-item">
                      <span className="label">{isArabic ? 'المدة:' : 'Duration:'}</span>
                      <span className="value">{subscriptionData.duration_name}</span>
                    </div>

                    <div className="detail-item">
                      <span className="label">{isArabic ? 'المبلغ المدفوع:' : 'Amount Paid:'}</span>
                      <span className="value amount">${subscriptionData.amount}</span>
                    </div>
                  </div>

                  <div className="detail-card dates-card">
                    <div className="detail-item">
                      <span className="label">{isArabic ? 'تاريخ البدء:' : 'Start Date:'}</span>
                      <span className="value">
                        {subscriptionData.starts_at
                          ? new Date(subscriptionData.starts_at).toLocaleDateString()
                          : isArabic
                          ? 'غير متوفر'
                          : 'N/A'}
                      </span>
                    </div>

                    <div className="detail-item">
                      <span className="label">{isArabic ? 'تاريخ الانتهاء:' : 'End Date:'}</span>
                      <span className="value">
                        {subscriptionData.ends_at
                          ? new Date(subscriptionData.ends_at).toLocaleDateString()
                          : isArabic
                          ? 'غير متوفر'
                          : 'N/A'}
                      </span>
                    </div>

                    <div className="detail-item status-item">
                      <span className="label">{isArabic ? 'الحالة:' : 'Status:'}</span>
                      <span className="value status-active">
                        <FaCheckCircle /> {isArabic ? 'نشط' : 'Active'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* ✅ عداد لمدة دقيقة */}
              <div className="info-box">
                <p>
                  {isArabic
                    ? `🧾 هذه صفحة الفاتورة — سيتم تحويلك تلقائياً إلى الملف الشخصي بعد ${countdown} ثانية`
                    : `🧾 Invoice page — you will be redirected to your profile in ${countdown}s`}
                </p>
              </div>

              <div className="action-buttons">
                <motion.button
                  className="btn btn-primary"
                  onClick={goToProfileNow}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isArabic ? 'انتقل إلى الملف الشخصي الآن' : 'Go to Profile Now'}
                  <FaArrowRight />
                </motion.button>

                <motion.button
                  className="btn btn-outline"
                  onClick={() => {
                    clearTimers();
                    navigate('/');
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isArabic ? 'العودة للصفحة الرئيسية' : 'Back to Home'}
                </motion.button>
              </div>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              className="status-card error"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="error-icon">
                <FaTimes />
              </div>

              <h2>{isArabic ? 'حدث خطأ في الدفع' : 'Payment Error'}</h2>

              <p className="error-message">
                {errorMessage ||
                  (isArabic
                    ? 'عذراً، حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى أو التواصل مع الدعم.'
                    : 'Sorry, an error occurred while processing payment. Please try again or contact support.')}
              </p>

              <div className="action-buttons">
                <motion.button
                  className="btn btn-primary"
                  onClick={() => navigate('/plans')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isArabic ? 'العودة للخطط' : 'Back to Plans'}
                </motion.button>

                <motion.button
                  className="btn btn-outline"
                  onClick={() => navigate('/')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isArabic ? 'الصفحة الرئيسية' : 'Home'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SubscriptionSuccess;
