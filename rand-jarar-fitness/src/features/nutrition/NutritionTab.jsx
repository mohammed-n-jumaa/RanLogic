import { useState, useEffect, useRef } from 'react';
import {
  Loader2, UtensilsCrossed, FileText, PieChart, ChevronDown, Check, Download, Lightbulb,
  Droplets, MessageSquare, Scale, Maximize2,
} from 'lucide-react';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';
import profileApi from '../../api/profileApi';
import Ring from '../profile/shell/Ring';
import { toDateKey, periodOf } from '../profile/shell/profileShared';
import { mealsOnDate, dayTotals, mealTotals, isMealDone, mealTypeOf, pdfUrlOf, mealImageUrl } from './nutritionUtils';
import { useProfileFeedback } from '../profile/shell/feedbackContext';
import './Nutrition.scss';

const DAY_SHORT = {
  ar: ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};

const NutritionTab = ({ onSelectTab }) => {
  const { t } = useProfileLanguage();
  const [data, setData] = useState(null);           // { plan, meals }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const now = new Date();
    profileApi.getMyNutritionPlan(now.getFullYear(), now.getMonth() + 1)
      .then(res => setData(res?.success && res.data ? res.data : null))
      .catch(err => { console.error('Error fetching nutrition plan:', err); setData(null); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="pf-card pf-state">
        <span className="pf-state__icon"><Loader2 className="pf-spin" /></span>
        <p className="pf-card__sub">{t('جاري تحميل خطة التغذية...', 'Loading nutrition plan...')}</p>
      </div>
    );
  }

  // Same decision as before: meals in the system → daily view; plan only → PDF; nothing → empty
  if (data?.meals?.length) return <MealsView data={data} setData={setData} />;
  if (data?.plan) return <NutritionPdfView plan={data.plan} onSelectTab={onSelectTab} />;

  return (
    <div className="pf-card pf-state">
      <span className="pf-state__icon"><UtensilsCrossed /></span>
      <h3>{t('لا توجد خطة تغذية', 'No nutrition plan')}</h3>
      <p className="pf-card__sub">
        {t('الكوتش لسا ما أضاف خطة التغذية لهذا الشهر. رح توصلك أول ما تجهز.', "Your coach hasn't added this month's nutrition plan yet.")}
      </p>
      <button type="button" className="pf-btn pf-btn--ghost" onClick={() => onSelectTab?.('chat')}>
        <MessageSquare /> {t('احكي الكوتش', 'Message your coach')}
      </button>
    </div>
  );
};

