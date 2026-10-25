import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Landmark, MessageCircle, CalendarClock, RefreshCw, Users, Dumbbell, Ticket, LayoutGrid, MessagesSquare,
} from 'lucide-react';
import { t, loc } from '../../../i18n';
import './TodayHero.scss';

const fmtToday = new Intl.DateTimeFormat(`${loc('ar-EG')}-u-nu-latn`, { weekday: 'long', day: 'numeric', month: 'long' });

const ECG = 'M0,40 H70 L82,40 L90,18 L100,62 L110,8 L120,54 L128,40 H200 L210,30 L220,40 H300 L312,40 L320,18 L330,62 L340,8 L350,54 L358,40 H430 L440,30 L450,40 H600';

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return t('صباح الخير');
  if (h < 18) return t('يومك سعيد');
  return t('مساء الخير');
};

// Words of encouragement for the coach, rotating every few seconds
const PRAISE = [
  () => t('قراراتك صحيحة، لا تترددي 💪'),
  () => t('ثقي بخبرتك، إنتِ بتعرفي شو الأفضل 🎯'),
  () => t('كل نتيجة حلوة عند متدربينك هي إنجازك إنتِ ✨'),
  () => t('إنتِ مدربة استثنائية، استمري 👑'),
  () => t('تعبك ما بيروح، النتائج بتحكي عنك 🏆'),
  () => t('كل يوم بتغيّري حياة حدا للأحسن ❤️'),
  () => t('طاقتك بتلهم كل اللي حواليكِ ⚡'),
  () => t('النجاح عادة، وإنتِ متعودة عليه 🥇'),
  () => t('خطوة اليوم هي نتيجة بكرة، كمّلي 🔥'),
  () => t('شغفك هو سر تميّزك 💎'),
  () => t('متدربينك محظوظين فيكِ 🌟'),
  () => t('إنتِ قدها وقدود، يلا نكسّر اليوم 💥'),
  () => t('وجودك بحياة متدربينك فرق كبير 🌸'),
  () => t('كل تمرين بتكتبيه هو بداية قصة نجاح 📝'),
  () => t('إنتِ مش بس مدربة، إنتِ مصدر إلهام ✨'),
  () => t('صبرك على متدربينك هو سر نتائجهم 🌱'),
  () => t('اليوم يوم جديد لإنجاز جديد، يلا 🚀'),
  () => t('إنتِ بتبني أجسام وبتبني ثقة كمان 💖'),
  () => t('خبرتك كنز، واللي معك محظوظ فيكِ 💎'),
  () => t('ارفعي راسك، إنتِ عم تعملي شي عظيم 👏'),
  () => t('التزامك هو اللي بيصنع الفرق كل يوم 🎖️'),
  () => t('خليكِ فخورة بحالك، إنتِ تستاهلي 🥰'),
  () => t('إنتِ أقوى مما بتتخيلي 🦋'),
  () => t('كل رسالة شكر من متدربينك هي شهادة إلك 💌'),
  () => t('رؤيتك واضحة، كمّلي على طريقك 🧭'),
  () => t('إنتِ بتعطي بقلب، وهاد بيبيّن بالنتائج 🤍'),
  () => t('أصعب البدايات بتصير أجمل النهايات معكِ 🌅'),
  () => t('حماسك معدي، وكل متدربينك حاسين فيه 🎉'),
  () => t('إنتِ القدوة اللي متدربينك بيحلموا يكونوها 🌟'),
  () => t('شغلك اليوم هو فخر الكل بكرة 🏅'),
  () => t('ولا تحدي أكبر من عزيمتك 🔥'),
  () => t('خذي نفس، إنتِ عم تعملي شغل رائع 🌿'),
  () => t('إنتِ مش بس بتدربي أجسام، إنتِ بتصنعي أبطال 🦸‍♀️'),
  () => t('وراء كل متدرب واثق بحاله، مدربة عظيمة متلك 👑'),
  () => t('إنتِ مش مجرد اسم، إنتِ علامة فارقة 💫'),
  () => t('اللي بتعمليه مش شغل، هاد رسالة 🕊️'),
  () => t('إنتِ مش بس بتغيّري أوزان، بتغيّري حياة 🌈'),
  () => t('صوتك بيضل براس متدربينك حتى بعد التمرين 🎶'),
  () => t('إنتِ الدافع اللي بيخليهم ما يستسلموا 🔋'),
  () => t('كل قصة تحوّل وراها إنتِ 📖'),
  () => t('إنتِ مش مدربة عادية، إنتِ حكاية نجاح 🌠'),
  () => t('الثقة اللي بتزرعيها بتكبر كل يوم 🌻'),
  () => t('إنتِ بتعلّمي الناس يحبوا حالهم من جديد 💗'),
  () => t('عزيمتك هي أقوى تمرين بتعطيه 🏋️‍♀️'),
  () => t('إنتِ النور اللي بيوصّلهم لأحسن نسخة منهم 🌞'),
  () => t('مكانك مش بس بالجيم، مكانك بقلوبهم 💞'),
  () => t('إنتِ تثبتي كل يوم إنه المستحيل مجرد كلمة 🚀'),
  () => t('إنتِ مش بس بتعطي تمارين، بتعطي أمل 🌤️'),
  () => t('كل حدا من متدربينك وصل لهدفه، وصل بفضلك 🎯'),
  () => t('إنتِ مش مجرد مدربة، إنتِ صديقة الرحلة 🤝'),
  () => t('اللي بتبنيه اليوم، بيضل أثره للعمر 🏛️'),
  () => t('إنتِ مش بس بتحفّزي، إنتِ بتغيّري طريقة تفكيرهم 🧠'),
  () => t('قوتك مش بس بعضلاتك، قوتك بروحك 💪✨'),
  () => t('إنتِ مش رقم بالمجال، إنتِ الرقم واحد 🥇'),
  () => t('كل ابتسامة رضا عند متدربينك هي توقيعك 😊'),
  () => t('إنتِ مش بس بتعلّمي الالتزام، إنتِ بتعيشيه 🔥'),
  () => t('العالم أحلى لأنه فيه مدربة متلك 🌍'),
];
const PRAISE_MS = 3000;

