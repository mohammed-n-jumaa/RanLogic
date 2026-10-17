import { memo, useState } from 'react';
import { Droplets, GlassWater, Plus } from 'lucide-react';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';
import { useProfileFeedback } from '../profile/shell/feedbackContext';
import dashboardApi from '../../api/dashboardApi';

const WaterTracker = ({ water }) => {
  const { t } = useProfileLanguage();
  const { toast, celebrate } = useProfileFeedback();
  const [cups, setCups] = useState(water?.cups ?? 0);
  const [saving, setSaving] = useState(false);
  const goal = water?.goal || 8;
  const pct = Math.min(100, Math.round((cups / goal) * 100));

  // Tapping the last filled cup empties it; any other cup fills up to it
  const handleTap = async (index) => {
    if (saving) return;
    const previous = cups;
    const next = index + 1 === cups ? index : index + 1;
    setCups(next);
    setSaving(true);
    try {
      await dashboardApi.logWater(next);
      if (next >= goal && previous < goal) celebrate(t('وصلت هدف المي اليوم! 💧', 'Daily water goal reached! 💧'));
    } catch (err) {
      console.error(err);
      setCups(previous);
      toast(t('ما قدرنا نحفظ المي، جرّب كمان مرة', "Couldn't save water — please try again"), 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="pf-card">
      <div className="pf-card__head">
        <h3 className="pf-card__title"><span className="pf-card__icon"><Droplets /></span>{t('متتبع المي', 'Water tracker')}</h3>
        <span className={`pf-pill ${cups >= goal ? 'pf-pill--ok' : 'pf-pill--muted'} pf-num`}>{cups} / {goal}</span>
      </div>
      <div className="db-water">
        {Array.from({ length: goal }, (_, i) => (
          <button
            key={i}
            type="button"
            className={`db-cup ${i < cups ? 'is-full' : ''}`}
            onClick={() => handleTap(i)}
            disabled={saving}
            aria-label={t(`كوب ${i + 1}`, `Cup ${i + 1}`)}
            aria-pressed={i < cups}
          >
            {i < cups ? <GlassWater /> : <Plus />}
          </button>
        ))}
      </div>
      <div className="pf-bar db-water__bar"><span style={{ width: `${pct}%` }} /></div>
      <p className="pf-card__sub db-water__hint">
        {cups >= goal ? t('ممتاز! أكملت هدف اليوم ✓', 'Great — goal reached ✓') : t('اضغط على الكوب لتسجيل شربة مي', 'Tap a cup to log a glass')}
      </p>
    </section>
  );
};

export default memo(WaterTracker);
