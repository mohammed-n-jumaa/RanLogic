import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Pencil, Upload, Youtube, Trash2, Play, CalendarDays, Loader2 } from 'lucide-react';
import apiClient from '../../../api/apiClient';
import ExSheet from './ExSheet';
import Stepper from './Stepper';
import { getYoutubeId, initials } from './exerciseUtils';
import { t, loc } from '../../../i18n';

const toDateInput = (d) => (d ? String(d).split('T')[0] : '');
const EMPTY_FORM = { trainee_id: '', workout_plan_id: '', exercise_date: '', name: '', sets: '3', reps: '12', notes: '', youtube_url: '' };
const MAX_VIDEO_MB = 100;

const ExerciseFormModal = ({ isOpen, exercise, onClose, onSave }) => {
  const isEditing = !!(exercise && exercise.id);

  const [form, setForm] = useState(EMPTY_FORM);
  const [videoFile, setVideoFile] = useState(null);
  const [videoTab, setVideoTab] = useState('yt');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [trainees, setTrainees] = useState([]);
  const [loadingTrainees, setLoadingTrainees] = useState(false);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const videoInputRef = useRef(null);
  const stepRefs = useRef({});

  // ── Fetch trainees ──
  useEffect(() => {
    if (!isOpen) return;
    setLoadingTrainees(true);
    apiClient.get('/admin/training/trainees')
      .then((res) => {
        if (res.data.success) setTrainees(res.data.data.map((tItem) => ({ id: tItem.id, name: tItem.name })));
      })
      .catch(() => {})
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
          params: { year: d.getFullYear(), month: d.getMonth() + 1 },
          silent: true,
        });
        if (res.data.success && res.data.data.workout_plan) {
          const wp = res.data.data.workout_plan;
          plans.push({
            id: wp.id,
            label: d.toLocaleDateString(loc('ar'), { month: 'long', year: 'numeric' }),
            month_start: wp.month_start_date,
            month_end: wp.month_end_date,
          });
        }
      } catch { /* month without a plan */ }
    }
    setAvailablePlans(plans);
    setLoadingPlans(false);
  };

  // ── Populate form when opening ──
  useEffect(() => {
    if (!isOpen) return;
    if (exercise?.id) {
      const traineeId = exercise.workout_plan?.user?.id ?? '';
      const planId = exercise.workout_plan_id ?? '';
      const wp = exercise.workout_plan ?? {};
      setForm({
        trainee_id: traineeId,
        workout_plan_id: planId,
        exercise_date: toDateInput(exercise.exercise_date),
        name: exercise.name ?? '',
        sets: String(exercise.sets ?? 3),
        reps: String(exercise.reps ?? 12),
        notes: exercise.notes ?? '',
        youtube_url: exercise.youtube_url ?? '',
      });
      // Pre-fill the plan list immediately so the current plan shows
      if (planId) {
        const startDate = wp.month_start_date ?? wp.start_date ?? '';
        const label = startDate
          ? new Date(`${startDate}T12:00:00`).toLocaleDateString(loc('ar'), { month: 'long', year: 'numeric' })
          : t('خطة #{0}', planId);
        setAvailablePlans([{
          id: planId,
          label,
          month_start: wp.month_start_date ?? wp.start_date ?? '',
          month_end: wp.month_end_date ?? wp.end_date ?? '',
        }]);
      }
      if (traineeId) fetchPlansForTrainee(traineeId);
      setVideoTab(exercise.video_file && !exercise.youtube_url ? 'file' : 'yt');
    } else {
      setForm(EMPTY_FORM);
      setAvailablePlans([]);
      setVideoTab('yt');
    }
    setVideoFile(null);
    setErrors({});
  }, [isOpen, exercise]);

  const set = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleTraineeChange = async (traineeId) => {
    setForm((prev) => ({ ...prev, trainee_id: traineeId, workout_plan_id: '', exercise_date: '' }));
    setErrors((prev) => ({ ...prev, workout_plan_id: undefined }));
    await fetchPlansForTrainee(traineeId);
  };

  const pickFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('video/')) { setErrors((p) => ({ ...p, video: t('يجب اختيار ملف فيديو') })); return; }
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) { setErrors((p) => ({ ...p, video: t('حجم الفيديو يجب ألا يتجاوز {0}MB', MAX_VIDEO_MB) })); return; }
    setErrors((p) => ({ ...p, video: undefined }));
    setVideoFile(file);
  };

  const validate = () => {
    const errs = {};
    if (!form.workout_plan_id) errs.workout_plan_id = t('اختر خطة التدريب');
    if (!form.exercise_date) errs.exercise_date = t('التاريخ مطلوب');
    if (!form.name.trim()) errs.name = t('اسم التمرين مطلوب');
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstStep = errs.workout_plan_id ? 'who' : 'what';
      stepRefs.current[firstStep]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setIsSaving(true);
    const fd = new FormData();
    fd.append('workout_plan_id', form.workout_plan_id);
    fd.append('exercise_date', form.exercise_date);
    fd.append('name', form.name.trim());
    fd.append('sets', form.sets || 3);
    fd.append('reps', form.reps || 12);
    if (form.notes) fd.append('notes', form.notes);
    if (form.youtube_url) fd.append('youtube_url', form.youtube_url);
    if (videoFile) fd.append('video_file', videoFile);
    if (isEditing) fd.append('_method', 'PUT');
    try {
      await onSave(fd, isEditing ? exercise.id : null);
    } finally {
      setIsSaving(false);
    }
  };

  const selectedPlan = availablePlans.find((p) => String(p.id) === String(form.workout_plan_id));
  const dateMin = selectedPlan ? toDateInput(selectedPlan.month_start) : '';
  const dateMax = selectedPlan ? toDateInput(selectedPlan.month_end) : '';
  const ytValid = !!getYoutubeId(form.youtube_url);

  // step progress
  const done = [!!form.workout_plan_id, !!(form.name.trim() && form.exercise_date), true, true];
  const current = done.indexOf(false);
  const stepClass = (i) => `exs-step ${done[i] && (current === -1 || i < current) ? 'is-done' : ''} ${i === current ? 'is-current' : ''}`;
  const fieldClass = (key) => `exs-field ${errors[key] ? 'has-error' : ''}`;

  return (
    <ExSheet isOpen={isOpen} onClose={onClose} size="md" className="exs--form" labelledBy="exform-title">
      <div className="exs__head">
        <span className="exs__head-icon">{isEditing ? <Pencil size={18} /> : <Plus size={18} />}</span>
        <div>
          <h2 id="exform-title">{isEditing ? t('تعديل التمرين') : t('تمرين جديد')}</h2>
          <p>{isEditing ? exercise.name : t('أضيفي تمرين لخطة متدرب')}</p>
        </div>
        <button type="button" className="exs__close" onClick={onClose} aria-label={t('إغلاق')}><X size={18} /></button>
      </div>

      <div className="exs__body exs-form">
        {/* 1 — who */}
        <div className={stepClass(0)} ref={(el) => { stepRefs.current.who = el; }}>
          <span className="exs-step__num">1</span>
          <div className="exs-step__title">{t('لمين التمرين؟')} <small>{t('اختاري المتدرب وخطة الشهر')}</small></div>

          <div className="exs-people">
            {loadingTrainees
              ? Array.from({ length: 5 }, (_, i) => <span key={i} className="exs-person exs-person--skeleton" />)
              : trainees.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`exs-person ${String(form.trainee_id) === String(p.id) ? 'is-active' : ''}`}
                  onClick={() => handleTraineeChange(p.id)}
                >
                  <span className="exs-person__ava">{initials(p.name)}</span>
                  <span className="exs-person__name">{p.name}</span>
                </button>
              ))}
          </div>

          <div className="exs-plans">
            {!form.trainee_id ? (
              <span className="exs-hint">{t('اختاري متدرب أول عشان تطلع خطط الشهر')}</span>
            ) : loadingPlans && availablePlans.length === 0 ? (
              <span className="exs-hint"><Loader2 size={13} className="spin" /> {t('جاري تحميل الخطط...')}</span>
            ) : availablePlans.length === 0 ? (
              <span className="exs-hint">{t('⚠️ لا توجد خطط تدريب لهذا المتدرب في الأشهر الأخيرة')}</span>
            ) : (
              availablePlans.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`exs-qchip ${String(form.workout_plan_id) === String(p.id) ? 'is-active' : ''}`}
                  onClick={() => { set('workout_plan_id', p.id); set('exercise_date', ''); }}
                >
                  <CalendarDays size={13} /> {p.label}
                </button>
              ))
            )}
          </div>
          {errors.workout_plan_id && <span className="exs-err">{errors.workout_plan_id}</span>}
        </div>

        {/* 2 — what */}
        <div className={stepClass(1)} ref={(el) => { stepRefs.current.what = el; }}>
          <span className="exs-step__num">2</span>
          <div className="exs-step__title">{t('التمرين')}</div>
          <div className={fieldClass('name')}>
            <label htmlFor="exf-name">{t('اسم التمرين')}</label>
            <input
              id="exf-name"
              className="exs-input"
              placeholder={t('مثال: سكوات، بنش برس، ديد ليفت...')}
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              autoComplete="off"
            />
            {errors.name && <span className="exs-err">{errors.name}</span>}
          </div>
          <div className={fieldClass('exercise_date')}>
            <label htmlFor="exf-date">
              {t('تاريخ التمرين')}
              {dateMin && dateMax && <small> ({dateMin} → {dateMax})</small>}
            </label>
            <input
              id="exf-date"
              type="date"
              className="exs-input exs-input--date"
              value={form.exercise_date}
              min={dateMin || undefined}
              max={dateMax || undefined}
              disabled={!form.workout_plan_id}
              onChange={(e) => set('exercise_date', e.target.value)}
            />
            {errors.exercise_date && <span className="exs-err">{errors.exercise_date}</span>}
          </div>
        </div>

        {/* 3 — volume */}
        <div className={stepClass(2)}>
          <span className="exs-step__num">3</span>
          <div className="exs-step__title">{t('المجموعات والتكرارات')}</div>
          <div className="exs-steppers">
            <Stepper label={t('🧱 المجموعات')} value={form.sets} onChange={(v) => set('sets', v)} presets={[3, 4, 5]} max={100} />
            <Stepper label={t('🔁 التكرارات')} value={form.reps} onChange={(v) => set('reps', v)} presets={[8, 10, 12, 15]} />
          </div>
        </div>

        {/* 4 — video + notes */}
        <div className={stepClass(3)}>
          <span className="exs-step__num">4</span>
          <div className="exs-step__title">{t('الفيديو والملاحظات')} <small>{t('اختياري')}</small></div>

          <div className="exs-tabs" role="tablist">
            <button type="button" role="tab" aria-selected={videoTab === 'yt'} className={videoTab === 'yt' ? 'is-active' : ''} onClick={() => setVideoTab('yt')}>
              <Youtube size={16} /> {t('رابط يوتيوب')}
            </button>
            <button type="button" role="tab" aria-selected={videoTab === 'file'} className={videoTab === 'file' ? 'is-active' : ''} onClick={() => setVideoTab('file')}>
              <Upload size={16} /> {t('رفع فيديو')}
            </button>
          </div>

          {videoTab === 'yt' ? (
            <>
              <input
                type="url"
                className="exs-input"
                dir="ltr"
                placeholder="https://youtube.com/watch?v=..."
                value={form.youtube_url}
                onChange={(e) => set('youtube_url', e.target.value)}
              />
              {ytValid && (
                <div className="exs-yt">
                  <img src={`https://img.youtube.com/vi/${getYoutubeId(form.youtube_url)}/mqdefault.jpg`} alt="" />
                  <div>
                    <small>{t('✓ رابط صحيح')}</small>
                    <span>{t('رح يظهر الفيديو للمتدرب')}</span>
                  </div>
                  <Play size={16} />
                </div>
              )}
            </>
          ) : (
            <>
              <div
                className={`exs-drop ${dragOver ? 'is-over' : ''} ${videoFile ? 'has-file' : ''}`}
                role="button"
                tabIndex={0}
                onClick={() => videoInputRef.current?.click()}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') videoInputRef.current?.click(); }}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); pickFile(e.dataTransfer.files?.[0]); }}
              >
                <span className="exs-drop__icon"><Upload size={20} /></span>
                {videoFile ? (
                  <>
                    <b>✓ {videoFile.name}</b>
                    <button type="button" className="exs-drop__remove" onClick={(e) => { e.stopPropagation(); setVideoFile(null); }}>
                      <Trash2 size={13} /> {t('إزالة')}
                    </button>
                  </>
                ) : (
                  <>
                    <b>{isEditing && exercise.video_file ? t('في فيديو مرفوع — اختاري ملف جديد لتبديله') : t('اسحبي الفيديو لهون أو اضغطي للاختيار')}</b>
                    <span>{t('MP4 أو MOV — حتى {0}MB', MAX_VIDEO_MB)}</span>
                  </>
                )}
              </div>
              <input
                type="file"
                ref={videoInputRef}
                accept="video/mp4,video/mov,video/quicktime,video/avi,video/webm"
                hidden
                onChange={(e) => { pickFile(e.target.files?.[0]); e.target.value = ''; }}
              />
              {errors.video && <span className="exs-err exs-err--block">{errors.video}</span>}
            </>
          )}

          <div className="exs-field">
            <label htmlFor="exf-notes">{t('ملاحظات للمتدرب')}</label>
            <textarea
              id="exf-notes"
              className="exs-input exs-input--area"
              placeholder={t('مثال: نزول بطيء، ظهر مستقيم')}
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="exs__foot">
        <button type="button" className="exs-btn" onClick={onClose}>{t('إلغاء')}</button>
        <button type="button" className="exs-btn exs-btn--brand exs-btn--grow" onClick={handleSubmit} disabled={isSaving}>
          {isSaving
            ? <><Loader2 size={16} className="spin" /> {t('جاري الحفظ...')}</>
            : isEditing ? t('حفظ التعديلات') : t('إضافة التمرين')}
        </button>
      </div>
    </ExSheet>
  );
};

export default ExerciseFormModal;
