import { useState } from 'react';
import { FaBullseye, FaPlus, FaCheck } from 'react-icons/fa';
import { useProfileLanguage } from '../../../contexts/ProfileLanguageContext';
import dashboardApi from '../../../api/dashboardApi';

const ChallengesCard = ({ challenges: initialChallenges }) => {
  const { t, currentLang } = useProfileLanguage();
  const [challenges, setChallenges] = useState(initialChallenges);
  const [loadingId, setLoadingId] = useState(null);

  const handleJoin = async (id) => {
    setLoadingId(id);
    try {
      await dashboardApi.joinChallenge(id);
      setChallenges(prev =>
        prev.map(ch => ch.id === id ? { ...ch, is_joined: true, completed_days: 0 } : ch)
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleIncrement = async (id) => {
    setLoadingId(id);
    try {
      await dashboardApi.incrementChallenge(id);
      setChallenges(prev =>
        prev.map(ch => ch.id === id ? { ...ch, completed_days: ch.completed_days + 1 } : ch)
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="dash-card">
      <div className="dash-card-title">
        <FaBullseye />
        <span>{t('تحديات الشهر', 'Monthly challenges')}</span>
      </div>

      <div className="challenges-list">
        {challenges.map(ch => {
          const pct = ch.duration_days > 0
            ? Math.round((ch.completed_days / ch.duration_days) * 100)
            : 0;
          const isDone = ch.completed_days >= ch.duration_days;
          const isLoading = loadingId === ch.id;

          return (
            <div key={ch.id} className="challenge-row">
              <div
                className="challenge-icon"
                style={{ background: ch.color + '22', color: ch.color }}
              >
                {isDone ? <FaCheck /> : <FaBullseye />}
              </div>

              <div className="challenge-info">
                <span className="challenge-name">
                  {currentLang === 'ar' ? ch.name_ar : ch.name_en}
                </span>
                <span className="challenge-progress">
                  {t(`يوم ${ch.completed_days} من ${ch.duration_days}`, `Day ${ch.completed_days} of ${ch.duration_days}`)}
                  {' '}({pct}%)
                </span>
                <div className="challenge-bar">
                  <div
                    className="challenge-bar-fill"
                    style={{ width: `${pct}%`, background: ch.color }}
                  />
                </div>
              </div>

              <div className="challenge-action">
                {!ch.is_joined ? (
                  <button
                    className="challenge-btn join"
                    onClick={() => handleJoin(ch.id)}
                    disabled={isLoading}
                  >
                    {isLoading ? '...' : <><FaPlus /> {t('انضم', 'Join')}</>}
                  </button>
                ) : !isDone ? (
                  <button
                    className="challenge-btn increment"
                    onClick={() => handleIncrement(ch.id)}
                    disabled={isLoading}
                    style={{ borderColor: ch.color, color: ch.color }}
                  >
                    {isLoading ? '...' : <><FaCheck /> {t('أنجزت اليوم', 'Done today')}</>}
                  </button>
                ) : (
                  <span className="challenge-complete">
                    {t('مكتمل ✓', 'Complete ✓')}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChallengesCard;