import { useState, useEffect, useRef } from 'react';
import {
  X, User, Mail, Lock, Camera, Ruler, Scale, HeartPulse, Target, Home, Save, AlertCircle, Loader2, Cake, CircleDot,
} from 'lucide-react';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';
import { useProfileFeedback } from './shell/feedbackContext';
import { getAvatarUrl, onAvatarError } from './shell/profileShared';
import './EditProfileModal.scss';

const GENDERS = [
  { value: 'male', labelAr: 'ذكر', labelEn: 'Male' },
  { value: 'female', labelAr: 'أنثى', labelEn: 'Female' },
];
const GOALS = [
  { value: 'weight-loss', labelAr: 'إنقاص الوزن', labelEn: 'Weight loss' },
  { value: 'muscle-gain', labelAr: 'بناء العضلات', labelEn: 'Muscle gain' },
  { value: 'toning', labelAr: 'التنشيف', labelEn: 'Toning' },
  { value: 'fitness', labelAr: 'اللياقة العامة', labelEn: 'General fitness' },
];
const PLACES = [
  { value: 'home', labelAr: 'المنزل', labelEn: 'Home' },
  { value: 'gym', labelAr: 'الصالة الرياضية', labelEn: 'Gym' },
];

const EMPTY = {
  name: '', email: '', password: '', confirmPassword: '', height: '', weight: '', waist: '', hips: '',
  age: '', gender: 'male', goal: 'weight-loss', workoutPlace: 'home', healthNotes: '', program: '',
};