// Signature phrase: always shown first and kept on screen one second longer
const SIGNATURE = PRAISE.length - 1;
const SIGNATURE_MS = PRAISE_MS + 1000;
const durationOf = (i) => (i === SIGNATURE ? SIGNATURE_MS : PRAISE_MS);

// Every phrase except the signature, in a random order (Fisher–Yates)
const shuffledRound = () => {
  const order = PRAISE.map((_, i) => i).filter((i) => i !== SIGNATURE);
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
};

const Praise = () => {
  const [index, setIndex] = useState(SIGNATURE);
  // Phrases still to show this round: none repeats until all have been seen,
  // then the signature opens the next round
  const queue = useRef([]);

  const next = () => {
    if (!queue.current.length) {
      setIndex(SIGNATURE);
      queue.current = shuffledRound();
      return;
    }
    setIndex(queue.current.shift());
  };

  useEffect(() => {
    queue.current = shuffledRound();
  }, []);

  // restarts after every change, so a tap gives the new phrase its full time
  useEffect(() => {
    const id = setTimeout(next, durationOf(index));
    return () => clearTimeout(id);
  }, [index]);

  return (
    <motion.button
      type="button"
      className="th-praise"
      onClick={next}
      aria-live="polite"
      title={t('عبارة جديدة')}
      // pops in with a bounce right after the page opens
      initial={{ opacity: 0, scale: 0.7, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 240, damping: 13, delay: 0.35 }}
      whileTap={{ scale: 0.97 }}
    >
      {/* sparkles that burst out once on entry */}
      <span className="th-praise__burst" aria-hidden="true">
        {Array.from({ length: 10 }, (_, i) => <i key={i} style={{ '--a': `${i * 36}deg`, '--d': `${0.55 + (i % 3) * 0.08}s` }} />)}
      </span>

      <span className="th-praise__badge" aria-hidden="true"><Sparkles size={20} /></span>

      <span className="th-praise__body">
        <small>{t('رسالة إلك 💌')}</small>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={index}
            className="th-praise__text"
            initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -14, filter: 'blur(6px)' }}
            transition={{ duration: 0.4 }}
          >
            {PRAISE[index]()}
          </motion.span>
        </AnimatePresence>
      </span>

      {/* light sweep + timer bar, replayed for every phrase */}
      <span key={`shine-${index}`} className="th-praise__shine" aria-hidden="true" />
      <span key={`timer-${index}`} className="th-praise__timer" style={{ '--t': `${durationOf(index)}ms` }} aria-hidden="true" />
    </motion.button>
  );
};

