import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSpinner, FaCalendarAlt } from 'react-icons/fa';
import WorkoutWeek from './workout/WorkoutWeek';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';
import profileApi from '../../api/profileApi';
import Swal from 'sweetalert2';

const WorkoutTab = () => {
  const { t } = useProfileLanguage();
  const [expandedDay, setExpandedDay] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPeriod, setCurrentPeriod] = useState(1);

  useEffect(() => {
    fetchWorkoutPlan();
  }, []);

  const fetchWorkoutPlan = async () => {
  try {
    setLoading(true);
    const now = new Date();
    const response = await profileApi.getMyWorkoutPlan(now.getFullYear(), now.getMonth() + 1);
    
    console.log('📊 Workout response in component:', response);
    
    if (response.success && response.data) {

      setWorkoutPlan(response.data);
    } else {
      setWorkoutPlan(null);
    }
  } catch (error) {
    console.error('Error fetching workout plan:', error);
    setWorkoutPlan(null);
  } finally {
    setLoading(false);
  }
};

  const handleToggleExercise = async (exerciseId) => {
    try {
      const response = await profileApi.toggleExercise(exerciseId);
      
      if (response.success) {
        await fetchWorkoutPlan();
      }
    } catch (error) {
      console.error('Error toggling exercise:', error);
      Swal.fire({
        title: t('خطأ', 'Error'),
        text: t('فشل في تحديث حالة التمرين', 'Failed to update exercise status'),
        icon: 'error',
        confirmButtonText: t('حسناً', 'OK'),
        confirmButtonColor: '#FDB813'
      });
    }
  };

const getCurrentPeriodWorkouts = () => {
  if (!workoutPlan?.exercises || workoutPlan.exercises.length === 0) return [];
  
  console.log('🔍 Processing workout plan:', workoutPlan);
  
  const startDay = (currentPeriod - 1) * 10 + 1;
  const endDay = Math.min(currentPeriod * 10, 31);
  
  const normalizeDate = (dateString) => {
    if (!dateString) return null;

    return dateString.split('T')[0];
  };
  
  const exercisesByDate = {};
  workoutPlan.exercises.forEach(exercise => {
    const normalizedDate = normalizeDate(exercise.exercise_date);
    console.log(`📅 Exercise date: ${exercise.exercise_date} → normalized: ${normalizedDate}`);
    
    if (!exercisesByDate[normalizedDate]) {
      exercisesByDate[normalizedDate] = [];
    }
    exercisesByDate[normalizedDate].push(exercise);
  });

  console.log('📊 Exercises grouped by date:', exercisesByDate);

  const daysOfWeek = [
    { nameAr: 'الأحد', nameEn: 'Sunday' },
    { nameAr: 'الاثنين', nameEn: 'Monday' },
    { nameAr: 'الثلاثاء', nameEn: 'Tuesday' },
    { nameAr: 'الأربعاء', nameEn: 'Wednesday' },
    { nameAr: 'الخميس', nameEn: 'Thursday' },
    { nameAr: 'الجمعة', nameEn: 'Friday' },
    { nameAr: 'السبت', nameEn: 'Saturday' }
  ];

  let monthStartDate;
  if (workoutPlan.plan?.month_start_date) {
    monthStartDate = new Date(workoutPlan.plan.month_start_date);
  } else {
    const now = new Date();
    monthStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  console.log('📅 Month start date:', monthStartDate);

  const days = [];
  
  for (let day = startDay; day <= Math.min(endDay, startDay + 6); day++) {
    const date = new Date(monthStartDate);
    date.setDate(day);
    
    if (isNaN(date.getTime())) {
      console.error(`Invalid date for day ${day}`);
      continue;
    }
    
    const dateString = normalizeDate(date.toISOString());
    const dayOfWeek = date.getDay();
    
    console.log(`🔍 Day ${day}: looking for ${dateString} in exercises`);
    
    const dayExercises = exercisesByDate[dateString] || [];
    
    console.log(`✅ Day ${day} (${daysOfWeek[dayOfWeek].nameAr}) has ${dayExercises.length} exercises`);
    
    days.push({
      day: t(daysOfWeek[dayOfWeek].nameAr, daysOfWeek[dayOfWeek].nameEn),
      title: dayExercises.length > 0 
        ? t(`${dayExercises.length} تمارين`, `${dayExercises.length} Exercises`)
        : t('يوم راحة', 'Rest Day'),
      exercises: dayExercises.map(exercise => ({
        id: exercise.id,
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        notes: exercise.notes,
        videoUrl: exercise.video_file 
          ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/storage/${exercise.video_file}`
          : null,
        youtubeUrl: exercise.youtube_url,
        checked: exercise.completed
      }))
    });
  }

  console.log('✅ Final workout days array:', days);
  return days;
};

  const periodWorkouts = getCurrentPeriodWorkouts();

  if (loading) {
    return (
      <div className="workout-tab loading">
        <div className="loading-container">
          <FaSpinner className="spinner" />
          <p>{t('جاري تحميل خطة التمارين...', 'Loading workout plan...')}</p>
        </div>
      </div>
    );
  }

  if (!workoutPlan || !workoutPlan.exercises || workoutPlan.exercises.length === 0) {
    return (
      <div className="workout-tab empty">
        <div className="empty-state">
          <FaCalendarAlt className="empty-icon" />
          <h3>{t('لا توجد خطة تمارين', 'No Workout Plan')}</h3>
          <p>{t('لم يتم إنشاء خطة تمارين لهذا الشهر بعد', 'No workout plan has been created for this month yet')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="workout-tab">
      <div className="workout-controls">
        <div className="period-selector">
          <button
            className={`period-btn ${currentPeriod === 1 ? 'active' : ''}`}
            onClick={() => {
              setCurrentPeriod(1);
              setExpandedDay(null);
            }}
          >
            {t('أيام 1-10', 'Days 1-10')}
          </button>
          <button
            className={`period-btn ${currentPeriod === 2 ? 'active' : ''}`}
            onClick={() => {
              setCurrentPeriod(2);
              setExpandedDay(null);
            }}
          >
            {t('أيام 11-20', 'Days 11-20')}
          </button>
          <button
            className={`period-btn ${currentPeriod === 3 ? 'active' : ''}`}
            onClick={() => {
              setCurrentPeriod(3);
              setExpandedDay(null);
            }}
          >
            {t('أيام 21-31', 'Days 21-31')}
          </button>
        </div>
      </div>

      <WorkoutWeek 
        workoutPlan={periodWorkouts}
        expandedDay={expandedDay}
        setExpandedDay={setExpandedDay}
        onToggleExercise={handleToggleExercise}
      />
    </div>
  );
};

export default WorkoutTab;