// ═══════════════ Meals entered in the system ═══════════════
const MealsView = ({ data, setData }) => {
  const { t, currentLang } = useProfileLanguage();
  const { toast, celebrate } = useProfileFeedback();
  const now = new Date();
  const planBase = data.plan?.month_start_date ? new Date(data.plan.month_start_date) : now;
  const monthStart = new Date(planBase.getFullYear(), planBase.getMonth(), 1);

  const isCurrentMonth = monthStart.getFullYear() === now.getFullYear() && monthStart.getMonth() === now.getMonth();
  const initialDay = isCurrentMonth ? now.getDate() : 1;

  const [period, setPeriod] = useState(periodOf(initialDay));
  const [selectedDay, setSelectedDay] = useState(initialDay);
  const [openMeals, setOpenMeals] = useState(() => new Set());
  const [busyIds, setBusyIds] = useState(() => new Set());
  const stripRef = useRef(null);

  const daysInMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate();
  const start = (period - 1) * 10 + 1;
  const end = period === 3 ? daysInMonth : period * 10;
  const dateOf = day => new Date(monthStart.getFullYear(), monthStart.getMonth(), day);
  const todayKey = toDateKey(now);

  const selectedDate = dateOf(selectedDay);
  const meals = mealsOnDate(data.meals, toDateKey(selectedDate));
  const totals = dayTotals(meals);
  const pdfUrl = pdfUrlOf(data.plan);
  const dayNames = DAY_SHORT[currentLang] || DAY_SHORT.ar;

  useEffect(() => {
    stripRef.current?.querySelector('.nu-chip.is-active')?.scrollIntoView({ inline: 'center', block: 'nearest' });
  }, [selectedDay, period]);

  const choosePeriod = (p) => {
    setPeriod(p);
    setSelectedDay(isCurrentMonth && periodOf(now.getDate()) === p ? now.getDate() : (p - 1) * 10 + 1);
    setOpenMeals(new Set());
  };

  const setItemsDone = (ids, done) => setData(prev => ({
    ...prev,
    meals: prev.meals.map(m => ({
      ...m,
      items: (m.items || []).map(i => (ids.includes(i.id) ? { ...i, completed: done } : i)),
    })),
  }));

  // Optimistic toggle; each item is its own API call (same endpoint as before)
  const toggleItems = async (meal, items, done) => {
    const ids = items.filter(i => !!i.completed !== done && !busyIds.has(i.id)).map(i => i.id);
    if (!ids.length) return;
    setItemsDone(ids, done);
    setBusyIds(prev => new Set([...prev, ...ids]));
    const results = await Promise.allSettled(ids.map(id => profileApi.toggleMealItem(id)));
    const failed = ids.filter((_, i) => results[i].status !== 'fulfilled' || !results[i].value?.success);
    setBusyIds(prev => { const next = new Set(prev); ids.forEach(id => next.delete(id)); return next; });

    if (failed.length) {
      setItemsDone(failed, !done);
      toast(t('ما قدرنا نحفظ الوجبة، جرّب كمان مرة', "Couldn't save that — please try again"), 'error');
      return;
    }
    if (!done) return;

    // Was this the last thing left in the meal / the day?
    const isNowDone = item => ids.includes(item.id) || item.completed;
    const mealDone = (meal.items || []).every(isNowDone);
    const dayDone = mealDone && meals.every(m => (m.id === meal.id ? true : isMealDone(m)));
    const type = mealTypeOf(meal.meal_type);

    if (dayDone && toDateKey(selectedDate) === todayKey) celebrate(t('خلّصت كل وجبات اليوم! 🎉', 'All of today’s meals done! 🎉'));
    else if (mealDone) toast(t(`تم تسجيل ${type.ar} ${type.emoji}`, `${type.en} logged ${type.emoji}`));
  };

  const toggleOpen = id => setOpenMeals(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  return (
    <div className="pf-grid">
      <div className="pf-toolbar" style={{ margin: 0 }}>
        <div className="pf-segmented">
          {[1, 2, 3].map(p => (
            <button key={p} type="button" className={p === period ? 'is-active' : ''} onClick={() => choosePeriod(p)}>
              {t('أيام', 'Days')} <span className="pf-num">{(p - 1) * 10 + 1}-{p === 3 ? daysInMonth : p * 10}</span>
            </button>
          ))}
        </div>
        {pdfUrl && (
          <a className="pf-btn pf-btn--ghost" href={pdfUrl} target="_blank" rel="noopener noreferrer">
            <FileText /> {t('الخطة الشهرية PDF', 'Monthly plan PDF')}
          </a>
        )}
      </div>

      <div className="nu-strip" ref={stripRef}>
        {Array.from({ length: end - start + 1 }, (_, i) => {
          const day = start + i;
          const date = dateOf(day);
          const key = toDateKey(date);
          const dayMeals = mealsOnDate(data.meals, key);
          const complete = dayMeals.length > 0 && dayMeals.every(isMealDone);
          return (
            <button
              key={key}
              type="button"
              className={`nu-chip ${day === selectedDay ? 'is-active' : ''} ${key === todayKey ? 'is-today' : ''} ${complete ? 'is-complete' : ''}`}
              onClick={() => { setSelectedDay(day); setOpenMeals(new Set()); }}
              aria-pressed={day === selectedDay}
            >
              <small>{key === todayKey ? t('اليوم', 'Today') : dayNames[date.getDay()]}</small>
              <strong className="pf-num">{day}</strong>
            </button>
          );
        })}
      </div>

      {meals.length === 0 ? (
        <div className="pf-card">
          <p className="pf-card__sub">
            {t('ما في وجبات مضافة لهذا اليوم.', 'No meals added for this day.')}
            {pdfUrl && ` ${t('ارجع لملف الـ PDF للخطة الكاملة.', 'Check the PDF for the full plan.')}`}
          </p>
        </div>
      ) : (
        <>
          <section className="pf-card">
            <div className="pf-card__head">
              <h3 className="pf-card__title">
                <span className="pf-card__icon"><PieChart /></span>
                {toDateKey(selectedDate) === todayKey ? t('ملخص اليوم', "Today's summary") : t('ملخص اليوم المختار', 'Day summary')}
              </h3>
              <span className={`pf-pill ${totals.mealsDone === meals.length ? 'pf-pill--ok' : 'pf-pill--muted'}`}>
                <span className="pf-num">{totals.mealsDone}/{meals.length}</span>&nbsp;{t('وجبات', 'meals')}
              </span>
            </div>
            <div className="nu-macros">
              <Ring value={totals.eaten.kcal} max={totals.goal.kcal || 1} size={150} stroke={13} label={totals.eaten.kcal} sub={t(`من ${totals.goal.kcal} سعرة`, `of ${totals.goal.kcal} kcal`)} />
              <div className="nu-macros__bars">
                <Macro tone="p" label={t('البروتين', 'Protein')} value={totals.eaten.p} max={totals.goal.p} />
                <Macro tone="c" label={t('الكربوهيدرات', 'Carbs')} value={totals.eaten.c} max={totals.goal.c} />
                <Macro tone="f" label={t('الدهون', 'Fats')} value={totals.eaten.f} max={totals.goal.f} />
              </div>
            </div>
          </section>

          <div className="nu-meals">
            {meals.map(meal => (
              <MealCard
                key={meal.id}
                meal={meal}
                isOpen={openMeals.has(meal.id)}
                onToggleOpen={() => toggleOpen(meal.id)}
                onToggleMeal={() => toggleItems(meal, meal.items || [], !isMealDone(meal))}
                onToggleItem={item => toggleItems(meal, [item], !item.completed)}
                busyIds={busyIds}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const Macro = ({ tone, label, value, max }) => {
  const { t } = useProfileLanguage();
  return (
    <div className={`nu-macro nu-macro--${tone}`}>
      <div className="nu-macro__head">
        <span>{label}</span>
        <span className="pf-num">{value} / {max} {t('غ', 'g')}</span>
      </div>
      <div className="pf-bar"><span style={{ width: `${max ? Math.min(100, (value / max) * 100) : 0}%` }} /></div>
    </div>
  );
};

const MealCard = ({ meal, isOpen, onToggleOpen, onToggleMeal, onToggleItem, busyIds }) => {
  const { t } = useProfileLanguage();
  const type = mealTypeOf(meal.meal_type);
  const totals = mealTotals(meal);
  const items = meal.items || [];
  const done = isMealDone(meal);
  const doneItems = items.filter(i => i.completed).length;
  const image = mealImageUrl(meal);
  const busy = items.some(i => busyIds.has(i.id));

  return (
    <article className={`nu-meal ${done ? 'is-done' : ''} ${isOpen ? 'is-open' : ''}`}>
      <div className="nu-meal__head">
        <button type="button" className="nu-meal__toggle" onClick={onToggleOpen} aria-expanded={isOpen}>
          {image ? <img className="nu-meal__img" src={image} alt="" loading="lazy" /> : <span className="nu-meal__emoji">{type.emoji}</span>}
          <span className="nu-meal__body">
            <span className="nu-meal__type">
              {t(type.ar, type.en)}{meal.meal_time && <> · <span className="pf-num">{meal.meal_time.slice(0, 5)}</span></>}
            </span>
            <span className="nu-meal__name">{items.slice(0, 3).map(i => i.name).join(' + ')}{items.length > 3 ? ' …' : ''}</span>
            <span className="nu-meal__meta">
              <span className="pf-pill pf-pill--muted"><span className="pf-num">{totals.kcal}</span>&nbsp;{t('سعرة', 'kcal')}</span>
              <span className="pf-pill pf-pill--muted">P <span className="pf-num">{totals.p}</span></span>
              <span className="pf-pill pf-pill--muted">C <span className="pf-num">{totals.c}</span></span>
              <span className="pf-pill pf-pill--muted">F <span className="pf-num">{totals.f}</span></span>
              {!done && doneItems > 0 && (
                <span className="pf-pill pf-pill--warn"><span className="pf-num">{doneItems}/{items.length}</span>&nbsp;{t('أصناف', 'items')}</span>
              )}
            </span>
          </span>
          <ChevronDown className="pf-chev nu-meal__chev" />
        </button>
        <button
          type="button"
          className={`pf-check ${done ? 'is-on' : ''}`}
          onClick={onToggleMeal}
          disabled={busy || !items.length}
          aria-pressed={done}
          aria-label={t('تم تناول الوجبة كاملة', 'Mark the whole meal as eaten')}
        >
          <Check />
        </button>
      </div>

      <div className={`pf-collapse ${isOpen ? 'is-open' : ''}`}>
        <div>
          <ul className="nu-items">
            {items.map(item => (
              <li key={item.id} className={`nu-item ${item.completed ? 'is-done' : ''}`}>
                <button
                  type="button"
                  className={`pf-check pf-check--sm ${item.completed ? 'is-on' : ''}`}
                  onClick={() => onToggleItem(item)}
                  disabled={busyIds.has(item.id)}
                  aria-pressed={!!item.completed}
                  aria-label={t(`تم: ${item.name}`, `Done: ${item.name}`)}
                >
                  <Check />
                </button>
                <span className="nu-item__name">{item.name}</span>
                <span className="nu-item__macros pf-num">
                  {Math.round(item.calories || 0)} kcal · P{Math.round(item.protein || 0)} C{Math.round(item.carbs || 0)} F{Math.round(item.fats || 0)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
};

// ═══════════════ PDF only (no meals in the system) ═══════════════
const NutritionPdfView = ({ plan, onSelectTab }) => {
  const { t, currentLang } = useProfileLanguage();
  const pdfUrl = pdfUrlOf(plan);
  const month = plan?.month_start_date
    ? new Date(plan.month_start_date).toLocaleDateString(currentLang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US', { month: 'long', year: 'numeric' })
    : '';

  if (!pdfUrl) {
    return (
      <div className="pf-card pf-state">
        <span className="pf-state__icon"><UtensilsCrossed /></span>
        <h3>{t('خطتك قيد التجهيز', 'Your plan is being prepared')}</h3>
        <p className="pf-card__sub">{t('الكوتش بيجهّز خطة التغذية، رح تبيّن هون أول ما تنضاف.', 'Your coach is preparing it — it will appear here once added.')}</p>
      </div>
    );
  }

  const tips = [
    [Download, t('نزّل الملف على جوالك عشان يكون معك دايماً', 'Save the file on your phone so it’s always with you')],
    [Scale, t('استعمل ميزان أكل للكميات بأول أسبوعين', 'Use a food scale for portions in the first two weeks')],
    [Droplets, t('سجّل أكواب المي من لوحة التحكم', 'Log your water cups from the dashboard')],
    [MessageSquare, t('في أكلة مش عاجبتك؟ احكي الكوتش ويبدّلها', 'Don’t like a meal? Ask your coach to swap it')],
  ];

  return (
    <div className="pf-grid pf-grid--3">
      <section className="pf-card pf-span-2">
        <div className="pf-card__head">
          <h3 className="pf-card__title"><span className="pf-card__icon"><FileText /></span>{t('خطة التغذية', 'Nutrition plan')}{month && ` — ${month}`}</h3>
          <span className="pf-pill pf-pill--ok">{t('الخطة الحالية', 'Current plan')}</span>
        </div>

        <a className="nu-preview" href={pdfUrl} target="_blank" rel="noopener noreferrer" aria-label={t('فتح ملف الخطة', 'Open the plan file')}>
          <span className="nu-preview__sheet" aria-hidden="true">
            <span className="nu-preview__brand">RanLogic</span>
            <span className="nu-preview__line" style={{ width: '70%' }} />
            <span className="nu-preview__line" style={{ width: '45%' }} />
            <span className="nu-preview__table">{Array.from({ length: 12 }, (_, i) => <span key={i} />)}</span>
            <span className="nu-preview__line" style={{ width: '80%' }} />
            <span className="nu-preview__line" style={{ width: '60%' }} />
          </span>
          <span className="nu-preview__open"><Maximize2 /> {t('اضغط لفتح الملف', 'Tap to open')}</span>
        </a>

        <div className="nu-pdf-actions">
          <a className="pf-btn pf-btn--primary" href={pdfUrl} target="_blank" rel="noopener noreferrer"><FileText /> {t('عرض الملف', 'Open file')}</a>
          <a className="pf-btn pf-btn--ghost" href={pdfUrl} download target="_blank" rel="noopener noreferrer"><Download /> {t('تحميل', 'Download')}</a>
        </div>
      </section>

      <div className="pf-grid" style={{ alignContent: 'start' }}>
        <section className="pf-card">
          <div className="pf-card__head">
            <h3 className="pf-card__title"><span className="pf-card__icon"><Lightbulb /></span>{t('نصائح لتلتزم بالخطة', 'Tips to stick to the plan')}</h3>
          </div>
          <div className="nu-tips">
            {tips.map(([Icon, text]) => (
              <div key={text} className="nu-tip"><span className="nu-tip__icon"><Icon /></span><span>{text}</span></div>
            ))}
          </div>
        </section>

        <button type="button" className="pf-btn pf-btn--ghost pf-btn--block" onClick={() => onSelectTab?.('chat')}>
          <MessageSquare /> {t('عندك سؤال عن الأكل؟ احكي الكوتش', 'Questions about food? Message your coach')}
        </button>
      </div>
    </div>
  );
};

export default NutritionTab;
