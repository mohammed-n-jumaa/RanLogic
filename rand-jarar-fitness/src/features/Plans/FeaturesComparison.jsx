import { motion } from 'framer-motion';
import { Check, Minus } from 'lucide-react';

// What each plan includes — keyed by the plan id (plan_key) coming from the API
const FEATURES = [
  { ar: 'برنامج تمارين مخصص (جيم أو بيت)', en: 'Customized workout plan (gym or home)', basic: true, nutrition: false, elite: true, vip: true },
  { ar: 'نظام غذائي محسوب (سعرات وماكروز)', en: 'Calculated nutrition plan (calories & macros)', basic: true, nutrition: true, elite: true, vip: true },
  { ar: 'تحديث شهري لبرنامج التمارين', en: 'Monthly workout updates', basic: true, nutrition: false, elite: true, vip: true },
  { ar: 'تحديث شهري للنظام الغذائي', en: 'Monthly nutrition updates', basic: false, nutrition: true, elite: true, vip: true },
  { ar: 'قائمة بدائل أكل (عشان ما تملّ)', en: 'Food swap list (so you never get bored)', basic: false, nutrition: true, elite: true, vip: true },
  { ar: 'خطة واضحة خطوة بخطوة', en: 'Clear step-by-step roadmap', basic: true, nutrition: false, elite: true, vip: true },
  { ar: 'نتائج مضمونة (مع الالتزام والمتابعة)', en: 'Guaranteed results (with commitment & follow-up)', basic: false, nutrition: false, elite: true, vip: true },
  { ar: 'تعديلات دورية لأفضل تقدّم', en: 'Regular adjustments for the best progress', basic: false, nutrition: false, elite: true, vip: true },
  {
    ar: 'متابعة التقدّم', en: 'Progress follow-up',
    basic: { ar: 'ذاتية', en: 'Self-managed' },
    nutrition: { ar: 'ذاتية', en: 'Self-managed' },
    elite: { ar: 'أسبوعية', en: 'Weekly' },
    vip: { ar: 'يومية', en: 'Daily' },
  },
  { ar: 'دردشة للأسئلة مع الكوتش', en: 'Chat with the coach for questions', basic: true, nutrition: true, elite: true, vip: true },
  { ar: 'توجيه بالمكمّلات', en: 'Supplements guidance', basic: false, nutrition: false, elite: true, vip: true },
  { ar: 'أولوية بالتواصل', en: 'Priority communication', basic: false, nutrition: false, elite: false, vip: true },
  { ar: 'جلسة استشارة فردية شهرية', en: 'Monthly 1-on-1 consultation', basic: false, nutrition: false, elite: false, vip: true },
];

const FeaturesComparison = ({ plans = [], isArabic }) => {
  const t = (ar, en) => (isArabic ? ar : en);
  // only plans this table knows about, in the same order as the cards
  const columns = plans.filter(p => FEATURES[0][p.id] !== undefined);
  if (!columns.length) return null;

  const cell = (value) => {
    if (value === true) return <span className="pl-cmp__yes" aria-label={t('متوفر', 'Included')}><Check /></span>;
    if (value === false) return <span className="pl-cmp__no" aria-label={t('غير متوفر', 'Not included')}><Minus /></span>;
    return <span className="pl-cmp__text">{t(value.ar, value.en)}</span>;
  };

  return (
    <section className="pl-section pl-cmp">
      <div className="pl-container">
        <motion.div className="pl-section__head" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2>{t('قارن بين الباقات', 'Compare the plans')}</h2>
          <p>{t('كل باقة مصممة لمستوى التزام وهدف مختلف — شوف الفرق بنظرة وحدة', 'Each plan fits a different level of commitment — see the difference at a glance')}</p>
        </motion.div>

        <div className="pl-cmp__scroll">
          <table className="pl-cmp__table">
            <thead>
              <tr>
                <th scope="col" className="pl-cmp__feature">{t('الميزة', 'Feature')}</th>
                {columns.map(plan => (
                  <th scope="col" key={plan.id} className={plan.popular ? 'is-popular' : ''}>
                    {plan.icon && <span className="pl-cmp__icon" aria-hidden="true">{plan.icon}</span>}
                    <span>{plan.name}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((f, i) => (
                <tr key={i}>
                  <th scope="row" className="pl-cmp__feature">{t(f.ar, f.en)}</th>
                  {columns.map(plan => (
                    <td key={plan.id} className={plan.popular ? 'is-popular' : ''}>{cell(f[plan.id])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default FeaturesComparison;
