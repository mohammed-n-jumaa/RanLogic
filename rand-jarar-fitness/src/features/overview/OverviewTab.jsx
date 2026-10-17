import { useEffect, useState } from 'react';
import {
  Play, FileText, Dumbbell, Droplets, Flame, Scale, User, Pencil, Ruler, Cake, CircleDot, Circle,
  MapPin, Target, HeartPulse, Utensils, Eye, Download, Info, X, Check,
} from 'lucide-react';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';
import profileApi from '../../api/profileApi';
import dashboardApi from '../../api/dashboardApi';
import Ring from '../profile/shell/Ring';
import { toDateKey, normalizeDate, isRestDay, getSubscriptionProgress } from '../profile/shell/profileShared';
import { mealsOnDate, dayTotals, isMealDone, mealTypeOf, mealTotals, pdfUrlOf } from '../nutrition/nutritionUtils';
import useExerciseToggle from '../workout/useExerciseToggle';
import ExerciseCheckRow from '../workout/ExerciseCheckRow';
import './Overview.scss';

const GOALS = { 'weight-loss': ['خسارة وزن', 'Weight loss'], 'muscle-gain': ['بناء عضلات', 'Muscle gain'], toning: ['شد الجسم', 'Toning'], fitness: ['لياقة عامة', 'General fitness'] };
const PLACES = { home: ['المنزل', 'Home'], gym: ['الجيم', 'Gym'] };

