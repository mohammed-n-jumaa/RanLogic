import { memo, useState } from 'react';
import { Trophy, Plus, Check, Loader2 } from 'lucide-react';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';
import { useProfileFeedback } from '../profile/shell/feedbackContext';
import dashboardApi from '../../api/dashboardApi';

const ChallengesCard = ({ challenges: initial = [] }) => {
  const { t, currentLang } = useProfileLanguage();
  const { toast, celebrate } = useProfileFeedback();
  const [challenges, setChallenges] = useState(initial);
  const [loadingId, setLoadingId] = useState(null);
  const nameOf = ch => (currentLang === 'ar' ? ch.name_ar : ch.name_en);

  const handleJoin = async (ch) => {
    setLoadingId(ch.id);
    try {
      await dashboardApi.joinChallenge(ch.id);
      setChallenges(prev => prev.map(c => (c.id === ch.id ? { ...c, is_joined: true, completed_days: 0 } : c)));
      toast(t(`انضممت لتحدي: ${nameOf(ch)}`, `Joined: ${nameOf(ch)}`));
    } catch (err) {
      console.error(err);
      toast(t('ما قدرنا ننضم للتحدي، جرّب كمان مرة', "Couldn't join — please try again"), 'error');
    } finally {
      setLoadingId(null);
    }
  };

  const handleIncrement = async (ch) => {
    setLoadingId(ch.id);
    try {
      await dashboardApi.incrementChallenge(ch.id);
      const days = ch.completed_days + 1;
      setChallenges(prev => prev.map(c => (c.id === ch.id ? { ...c, completed_days: days } : c)));
      if (days >= ch.duration_days) celebrate(t(`خلّصت تحدي ${nameOf(ch)}! 🏆`, `Challenge complete: ${nameOf(ch)}! 🏆`));
      else toast(t('تم تسجيل اليوم ✓', 'Day logged ✓'));
    } catch (err) {
      console.error(err);
      toast(t('ما قدرنا نسجّل اليوم، جرّب كمان مرة', "Couldn't log today — please try again"), 'error');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <section className="pf-card">
      <div className="pf-card__head">
        <h3 className="pf-card__title"><span className="pf-card__icon"><Trophy /></span>{t('تحديات الشهر', 'Monthly challenges')}</h3>
      </div>

      {!challenges.length && <p className="pf-card__sub">{t('ما في تحديات هالشهر', 'No challenges this month')}</p>}

      <div className="db-challenges">
        {challenges.map(ch => {
          const pct = ch.duration_days > 0 ? Math.min(100, Math.round((ch.completed_days / ch.duration_days) * 100)) : 0;
          const done = ch.completed_days >= ch.duration_days;
          const busy = loadingId === ch.id;
          return (
            <div key={ch.id} className="db-challenge">
              <div className="db-challenge__head">
                <strong>{nameOf(ch)}</strong>
                <small className="pf-num">{ch.completed_days}/{ch.duration_days}</small>
              </div>
              <div className="pf-bar"><span style={{ width: `${pct}%`, ...(ch.color ? { background: ch.color } : {}) }} /></div>
              <div className="db-challenge__action">
                {!ch.is_joined ? (
                  <button type="button" className="pf-btn pf-btn--ghost pf-btn--sm" onClick={() => handleJoin(ch)} disabled={busy}>
                    {busy ? <Loader2 className="pf-spin" /> : <Plus />} {t('انضم', 'Join')}
                  </button>
                ) : done ? (
                  <span className="pf-pill pf-pill--ok">{t('مكتمل ✓', 'Complete ✓')}</span>
                ) : (
                  <button type="button" className="pf-btn pf-btn--ghost pf-btn--sm" onClick={() => handleIncrement(ch)} disabled={busy}>
                    {busy ? <Loader2 className="pf-spin" /> : <Check />} {t('أنجزت اليوم', 'Done today')}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default memo(ChallengesCard);
