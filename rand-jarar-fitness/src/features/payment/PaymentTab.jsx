import { useEffect, useState } from 'react';
import { BadgeCheck, RefreshCw, Receipt, Lock, Landmark, ArrowRight, ArrowLeft, Star, Sparkles, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { FaPaypal } from '@/components/common/SocialIcons';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';
import subscriptionApi from '../../api/subscriptionApi';
import Ring from '../profile/shell/Ring';
import { getSubscriptionProgress } from '../profile/shell/profileShared';
import PayPalPayment from './PayPalPayment';
import BankTransferPayment from './BankTransferPayment';
import './Payment.scss';

// Same plans / durations / price formula as the previous RenewalCard
const PLANS = [
  { value: 'basic', labelAr: 'Basic', labelEn: 'Basic', price: 39, icon: '💪' },
  { value: 'nutrition', labelAr: 'Nutrition', labelEn: 'Nutrition', price: 49, icon: '🥗' },
  { value: 'elite', labelAr: 'Elite', labelEn: 'Elite', price: 79, icon: '⭐', popular: true },
  { value: 'vip', labelAr: 'VIP', labelEn: 'VIP', price: 149, icon: '👑' },
];
const DURATIONS = [
  { value: '1month', labelAr: 'شهر', labelEn: '1 month', months: 1, discount: 0 },
  { value: '3months', labelAr: '3 أشهر', labelEn: '3 months', months: 3, discount: 5 },
  { value: '6months', labelAr: '6 أشهر', labelEn: '6 months', months: 6, discount: 10 },
];

const PaymentTab = ({ userData }) => {
  const { t, currentLang, isArabic } = useProfileLanguage();
  const [plan, setPlan] = useState('elite');
  const [duration, setDuration] = useState('1month');
  const [method, setMethod] = useState('paypal');
  const [checkout, setCheckout] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    subscriptionApi.getUserSubscriptions()
      .then(res => { if (res?.success) setHistory(res.data || []); })
      .catch(err => console.error('Error fetching payment history:', err))
      .finally(() => setHistoryLoading(false));
  }, []);

  const locale = currentLang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US';
  const fmt = d => (d ? new Date(d).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' }) : '--');

  const active = !!userData.has_active_subscription;
  const { daysLeft, totalDays, pctUsed } = getSubscriptionProgress(userData);
  const expiringSoon = active && daysLeft <= 7;

  const planData = PLANS.find(p => p.value === plan);
  const durationData = DURATIONS.find(d => d.value === duration);
  const subtotal = planData.price * durationData.months;
  const discountAmount = +(subtotal * durationData.discount / 100).toFixed(2);
  const total = (subtotal - discountAmount).toFixed(2);

  const handleRenewalSuccess = () => {
    setCheckout(false);
    window.location.reload();
  };

  const BackIcon = isArabic ? ArrowRight : ArrowLeft;

  return (
    <div className="pf-grid pf-grid--3">
      {/* ── Status ── */}
      <section className="pf-card pf-span-2">
        <div className="pf-card__head">
          <h3 className="pf-card__title"><span className="pf-card__icon"><BadgeCheck /></span>{userData.program || t('اشتراكك', 'Your subscription')}</h3>
          <span className={`pf-pill ${!active ? 'pf-pill--bad' : expiringSoon ? 'pf-pill--warn' : 'pf-pill--ok'}`}>
            {!active ? t('منتهي', 'Expired') : expiringSoon ? t('قارب على الانتهاء', 'Ending soon') : t('نشط', 'Active')}
          </span>
        </div>

        <div className="pay-status">
          <Ring value={daysLeft} max={totalDays || 1} size={112} stroke={10} label={daysLeft} sub={t('يوم متبقي', 'days left')} />
          <div className="pay-timeline">
            <span className="pay-timeline__track"><span style={{ width: `${pctUsed}%` }} /></span>
            <div className="pay-timeline__point"><i /><strong>{t('البدء', 'Start')}</strong><small className="pf-num">{fmt(userData.subscription_start_date)}</small></div>
            <div className="pay-timeline__point"><i /><strong>{t('اليوم', 'Today')}</strong><small className="pf-num">{fmt(new Date())}</small></div>
            <div className="pay-timeline__point is-future"><i /><strong>{t('الانتهاء', 'End')}</strong><small className="pf-num">{fmt(userData.subscription_end_date)}</small></div>
          </div>
        </div>

        {expiringSoon && (
          <p className="pay-warning"><AlertTriangle /> {t(`اشتراكك بينتهي خلال ${daysLeft} أيام — جدّد عشان ما تنقطع خطتك.`, `Your plan ends in ${daysLeft} days — renew to keep going.`)}</p>
        )}
      </section>

      <section className="pf-card">
        <div className="pf-card__head">
          <h3 className="pf-card__title"><span className="pf-card__icon"><Sparkles /></span>{t('بتشمل خطتك', 'Your plan includes')}</h3>
        </div>
        <ul className="pay-includes">
          {[t('برنامج تمارين شهري', 'Monthly workout program'), t('خطة تغذية مخصصة', 'Custom nutrition plan'),
            t('دردشة مباشرة مع الكوتش', 'Direct chat with your coach'), t('متابعة وتعديل مستمر', 'Ongoing follow-up')].map(item => (
            <li key={item}><Check /> {item}</li>
          ))}
        </ul>
      </section>

      {/* ── Renewal ── */}
      <section className="pf-card pf-span-3">
        <div className="pf-card__head">
          <h3 className="pf-card__title">
            <span className="pf-card__icon"><RefreshCw /></span>
            {active ? t('تجديد الاشتراك', 'Renew subscription') : t('اشترك من جديد', 'Subscribe again')}
          </h3>
          {checkout && (
            <button type="button" className="pf-btn pf-btn--ghost pf-btn--sm" onClick={() => setCheckout(false)}>
              <BackIcon /> {t('رجوع', 'Back')}
            </button>
          )}
        </div>

        {checkout ? (
          <div className="pay-checkout">
            {method === 'paypal' ? (
              <PayPalPayment
                planType={plan} duration={duration} amount={total} originalAmount={subtotal}
                discountPercentage={durationData.discount}
                onSuccess={handleRenewalSuccess} onCancel={() => setCheckout(false)}
              />
            ) : (
              <BankTransferPayment
                planType={plan} duration={duration} amount={total} originalAmount={subtotal}
                discountPercentage={durationData.discount}
                onSuccess={handleRenewalSuccess} onCancel={() => setCheckout(false)}
              />
            )}
          </div>
        ) : (
          <div className="pay-renew">
            <div className="pay-renew__choices">
              <p className="pay-label">{t('اختر الخطة', 'Choose a plan')}</p>
              <div className="pay-plans">
                {PLANS.map(p => (
                  <button key={p.value} type="button" className={`pay-plan ${plan === p.value ? 'is-active' : ''}`} onClick={() => setPlan(p.value)} aria-pressed={plan === p.value}>
                    {p.popular && <span className="pf-pill pf-pill--primary pay-plan__tag"><Star /> {t('الأكثر شعبية', 'Most popular')}</span>}
                    <span className="pay-plan__icon">{p.icon}</span>
                    <strong>{t(p.labelAr, p.labelEn)}</strong>
                    <span className="pay-plan__price pf-num">${p.price}<small>/{t('شهر', 'mo')}</small></span>
                  </button>
                ))}
              </div>

              <p className="pay-label">{t('اختر المدة', 'Choose a duration')}</p>
              <div className="pf-segmented pay-durations">
                {DURATIONS.map(d => (
                  <button key={d.value} type="button" className={duration === d.value ? 'is-active' : ''} onClick={() => setDuration(d.value)}>
                    {t(d.labelAr, d.labelEn)}
                    {d.discount > 0 && <span className="pay-save">-{d.discount}%</span>}
                  </button>
                ))}
              </div>

              <p className="pay-label">{t('طريقة الدفع', 'Payment method')}</p>
              <div className="pay-methods">
                <button type="button" className={`pay-method ${method === 'paypal' ? 'is-active' : ''}`} onClick={() => setMethod('paypal')} aria-pressed={method === 'paypal'}>
                  <FaPaypal /><span><strong>PayPal</strong><small>{t('دفع فوري وآمن', 'Instant & secure')}</small></span>
                </button>
                <button type="button" className={`pay-method ${method === 'bank' ? 'is-active' : ''}`} onClick={() => setMethod('bank')} aria-pressed={method === 'bank'}>
                  <Landmark /><span><strong>{t('تحويل بنكي', 'Bank transfer')}</strong><small>{t('تفعيل خلال 48 ساعة', 'Activated within 48h')}</small></span>
                </button>
              </div>
            </div>

            <aside className="pay-summary">
              <div><span>{t('السعر', 'Price')}</span><span className="pf-num">${planData.price} × {durationData.months}</span></div>
              <div><span>{t('المجموع الفرعي', 'Subtotal')}</span><span className="pf-num">${subtotal}</span></div>
              {durationData.discount > 0 && (
                <div className="is-discount"><span>{t('الخصم', 'Discount')} ({durationData.discount}%)</span><span className="pf-num">-${discountAmount}</span></div>
              )}
              <div className="is-total"><span>{t('المجموع', 'Total')}</span><span className="pf-num">${total}</span></div>
              <button type="button" className="pf-btn pf-btn--primary pf-btn--block" onClick={() => setCheckout(true)}>
                <Lock /> {t('متابعة إلى الدفع', 'Continue to payment')}
              </button>
            </aside>
          </div>
        )}
      </section>

      {/* ── History ── */}
      <section className="pf-card pf-span-3">
        <div className="pf-card__head">
          <h3 className="pf-card__title"><span className="pf-card__icon"><Receipt /></span>{t('سجل الدفعات', 'Payment history')}</h3>
        </div>
        {historyLoading ? (
          <p className="pf-card__sub"><Loader2 className="pf-spin" /> {t('جاري التحميل…', 'Loading…')}</p>
        ) : !history.length ? (
          <p className="pf-card__sub">{t('لا يوجد سجل دفعات', 'No payments yet')}</p>
        ) : (
          <div className="pay-table-wrap">
            <table className="pay-table">
              <thead>
                <tr>
                  <th>{t('التاريخ', 'Date')}</th>
                  <th>{t('الخطة', 'Plan')}</th>
                  <th className="pay-table__method">{t('الطريقة', 'Method')}</th>
                  <th>{t('المبلغ', 'Amount')}</th>
                  <th>{t('الحالة', 'Status')}</th>
                </tr>
              </thead>
              <tbody>
                {history.map(p => (
                  <tr key={p.id}>
                    <td className="pf-num">{fmt(p.created_at)}</td>
                    <td>{(p.plan_type || '').toUpperCase()}{p.duration ? ` · ${t(DURATIONS.find(d => d.value === p.duration)?.labelAr || p.duration, DURATIONS.find(d => d.value === p.duration)?.labelEn || p.duration)}` : ''}</td>
                    <td className="pay-table__method">{p.payment_method === 'paypal' ? 'PayPal' : t('تحويل بنكي', 'Bank transfer')}</td>
                    <td className="pf-num">${p.amount}</td>
                    <td><StatusPill status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

const StatusPill = ({ status }) => {
  const { t } = useProfileLanguage();
  const map = {
    approved: ['pf-pill--ok', t('مدفوع', 'Paid')],
    pending: ['pf-pill--warn', t('قيد المراجعة', 'Pending')],
    rejected: ['pf-pill--bad', t('مرفوض', 'Rejected')],
    cancelled: ['pf-pill--muted', t('ملغي', 'Cancelled')],
  };
  const [cls, label] = map[status] || ['pf-pill--muted', status];
  return <span className={`pf-pill ${cls}`}>{label}</span>;
};

export default PaymentTab;
