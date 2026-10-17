import { Check } from 'lucide-react';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';
import ExerciseVideoLinks from './ExerciseVideoLinks';

/** One exercise as a checklist row — shared by the Overview and the Workout tab */
const ExerciseCheckRow = ({ exercise, onToggle, busy, showNotes = true }) => {
  const { t } = useProfileLanguage();
  const done = !!exercise.completed;

  return (
    <li className={`ex-row ${done ? 'is-done' : ''}`}>
      <button
        type="button"
        className="ex-row__check"
        onClick={onToggle}
        disabled={busy}
        aria-pressed={done}
        aria-label={t(`تم: ${exercise.name}`, `Done: ${exercise.name}`)}
      >
        <Check />
      </button>

      <div className="ex-row__body">
        <span className="ex-row__name">{exercise.name}</span>
        {showNotes && exercise.notes && <p className="ex-row__notes">{exercise.notes}</p>}
        <ExerciseVideoLinks exercise={exercise} />
      </div>

      <dl className="ex-row__stats">
        <div>
          <dt>{t('جولات', 'Sets')}</dt>
          <dd className="pf-num">{exercise.sets}</dd>
        </div>
        <span className="ex-row__x" aria-hidden="true">×</span>
        <div>
          <dt>{t('تكرار', 'Reps')}</dt>
          <dd className="pf-num">{exercise.reps}</dd>
        </div>
      </dl>
    </li>
  );
};

export default ExerciseCheckRow;