const OverviewTab = ({ userData, onSelectTab, onEditProfile }) => {
  const { t } = useProfileLanguage();
  const [dashboard, setDashboard] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [nutritionPlan, setNutritionPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toggleExercise, busyId } = useExerciseToggle(setWorkoutPlan);
  const [showReminder, setShowReminder] = useState(() => sessionStorage.getItem('pf-reminder-dismissed') !== '1');

  const todayKey = toDateKey(new Date());

  useEffect(() => {
    const now = new Date();
    const y = now.getFullYear(), m = now.getMonth() + 1;
    // Each source is optional — a failing one just hides its card
    Promise.allSettled([
      dashboardApi.getDashboard(),
      profileApi.getMyWorkoutPlan(y, m),
      profileApi.getMyNutritionPlan(y, m),
    ]).then(([dash, workout, nutrition]) => {
      if (dash.status === 'fulfilled' && dash.value?.success) setDashboard(dash.value.data);
      if (workout.status === 'fulfilled' && workout.value?.success) setWorkoutPlan(workout.value.data);
      if (nutrition.status === 'fulfilled' && nutrition.value?.success) setNutritionPlan(nutrition.value.data);
      setLoading(false);
    });
  }, []);

  // ── Today's workout ──
  const todayRows = (workoutPlan?.exercises || []).filter(e => normalizeDate(e.exercise_date) === todayKey);
  const isRest = isRestDay(todayRows);
  const hasWorkout = todayRows.length > 0 && !isRest;
  const doneCount = hasWorkout ? todayRows.filter(e => e.completed).length : 0;

  // ── Weight + streak + water from the dashboard API ──
  const weights = dashboard?.weight_chart || [];
  const firstW = parseFloat(weights[0]?.weight);
  const lastW = parseFloat(weights[weights.length - 1]?.weight) || parseFloat(userData.weight) || null;
  const weightChange = weights.length > 1 && firstW && lastW ? +(lastW - firstW).toFixed(1) : null;
  const streak = dashboard?.streak?.count ?? 0;
  const water = dashboard?.water || null;

  const sub = getSubscriptionProgress(userData);
  const heroTitle = loading ? t('جاري تجهيز يومك…', 'Getting your day ready…')
    : hasWorkout ? t('تمرين اليوم بانتظارك 🔥', "Today's workout is waiting 🔥")
    : isRest ? t('اليوم يوم راحة — جسمك بيبني نفسه 🌿', 'Rest day — your body is rebuilding 🌿')
    : t('لسا ما انضاف تمرين لليوم', 'No workout added for today yet');

  const heroText = weightChange === null
    ? t('كل يوم التزام بيقرّبك من هدفك. خلّينا نكمّل.', 'Every day you show up gets you closer. Keep going.')
    : weightChange < 0
      ? t(`نزلت ${Math.abs(weightChange)} كغ من بداية تسجيلك — استمر!`, `You've lost ${Math.abs(weightChange)} kg since you started — keep it up!`)
      : t(`تغيّر وزنك ${weightChange > 0 ? '+' : ''}${weightChange} كغ من بداية تسجيلك.`, `Your weight changed ${weightChange > 0 ? '+' : ''}${weightChange} kg since you started.`);

  const dismissReminder = () => {
    setShowReminder(false);
    try { sessionStorage.setItem('pf-reminder-dismissed', '1'); } catch { /* ignore */ }
  };

  const label = (map, key) => (map[key] ? t(map[key][0], map[key][1]) : key || '--');

  return (
    <div className="pf-grid">
      {showReminder && (
        <div className="ov-reminder">
          <span className="ov-reminder__icon"><Info /></span>
          <p>
            <strong>{t('فحص الملف الشخصي:', 'Profile check:')}</strong>{' '}
            {t('تأكد إن معلوماتك صحيحة عشان تكون خططك مخصصة إلك.', 'Make sure your details are accurate for personalized plans.')}
          </p>
          <button type="button" className="ov-reminder__action" onClick={onEditProfile}><Pencil /> {t('تحديث بياناتي', 'Update my details')}</button>
          <button type="button" className="ov-reminder__close" onClick={dismissReminder} aria-label={t('إغلاق', 'Close')}><X /></button>
        </div>
      )}

      <section className="ov-hero">
        <div>
          <p className="ov-hero__eyebrow">
            {userData.program || t('برنامج تدريبي', 'Training program')}
            {sub.totalDays > 0 && <> · <span className="pf-num">{sub.daysLeft}</span> {t('يوم متبقي', 'days left')}</>}
          </p>
          <h2 className="ov-hero__title">{heroTitle}</h2>
          <p className="ov-hero__text">{heroText}</p>
          <div className="ov-hero__actions">
            {hasWorkout && (
              <button type="button" className="pf-btn pf-btn--primary" onClick={() => onSelectTab('workout')}>
                <Play /> {t('ابدأ التمرين', 'Start workout')}
              </button>
            )}
            <button type="button" className="pf-btn pf-btn--ghost" onClick={() => onSelectTab('nutrition')}>
              <FileText /> {t('خطة التغذية', 'Nutrition plan')}
            </button>
          </div>
        </div>
        <Ring value={sub.pctUsed} max={100} size={132} stroke={11} label={`${sub.pctUsed}%`} sub={t('من البرنامج', 'of program')} />
      </section>

      <div className="pf-grid pf-grid--4">
        <Kpi label={t('تمارين اليوم', "Today's exercises")}
          value={hasWorkout ? <>{doneCount}<small> / {todayRows.length}</small></> : isRest ? t('راحة 🌿', 'Rest 🌿') : '—'}
          ring={<Ring value={doneCount} max={todayRows.length || 1} size={56} stroke={7} />} icon={<Dumbbell />} />
        <Kpi label={t('المي', 'Water')}
          value={water ? <>{water.cups}<small> / {water.goal} {t('أكواب', 'cups')}</small></> : '—'}
          ring={<Ring value={water?.cups || 0} max={water?.goal || 1} size={56} stroke={7} />} icon={<Droplets />}
          onClick={() => onSelectTab('dashboard')} />
        <Kpi label={t('التزام متتالي', 'Streak')}
          value={<>{streak}<small> {t('يوم', 'days')}</small></>}
          ring={<Ring value={Math.min(streak, 7)} max={7} size={56} stroke={7} />} icon={<Flame />} />
        <Kpi label={t('الوزن الحالي', 'Current weight')}
          value={lastW ? <>{lastW}<small> {t('كغ', 'kg')}</small></> : '—'}
          ring={<span className="ov-kpi__icon"><Scale /></span>}
          trend={weightChange !== null && weightChange !== 0 ? `${weightChange > 0 ? '+' : ''}${weightChange} ${t('كغ', 'kg')}` : null}
          trendGood={weightChange !== null && weightChange < 0} />
      </div>

      <div className="pf-grid pf-grid--3">
        <section className="pf-card pf-span-2 ov-today">
          <div className="pf-card__head">
            <h3 className="pf-card__title"><span className="pf-card__icon"><Dumbbell /></span>{t('تمرين اليوم', "Today's workout")}</h3>
            {hasWorkout && <span className="pf-pill pf-pill--muted pf-num">{doneCount}/{todayRows.length}</span>}
          </div>

          {loading ? (
            <p className="pf-card__sub">{t('جاري التحميل…', 'Loading…')}</p>
          ) : isRest ? (
            <div className="ov-rest">
              <span className="ov-rest__icon">🌿</span>
              <div>
                <strong>{t('يوم راحة', 'Rest day')}</strong>
                <p>{todayRows.map(r => r.notes).filter(Boolean).join(' · ')
                  || t('استرح اليوم — العضلات بتكبر وقت الراحة مش وقت التمرين.', 'Rest today — muscles grow while you recover.')}</p>
              </div>
            </div>
          ) : hasWorkout ? (
            <>
              <div className="pf-bar ov-progress"><span style={{ width: `${Math.round((doneCount / todayRows.length) * 100)}%` }} /></div>
              <ol className="ex-list">
                {todayRows.map(ex => (
                  <ExerciseCheckRow key={ex.id} exercise={ex} onToggle={() => toggleExercise(ex, todayRows)} busy={busyId === ex.id} showNotes={false} />
                ))}
              </ol>
            </>
          ) : (
            <p className="pf-card__sub">{t('المدرب لسا ما أضاف تمارين لهذا اليوم.', "Your coach hasn't added exercises for today yet.")}</p>
          )}
        </section>

        <div className="pf-grid ov-side">
          <NutritionSummary plan={nutritionPlan} todayKey={todayKey} loading={loading} onOpen={() => onSelectTab('nutrition')} />

          <section className="pf-card">
            <div className="pf-card__head">
              <h3 className="pf-card__title"><span className="pf-card__icon"><User /></span>{t('بياناتي', 'My details')}</h3>
              <button type="button" className="pf-btn pf-btn--ghost pf-btn--sm" onClick={onEditProfile}><Pencil /> {t('تعديل', 'Edit')}</button>
            </div>
            <div className="ov-facts">
              <Fact icon={<Scale />} label={t('الوزن', 'Weight')} value={userData.weight ? <><span className="pf-num">{userData.weight}</span> {t('كغ', 'kg')}</> : '--'} />
              <Fact icon={<Ruler />} label={t('الطول', 'Height')} value={userData.height ? <><span className="pf-num">{userData.height}</span> {t('سم', 'cm')}</> : '--'} />
              <Fact icon={<Cake />} label={t('العمر', 'Age')} value={userData.age ? <span className="pf-num">{userData.age}</span> : '--'} />
              <Fact icon={<CircleDot />} label={t('الخصر', 'Waist')} value={userData.waist ? <><span className="pf-num">{userData.waist}</span> {t('سم', 'cm')}</> : '--'} />
              {userData.gender === 'female' && (
                <Fact icon={<Circle />} label={t('الأرداف', 'Hips')} value={userData.hips ? <><span className="pf-num">{userData.hips}</span> {t('سم', 'cm')}</> : '--'} />
              )}
              <Fact icon={<MapPin />} label={t('المكان', 'Place')} value={label(PLACES, userData.workout_place)} />
              <Fact icon={<Target />} label={t('الهدف', 'Goal')} value={label(GOALS, userData.goal)} wide />
              <Fact icon={<HeartPulse />} label={t('ملاحظات صحية', 'Health notes')} value={userData.health_notes || t('لا توجد إصابات أو حساسية', 'No injuries or allergies')} wide />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const Kpi = ({ label, value, ring, trend, trendGood, onClick }) => {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag type={onClick ? 'button' : undefined} className={`pf-card ov-kpi ${onClick ? 'is-clickable' : ''}`} onClick={onClick}>
      {ring}
      <div className="ov-kpi__body">
        <div className="ov-kpi__label">{label}</div>
        <div className="ov-kpi__value pf-num">{value}</div>
        {trend && <div className={`ov-kpi__trend ${trendGood ? 'is-good' : ''}`}>{trend}</div>}
      </div>
    </Tag>
  );
};

const Fact = ({ icon, label, value, wide }) => (
  <div className={`ov-fact ${wide ? 'ov-fact--wide' : ''}`}>
    <div className="ov-fact__label">{icon}{label}</div>
    <div className="ov-fact__value">{value}</div>
  </div>
);

// Today's meals when they're entered in the system; otherwise the monthly PDF
const NutritionSummary = ({ plan, todayKey, loading, onOpen }) => {
  const { t } = useProfileLanguage();
  if (loading) return null;

  const pdfUrl = pdfUrlOf(plan?.plan);
  const todayMeals = mealsOnDate(plan?.meals, todayKey);

  if (todayMeals.length) {
    const totals = dayTotals(todayMeals);
    const next = todayMeals.find(m => !isMealDone(m));
    const nextType = next && mealTypeOf(next.meal_type);
    return (
      <section className="pf-card">
        <div className="pf-card__head">
          <h3 className="pf-card__title"><span className="pf-card__icon"><Utensils /></span>{t('تغذية اليوم', "Today's nutrition")}</h3>
          <span className="pf-pill pf-pill--muted pf-num">{totals.mealsDone}/{todayMeals.length}</span>
        </div>
        <div className="ov-nutri">
          <Ring value={totals.eaten.kcal} max={totals.goal.kcal || 1} size={92} stroke={9} label={totals.eaten.kcal} sub={t('سعرة', 'kcal')} />
          <div className="ov-nutri__next">
            <span className="pf-card__sub">{t('الوجبة الجاية', 'Next meal')}</span>
            {next ? (
              <>
                <strong>{nextType.emoji} {t(nextType.ar, nextType.en)}</strong>
                <small className="pf-card__sub pf-num">{next.meal_time ? `${next.meal_time.slice(0, 5)} · ` : ''}{mealTotals(next).kcal} {t('سعرة', 'kcal')}</small>
              </>
            ) : (
              <strong className="ov-nutri__done">{t('خلّصت وجبات اليوم ✓', 'All meals done ✓')}</strong>
            )}
          </div>
        </div>
        <button type="button" className="pf-btn pf-btn--ghost pf-btn--block ov-nutri__btn" onClick={onOpen}>{t('عرض وجبات اليوم', "View today's meals")}</button>
      </section>
    );
  }

  if (pdfUrl) return <NutritionPdfCard plan={plan.plan} url={pdfUrl} compact />;
  return null;
};

const NutritionPdfCard = ({ plan, url, compact }) => {
  const { t, currentLang } = useProfileLanguage();
  const month = plan?.month_start_date
    ? new Date(plan.month_start_date).toLocaleDateString(currentLang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US', { month: 'long', year: 'numeric' })
    : '';
  return (
    <section className={`pf-card ov-pdf ${compact ? 'ov-pdf--compact' : ''}`}>
      <div className="ov-pdf__file">
        <span className="ov-pdf__icon"><FileText /><small>PDF</small></span>
        <div>
          <strong>{t('خطة التغذية', 'Nutrition plan')}{month && ` — ${month}`}</strong>
          <small className="pf-card__sub">{t('الخطة الشهرية كاملة بملف PDF', 'Your full monthly plan as a PDF')}</small>
        </div>
      </div>
      <div className="ov-pdf__actions">
        <a className="pf-btn pf-btn--primary" href={url} target="_blank" rel="noopener noreferrer"><Eye /> {t('عرض', 'View')}</a>
        <a className="pf-btn pf-btn--ghost" href={url} download target="_blank" rel="noopener noreferrer"><Download /> {t('تحميل', 'Download')}</a>
      </div>
    </section>
  );
};

export default OverviewTab;
