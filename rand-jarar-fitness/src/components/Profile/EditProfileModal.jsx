import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { 
  FaTimes, 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaCamera, 
  FaRuler, 
  FaWeight, 
  FaHeartbeat,
  FaBullseye,
  FaHome,
  FaSave,
  FaExclamationCircle,
  FaCheckCircle,
  FaVenusMars,
  FaVenus,
  FaMars
} from 'react-icons/fa';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';
import './EditProfileModal.scss';

const EditProfileModal = ({ isOpen, onClose, userData, onSave }) => {
  const { t } = useProfileLanguage();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: '',
    height: '',
    weight: '',
    waist: '',
    hips: '',
    age: '',
    gender: 'male',
    goal: '',
    workoutPlace: '',
    healthNotes: '',
    program: ''
  });

  const [avatarPreview, setAvatarPreview] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && userData) {
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        password: '',
        confirmPassword: '',
        avatar: userData.avatar_url || '',
        height: userData.height?.toString() || '',
        weight: userData.weight?.toString() || '',
        waist: userData.waist?.toString() || '',
        hips: userData.hips?.toString() || '',
        age: userData.age?.toString() || '',
        gender: userData.gender || 'male',
        goal: userData.goal || 'weight-loss',
        workoutPlace: userData.workout_place || 'home',
        healthNotes: userData.health_notes || '',
        program: userData.program || ''
      });
      setAvatarPreview(userData.avatar_url || '');
      setErrors({});
      setSuccessMessage('');
      setServerError('');
    }
  }, [isOpen, userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setSuccessMessage('');
    setServerError('');
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, avatar: t('حجم الصورة يجب أن يكون أقل من 5 ميجابايت', 'Image size must be less than 5MB') }));
        return;
      }

      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, avatar: t('يرجى اختيار ملف صورة صالح', 'Please select a valid image file') }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setFormData(prev => ({
          ...prev,
          avatar: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t('الاسم مطلوب', 'Name is required');
    } else if (formData.name.length < 2) {
      newErrors.name = t('الاسم يجب أن يكون حرفين على الأقل', 'Name must be at least 2 characters');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('البريد الإلكتروني مطلوب', 'Email is required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('يرجى إدخال بريد إلكتروني صالح', 'Please enter a valid email address');
    }

    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = t('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'Password must be at least 6 characters');
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = t('كلمات المرور غير متطابقة', 'Passwords do not match');
      }
    }

    if (!formData.height) {
      newErrors.height = t('الطول مطلوب', 'Height is required');
    } else if (parseFloat(formData.height) < 100 || parseFloat(formData.height) > 250) {
      newErrors.height = t('الطول يجب أن يكون بين 100 و 250 سم', 'Height must be between 100 and 250 cm');
    }

    if (!formData.weight) {
      newErrors.weight = t('الوزن مطلوب', 'Weight is required');
    } else if (parseFloat(formData.weight) < 30 || parseFloat(formData.weight) > 300) {
      newErrors.weight = t('الوزن يجب أن يكون بين 30 و 300 كجم', 'Weight must be between 30 and 300 kg');
    }

    if (!formData.waist) {
      newErrors.waist = t('قياس الخصر مطلوب', 'Waist measurement is required');
    } else if (parseFloat(formData.waist) < 50 || parseFloat(formData.waist) > 200) {
      newErrors.waist = t('قياس الخصر يجب أن يكون بين 50 و 200 سم', 'Waist measurement must be between 50 and 200 cm');
    }

    if (formData.gender === 'female' && !formData.hips) {
      newErrors.hips = t('قياس الأرداف مطلوب للإناث', 'Hips measurement is required for females');
    } else if (formData.hips && (parseFloat(formData.hips) < 50 || parseFloat(formData.hips) > 200)) {
      newErrors.hips = t('قياس الأرداف يجب أن يكون بين 50 و 200 سم', 'Hips measurement must be between 50 and 200 cm');
    }

    if (!formData.age) {
      newErrors.age = t('العمر مطلوب', 'Age is required');
    } else if (parseInt(formData.age) < 10 || parseInt(formData.age) > 100) {
      newErrors.age = t('العمر يجب أن يكون بين 10 و 100 سنة', 'Age must be between 10 and 100 years');
    }

    if (!formData.gender) {
      newErrors.gender = t('الجنس مطلوب', 'Gender is required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }

  setIsSubmitting(true);
  setServerError('');

  try {
    const updatedUser = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
      waist: parseFloat(formData.waist),
      hips: formData.hips ? parseFloat(formData.hips) : null,
      age: parseInt(formData.age),
      gender: formData.gender,
      goal: formData.goal,
      workout_place: formData.workoutPlace, // ✅ تصحيح اسم الحقل
      health_notes: formData.healthNotes.trim(), // ✅ تصحيح اسم الحقل
      program: formData.program.trim()
    };

    // ✅ إضافة الصورة إذا تغيرت
    if (avatarPreview && avatarPreview !== userData.avatar_url) {
      updatedUser.avatar = avatarPreview;
    }

    // ✅ إضافة كلمة المرور مع التأكيد
    if (formData.password && formData.password.trim() !== '') {
      updatedUser.password = formData.password.trim();
      updatedUser.password_confirmation = formData.confirmPassword.trim(); // ✅ هذا مهم جداً!
      
      console.log('Sending password data:', {
        has_password: !!updatedUser.password,
        has_confirmation: !!updatedUser.password_confirmation,
        passwords_match: updatedUser.password === updatedUser.password_confirmation
      });
    }

    console.log('Full update data:', updatedUser);

    await onSave(updatedUser);

    Swal.fire({
      title: t('نجح!', 'Success!'),
      text: t('تم تحديث الملف الشخصي بنجاح', 'Profile updated successfully'),
      icon: 'success',
      confirmButtonText: t('حسناً', 'OK'),
      confirmButtonColor: '#FDB813',
      timer: 3000,
      timerProgressBar: true,
      didClose: () => {
        onClose();
      }
    });

  } catch (error) {
    console.error('Submit error:', error);
    
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        t('فشل في حفظ التغييرات. يرجى المحاولة مرة أخرى.', 'Failed to save changes. Please try again.');
    
    setServerError(errorMessage);
    
    Swal.fire({
      title: t('خطأ!', 'Error!'),
      text: errorMessage,
      icon: 'error',
      confirmButtonText: t('حاول مرة أخرى', 'Try Again'),
      confirmButtonColor: '#dc2626'
    });
  } finally {
    setIsSubmitting(false);
  }
};

  const genders = [
    { value: 'male', labelAr: 'ذكر', labelEn: 'Male', icon: <FaMars /> },
    { value: 'female', labelAr: 'أنثى', labelEn: 'Female', icon: <FaVenus /> }
  ];

  const goals = [
    { value: 'weight-loss', labelAr: 'إنقاص الوزن', labelEn: 'Weight Loss' },
    { value: 'muscle-gain', labelAr: 'بناء العضلات', labelEn: 'Muscle Gain' },
    { value: 'toning', labelAr: 'التنشيف', labelEn: 'Toning' },
    { value: 'fitness', labelAr: 'اللياقة العامة', labelEn: 'General Fitness' }
  ];

  const workoutPlaces = [
    { value: 'home', labelAr: 'المنزل', labelEn: 'Home' },
    { value: 'gym', labelAr: 'الصالة الرياضية', labelEn: 'Gym' }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose}>
        <motion.div 
          className="edit-profile-modal"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="modal-header">
            <h2>{t('تعديل الملف الشخصي', 'Edit Profile')}</h2>
            <button className="close-btn" onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          {/* Modal Content */}
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              {/* Success Message */}
              {successMessage && (
                <div className="success-message">
                  <FaCheckCircle />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Server Error */}
              {serverError && (
                <div className="server-error">
                  <FaExclamationCircle />
                  <span>{serverError}</span>
                </div>
              )}

              {/* Avatar Section */}
              <div className="avatar-section">
                <div className="avatar-upload">
                  <div className="avatar-preview">
                    <img 
                      src={avatarPreview || '/default-avatar.png'} 
                      alt="Avatar Preview" 
                      className="avatar-img"
                    />
                    <label htmlFor="avatar-upload" className="avatar-upload-label">
                      <FaCamera />
                    </label>
                  </div>
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="avatar-input"
                  />
                </div>
                {errors.avatar && <p className="error-message">{errors.avatar}</p>}
              </div>

              {/* Basic Information Section */}
              <div className="form-section">
                <h3>{t('المعلومات الأساسية', 'Basic Information')}</h3>
                
                <div className="form-grid">
                  {/* Name */}
                  <div className="form-group">
                    <label>
                      <FaUser /> {t('الاسم الكامل', 'Full Name')}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={errors.name ? 'error' : ''}
                      placeholder={t('أدخل اسمك الكامل', 'Enter your full name')}
                      maxLength="50"
                    />
                    {errors.name && <p className="error-message">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label>
                      <FaEnvelope /> {t('البريد الإلكتروني', 'Email Address')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'error' : ''}
                      placeholder="example@email.com"
                    />
                    {errors.email && <p className="error-message">{errors.email}</p>}
                  </div>

                  {/* Gender */}
                  <div className="form-group">
                    <label>
                      <FaVenusMars /> {t('الجنس', 'Gender')}
                    </label>
                    <div className="gender-radio-group">
                      {genders.map(gender => (
                        <label key={gender.value} className="gender-radio-label">
                          <input
                            type="radio"
                            name="gender"
                            value={gender.value}
                            checked={formData.gender === gender.value}
                            onChange={handleInputChange}
                          />
                          <span className="gender-radio-custom">
                            {gender.icon}
                          </span>
                          <span className="gender-label">{t(gender.labelAr, gender.labelEn)}</span>
                        </label>
                      ))}
                    </div>
                    {errors.gender && <p className="error-message">{errors.gender}</p>}
                  </div>

                  {/* Age */}
                  <div className="form-group">
                    <label>{t('العمر (سنة)', 'Age (years)')}</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className={errors.age ? 'error' : ''}
                      placeholder={t('مثال: 25', 'e.g., 25')}
                      min="10"
                      max="100"
                    />
                    {errors.age && <p className="error-message">{errors.age}</p>}
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <div className="form-section">
                <h3>{t('إعدادات كلمة المرور', 'Password Settings')}</h3>
                
                <div className="form-grid">
                  {/* Password */}
                  <div className="form-group">
                    <label>
                      <FaLock /> {t('كلمة المرور الجديدة (اختياري)', 'New Password (Optional)')}
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={errors.password ? 'error' : ''}
                      placeholder={t('أدخل كلمة مرور جديدة (6 أحرف على الأقل)', 'Enter new password (min 6 characters)')}
                    />
                    {errors.password && <p className="error-message">{errors.password}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div className="form-group">
                    <label>
                      <FaLock /> {t('تأكيد كلمة المرور', 'Confirm Password')}
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={errors.confirmPassword ? 'error' : ''}
                      placeholder={t('أعد إدخال كلمة المرور', 'Re-enter password')}
                    />
                    {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>

              {/* Body Measurements Section */}
              <div className="form-section">
                <h3>{t('قياسات الجسم', 'Body Measurements')}</h3>
                
                <div className="form-grid">
                  {/* Height */}
                  <div className="form-group">
                    <label>
                      <FaRuler /> {t('الطول (سم)', 'Height (cm)')}
                    </label>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      className={errors.height ? 'error' : ''}
                      placeholder={t('مثال: 170', 'e.g., 170')}
                      min="100"
                      max="250"
                      step="0.1"
                    />
                    {errors.height && <p className="error-message">{errors.height}</p>}
                  </div>

                  {/* Weight */}
                  <div className="form-group">
                    <label>
                      <FaWeight /> {t('الوزن الحالي (كجم)', 'Current Weight (kg)')}
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className={errors.weight ? 'error' : ''}
                      placeholder={t('مثال: 75', 'e.g., 75')}
                      min="30"
                      max="300"
                      step="0.1"
                    />
                    {errors.weight && <p className="error-message">{errors.weight}</p>}
                  </div>

                  {/* Waist */}
                  <div className="form-group">
                    <label>{t('قياس الخصر (سم) *', 'Waist Measurement (cm) *')}</label>
                    <input
                      type="number"
                      name="waist"
                      value={formData.waist}
                      onChange={handleInputChange}
                      className={errors.waist ? 'error' : ''}
                      placeholder={t('القياس عند السرة', 'Measurement at navel')}
                      min="50"
                      max="200"
                      step="0.1"
                    />
                    <small className="field-note">{t('مطلوب لجميع الأجناس', 'Required for all genders')}</small>
                    {errors.waist && <p className="error-message">{errors.waist}</p>}
                  </div>

                  {/* Hips - Only for females */}
                  <div className="form-group">
                    <label>
                      {t('قياس الأرداف (سم)', 'Hips Measurement (cm)')} {formData.gender === 'female' && '*'}
                    </label>
                    <input
                      type="number"
                      name="hips"
                      value={formData.hips}
                      onChange={handleInputChange}
                      className={errors.hips ? 'error' : ''}
                      placeholder={t('قياس الأرداف', 'Hips measurement')}
                      min="50"
                      max="200"
                      step="0.1"
                      disabled={formData.gender !== 'female'}
                    />
                    <small className="field-note">
                      {formData.gender === 'female' 
                        ? t('مطلوب للإناث', 'Required for females')
                        : t('للإناث فقط', 'Only for females')}
                    </small>
                    {errors.hips && <p className="error-message">{errors.hips}</p>}
                  </div>
                </div>
              </div>

              {/* Goal & Activity Section */}
              <div className="form-section">
                <h3>{t('الهدف والنشاط', 'Goal & Activity')}</h3>
                
                <div className="form-grid">
                  {/* Goal */}
                  <div className="form-group">
                    <label>
                      <FaBullseye /> {t('ما هو هدفك؟', 'Your Goal?')}
                    </label>
                    <select
                      name="goal"
                      value={formData.goal}
                      onChange={handleInputChange}
                      className="select-input"
                    >
                      {goals.map(goal => (
                        <option key={goal.value} value={goal.value}>
                          {t(goal.labelAr, goal.labelEn)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Workout Place */}
                  <div className="form-group">
                    <label>
                      <FaHome /> {t('مكان التمرين؟', 'Workout Place?')}
                    </label>
                    <div className="radio-group">
                      {workoutPlaces.map(place => (
                        <label key={place.value} className="radio-label">
                          <input
                            type="radio"
                            name="workoutPlace"
                            value={place.value}
                            checked={formData.workoutPlace === place.value}
                            onChange={handleInputChange}
                          />
                          <span className="radio-custom"></span>
                          {t(place.labelAr, place.labelEn)}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Program */}
                  <div className="form-group">
                    <label>{t('البرنامج المختار', 'Selected Program')}</label>
                    <input
                      type="text"
                      name="program"
                      value={formData.program}
                      onChange={handleInputChange}
                      placeholder={t('اسم البرنامج', 'Program name')}
                      maxLength="100"
                    />
                  </div>
                </div>
              </div>

              {/* Health Status Section */}
              <div className="form-section">
                <h3>{t('الحالة الصحية', 'Health Status')}</h3>
                
                <div className="form-group">
                  <label>
                    <FaHeartbeat /> {t('هل لديك أي إصابات أو حساسية غذائية؟', 'Any injuries or food allergies?')}
                  </label>
                  <textarea
                    name="healthNotes"
                    value={formData.healthNotes}
                    onChange={handleInputChange}
                    placeholder={t('أدخل أي ملاحظات صحية (إصابات، حساسية، أدوية، إلخ...)', 'Enter any health notes (injuries, allergies, medications, etc...)')}
                    rows="3"
                    className="textarea-input"
                    maxLength="500"
                  />
                  <div className="char-count">
                    {formData.healthNotes.length}/500 {t('حرف', 'characters')}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  {t('إلغاء', 'Cancel')}
                </button>
                <button 
                  type="submit" 
                  className="save-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      {t('جاري الحفظ...', 'Saving...')}
                    </>
                  ) : (
                    <>
                      <FaSave />
                      {t('حفظ التغييرات', 'Save Changes')}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EditProfileModal;