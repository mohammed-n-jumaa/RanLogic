import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2,
  CheckCircle,
  Circle,
  ChevronDown,
  Dumbbell,
  Upload,
  X,
  Youtube,
  Save,
  Loader
} from 'lucide-react';
import trainingApi from '../../../api/trainingApi';
import Swal from 'sweetalert2';
import './WorkoutPlan.scss';

const WorkoutPlan = ({ clientId, workoutPlan, onRefresh }) => {
  const [expandedDays, setExpandedDays] = useState([1]);
  const [exercises, setExercises] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRefs = useRef({});
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  const currentDate = new Date();
  let displayYear = currentDate.getFullYear();
  let displayMonth = currentDate.getMonth() + 1;
  
  if (workoutPlan && workoutPlan.month_start_date) {
    const planDate = new Date(workoutPlan.month_start_date);
    displayYear = planDate.getFullYear();
    displayMonth = planDate.getMonth() + 1;
  }
  
  const daysInMonth = new Date(displayYear, displayMonth, 0).getDate();
  
  const daysOfMonth = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const date = new Date(displayYear, displayMonth - 1, day);
    const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    
    return {
      id: day,
      name: dayNames[date.getDay()],
      date: `${displayYear}-${String(displayMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      fullDate: date
    };
  });
  
  // CRITICAL FIX: Convert date to YYYY-MM-DD format
  const normalizeDate = (dateString) => {
    if (!dateString) return null;
    // Handle ISO timestamps: 2026-01-01T00:00:00.000000Z -> 2026-01-01
    return dateString.split('T')[0];
  };
  
  useEffect(() => {
    console.log('=== WorkoutPlan useEffect ===');
    console.log('workoutPlan:', workoutPlan);
    
    if (workoutPlan && workoutPlan.exercises && workoutPlan.exercises.length > 0) {
      console.log(`Found ${workoutPlan.exercises.length} exercises`);
      
      const loadedExercises = workoutPlan.exercises.map(ex => {
        const normalizedDate = normalizeDate(ex.exercise_date);
        console.log(`Exercise ${ex.id}:`, {
          original_date: ex.exercise_date,
          normalized_date: normalizedDate,
          name: ex.name
        });
        
        return {
          id: ex.id,
          exercise_date: normalizedDate, // FIXED: Normalize the date
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          notes: ex.notes || '',
          youtube_url: ex.youtube_url || '',
          video_file: ex.video_file || null,
          completed: ex.completed || false,
          order: ex.order || 0
        };
      });
      
      console.log('Setting exercises:', loadedExercises);
      setExercises(loadedExercises);
      
      const daysWithData = [...new Set(loadedExercises.map(ex => {
        const day = parseInt(ex.exercise_date.split('-')[2]);
        return day;
      }))];
      
      console.log('Auto-expanding days:', daysWithData);
      setExpandedDays(prev => [...new Set([...prev, ...daysWithData])]);
    } else {
      console.log('No exercises');
      setExercises([]);
    }
  }, [workoutPlan]);
  
  const getExercisesForDate = (date) => {
    const filtered = exercises.filter(ex => ex.exercise_date === date);
    if (filtered.length > 0) {
      console.log(`✅ Found ${filtered.length} exercises for ${date}:`, filtered);
    }
    return filtered;
  };
  
  const handleAddExercise = (date) => {
    const newExercise = {
      id: `temp-${Date.now()}`,
      exercise_date: date,
      name: '',
      sets: 3,
      reps: 12,
      notes: '',
      youtube_url: '',
      video_file: null,
      completed: false,
      order: exercises.filter(ex => ex.exercise_date === date).length
    };
    
    setExercises(prev => [...prev, newExercise]);
  };
  
  const handleUpdateExercise = (exerciseId, field, value) => {
    setExercises(prev => prev.map(ex =>
      ex.id === exerciseId ? { ...ex, [field]: value } : ex
    ));
  };
  
  const handleVideoUpload = (exerciseId, file) => {
    if (file.size > 20 * 1024 * 1024) {
      Swal.fire({
        icon: 'warning',
        title: 'ملف كبير',
        html: '<p>حجم الفيديو يجب ألا يتجاوز 20MB</p>',
        confirmButtonText: 'حسناً',
      });
      return;
    }
    
    if (!file.type.startsWith('video/')) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'يجب اختيار ملف فيديو',
      });
      return;
    }
    
    handleUpdateExercise(exerciseId, 'video_file', file);
  };
  
  const handleDeleteExercise = async (exerciseId) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: 'سيتم حذف هذا التمرين',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e91e63',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء',
    });
    
    if (!result.isConfirmed) return;
    
    if (!String(exerciseId).startsWith('temp-')) {
      try {
        await trainingApi.deleteExercise(exerciseId);
        Swal.fire({
          icon: 'success',
          title: 'تم الحذف',
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error('Error deleting:', error);
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: 'حدث خطأ أثناء الحذف',
        });
        return;
      }
    }
    
    setExercises(prev => prev.filter(ex => ex.id !== exerciseId));
  };
  
  const handleToggleCompletion = async (exerciseId) => {
    if (String(exerciseId).startsWith('temp-')) {
      Swal.fire({
        icon: 'info',
        title: 'تنبيه',
        text: 'يجب حفظ التمرين أولاً',
      });
      return;
    }
    
    try {
      const response = await trainingApi.toggleExercise(exerciseId);
      if (response.data.success) {
        setExercises(prev => prev.map(ex =>
          ex.id === exerciseId ? { ...ex, completed: response.data.data.completed } : ex
        ));
      }
    } catch (error) {
      console.error('Error toggling:', error);
    }
  };
  
  const handleSaveWorkoutPlan = async () => {
    setIsSaving(true);
    
    try {
      const formData = new FormData();
      formData.append('year', displayYear);
      formData.append('month', displayMonth);
      
      const exercisesData = [];
      let videoIndex = 0;
      
      exercises.forEach((exercise, index) => {
        const exerciseData = {
          exercise_date: exercise.exercise_date,
          name: exercise.name,
          sets: parseInt(exercise.sets) || 3,
          reps: parseInt(exercise.reps) || 12,
          notes: exercise.notes || '',
          youtube_url: exercise.youtube_url || '',
          order: index,
          completed: exercise.completed || false
        };
        
        if (!String(exercise.id).startsWith('temp-')) {
          exerciseData.id = exercise.id;
        }
        
        if (exercise.video_file instanceof File) {
          const videoKey = `video_${videoIndex}`;
          formData.append(videoKey, exercise.video_file);
          exerciseData.video_file_key = videoKey;
          videoIndex++;
        }
        
        exercisesData.push(exerciseData);
      });
      
      formData.append('exercises', JSON.stringify(exercisesData));
      
      const response = await trainingApi.saveWorkoutPlan(clientId, formData);
      
      if (response.data.success) {
        await Swal.fire({
          icon: 'success',
          title: 'تم الحفظ',
          text: 'تم حفظ البرنامج التدريبي بنجاح',
          timer: 2000,
          showConfirmButton: false,
        });
        
        if (onRefresh) {
          await onRefresh();
        }
      }
    } catch (error) {
      console.error('Error saving:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: error.response?.data?.message || 'حدث خطأ أثناء الحفظ',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const toggleDay = (dayId) => {
    setExpandedDays(prev =>
      prev.includes(dayId) ? prev.filter(id => id !== dayId) : [...prev, dayId]
    );
  };
  
  const getDayProgress = (date) => {
    const dayExercises = getExercisesForDate(date);
    if (dayExercises.length === 0) return 0;
    const completed = dayExercises.filter(ex => ex.completed).length;
    return Math.round((completed / dayExercises.length) * 100);
  };
  
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_URL}/storage/${path}`;
  };
  
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : null;
  };
  
  console.log('Total exercises:', exercises.length);
  
  return (
    <div className="workout-plan">
      <div className="workout-plan__header">
        <div className="workout-plan__header-top">
          <h2 className="workout-plan__title">
            <Dumbbell size={24} />
            البرنامج التدريبي الشهري
          </h2>
          
          <div className="workout-plan__week-info">
            {new Date(displayYear, displayMonth - 1).toLocaleDateString('ar-SA', { 
              year: 'numeric', 
              month: 'long' 
            })}
          </div>
          
          <button 
            className="workout-plan__save-btn"
            onClick={handleSaveWorkoutPlan}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader size={18} className="spinner" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>حفظ التعديلات</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="workout-plan__days">
        {daysOfMonth.map((dayInfo, index) => {
          const dayExercises = getExercisesForDate(dayInfo.date);
          const isExpanded = expandedDays.includes(dayInfo.id);
          const progress = getDayProgress(dayInfo.date);
          const isToday = dayInfo.date === new Date().toISOString().split('T')[0];
          
          return (
            <motion.div
              key={dayInfo.id}
              className={`workout-day ${isToday ? 'workout-day--today' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
            >
              <div className="workout-day__header" onClick={() => toggleDay(dayInfo.id)}>
                <div className="workout-day__header-top">
                  <motion.div
                    className="workout-day__chevron"
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                  
                  <div className="workout-day__title-section">
                    <div className="workout-day__title-wrapper">
                      <h3 className="workout-day__title">{dayInfo.name}</h3>
                      {isToday && <span className="workout-day__today-badge">اليوم</span>}
                    </div>
                    <span className="workout-day__date">{dayInfo.date}</span>
                  </div>
                  
                  <div className="workout-day__count">
                    {dayExercises.length} تمرين
                  </div>
                </div>
                
                <div className="workout-day__header-bottom" onClick={(e) => e.stopPropagation()}>
                  <div className="workout-day__progress">
                    <div 
                      className="workout-day__progress-bar"
                      style={{ width: `${progress}%` }}
                    />
                    <span className="workout-day__progress-text">{progress}%</span>
                  </div>
                  
                  <button 
                    className="workout-day__expand-btn"
                    onClick={() => toggleDay(dayInfo.id)}
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>
              </div>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className="workout-day__content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <div className="workout-day__exercises">
                      {dayExercises.length > 0 ? (
                        dayExercises.map((exercise) => (
                          <motion.div
                            key={exercise.id}
                            className="exercise-item"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                          >
                            <div className="exercise-item__left">
                              <button
                                className={`exercise-item__check ${exercise.completed ? 'exercise-item__check--completed' : ''}`}
                                onClick={() => handleToggleCompletion(exercise.id)}
                                disabled={String(exercise.id).startsWith('temp-')}
                              >
                                {exercise.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
                              </button>
                            </div>
                            
                            <div className="exercise-item__content">
                              <div className="exercise-item__main">
                                <input
                                  type="text"
                                  className="exercise-item__name"
                                  value={exercise.name}
                                  onChange={(e) => handleUpdateExercise(exercise.id, 'name', e.target.value)}
                                  placeholder="اسم التمرين"
                                />
                                
                                <div className="exercise-item__details">
                                  <div className="exercise-item__detail">
                                    <label className="exercise-item__detail-label">مجموعات</label>
                                    <input
                                      type="number"
                                      value={exercise.sets}
                                      onChange={(e) => handleUpdateExercise(exercise.id, 'sets', e.target.value)}
                                      min="1"
                                    />
                                  </div>
                                  
                                  <div className="exercise-item__detail">
                                    <label className="exercise-item__detail-label">تكرارات</label>
                                    <input
                                      type="number"
                                      value={exercise.reps}
                                      onChange={(e) => handleUpdateExercise(exercise.id, 'reps', e.target.value)}
                                      min="1"
                                    />
                                  </div>
                                </div>
                              </div>
                              
                              <textarea
                                className="exercise-item__notes"
                                value={exercise.notes}
                                onChange={(e) => handleUpdateExercise(exercise.id, 'notes', e.target.value)}
                                placeholder="ملاحظات التمرين (اختياري)"
                                rows="2"
                              />
                              
                              <div className="exercise-item__youtube-input">
                                <Youtube size={18} />
                                <input
                                  type="url"
                                  value={exercise.youtube_url}
                                  onChange={(e) => handleUpdateExercise(exercise.id, 'youtube_url', e.target.value)}
                                  placeholder="رابط YouTube"
                                />
                              </div>
                              
                              <div className="exercise-item__media-section">
                                <input
                                  ref={el => fileInputRefs.current[exercise.id] = el}
                                  type="file"
                                  accept="video/*"
                                  onChange={(e) => handleVideoUpload(exercise.id, e.target.files[0])}
                                  style={{ display: 'none' }}
                                />
                                
                                {exercise.youtube_url && getYoutubeEmbedUrl(exercise.youtube_url) && (
                                  <div className="exercise-media-preview">
                                    <div className="exercise-media-preview__youtube">
                                      <iframe
                                        src={getYoutubeEmbedUrl(exercise.youtube_url)}
                                        title="YouTube video"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                      />
                                    </div>
                                  </div>
                                )}
                                
                                {exercise.video_file && (
                                  <div className="exercise-media-preview">
                                    <div className="exercise-media-preview__video">
                                      {exercise.video_file instanceof File ? (
                                        <video controls>
                                          <source src={URL.createObjectURL(exercise.video_file)} type={exercise.video_file.type} />
                                        </video>
                                      ) : (
                                        <video src={getImageUrl(exercise.video_file)} controls />
                                      )}
                                      <button
                                        className="exercise-media-preview__remove"
                                        onClick={() => handleUpdateExercise(exercise.id, 'video_file', null)}
                                      >
                                        <X size={16} />
                                      </button>
                                    </div>
                                  </div>
                                )}
                                
                                {!exercise.video_file && (
                                  <button
                                    className="exercise-item__upload-btn"
                                    onClick={() => fileInputRefs.current[exercise.id]?.click()}
                                  >
                                    <Upload size={16} />
                                    <span>رفع فيديو</span>
                                  </button>
                                )}
                              </div>
                            </div>
                            
                            <div className="exercise-item__right">
                              <button
                                className="exercise-item__delete"
                                onClick={() => handleDeleteExercise(exercise.id)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="workout-day__empty">
                          <Dumbbell size={40} />
                          <p>لا توجد تمارين لهذا اليوم</p>
                          <p className="workout-day__empty-sub">انقر على "إضافة تمرين" لبدء إنشاء البرنامج</p>
                        </div>
                      )}
                    </div>
                    
                    <button 
                      className="workout-day__add-exercise"
                      onClick={() => handleAddExercise(dayInfo.date)}
                    >
                      <Plus size={16} />
                      إضافة تمرين
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkoutPlan;