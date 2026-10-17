import { useState } from 'react';
import profileApi from '../../api/profileApi';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';
import { useProfileFeedback } from '../profile/shell/feedbackContext';
import { normalizeDate, toDateKey, isRestRow } from '../profile/shell/profileShared';

/**
 * Optimistic exercise toggle shared by Overview and the Workout tab.
 * Shows a toast on success/failure and fireworks when today's workout is complete.
 */
const useExerciseToggle = (setWorkoutPlan) => {
  const { t } = useProfileLanguage();
  const { toast, celebrate } = useProfileFeedback();
  const [busyId, setBusyId] = useState(null);

  const toggleExercise = async (exercise, dayRows) => {
    if (busyId) return;
    setBusyId(exercise.id);

    const setDone = done => setWorkoutPlan(plan => ({
      ...plan,
      exercises: plan.exercises.map(e => (e.id === exercise.id ? { ...e, completed: done } : e)),
    }));
    const nowDone = !exercise.completed;
    setDone(nowDone);

    try {
      const res = await profileApi.toggleExercise(exercise.id);
      if (!res?.success) throw new Error('toggle failed');

      const workoutRows = dayRows.filter(r => !isRestRow(r));
      const allDone = nowDone && workoutRows.every(r => (r.id === exercise.id ? true : r.completed));
      const isToday = normalizeDate(exercise.exercise_date) === toDateKey(new Date());

      if (allDone && isToday) celebrate(t('خلّصت تمرين اليوم! 💪', "Today's workout is done! 💪"));
      else if (allDone) toast(t('اكتمل تمرين هذا اليوم ✓', 'Workout for this day complete ✓'));
      else if (nowDone) toast(t(`تم: ${exercise.name}`, `Done: ${exercise.name}`));
    } catch (err) {
      console.error('Error toggling exercise:', err);
      setDone(exercise.completed);
      toast(t('ما قدرنا نحفظ التمرين، جرّب كمان مرة', "Couldn't save that — please try again"), 'error');
    } finally {
      setBusyId(null);
    }
  };

  return { toggleExercise, busyId };
};

export default useExerciseToggle;