const EditProfileModal = ({ isOpen, onClose, userData, onSave }) => {
  const { t } = useProfileLanguage();
  const { toast } = useProfileFeedback();
  const [form, setForm] = useState(EMPTY);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firstFieldRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !userData) return;
    setForm({
      name: userData.name || '',
      email: userData.email || '',
      password: '',
      confirmPassword: '',
      height: userData.height?.toString() || '',
      weight: userData.weight?.toString() || '',
      waist: userData.waist?.toString() || '',
      hips: userData.hips?.toString() || '',
      age: userData.age?.toString() || '',
      gender: userData.gender || 'male',
      goal: userData.goal || 'weight-loss',
      workoutPlace: userData.workout_place || 'home',
      healthNotes: userData.health_notes || '',
      program: userData.program || '',
    });
    setAvatarPreview('');
    setErrors({});
    setServerError('');
    setTimeout(() => firstFieldRef.current?.focus(), 50);
  }, [isOpen, userData]);

  // Esc closes; lock page scroll while open
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = e => { if (e.key === 'Escape' && !isSubmitting) onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [isOpen, isSubmitting, onClose]);

  const setField = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    setServerError('');
  };
  const handleInput = e => setField(e.target.name, e.target.value);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, avatar: t('يرجى اختيار ملف صورة صالح', 'Please select a valid image file') }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, avatar: t('حجم الصورة يجب أن يكون أقل من 5 ميجابايت', 'Image size must be less than 5MB') }));
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => { setAvatarPreview(reader.result); setErrors(prev => ({ ...prev, avatar: '' })); };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e = {};
    const num = v => parseFloat(v);
    if (!form.name.trim()) e.name = t('الاسم مطلوب', 'Name is required');
    else if (form.name.trim().length < 2) e.name = t('الاسم يجب أن يكون حرفين على الأقل', 'Name must be at least 2 characters');

    if (!form.email.trim()) e.email = t('البريد الإلكتروني مطلوب', 'Email is required');
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = t('يرجى إدخال بريد إلكتروني صالح', 'Please enter a valid email address');

    if (form.password) {
      if (form.password.length < 6) e.password = t('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'Password must be at least 6 characters');
      else if (form.password !== form.confirmPassword) e.confirmPassword = t('كلمات المرور غير متطابقة', 'Passwords do not match');
    }

    if (!form.height) e.height = t('الطول مطلوب', 'Height is required');
    else if (num(form.height) < 100 || num(form.height) > 250) e.height = t('بين 100 و 250 سم', 'Between 100 and 250 cm');

    if (!form.weight) e.weight = t('الوزن مطلوب', 'Weight is required');
    else if (num(form.weight) < 30 || num(form.weight) > 300) e.weight = t('بين 30 و 300 كغ', 'Between 30 and 300 kg');

    if (!form.waist) e.waist = t('قياس الخصر مطلوب', 'Waist is required');
    else if (num(form.waist) < 50 || num(form.waist) > 200) e.waist = t('بين 50 و 200 سم', 'Between 50 and 200 cm');

    if (form.gender === 'female' && !form.hips) e.hips = t('قياس الأرداف مطلوب للإناث', 'Hips are required for females');
    else if (form.hips && (num(form.hips) < 50 || num(form.hips) > 200)) e.hips = t('بين 50 و 200 سم', 'Between 50 and 200 cm');

    if (!form.age) e.age = t('العمر مطلوب', 'Age is required');
    else if (parseInt(form.age, 10) < 10 || parseInt(form.age, 10) > 100) e.age = t('بين 10 و 100 سنة', 'Between 10 and 100 years');

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast(t('في حقول بدها تصحيح', 'Some fields need fixing'), 'error');
      return;
    }

    setIsSubmitting(true);
    setServerError('');
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        height: parseFloat(form.height),
        weight: parseFloat(form.weight),
        waist: parseFloat(form.waist),
        hips: form.hips ? parseFloat(form.hips) : null,
        age: parseInt(form.age, 10),
        gender: form.gender,
        goal: form.goal,
        workout_place: form.workoutPlace,
        health_notes: form.healthNotes.trim(),
        program: form.program.trim(),
      };
      if (avatarPreview) payload.avatar = avatarPreview;
      if (form.password.trim()) {
        payload.password = form.password.trim();
        payload.password_confirmation = form.confirmPassword.trim();
      }

      await onSave(payload);
      toast(t('تم تحديث ملفك الشخصي ✓', 'Profile updated ✓'));
      onClose();
    } catch (error) {
      console.error('Submit error:', error);
      const message = error.response?.data?.message || error.message
        || t('فشل في حفظ التغييرات. يرجى المحاولة مرة أخرى.', 'Failed to save changes. Please try again.');
      setServerError(message);
      toast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const field = (name, label, icon, { hint, ...inputProps } = {}) => (
    <label className={`ep-field ${errors[name] ? 'has-error' : ''}`}>
      <span className="ep-field__label">{icon}{label}</span>
      <input name={name} value={form[name]} onChange={handleInput} aria-invalid={!!errors[name]} {...inputProps} />
      {hint && !errors[name] && <small className="ep-field__hint">{hint}</small>}
      {errors[name] && <small className="ep-field__error">{errors[name]}</small>}
    </label>
  );

  return (
    <div className="ep" role="presentation">
      <div className="ep__scrim" onClick={() => !isSubmitting && onClose()} />
      <aside className="ep__panel" role="dialog" aria-modal="true" aria-labelledby="ep-title">
        <header className="ep__head">
          <h2 id="ep-title">{t('تعديل الملف الشخصي', 'Edit profile')}</h2>
          <button type="button" className="pf-icon-btn" onClick={onClose} disabled={isSubmitting} aria-label={t('إغلاق', 'Close')}><X /></button>
        </header>

        <form className="ep__form" onSubmit={handleSubmit} noValidate>
          {serverError && <div className="ep__alert" role="alert"><AlertCircle /> {serverError}</div>}

          <div className="ep__avatar">
            <img src={avatarPreview || getAvatarUrl(userData)} alt="" onError={onAvatarError} />
            <label className="pf-btn pf-btn--ghost pf-btn--sm">
              <Camera /> {t('تغيير الصورة', 'Change photo')}
              <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
            </label>
            {errors.avatar && <small className="ep-field__error">{errors.avatar}</small>}
          </div>

          <fieldset className="ep__section">
            <legend>{t('المعلومات الأساسية', 'Basic information')}</legend>
            {field('name', t('الاسم الكامل', 'Full name'), <User />, { type: 'text', maxLength: 50, ref: firstFieldRef, autoComplete: 'name' })}
            {field('email', t('البريد الإلكتروني', 'Email'), <Mail />, { type: 'email', autoComplete: 'email', dir: 'ltr' })}
            <div className="ep__row">
              <div className="ep-field">
                <span className="ep-field__label"><CircleDot />{t('الجنس', 'Gender')}</span>
                <div className="pf-segmented ep__seg">
                  {GENDERS.map(g => (
                    <button key={g.value} type="button" className={form.gender === g.value ? 'is-active' : ''} onClick={() => setField('gender', g.value)} aria-pressed={form.gender === g.value}>
                      {t(g.labelAr, g.labelEn)}
                    </button>
                  ))}
                </div>
              </div>
              {field('age', t('العمر', 'Age'), <Cake />, { type: 'number', min: 10, max: 100, inputMode: 'numeric' })}
            </div>
          </fieldset>

          <fieldset className="ep__section">
            <legend>{t('قياسات الجسم', 'Body measurements')}</legend>
            <div className="ep__row">
              {field('height', t('الطول (سم)', 'Height (cm)'), <Ruler />, { type: 'number', min: 100, max: 250, step: 0.1, inputMode: 'decimal' })}
              {field('weight', t('الوزن (كغ)', 'Weight (kg)'), <Scale />, { type: 'number', min: 30, max: 300, step: 0.1, inputMode: 'decimal' })}
            </div>
            <div className="ep__row">
              {field('waist', t('الخصر (سم)', 'Waist (cm)'), <Ruler />, { type: 'number', min: 50, max: 200, step: 0.1, inputMode: 'decimal', hint: t('القياس عند السرة', 'Measured at the navel') })}
              {form.gender === 'female'
                ? field('hips', t('الأرداف (سم)', 'Hips (cm)'), <Ruler />, { type: 'number', min: 50, max: 200, step: 0.1, inputMode: 'decimal' })
                : <div />}
            </div>
          </fieldset>

          <fieldset className="ep__section">
            <legend>{t('الهدف والنشاط', 'Goal & activity')}</legend>
            <div className="ep-field">
              <span className="ep-field__label"><Target />{t('هدفك', 'Your goal')}</span>
              <div className="ep__chips">
                {GOALS.map(g => (
                  <button key={g.value} type="button" className={`ep__chip ${form.goal === g.value ? 'is-active' : ''}`} onClick={() => setField('goal', g.value)} aria-pressed={form.goal === g.value}>
                    {t(g.labelAr, g.labelEn)}
                  </button>
                ))}
              </div>
            </div>
            <div className="ep-field">
              <span className="ep-field__label"><Home />{t('مكان التمرين', 'Workout place')}</span>
              <div className="pf-segmented ep__seg">
                {PLACES.map(p => (
                  <button key={p.value} type="button" className={form.workoutPlace === p.value ? 'is-active' : ''} onClick={() => setField('workoutPlace', p.value)} aria-pressed={form.workoutPlace === p.value}>
                    {t(p.labelAr, p.labelEn)}
                  </button>
                ))}
              </div>
            </div>
            {field('program', t('البرنامج', 'Program'), null, { type: 'text', maxLength: 100 })}
          </fieldset>

          <fieldset className="ep__section">
            <legend>{t('الحالة الصحية', 'Health')}</legend>
            <label className="ep-field">
              <span className="ep-field__label"><HeartPulse />{t('إصابات أو حساسية أو أدوية؟', 'Injuries, allergies or medication?')}</span>
              <textarea name="healthNotes" value={form.healthNotes} onChange={handleInput} rows={3} maxLength={500}
                placeholder={t('اكتب أي ملاحظة صحية', 'Any health notes')} />
              <small className="ep-field__hint pf-num">{form.healthNotes.length}/500</small>
            </label>
          </fieldset>

          <fieldset className="ep__section">
            <legend>{t('تغيير كلمة المرور (اختياري)', 'Change password (optional)')}</legend>
            <div className="ep__row">
              {field('password', t('كلمة المرور الجديدة', 'New password'), <Lock />, { type: 'password', autoComplete: 'new-password', placeholder: t('6 أحرف على الأقل', 'At least 6 characters') })}
              {field('confirmPassword', t('تأكيدها', 'Confirm'), <Lock />, { type: 'password', autoComplete: 'new-password' })}
            </div>
          </fieldset>

          <footer className="ep__actions">
            <button type="button" className="pf-btn pf-btn--ghost" onClick={onClose} disabled={isSubmitting}>{t('إلغاء', 'Cancel')}</button>
            <button type="submit" className="pf-btn pf-btn--primary" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="pf-spin" /> : <Save />}
              {isSubmitting ? t('جاري الحفظ...', 'Saving...') : t('حفظ التغييرات', 'Save changes')}
            </button>
          </footer>
        </form>
      </aside>
    </div>
  );
};

export default EditProfileModal;