// Share of running subscriptions that are NOT about to end
const HealthRing = ({ pct }) => {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(pct));
    return () => cancelAnimationFrame(id);
  }, [pct]);
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <div className="th-ring" role="img" aria-label={`${t('اشتراكات مستقرة')} ${pct}%`}>
      <svg viewBox="0 0 80 80">
        <circle className="th-ring__track" cx="40" cy="40" r={r} />
        <circle className="th-ring__bar" cx="40" cy="40" r={r} strokeDasharray={c} strokeDashoffset={c * (1 - shown / 100)} />
      </svg>
      <div className="th-ring__label">
        <b>{pct}%</b>
        <small>{t('مستقرة')}</small>
      </div>
    </div>
  );
};

/**
 * "Today" card: greeting, how many things need the coach, quick jumps.
 */
const TodayHero = ({ name, counts, health, ready, onJump, onRefresh, refreshing }) => {
  const total = counts.transfers + counts.chats + counts.endingToday;

  const chips = [
    { id: 'transfers', icon: Landmark, value: counts.transfers, label: t('تحويلات'), tone: 'amber' },
    { id: 'chats', icon: MessageCircle, value: counts.chats, label: t('محادثات'), tone: 'white' },
    { id: 'calendar', icon: CalendarClock, value: counts.endingToday, label: t('تنتهي اليوم'), tone: 'red' },
  ];

  return (
    <motion.section className="th" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
      <svg className="th-ecg" viewBox="0 0 600 80" preserveAspectRatio="none" aria-hidden="true">
        <path className="th-ecg__base" d={ECG} />
        <path className="th-ecg__beat" d={ECG} pathLength="1000" />
      </svg>

      <div className="th-top">
        <div className="th-hello">
          <span className="th-hello__date">{fmtToday.format(new Date())}</span>
          <h1>{greeting()}، <strong>{name}</strong> 👋</h1>
        </div>
        <button type="button" className="th-refresh" onClick={onRefresh} disabled={refreshing} aria-label={t('تحديث')}>
          <RefreshCw size={17} className={refreshing ? 'ds-spin' : ''} />
        </button>
      </div>

      <Praise />

      <div className="th-main">
        <div className="th-headline">
          {!ready ? (
            <span className="th-headline__skeleton" />
          ) : total > 0 ? (
            <>
              <span className="th-headline__num">{total}</span>
              <span className="th-headline__text">{t('مهام بانتظارك اليوم')}</span>
            </>
          ) : (
            <span className="th-headline__text th-headline__text--done">{t('كل شي تمام اليوم 💪')}</span>
          )}
        </div>
        {health !== null && <HealthRing pct={health} />}
      </div>

      <div className="th-chips">
        {chips.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`th-chip th-chip--${c.tone} ${c.value > 0 ? 'has-value' : ''}`}
            onClick={() => onJump(c.id)}
          >
            <c.icon size={16} />
            <b>{ready ? c.value : '–'}</b>
            <span>{c.label}</span>
          </button>
        ))}
      </div>
    </motion.section>
  );
};

const QUICK = [
  { to: '/training/clients', icon: Users, label: () => t('المتدربين'), tone: 'pink' },
  { to: '/chat', icon: MessagesSquare, label: () => t('المحادثات'), tone: 'purple' },
  { to: '/training/exercise-library', icon: Dumbbell, label: () => t('التمارين'), tone: 'indigo' },
  { to: '/coupons', icon: Ticket, label: () => t('الكوبونات'), tone: 'amber' },
  { to: '/plans', icon: LayoutGrid, label: () => t('الخطط'), tone: 'emerald' },
];

/** App-style shortcuts to the pages used most from the phone. */
export const QuickActions = () => {
  const navigate = useNavigate();
  return (
    <nav className="qa" aria-label={t('اختصارات')}>
      {QUICK.map((q, i) => (
        <motion.button
          key={q.to}
          type="button"
          className={`qa-item qa-item--${q.tone}`}
          onClick={() => navigate(q.to)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * i }}
          whileTap={{ scale: 0.92 }}
        >
          <span className="qa-item__icon"><q.icon size={22} /></span>
          <span className="qa-item__label">{q.label()}</span>
        </motion.button>
      ))}
    </nav>
  );
};

export default TodayHero;
