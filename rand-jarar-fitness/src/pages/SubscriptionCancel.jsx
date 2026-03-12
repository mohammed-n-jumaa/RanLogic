import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaArrowRight, FaUndo } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header/Header';
import { useLanguage } from '../contexts/LanguageContext';
import './SubscriptionCancel.scss';

const SubscriptionCancel = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isArabic } = useLanguage();
  const subscriptionId = searchParams.get('subscription_id');

  useEffect(() => {

    console.log('Payment cancelled for subscription:', subscriptionId);
  }, [subscriptionId]);

  return (
    <div className="subscription-cancel-page">
      <Header />
      
      <section className="cancel-section">
        <div className="container">
          <motion.div 
            className="cancel-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <motion.div 
              className="cancel-icon"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <FaTimes />
            </motion.div>
            
            <h2>{isArabic ? 'تم إلغاء عملية الدفع' : 'Payment Cancelled'}</h2>
            
            <p className="cancel-message">
              {isArabic 
                ? 'لقد ألغيت عملية الدفع. لم يتم خصم أي مبلغ من حسابك.'
                : 'You have cancelled the payment process. No amount has been charged from your account.'}
            </p>

            <div className="info-box">
              <p>
                {isArabic 
                  ? 'إذا كنت قد واجهت مشكلة أو لديك أسئلة، يمكنك التواصل مع فريق الدعم.'
                  : 'If you encountered a problem or have questions, you can contact our support team.'}
              </p>
            </div>

            <div className="action-buttons">
              <motion.button 
                className="btn btn-primary"
                onClick={() => navigate('/plans')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaUndo />
                {isArabic ? 'إعادة المحاولة' : 'Try Again'}
              </motion.button>
              
              <motion.button 
                className="btn btn-outline"
                onClick={() => navigate('/')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isArabic ? 'العودة للصفحة الرئيسية' : 'Back to Home'}
                <FaArrowRight />
              </motion.button>
            </div>

            <div className="help-section">
              <p>
                {isArabic ? 'هل تحتاج مساعدة؟' : 'Need help?'}
              </p>
              <button 
                className="contact-link"
                onClick={() => navigate('/contact')}
              >
                {isArabic ? 'تواصل معنا' : 'Contact Us'}
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SubscriptionCancel;