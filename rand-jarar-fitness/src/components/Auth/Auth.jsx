import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaDumbbell, 
  FaFire,
  FaHeart,
  FaStar,
  FaTrophy,
  FaRocket,
  FaSpinner,
  FaExclamationTriangle,
  FaUserShield,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useLanguage } from '../../contexts/LanguageContext';
import authApi from '../../api/authApi';
import './Auth.scss';

const Auth = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    gender: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: '',
    checks: {
      length: false,
      lowercase: false,
      uppercase: false,
      number: false,
      special: false
    }
  });
  const { currentLang, isArabic } = useLanguage();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  // Refs للتحكم في السكروول
  const formContainerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleEscape);
      
      // منع scroll للصفحة الأساسية عند فتح المودال
      document.body.style.overflow = 'hidden';
      
      return () => {
        window.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'auto';
      };
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    const checkAdminAccess = () => {
      const timeoutId = setTimeout(() => {
        if (authApi.isAuthenticated()) {
          const user = authApi.getUser();
          if (user && user.role === 'admin') {
            Swal.fire({
              title: isArabic ? 'عذراً!' : 'Sorry!',
              text: isArabic 
                ? 'هذه البوابة مخصصة للعملاء فقط. المدربون لديهم بوابة دخول منفصلة.' 
                : 'This portal is for clients only. Trainers have a separate login portal.',
              icon: 'info',
              confirmButtonText: isArabic ? 'حسناً' : 'OK',
              confirmButtonColor: '#FDB813',
              iconColor: '#FDB813'
            });
            onClose();
            return;
          }
        }
        setIsCheckingAuth(false);
      }, 300);

      return () => clearTimeout(timeoutId);
    };

    if (isOpen) {
      const cleanup = checkAdminAccess();
      return cleanup;
    } else {
      setIsCheckingAuth(false);
    }
  }, [isOpen, isArabic, onClose]);

  // Real-time validation
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'name':
        if (mode === 'register') {
          if (!value.trim()) {
            error = isArabic ? 'الاسم مطلوب' : 'Name is required';
          } else if (value.trim().length < 3) {
            error = isArabic ? 'الاسم يجب أن يكون 3 أحرف على الأقل' : 'Name must be at least 3 characters';
          }
        }
        break;

      case 'email':
        if (!value) {
          error = isArabic ? 'البريد الإلكتروني مطلوب' : 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = isArabic ? 'البريد الإلكتروني غير صحيح' : 'Email is invalid';
        }
        break;

      case 'password':
        if (!value) {
          error = isArabic ? 'كلمة المرور مطلوبة' : 'Password is required';
        } else if (mode === 'register') {
          if (value.length < 8) {
            error = isArabic ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' : 'Password must be at least 8 characters';
          } else if (!/(?=.*[a-z])/.test(value)) {
            error = isArabic ? 'يجب أن تحتوي على حرف صغير' : 'Must contain a lowercase letter';
          } else if (!/(?=.*[A-Z])/.test(value)) {
            error = isArabic ? 'يجب أن تحتوي على حرف كبير' : 'Must contain an uppercase letter';
          } else if (!/(?=.*\d)/.test(value)) {
            error = isArabic ? 'يجب أن تحتوي على رقم' : 'Must contain a number';
          } else if (!/(?=.*[@$!%*?&#^()_+=\-\[\]{};:,.<>])/.test(value)) {
            error = isArabic ? 'يجب أن تحتوي على رمز خاص (!@#$%^&*)' : 'Must contain a special character (!@#$%^&*)';
          }
        } else if (value.length < 6) {
          error = isArabic ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters';
        }
        break;

      case 'password_confirmation':
        if (mode === 'register') {
          if (!value) {
            error = isArabic ? 'تأكيد كلمة المرور مطلوب' : 'Password confirmation is required';
          } else if (value !== formData.password) {
            error = isArabic ? 'كلمة المرور غير متطابقة' : 'Passwords do not match';
          }
        }
        break;
    }

    return error;
  };

  // Password strength checker
  const checkPasswordStrength = (password) => {
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&#^()_+=\-\[\]{};:,.<>]/.test(password)
    };

    const score = Object.values(checks).filter(Boolean).length;
    
    let feedback = '';
    if (!password) {
      feedback = '';
    } else if (score <= 2) {
      feedback = isArabic ? 'ضعيفة جداً' : 'Very Weak';
    } else if (score === 3) {
      feedback = isArabic ? 'ضعيفة' : 'Weak';
    } else if (score === 4) {
      feedback = isArabic ? 'متوسطة' : 'Medium';
    } else {
      feedback = isArabic ? 'قوية' : 'Strong';
    }

    return { score, feedback, checks };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Real-time validation
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));

    // Check password strength for register mode
    if (name === 'password' && mode === 'register') {
      const strength = checkPasswordStrength(value);
      setPasswordStrength(strength);
      
      // إذا تحققت جميع الشروط، قم بإزالة رسالة الخطأ
      if (strength.score === 5 && errors.password) {
        setErrors(prev => ({
          ...prev,
          password: ''
        }));
      }
    }

    // Re-validate password confirmation if password changes
    if (name === 'password' && formData.password_confirmation) {
      const confirmError = validateField('password_confirmation', formData.password_confirmation);
      setErrors(prev => ({
        ...prev,
        password_confirmation: confirmError
      }));
    }

    // Clear submit error
    if (errors.submit) {
      setErrors(prev => ({
        ...prev,
        submit: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const fieldsToValidate = mode === 'login' 
      ? ['email', 'password']
      : ['name', 'email', 'password', 'password_confirmation'];

    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    
    // Mark all fields as touched
    const touchedFields = {};
    fieldsToValidate.forEach(field => {
      touchedFields[field] = true;
    });
    setTouched(touchedFields);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setErrors({});

    try {
      let response;
      
      if (mode === 'login') {
        response = await authApi.login(formData.email, formData.password);
      } else {
        const registerData = {
          ...formData,
          language: currentLang
        };
        response = await authApi.register(registerData);
      }

      if (response.success) {
        const user = response.data.user;
        
        if (user.role === 'admin') {
          authApi.clearAuthData();
          
          Swal.fire({
            title: isArabic ? 'عذراً!' : 'Sorry!',
            text: isArabic 
              ? 'هذه البوابة مخصصة للعملاء فقط. المدربون لديهم بوابة دخول منفصلة.' 
              : 'This portal is for clients only. Trainers have a separate login portal.',
            icon: 'warning',
            confirmButtonText: isArabic ? 'حسناً' : 'OK',
            confirmButtonColor: '#FDB813',
            iconColor: '#FDB813'
          });
          
          onClose();
          setIsSubmitting(false);
          return;
        }

        onClose();
        
        setTimeout(() => {
          Swal.fire({
            title: isArabic 
              ? (mode === 'login' ? 'مرحباً بعودتك! 💪' : 'مرحباً بك! 🎉') 
              : (mode === 'login' ? 'Welcome Back! 💪' : 'Welcome! 🎉'),
            text: isArabic
              ? (mode === 'login' 
                  ? 'تم تسجيل الدخول بنجاح' 
                  : 'تم إنشاء حسابك بنجاح! ابدأ رحلة التحول الآن')
              : (mode === 'login' 
                  ? 'Successfully logged in' 
                  : 'Your account is ready! Start your transformation journey'),
            icon: 'success',
            confirmButtonText: isArabic ? 'متابعة' : 'Continue',
            confirmButtonColor: '#FDB813',
            iconColor: '#FDB813',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: true
          }).then(() => {
            const currentUser = authApi.getUser();
            
            setTimeout(() => {
              if (currentUser) {
                if (currentUser.has_active_subscription) {
                  window.location.href = '/profile';
                } else {
                  window.location.href = '/plans';
                }
              } else {
                window.location.reload();
              }
            }, 500);
          });
        }, 300);
        
      } else {
        setErrors({
          submit: response.message || (isArabic 
            ? 'حدث خطأ. يرجى المحاولة مرة أخرى' 
            : 'An error occurred. Please try again')
        });

        if (response.errors) {
          const backendErrors = {};
          Object.keys(response.errors).forEach(key => {
            backendErrors[key] = Array.isArray(response.errors[key]) 
              ? response.errors[key][0] 
              : response.errors[key];
          });
          setErrors(prev => ({ ...prev, ...backendErrors }));
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setErrors({
        submit: isArabic 
          ? 'حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى' 
          : 'Connection error. Please try again'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = () => {
    const newMode = mode === 'login' ? 'register' : 'login';
    setMode(newMode);
    setFormData({ 
      name: '', 
      email: '', 
      password: '', 
      password_confirmation: '',
      gender: '',
      phone: ''
    });
    setErrors({});
    setTouched({});
    setShowPassword(false);
    setShowPasswordConfirmation(false);
    setPasswordStrength({ 
      score: 0, 
      feedback: '',
      checks: {
        length: false,
        lowercase: false,
        uppercase: false,
        number: false,
        special: false
      }
    });
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('auth-overlay')) {
      onClose();
    }
  };

  const getPasswordStrengthClass = () => {
    if (passwordStrength.score <= 2) return 'weak';
    if (passwordStrength.score === 3) return 'fair';
    if (passwordStrength.score === 4) return 'medium';
    return 'strong';
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordConfirmationVisibility = () => {
    setShowPasswordConfirmation(!showPasswordConfirmation);
  };

  if (isCheckingAuth) {
    return (
      <AnimatePresence>
        <motion.div 
          className="auth-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="loading-check">
            <FaSpinner className="spinner-large" />
            <p>{isArabic ? 'جاري التحقق...' : 'Checking authentication...'}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (!isOpen) return null;

  // تسميات الحقول
  const fieldLabels = {
    name: isArabic ? 'الاسم الكامل' : 'Full Name',
    email: isArabic ? 'البريد الإلكتروني' : 'Email',
    password: isArabic ? 'كلمة المرور' : 'Password',
    password_confirmation: isArabic ? 'تأكيد كلمة المرور' : 'Confirm Password',
    gender: isArabic ? 'الجنس (اختياري)' : 'Gender (Optional)'
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="auth-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleOverlayClick}
      >
        <motion.div 
          className="auth-container"
          initial={{ scale: 0.5, rotateY: -180, opacity: 0 }}
          animate={{ scale: 1, rotateY: 0, opacity: 1 }}
          exit={{ scale: 0.5, rotateY: 180, opacity: 0 }}
          transition={{ 
            type: "spring", 
            duration: 0.8,
            bounce: 0.3
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Floating Icons Background */}
          <div className="floating-icons">
            {[FaDumbbell, FaFire, FaHeart, FaStar, FaTrophy, FaRocket].map((Icon, i) => (
              <motion.div
                key={i}
                className="floating-icon"
                initial={{ y: 0, opacity: 0.3 }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.6, 0.3],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                style={{
                  left: `${15 + i * 15}%`,
                  top: `${10 + (i % 3) * 30}%`
                }}
              >
                <Icon />
              </motion.div>
            ))}
          </div>

          {/* Main Card */}
          <div className="auth-card">
            {/* Left Side - Animated Illustration */}
            <motion.div 
              className="auth-visual"
              animate={{
                background: mode === 'login' 
                  ? 'linear-gradient(135deg, #3a1f3d 0%, #2d1b2e 50%, #1f1520 100%)'
                  : 'linear-gradient(135deg, #2c2416 0%, #3d2f1a 35%, #4a3a1f 70%, #5a4a2a 100%)'
              }}
              transition={{ duration: 0.5 }}
            >
              <div className="animated-circle-2"></div>
              <div className="visual-content">
                <motion.div
                  className="visual-circle"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <div className="circle-inner">
                    <FaDumbbell className="circle-icon" />
                  </div>
                </motion.div>

                <motion.div
                  className="visual-text"
                  key={mode}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  dir={isArabic ? 'rtl' : 'ltr'}
                >
                  <h2>
                    {mode === 'login' 
                      ? (isArabic ? 'مرحباً بعودتك!' : 'Welcome Back!')
                      : (isArabic ? 'ابدأ رحلتك!' : 'Start Your Journey!')
                    }
                  </h2>
                  <p>
                    {mode === 'login' 
                      ? (isArabic ? 'مستعد لمواصلة التحدي؟' : 'Ready to continue the challenge?')
                      : (isArabic ? 'حوّل حياتك معنا' : 'Transform your life with us')
                    }
                  </p>
                  <div className="client-badge">
                    <FaUserShield />
                    <span>{isArabic ? 'للعملاء فقط' : 'For Clients Only'}</span>
                  </div>
                </motion.div>

                
              </div>
            </motion.div>

            {/* Right Side - Form */}
            <div className="auth-form-container" ref={formContainerRef}>
              <motion.div
                className="auth-header"
                layout
                dir={isArabic ? 'rtl' : 'ltr'}
              >
                <div className="header-title">
                  <h1>
                    {mode === 'login' 
                      ? (isArabic ? 'تسجيل الدخول للعميل' : 'Client Login')
                      : (isArabic ? 'إنشاء حساب عميل' : 'Create Client Account')
                    }
                  </h1>
                  <div className="role-badge">
                    <FaUserShield />
                    <span>{isArabic ? 'عميل' : 'Client'}</span>
                  </div>
                </div>
                <p>
                  {mode === 'login' 
                    ? (isArabic ? 'أدخل بيانات حسابك للوصول إلى برامجك التدريبية' : 'Enter your account to access your training programs')
                    : (isArabic ? 'سجل الآن لتبدأ رحلتك الصحية' : 'Register now to start your health journey')
                  }
                </p>
              </motion.div>

              <form onSubmit={handleSubmit} noValidate>
                <AnimatePresence mode="wait">
                  {/* Login Form */}
                  {mode === 'login' && (
                    <motion.div
                      key="login"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="form-group">
                        <label className="field-label">
                          {fieldLabels.email}
                        </label>
                        <div className={`input-wrapper ${touched.email && errors.email ? 'error' : ''} ${touched.email && !errors.email && formData.email ? 'success' : ''}`}>
                          <FaEnvelope className="input-icon" />
                          <input
                            type="email"
                            name="email"
                            placeholder={fieldLabels.email}
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            disabled={isSubmitting}
                            dir={isArabic ? 'rtl' : 'ltr'}
                          />
                          {touched.email && !errors.email && formData.email && (
                            <FaCheckCircle className="validation-icon success-icon" />
                          )}
                          {touched.email && errors.email && (
                            <FaTimesCircle className="validation-icon error-icon" />
                          )}
                        </div>
                        <AnimatePresence>
                          {touched.email && errors.email && (
                            <motion.span 
                              className="error-message"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              {errors.email}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="form-group">
                        <label className="field-label">
                          {fieldLabels.password}
                        </label>
                        <div className={`input-wrapper password-wrapper ${touched.password && errors.password ? 'error' : ''} ${touched.password && !errors.password && formData.password ? 'success' : ''}`}>
                          <FaLock className="input-icon" />
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder={fieldLabels.password}
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            disabled={isSubmitting}
                            dir={isArabic ? 'rtl' : 'ltr'}
                          />
                          <button
                            type="button"
                            className="password-toggle"
                            onClick={togglePasswordVisibility}
                            tabIndex={-1}
                            aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                          {touched.password && !errors.password && formData.password && (
                            <FaCheckCircle className="validation-icon success-icon" />
                          )}
                          {touched.password && errors.password && (
                            <FaTimesCircle className="validation-icon error-icon" />
                          )}
                        </div>
                        <AnimatePresence>
                          {touched.password && errors.password && (
                            <motion.span 
                              className="error-message"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              {errors.password}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>

                      {errors.submit && (
                        <div className="submit-error">
                          {errors.submit}
                        </div>
                      )}

                      <motion.button
                        type="submit"
                        className="submit-button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <FaSpinner className="spinner" />
                        ) : (
                          isArabic ? 'تسجيل الدخول' : 'Login'
                        )}
                      </motion.button>
                    </motion.div>
                  )}

                  {/* Register Form */}
                  {mode === 'register' && (
                    <motion.div
                      key="register"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                    >
                      <div className="form-group">
                        <label className="field-label">
                          {fieldLabels.name}
                        </label>
                        <div className={`input-wrapper ${touched.name && errors.name ? 'error' : ''} ${touched.name && !errors.name && formData.name ? 'success' : ''}`}>
                          <FaUser className="input-icon" />
                          <input
                            type="text"
                            name="name"
                            placeholder={fieldLabels.name}
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            disabled={isSubmitting}
                            dir={isArabic ? 'rtl' : 'ltr'}
                          />
                          {touched.name && !errors.name && formData.name && (
                            <FaCheckCircle className="validation-icon success-icon" />
                          )}
                          {touched.name && errors.name && (
                            <FaTimesCircle className="validation-icon error-icon" />
                          )}
                        </div>
                        <AnimatePresence>
                          {touched.name && errors.name && (
                            <motion.span 
                              className="error-message"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              {errors.name}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="form-group">
                        <label className="field-label">
                          {fieldLabels.email}
                        </label>
                        <div className={`input-wrapper ${touched.email && errors.email ? 'error' : ''} ${touched.email && !errors.email && formData.email ? 'success' : ''}`}>
                          <FaEnvelope className="input-icon" />
                          <input
                            type="email"
                            name="email"
                            placeholder={fieldLabels.email}
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            disabled={isSubmitting}
                            dir={isArabic ? 'rtl' : 'ltr'}
                          />
                          {touched.email && !errors.email && formData.email && (
                            <FaCheckCircle className="validation-icon success-icon" />
                          )}
                          {touched.email && errors.email && (
                            <FaTimesCircle className="validation-icon error-icon" />
                          )}
                        </div>
                        <AnimatePresence>
                          {touched.email && errors.email && (
                            <motion.span 
                              className="error-message"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              {errors.email}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="form-group">
                        <label className="field-label">
                          {fieldLabels.password}
                        </label>
                        <div className={`input-wrapper password-wrapper ${touched.password && errors.password ? 'error' : ''} ${touched.password && !errors.password && formData.password ? 'success' : ''}`}>
                          <FaLock className="input-icon" />
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder={fieldLabels.password}
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            minLength={8}
                            disabled={isSubmitting}
                            dir={isArabic ? 'rtl' : 'ltr'}
                          />
                          <button
                            type="button"
                            className="password-toggle"
                            onClick={togglePasswordVisibility}
                            tabIndex={-1}
                            aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                          {touched.password && !errors.password && formData.password && passwordStrength.score === 5 && (
                            <FaCheckCircle className="validation-icon success-icon" />
                          )}
                          {touched.password && errors.password && (
                            <FaTimesCircle className="validation-icon error-icon" />
                          )}
                        </div>
                        
                        {/* عرض رسائل الخطأ للباسورد فقط عند وجود خطأ */}
                        <AnimatePresence>
                          {touched.password && errors.password && (
                            <motion.span 
                              className="error-message"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              {errors.password}
                            </motion.span>
                          )}
                        </AnimatePresence>
                        
                        {/* عرض قوة الباسورد فقط عندما يبدأ المستخدم بالكتابة */}
                        <AnimatePresence>
                          {touched.password && formData.password && (
                            <motion.div 
                              className="password-strength"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="strength-label" dir={isArabic ? 'rtl' : 'ltr'}>
                                <span>{isArabic ? 'قوة كلمة المرور:' : 'Password Strength:'}</span>
                                <span className={`strength-text ${getPasswordStrengthClass()}`}>
                                  {passwordStrength.feedback}
                                </span>
                              </div>
                              <div className="strength-bar">
                                <motion.div 
                                  className={`strength-fill ${getPasswordStrengthClass()}`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                  transition={{ duration: 0.3 }}
                                />
                              </div>
                              
                              {/* إخفاء متطلبات الباسورد عندما تكون صحيحة بالكامل */}
                              {passwordStrength.score < 5 && (
                                <div className="password-requirements" dir={isArabic ? 'rtl' : 'ltr'}>
                                  <div className={`requirement ${passwordStrength.checks.length ? 'met' : ''}`}>
                                    {passwordStrength.checks.length ? <FaCheckCircle /> : <FaTimesCircle />}
                                    <span>{isArabic ? '8 أحرف على الأقل' : '8+ characters'}</span>
                                  </div>
                                  <div className={`requirement ${passwordStrength.checks.lowercase ? 'met' : ''}`}>
                                    {passwordStrength.checks.lowercase ? <FaCheckCircle /> : <FaTimesCircle />}
                                    <span>{isArabic ? 'حرف صغير (a-z)' : 'Lowercase (a-z)'}</span>
                                  </div>
                                  <div className={`requirement ${passwordStrength.checks.uppercase ? 'met' : ''}`}>
                                    {passwordStrength.checks.uppercase ? <FaCheckCircle /> : <FaTimesCircle />}
                                    <span>{isArabic ? 'حرف كبير (A-Z)' : 'Uppercase (A-Z)'}</span>
                                  </div>
                                  <div className={`requirement ${passwordStrength.checks.number ? 'met' : ''}`}>
                                    {passwordStrength.checks.number ? <FaCheckCircle /> : <FaTimesCircle />}
                                    <span>{isArabic ? 'رقم (0-9)' : 'Number (0-9)'}</span>
                                  </div>
                                  <div className={`requirement ${passwordStrength.checks.special ? 'met' : ''}`}>
                                    {passwordStrength.checks.special ? <FaCheckCircle /> : <FaTimesCircle />}
                                    <span>{isArabic ? 'رمز خاص (!@#$)' : 'Special (!@#$)'}</span>
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="form-group">
                        <label className="field-label">
                          {fieldLabels.password_confirmation}
                        </label>
                        <div className={`input-wrapper password-wrapper ${touched.password_confirmation && errors.password_confirmation ? 'error' : ''} ${touched.password_confirmation && !errors.password_confirmation && formData.password_confirmation ? 'success' : ''}`}>
                          <FaLock className="input-icon" />
                          <input
                            type={showPasswordConfirmation ? "text" : "password"}
                            name="password_confirmation"
                            placeholder={fieldLabels.password_confirmation}
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            minLength={8}
                            disabled={isSubmitting}
                            dir={isArabic ? 'rtl' : 'ltr'}
                          />
                          <button
                            type="button"
                            className="password-toggle"
                            onClick={togglePasswordConfirmationVisibility}
                            tabIndex={-1}
                            aria-label={showPasswordConfirmation ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                          >
                            {showPasswordConfirmation ? <FaEyeSlash /> : <FaEye />}
                          </button>
                          {touched.password_confirmation && !errors.password_confirmation && formData.password_confirmation && (
                            <FaCheckCircle className="validation-icon success-icon" />
                          )}
                          {touched.password_confirmation && errors.password_confirmation && (
                            <FaTimesCircle className="validation-icon error-icon" />
                          )}
                        </div>
                        <AnimatePresence>
                          {touched.password_confirmation && errors.password_confirmation && (
                            <motion.span 
                              className="error-message"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              {errors.password_confirmation}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="form-group">
                        <label className="field-label">
                          {fieldLabels.gender}
                        </label>
                        <div className="input-wrapper">
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            className="select-input"
                            dir={isArabic ? 'rtl' : 'ltr'}
                          >
                            <option value="">{fieldLabels.gender}</option>
                            <option value="male">{isArabic ? 'ذكر' : 'Male'}</option>
                            <option value="female">{isArabic ? 'أنثى' : 'Female'}</option>
                          </select>
                        </div>
                      </div>

                      {errors.submit && (
                        <div className="submit-error">
                          {errors.submit}
                        </div>
                      )}

                      <motion.button
                        type="submit"
                        className="submit-button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <FaSpinner className="spinner" />
                        ) : (
                          isArabic ? 'إنشاء حساب عميل' : 'Create Client Account'
                        )}
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>

              <motion.div 
                className="switch-mode"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                dir={isArabic ? 'rtl' : 'ltr'}
              >
                <p>
                  {mode === 'login' 
                    ? (isArabic ? 'ليس لديك حساب؟' : 'Don\'t have an account?')
                    : (isArabic ? 'لديك حساب بالفعل؟' : 'Already have an account?')
                  }
                  <button onClick={switchMode} disabled={isSubmitting}>
                    {mode === 'login' 
                      ? (isArabic ? 'سجل الآن' : 'Register Now')
                      : (isArabic ? 'سجل دخول' : 'Login')
                    }
                  </button>
                </p>
              </motion.div>
            </div>
          </div>

          <motion.button
            className="close-button"
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            disabled={isSubmitting}
            aria-label={isArabic ? 'إغلاق' : 'Close'}
          >
            ✕
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Auth;