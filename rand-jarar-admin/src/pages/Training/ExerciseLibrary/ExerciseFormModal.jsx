import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader, Upload, Youtube, Dumbbell, Trash2 } from 'lucide-react';
import apiClient from '../../../api/apiClient';
import './ExerciseFormModal.scss';

const TABLET = 768;
const toDateInput = (d) => (d ? String(d).split('T')[0] : '');

const ExerciseFormModal = ({ isOpen, exercise, onClose, onSave }) => {
  const isEditing = !!(exercise && exercise.id);
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= TABLET;

  const [form, setForm] = useState({
    trainee_id: '',
    workout_plan_id: '',
    exercise_date: '',
    name: '',
    sets: 3,
    reps: 12,
    notes: '',
    youtube_url: '',
  });

  const [videoFile, setVideoFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [trainees, setTrainees] = useState([]);
  const [loadingTrainees, setLoadingTrainees] = useState(false);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);

  const videoInputRef = useRef(null);

  // ── Fetch trainees ──
  useEffect(() => {
    if (!isOpen) return;
    setLoadingTrainees(true);
    apiClient.get('/admin/training/trainees')
      .then(res => {
        if (res.data.success)
          setTrainees(res.data.data.map(t => ({ id: t.id, name: t.name })));
      })
      .catch(e => console.error('Failed to fetch trainees', e))
      .finally(() => setLoadingTrainees(false));
  }, [isOpen]);

  // ── Fetch workout plans for a trainee (last 4 months) ──
  const fetchPlansForTrainee = async (traineeId) => {
    if (!traineeId) { setAvailablePlans([]); return; }
    setLoadingPlans(true);
    const now = new Date();
    const plans = [];
    for (let i = 0; i < 4; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      try {
        const res = await apiClient.get(`/admin/training/trainees/${traineeId}`, {
          params: { year: d.getFullYear(), month: d.getMonth() + 1 }
        });
        if (res.data.success && res.data.data.workout_plan) {
          const wp = res.data.data.workout_plan;
          plans.push({
            id: wp.id,
            label: d.toLocaleDateString('ar', { month: 'long', year: 'numeric' }),
            month_start: wp.month_start_date,
            month_end: wp.month_end_date,
          });
        }
      } catch (_) {}
    }
    setAvailablePlans(plans);
    setLoadingPlans(false);
  };

  // ── Populate form when opening ──
  useEffect(() => {
    if (!isOpen) return;

    if (exercise?.id) {
      const traineeId = exercise.workout_plan?.user?.id ?? '';
      const planId    = exercise.workout_plan_id ?? '';
      const wp        = exercise.workout_plan ?? {};

      setForm({
        trainee_id:     traineeId,
        workout_plan_id: planId,
        exercise_date:  toDateInput(exercise.exercise_date),
        name:           exercise.name ?? '',
        sets:           exercise.sets ?? 3,
        reps:           exercise.reps ?? 12,
        notes:          exercise.notes ?? '',
        youtube_url:    exercise.youtube_url ?? '',
      });

      // Pre-fill the plan list immediately so the select renders the current plan
      if (planId) {
        const startDate = wp.month_start_date ?? wp.start_date ?? '';
        const label = startDate
          ? new Date(startDate + 'T12:00:00').toLocaleDateString('ar', { month: 'long', year: 'numeric' })
          : `خطة #${planId}`;
        setAvailablePlans([{
          id: planId, label,
          month_start: wp.month_start_date ?? wp.start_date ?? '',
          month_end:   wp.month_end_date   ?? wp.end_date   ?? '',
        }]);
      }

      // Fetch full list in background
      if (traineeId) fetchPlansForTrainee(traineeId);

    } else {
      setForm({ trainee_id: '', workout_plan_id: '', exercise_date: '', name: '', sets: 3, reps: 12, notes: '', youtube_url: '' });
      setAvailablePlans([]);
    }

    setVideoFile(null);
    setErrors({});
  }, [isOpen, exercise]);

  const set = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const handleTraineeChange = async (traineeId) => {
    set('trainee_id', traineeId);
    set('workout_plan_id', '');
    set('exercise_date', '');
    await fetchPlansForTrainee(traineeId);
  };

  const validate = () => {
    const errs = {};
    if (!form.workout_plan_id) errs.workout_plan_id = 'اختر خطة التدريب';
    if (!form.exercise_date)   errs.exercise_date   = 'التاريخ مطلوب';
    if (!form.name.trim())     errs.name            = 'اسم التمرين مطلوب';
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setIsSaving(true);
    const fd = new FormData();
    fd.append('workout_plan_id', form.workout_plan_id);
    fd.append('exercise_date',   form.exercise_date);
    fd.append('name',            form.name.trim());
    fd.append('sets',            form.sets || 3);
    fd.append('reps',            form.reps || 12);
    if (form.notes)        fd.append('notes',       form.notes);
    if (form.youtube_url)  fd.append('youtube_url', form.youtube_url);
    if (videoFile)         fd.append('video_file',  videoFile);
    if (isEditing)         fd.append('_method',     'PUT');
    await onSave(fd, isEditing ? exercise.id : null);
    setIsSaving(false);
  };

  const selectedPlan = availablePlans.find(p => String(p.id) === String(form.workout_plan_id));
  const dateMin = selectedPlan ? toDateInput(selectedPlan.month_start) : '';
  const dateMax = selectedPlan ? toDateInput(selectedPlan.month_end)   : '';

  const mobileAnim = {
    initial: { y: '100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit:    { y: '100%', opacity: 0 },
  };
  const desktopAnim = {
    initial: { opacity: 0, scale: 0.94 },
    animate: { opacity: 1, scale: 1 },
    exit:    { opacity: 0, scale: 0.94 },
  };

  const modalContent = (
    <motion.div
      className="ex-form-modal"
      {...(isDesktop ? desktopAnim : mobileAnim)}
      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      dir="rtl"
    >
      <div className="ex-form-modal__handle" />

      {/* Header */}
      <div className="ex-form-modal__header">
        <div className="ex-form-modal__header-title">
          <Dumbbell size={17} />
          <span>{isEditing ? 'تعديل التمرين' : 'إضافة تمرين جديد'}</span>
        </div>
        <button className="ex-form-modal__close" onClick={onClose}><X size={17} /></button>
      </div>

      {/* Body */}
      <div className="ex-form-modal__body">

        {/* Trainee */}
        <div className="ex-form-modal__field">
          <label className="ex-form-modal__label">👤 المتدربة *</label>
          <select
            className={`ex-form-modal__select ${errors.workout_plan_id && !form.trainee_id ? 'error' : ''}`}
            value={form.trainee_id}
            onChange={(e) => handleTraineeChange(e.target.value)}
            disabled={loadingTrainees}
          >
            <option value="">{loadingTrainees ? 'جاري التحميل...' : '-- اختر المتدربة --'}</option>
            {trainees.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>

        {/* Workout plan */}
        {form.trainee_id && (
          <div className="ex-form-modal__field">
            <label className="ex-form-modal__label">📅 خطة التدريب (الشهر) *</label>
            {loadingPlans ? (
              <p className="ex-form-modal__hint">⏳ جاري تحميل الخطط...</p>
            ) : availablePlans.length === 0 ? (
              <p className="ex-form-modal__hint">⚠️ لا توجد خطط تدريب لهذه المتدربة في الأشهر الأخيرة</p>
            ) : (
              <select
                className={`ex-form-modal__select ${errors.workout_plan_id ? 'error' : ''}`}
                value={form.workout_plan_id}
                onChange={(e) => { set('workout_plan_id', e.target.value); set('exercise_date', ''); }}
              >
                <option value="">-- اختر الشهر --</option>
                {availablePlans.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            )}
            {errors.workout_plan_id && <span className="ex-form-modal__error">{errors.workout_plan_id}</span>}
          </div>
        )}

        {/* Date */}
        {form.workout_plan_id && (
          <div className="ex-form-modal__field">
            <label className="ex-form-modal__label">
              📆 تاريخ التمرين *
              {dateMin && dateMax && <span className="ex-form-modal__label-hint"> ({dateMin} → {dateMax})</span>}
            </label>
            <input
              type="date"
              className={`ex-form-modal__input ${errors.exercise_date ? 'error' : ''}`}
              value={form.exercise_date}
              min={dateMin || undefined}
              max={dateMax || undefined}
              onChange={(e) => set('exercise_date', e.target.value)}
            />
            {errors.exercise_date && <span className="ex-form-modal__error">{errors.exercise_date}</span>}
          </div>
        )}

        {/* Name */}
        <div className="ex-form-modal__field">
          <label className="ex-form-modal__label">🏋️ اسم التمرين *</label>
          <input
            type="text"
            className={`ex-form-modal__input ${errors.name ? 'error' : ''}`}
            placeholder="مثال: سكوات، بنش برس، ديد ليفت..."
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
          />
          {errors.name && <span className="ex-form-modal__error">{errors.name}</span>}
        </div>

        {/* Sets & Reps */}
        <div className="ex-form-modal__row">
          <div className="ex-form-modal__field">
            <label className="ex-form-modal__label">🧱 المجموعات</label>
            <input type="number" min={1} max={100} className="ex-form-modal__input"
              value={form.sets} onChange={(e) => set('sets', e.target.value)} />
          </div>
          <div className="ex-form-modal__field">
            <label className="ex-form-modal__label">🔁 التكرارات</label>
            <input type="number" min={1} max={1000} className="ex-form-modal__input"
              value={form.reps} onChange={(e) => set('reps', e.target.value)} />
          </div>
        </div>

        {/* YouTube URL */}
        <div className="ex-form-modal__field">
          <label className="ex-form-modal__label">
            <Youtube size={13} style={{ display: 'inline', marginLeft: '4px', color: '#ff0000', verticalAlign: 'middle' }} />
            رابط يوتيوب
          </label>
          <input
            type="url"
            className="ex-form-modal__input"
            placeholder="https://youtube.com/watch?v=..."
            value={form.youtube_url}
            onChange={(e) => set('youtube_url', e.target.value)}
            dir="ltr"
          />
        </div>

        {/* Video File */}
        <div className="ex-form-modal__field">
          <label className="ex-form-modal__label">🎬 فيديو محلي (اختياري)</label>
          <div
            className={`ex-form-modal__upload ${videoFile ? 'has-file' : ''}`}
            onClick={() => videoInputRef.current?.click()}
          >
            {videoFile ? (
              <>
                <Upload size={14} />
                <span>{videoFile.name}</span>
                <button className="ex-form-modal__remove-file"
                  onClick={(e) => { e.stopPropagation(); setVideoFile(null); }}>
                  <Trash2 size={12} />
                </button>
              </>
            ) : (
              <>
                <Upload size={14} />
                <span>اضغط لرفع فيديو</span>
                <small>MP4, MOV – حتى 100MB</small>
              </>
            )}
          </div>
          <input type="file" ref={videoInputRef} accept="video/mp4,video/mov,video/avi,video/webm"
            style={{ display: 'none' }} onChange={(e) => setVideoFile(e.target.files[0] || null)} />
        </div>

        {/* Notes */}
        <div className="ex-form-modal__field">
          <label className="ex-form-modal__label">📝 ملاحظات</label>
          <textarea className="ex-form-modal__textarea" placeholder="أي ملاحظات إضافية..."
            value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={3} />
        </div>
      </div>

      {/* Footer */}
      <div className="ex-form-modal__footer">
        <button className="ex-form-modal__btn ex-form-modal__btn--cancel" onClick={onClose}>إلغاء</button>
        <button className="ex-form-modal__btn ex-form-modal__btn--save" onClick={handleSubmit} disabled={isSaving}>
          {isSaving
            ? <><Loader size={13} className="spin" /> جاري الحفظ...</>
            : <><Save size={13} /> {isEditing ? 'حفظ التعديلات' : 'إضافة التمرين'}</>
          }
        </button>
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="ex-form-modal__backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {isDesktop ? (
            <div className="ex-form-modal-wrapper">
              {modalContent}
            </div>
          ) : (
            modalContent
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default ExerciseFormModal;