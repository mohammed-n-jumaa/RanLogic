import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, RefreshCw, ShieldCheck, MessageCircle, Salad, Zap, Sparkles } from 'lucide-react';
import Header from '../components/layout/Header/Header';
import PlansSkeleton from '../components/common/PlansSkeleton/PlansSkeleton';
import PlanCard from "../features/Plans/PlanCard";
import PaymentModal from "../features/Plans/PaymentModal";
import FeaturesComparison from "../features/Plans/FeaturesComparison";
import PlansFaq from "../features/Plans/PlansFaq";
import SEO from '../components/common/SEO/SEO';
import { useLanguage } from '../contexts/LanguageContext';
import { breadcrumbs, siteConfig } from '../utils/seoConfig';
import subscriptionApi from '../api/subscriptionApi';
import usePageTitle from '@/hooks/usePageTitle';
import './Plans.scss';

const Plans = () => {
  const navigate = useNavigate();
  const { currentLang, isArabic } = useLanguage();
  usePageTitle('باقات الاشتراك', 'Subscription Plans', currentLang);
  
  

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [plansStructuredData, setPlansStructuredData] = useState(null);
  const [currency, setCurrency] = useState({ code: 'USD', symbol: '$' });
  const [duration, setDuration] = useState('1month');   // one switch for all plan cards

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

        if (response.currency) {
          setCurrency(response.currency);
        }

        // Generate Offer schema for each plan (inline — no dependency on structuredData.offer)
        const offersSchema = data.map((plan) => {
          const prices = Array.isArray(plan?.durations)
            ? plan.durations.map((d) => parseFloat(d.price)).filter((p) => !Number.isNaN(p))
            : [];
          const lowestPrice = prices.length ? Math.min(...prices) : undefined;

          return {
            '@context': 'https://schema.org',
            '@type': 'Offer',
            name: plan.name,
            description: plan.description,
            price: lowestPrice,
            priceCurrency: 'JOD',
            availability: 'https://schema.org/InStock',
            url: `${siteConfig.siteUrl}/plans`,
            seller: { '@id': `${siteConfig.siteUrl}/#organization` }
          };
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
                priceValidUntil: new Date(
                  Date.now() + 90 * 24 * 60 * 60 * 1000
                ).toISOString()
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

  // ── Loading state ─────────────────────────────────────────
  if (loading) {
    return (
      <>
        <SEO
          page="plans"
          breadcrumbItems={breadcrumbs.plans(currentLang)}
        />
        <PlansSkeleton />
      </>
    );
  }

  // Best discount per duration across all plans (for the "save up to X%" tags on the switch)
  const maxDiscount = (key) => Math.max(0, ...plans.map(p => Number(p.pricing?.[key]?.discount) || 0));
  const durations = [
    { key: '1month', label: isArabic ? 'شهر' : '1 month' },
    { key: '3months', label: isArabic ? '3 أشهر' : '3 months', save: maxDiscount('3months') },
    { key: '6months', label: isArabic ? '6 أشهر' : '6 months', save: maxDiscount('6months') },
  ];
  const bestSave = maxDiscount('6months');

  // ── Error state ───────────────────────────────────────────
  if (error) {
    return (
      <>
        <SEO page="plans" breadcrumbItems={breadcrumbs.plans(currentLang)} />
        <div className="plans-page" dir={isArabic ? 'rtl' : 'ltr'}>
          <Header />
          <div className="pl-top pl-top--error">
            <div className="pl-error">
              <AlertCircle />
              <p>{isArabic ? 'عذراً، صار خطأ بتحميل الباقات' : 'Sorry, we couldn’t load the plans'}</p>
              <button type="button" className="pl-btn" onClick={fetchPlans}>
                <RefreshCw /> {isArabic ? 'إعادة المحاولة' : 'Try again'}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Main return ───────────────────────────────────────────
  return (
    <>
      <SEO
        page="plans"
        structuredDataOverride={plansStructuredData}
        breadcrumbItems={breadcrumbs.plans(currentLang)}
      />

      <div className="plans-page" dir={isArabic ? 'rtl' : 'ltr'}>
        <Header />

        {/* Hero + plans share one background (site colours, admin-configurable) */}
        <div className="pl-top">
          <div className="pl-glow pl-glow--1" aria-hidden="true" />
          <div className="pl-glow pl-glow--2" aria-hidden="true" />

          <section className="pl-hero">
            <motion.div
              className="pl-container pl-hero__inner"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="pl-eyebrow">{isArabic ? 'باقات الاشتراك' : 'Subscription plans'}</span>
              <h1 className="pl-hero__title">
                {isArabic ? <>اختر الباقة اللي <span>بتناسب هدفك</span></> : <>Pick the plan that <span>fits your goal</span></>}
              </h1>
              <p className="pl-hero__text">
                {isArabic
                  ? 'برنامج تدريب وتغذية مصمم إلك، ودردشة مباشرة مع الكوتش لمتابعة تقدّمك خطوة بخطوة.'
                  : 'A training and nutrition program built for you, with direct chat with your coach to follow your progress step by step.'}
              </p>

              {/* One duration switch for all cards */}
              <div className="pl-switch" role="radiogroup" aria-label={isArabic ? 'مدة الاشتراك' : 'Subscription length'}>
                {durations.map(d => (
                  <button
                    key={d.key}
                    type="button"
                    role="radio"
                    aria-checked={duration === d.key}
                    className={`pl-switch__opt ${duration === d.key ? 'is-active' : ''}`}
                    onClick={() => setDuration(d.key)}
                  >
                    {d.label}
                    {d.save > 0 && <span className="pl-switch__save">-{d.save}%</span>}
                  </button>
                ))}
              </div>
              {bestSave > 0 && (
                <p className="pl-hero__hint">
                  <Sparkles />
                  {isArabic ? `وفّر لحد ${bestSave}% لما تشترك 6 أشهر` : `Save up to ${bestSave}% with 6 months`}
                </p>
              )}
            </motion.div>
          </section>

          <section className="pl-plans" aria-label={isArabic ? 'الباقات' : 'Plans'}>
            <div className="pl-container">
              <div className="pl-grid">
                {plans.map((plan, index) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    duration={duration}
                    onSelect={handleSelectPlan}
                    delay={index * 0.08}
                    currency={currency}
                    isArabic={isArabic}
                  />
                ))}
              </div>

              <ul className="pl-trust">
                <li><ShieldCheck /><span>{isArabic ? 'دفع آمن عبر PayPal أو تحويل بنكي' : 'Secure payment via PayPal or bank transfer'}</span></li>
                <li><MessageCircle /><span>{isArabic ? 'دردشة خاصة مباشرة مع الكوتش' : 'Private chat with your coach'}</span></li>
                <li><Salad /><span>{isArabic ? 'نظام غذائي مخصص إلك' : 'A nutrition plan made for you'}</span></li>
                <li><Zap /><span>{isArabic ? 'برنامجك جاهز خلال 24–48 ساعة' : 'Your program within 24–48 hours'}</span></li>
              </ul>
            </div>
          </section>
        </div>

        <FeaturesComparison plans={plans} isArabic={isArabic} />
        <PlansFaq isArabic={isArabic} />

        {/* Payment Modal */}
        {showPaymentModal && (
          <PaymentModal
            plan={selectedPlan}
            duration={selectedDuration}
            onClose={() => setShowPaymentModal(false)}
            onSuccess={handlePaymentSuccess}
            currentLang={currentLang}
            currency={currency}
          />
        )}
      </div>
    </>
  );
};

export default Plans;
