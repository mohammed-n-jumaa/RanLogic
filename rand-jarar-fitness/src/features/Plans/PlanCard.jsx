import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react';

const MONTHS = { '1month': 1, '3months': 3, '6months': 6 };
const VISIBLE_FEATURES = 6;   // the rest sit behind "show all"

const formatMoney = (value) => {
  const n = Number(value) || 0;
  return Number.isInteger(n) ? n.toLocaleString('en-US') : n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

/** One subscription plan. The duration is chosen once for the whole page (see Plans.jsx). */
const PlanCard = ({ plan, duration, onSelect, currency, isArabic, delay = 0 }) => {
  const { name, subtitle, pricing, popular, badge, features = [], icon } = plan;
  const [showAll, setShowAll] = useState(false);
  const t = (ar, en) => (isArabic ? ar : en);

  const p = pricing?.[duration] || pricing?.['1month'] || {};
  const months = MONTHS[duration] || 1;
  const hasDiscount = p.discount > 0 && p.originalPrice > p.price;
  const sym = currency?.symbol || '$';
  const perMonth = months > 1 ? p.price / months : null;
  const visible = showAll ? features : features.slice(0, VISIBLE_FEATURES);
  const Arrow = isArabic ? ArrowLeft : ArrowRight;

  return (
    <motion.article
      className={`pl-card ${popular ? 'is-popular' : ''}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
    >
      {popular && (
        <span className="pl-card__badge">
          <Crown /> {badge || t('الأكثر طلباً', 'Most popular')}
        </span>
      )}

      <header className="pl-card__head">
        {icon && <span className="pl-card__icon" aria-hidden="true">{icon}</span>}
        <div>
          <h3 className="pl-card__name">{name}</h3>
          {subtitle && <p className="pl-card__subtitle">{subtitle}</p>}
        </div>
      </header>

      <div className="pl-card__price">
        <div className="pl-card__amount">
          <span className="pl-card__currency">{sym}</span>
          <span className="pl-card__value">{formatMoney(p.price)}</span>
          <span className="pl-card__period">
            / {months === 1 ? t('شهر', 'month') : t(`${months} أشهر`, `${months} months`)}
          </span>
        </div>

        {/* Always two lines under the price, so every card lines up */}
        <p className="pl-card__billing">
          {perMonth
            ? <>{t('يعني', 'That’s')} <strong className="pl-num">{sym}{formatMoney(perMonth)}</strong> {t('بالشهر', 'per month')}</>
            : t('دفعة شهرية', 'Billed monthly')}
        </p>
        <div className="pl-card__price-meta">
          {hasDiscount ? (
            <>
              <s className="pl-num">{sym}{formatMoney(p.originalPrice)}</s>
              <span className="pl-card__save">
                {t('وفّر', 'Save')} <span className="pl-num">{sym}{formatMoney(p.originalPrice - p.price)}</span>
              </span>
            </>
          ) : (
            <span className="pl-card__nodeal">
              {months === 1 ? t('ابدأ بشهر وجرّب', 'Start with a month') : t('بدون خصم على هذه المدة', 'No discount on this length')}
            </span>
          )}
        </div>
      </div>

      <button type="button" className="pl-card__cta" onClick={() => onSelect(plan, duration)}>
        {t('اختر هذه الباقة', 'Choose this plan')} <Arrow />
      </button>

      {features.length > 0 && (
        <div className="pl-card__features">
          <p className="pl-card__features-title">{t('شو بتاخد:', 'What you get:')}</p>
          <ul>
            {visible.map((feature, i) => (
              <li key={i}><span className="pl-card__tick"><Check /></span>{feature}</li>
            ))}
          </ul>
          {features.length > VISIBLE_FEATURES && (
            <button type="button" className="pl-card__more" onClick={() => setShowAll(v => !v)} aria-expanded={showAll}>
              {showAll
                ? t('عرض أقل', 'Show less')
                : t(`عرض كل المميزات (${features.length})`, `Show all features (${features.length})`)}
              <ChevronDown className={showAll ? 'is-up' : ''} />
            </button>
          )}
        </div>
      )}
    </motion.article>
  );
};

export default PlanCard;
