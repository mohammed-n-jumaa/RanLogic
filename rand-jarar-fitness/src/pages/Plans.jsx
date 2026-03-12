import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import PlanCard from '../components/Plans/PlanCard';
import PaymentModal from '../components/Plans/PaymentModal';
import FeaturesComparison from '../components/Plans/FeaturesComparison';
import SEO from '../components/SEO/SEO';
import { useLanguage } from '../contexts/LanguageContext';
import { pagesSEO, breadcrumbs, structuredData } from '../utils/seoConfig';
import subscriptionApi from '../api/subscriptionApi';
import './Plans.scss';

const Plans = () => {
  const navigate = useNavigate();
  const { currentLang, isArabic } = useLanguage();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [plansStructuredData, setPlansStructuredData] = useState(null);

  const seoData = pagesSEO?.plans?.[currentLang] || pagesSEO?.plans?.en || {
    title: isArabic ? 'الخطط والاشتراكات' : 'Plans & Subscriptions',
    description: isArabic
      ? 'اختر خطة التدريب المناسبة لك مع نظام تغذية ومتابعة.'
      : 'Choose the best plan for you with nutrition and coaching support.',
    keywords: isArabic
      ? 'خطط تدريب, اشتراك, مدربة شخصية, نظام غذائي'
      : 'training plans, subscription, personal trainer, nutrition plan',
    ogImage: '/og-image.jpg'
  };

  useEffect(() => {
    fetchPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLang]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await subscriptionApi.getPlans(currentLang);

      if (response?.success && response?.data) {
        const data = response.data;
        setPlans(data);

        // Generate structured data for plans
        const offersSchema = data.map((plan) => {
          const prices = Array.isArray(plan?.durations)
            ? plan.durations.map((d) => parseFloat(d.price)).filter((p) => !Number.isNaN(p))
            : [];
          const lowestPrice = prices.length ? Math.min(...prices) : undefined;

          return structuredData.offer({
            name: plan.name,
            description: plan.description,
            price: lowestPrice
          });
        });

        // ItemList schema for all plans
        const itemListSchema = {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: isArabic ? 'خطط الاشتراك' : 'Subscription Plans',
          description: isArabic
            ? 'خطط تدريبية متنوعة تناسب جميع الأهداف والاحتياجات'
            : 'Various training plans suitable for all goals and needs',
          itemListElement: data.map((plan, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Product',
              name: plan.name,
              description: plan.description,
              offers: (plan?.durations || []).map((duration) => ({
                '@type': 'Offer',
                price: duration.price,
                priceCurrency: 'JOD',
                availability: 'https://schema.org/InStock',
                validFrom: new Date().toISOString(),
                priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // 90 days
              }))
            }
          }))
        };

        setPlansStructuredData([...offersSchema, itemListSchema]);
      } else {
        setError('Failed to load plans');
      }
    } catch (err) {
      console.error('Error fetching plans:', err);
      setError('Error loading plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan, duration) => {
    setSelectedPlan(plan);
    setSelectedDuration(duration);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    navigate('/profile');
  };

  // Loading state
  if (loading) {
    return (
      <>
        <SEO
          title={seoData.title}
          description={seoData.description}
          keywords={seoData.keywords}
          image={seoData.ogImage}
          lang={currentLang}
          breadcrumbItems={breadcrumbs.plans(currentLang)}
        />

        <div className="plans-page">
          <Header />
          <div className="plans-loading">
            <div className="spinner"></div>
            <p>{isArabic ? 'جاري تحميل الخطط...' : 'Loading plans...'}</p>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <SEO
          title={seoData.title}
          description={seoData.description}
          keywords={seoData.keywords}
          image={seoData.ogImage}
          lang={currentLang}
          breadcrumbItems={breadcrumbs.plans(currentLang)}
        />

        <div className="plans-page">
          <Header />
          <div className="plans-error">
            <p>{isArabic ? 'عذراً، حدث خطأ في تحميل الخطط' : 'Sorry, error loading plans'}</p>
            <button className="retry-btn" onClick={fetchPlans}>
              {isArabic ? 'إعادة المحاولة' : 'Try Again'}
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        image={seoData.ogImage}
        lang={currentLang}
        structuredDataOverride={plansStructuredData}
        breadcrumbItems={breadcrumbs.plans(currentLang)}
      />

      <div className="plans-page">
        <Header />

        {/* Hero Section */}
        <section className="plans-hero">
          <div className="hero-background">
            <div className="gradient-orb orb-1"></div>
            <div className="gradient-orb orb-2"></div>
            <div className="gradient-orb orb-3"></div>
          </div>

          <div className="container">
            <motion.div
              className="hero-content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.span
                className="hero-label"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                {isArabic ? 'خطط التدريب والاشتراك' : 'Training & Subscription Plans'}
              </motion.span>

              <h1 className="hero-title">
                {isArabic ? 'طريقك لجسم صحي' : 'Your Path to a Healthy Body'}
                <span className="gradient-text">{isArabic ? ' يبدأ من هنا' : ' Starts Here'}</span>
              </h1>

              <p className="hero-description">
                {isArabic
                  ? 'برامج تدريبية وخطط تغذية مصممة خصيصاً لك، مع دردشة خاصة مباشرة مع المدرب لمتابعة تقدمك خطوة بخطوة'
                  : 'Training programs and nutrition plans designed specifically for you, with direct private chat with the coach to track your progress step by step'}
              </p>

              <motion.div
                className="special-offer-banner"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="offer-icon">🎉</div>
                <div className="offer-text">
                  <strong>{isArabic ? 'عرض محدود!' : 'Limited Time Offer!'}</strong>
                  <span>
                    {isArabic
                      ? 'احصل على خصم يصل إلى 10% على اشتراكات 6 أشهر'
                      : 'Get up to 10% OFF on 6-month subscriptions'}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Plans Section */}
        <section className="plans-section">
          <div className="container">
            <div className="plans-grid">
              {plans.map((plan, index) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onSelect={handleSelectPlan}
                  delay={index * 0.15}
                  currentLang={currentLang}
                />
              ))}
            </div>

            {/* Trust Badges */}
            <motion.div
              className="trust-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="trust-badge">
                <span className="badge-icon">🥗</span>
                <span>{isArabic ? 'برنامج تغذية مخصص لكل متدرب' : 'Custom nutrition plan for each trainee'}</span>
              </div>

              <div className="trust-badge">
                <span className="badge-icon">💬</span>
                <span>{isArabic ? 'دردشة خاصة مباشرة مع المدرب' : 'Direct private chat with coach'}</span>
              </div>

              <div className="trust-badge">
                <span className="badge-icon">⚡</span>
                <span>{isArabic ? 'بدء فوري بعد الاشتراك' : 'Instant start after subscription'}</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Comparison */}
        <FeaturesComparison plans={plans} currentLang={currentLang} />

        {/* Payment Modal */}
        {showPaymentModal && (
          <PaymentModal
            plan={selectedPlan}
            duration={selectedDuration}
            onClose={() => setShowPaymentModal(false)}
            onSuccess={handlePaymentSuccess}
            currentLang={currentLang}
          />
        )}
      </div>
    </>
  );
};

export default Plans;
