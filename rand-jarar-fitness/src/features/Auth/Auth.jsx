import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { useLanguage } from '../../contexts/LanguageContext';
import authApi from '../../api/authApi';
import logoApi from '../../api/logoApi';
import { throttle, createRateLimiter } from '@/utils/debounce';
import './Auth.scss';
import { Loader2, ShieldCheck, CheckCircle, XCircle, Eye, EyeOff, Zap, Flame, Trophy, Users, Star, LineChart, Lock, Shield } from 'lucide-react';

const Auth = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [loginLimiter] = useState(() => createRateLimiter(5, 60000));
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    gender: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: '',
    checks: { length: false, lowercase: false, uppercase: false, number: false, special: false },
  });
  const [logoData, setLogoData] = useState(null);
  const { currentLang, isArabic } = useLanguage();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const formContainerRef = useRef(null);

  // Fetch logo
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await logoApi.getActiveLogo();
        if (response.success && response.data) setLogoData(response.data);
      } catch (err) {
        console.error('Logo fetch error:', err);
      }
    };
    fetchLogo();
  }, []);

  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e) => { if (e.key === 'Escape') onClose(); };
      window.addEventListener('keydown', handleEscape);
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
              iconColor: '#FDB813',
            });
            onClose();
            return;
          }
        }
        setIsCheckingAuth(false);
      }, 300);
      return () => clearTimeout(timeoutId);
    };
    if (isOpen) { const cleanup = checkAdminAccess(); return cleanup; }
    else setIsCheckingAuth(false);
  }, [isOpen, isArabic, onClose]);

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'name':
        if (mode === 'register') {
          if (!value.trim()) error = isArabic ? 'الاسم مطلوب' : 'Name is required';
          else if (value.trim().length < 3) error = isArabic ? 'الاسم يجب أن يكون 3 أحرف على الأقل' : 'Name must be at least 3 characters';
        }
        break;
      case 'email':
        if (!value) error = isArabic ? 'البريد الإلكتروني مطلوب' : 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = isArabic ? 'البريد الإلكتروني غير صحيح' : 'Email is invalid';
        break;
      case 'password':
        if (!value) {
          error = isArabic ? 'كلمة المرور مطلوبة' : 'Password is required';
        } else if (mode === 'register') {
          if (value.length < 8) error = isArabic ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' : 'Password must be at least 8 characters';
          else if (!/(?=.*[a-z])/.test(value)) error = isArabic ? 'يجب أن تحتوي على حرف صغير' : 'Must contain a lowercase letter';
          else if (!/(?=.*[A-Z])/.test(value)) error = isArabic ? 'يجب أن تحتوي على حرف كبير' : 'Must contain an uppercase letter';
          else if (!/(?=.*\d)/.test(value)) error = isArabic ? 'يجب أن تحتوي على رقم' : 'Must contain a number';
          else if (!/(?=.*[@$!%*?&#^()_+=\-\[\]{};:,.<>])/.test(value)) error = isArabic ? 'يجب أن تحتوي على رمز خاص (!@#$%^&*)' : 'Must contain a special character (!@#$%^&*)';
        } else if (value.length < 6) {
          error = isArabic ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters';
        }
        break;
      case 'password_confirmation':
        if (mode === 'register') {
          if (!value) error = isArabic ? 'تأكيد كلمة المرور مطلوب' : 'Password confirmation is required';
          else if (value !== formData.password) error = isArabic ? 'كلمة المرور غير متطابقة' : 'Passwords do not match';
        }
        break;
      default: break;
    }
    return error;
  };

  const checkPasswordStrength = (password) => {
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&#^()_+=\-\[\]{};:,.<>]/.test(password),
    };
    const score = Object.values(checks).filter(Boolean).length;
    let feedback = '';
    if (!password) feedback = '';
    else if (score <= 2) feedback = isArabic ? 'ضعيفة جداً' : 'Very Weak';
    else if (score === 3) feedback = isArabic ? 'ضعيفة' : 'Weak';
    else if (score === 4) feedback = isArabic ? 'متوسطة' : 'Medium';
    else feedback = isArabic ? 'قوية' : 'Strong';
    return { score, feedback, checks };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
    if (name === 'password' && mode === 'register') {
      const strength = checkPasswordStrength(value);
      setPasswordStrength(strength);
      if (strength.score === 5 && errors.password) setErrors((prev) => ({ ...prev, password: '' }));
    }
    if (name === 'password' && formData.password_confirmation) {
      const confirmError = validateField('password_confirmation', formData.password_confirmation);
      setErrors((prev) => ({ ...prev, password_confirmation: confirmError }));
    }
    if (errors.submit) setErrors((prev) => ({ ...prev, submit: '' }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validateForm = () => {
    const newErrors = {};
    const fields = mode === 'login' ? ['email', 'password'] : ['name', 'email', 'password', 'password_confirmation'];
    fields.forEach((f) => { const e = validateField(f, formData[f]); if (e) newErrors[f] = e; });
    setErrors(newErrors);
    const t = {}; fields.forEach((f) => { t[f] = true; }); setTouched(t);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
   if (!loginLimiter.canProceed()) {
      setErrors({ submit: isArabic ? 'محاولات كثيرة — انتظر دقيقة وحاول مرة ثانية' : 'Too many attempts — please wait a minute and try again' });
      return;
    }
    setIsSubmitting(true);
    setErrors({});
    try {
      let response;
      if (mode === 'login') {
        response = await authApi.login(formData.email, formData.password);
      } else {
        response = await authApi.register({ ...formData, language: currentLang });
      }
      if (response.success) {
        const user = response.data.user;
        if (user.role === 'admin') {
          authApi.clearAuthData();
          Swal.fire({
            title: isArabic ? 'عذراً!' : 'Sorry!',
            text: isArabic ? 'هذه البوابة مخصصة للعملاء فقط. المدربون لديهم بوابة دخول منفصلة.' : 'This portal is for clients only. Trainers have a separate login portal.',
            icon: 'warning',
            confirmButtonText: isArabic ? 'حسناً' : 'OK',
            confirmButtonColor: '#FDB813',
            iconColor: '#FDB813',
          });
          onClose();
          setIsSubmitting(false);
          return;
        }
        onClose();
        setTimeout(() => {
          Swal.fire({
            title: isArabic ? (mode === 'login' ? 'مرحباً بعودتك! 💪' : 'مرحباً بك! 🎉') : (mode === 'login' ? 'Welcome Back! 💪' : 'Welcome! 🎉'),
            text: isArabic ? (mode === 'login' ? 'تم تسجيل الدخول بنجاح' : 'تم إنشاء حسابك بنجاح! ابدأ رحلة التحول الآن') : (mode === 'login' ? 'Successfully logged in' : 'Your account is ready! Start your transformation journey'),
            icon: 'success',
            confirmButtonText: isArabic ? 'متابعة' : 'Continue',
            confirmButtonColor: '#FDB813',
            iconColor: '#FDB813',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: true,
          }).then(() => {
            const currentUser = authApi.getUser();
            setTimeout(() => {
              if (currentUser) window.location.href = currentUser.has_active_subscription ? '/profile' : '/plans';
              else window.location.reload();
            }, 500);
          });
        }, 300);
      } else {
        setErrors({ submit: response.message || (isArabic ? 'حدث خطأ. يرجى المحاولة مرة أخرى' : 'An error occurred. Please try again') });
        if (response.errors) {
          const backendErrors = {};
          Object.keys(response.errors).forEach((k) => {
            backendErrors[k] = Array.isArray(response.errors[k]) ? response.errors[k][0] : response.errors[k];
          });
          setErrors((prev) => ({ ...prev, ...backendErrors }));
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setErrors({ submit: isArabic ? 'حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى' : 'Connection error. Please try again' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = () => {
    const newMode = mode === 'login' ? 'register' : 'login';
    setMode(newMode);
    setFormData({ name: '', email: '', password: '', password_confirmation: '', gender: '', phone: '' });
    setErrors({}); setTouched({}); setShowPassword(false); setShowPasswordConfirmation(false); setAgreeTerms(false);
    setPasswordStrength({ score: 0, feedback: '', checks: { length: false, lowercase: false, uppercase: false, number: false, special: false } });
  };

  const handleOverlayClick = (e) => { if (e.target.classList.contains('auth-overlay')) onClose(); };

  const getStrengthClass = () => {
    if (passwordStrength.score <= 2) return 'weak';
    if (passwordStrength.score === 3) return 'fair';
    if (passwordStrength.score === 4) return 'medium';
    return 'strong';
  };

  const loginStats = [
    { icon: <Zap fill="currentColor" />, label: isArabic ? 'هذا الأسبوع' : 'This week', value: isArabic ? '4 جلسات مكتملة' : '4 sessions completed' },
    { icon: <Flame fill="currentColor" />, label: isArabic ? 'الإنجاز الحالي' : 'Current streak', value: isArabic ? '12 يوم متواصل 🔥' : '12 days in a row 🔥' },
    { icon: <Trophy fill="currentColor" />, label: isArabic ? 'الهدف الشهري' : 'Monthly goal', value: isArabic ? 'تحقق 98%' : '98% achieved' },
  ];
  const registerStats = [
    { icon: <Users />, label: isArabic ? 'المجتمع' : 'Community', value: isArabic ? '+200 عميل نشط' : '200+ active clients' },
    { icon: <Star fill="currentColor" />, label: isArabic ? 'الرضا' : 'Satisfaction', value: isArabic ? '4.9 / 5 — 200 تقييم' : '4.9 / 5 — 200 reviews' },
    { icon: <LineChart />, label: isArabic ? 'متوسط النتائج' : 'Avg. result', value: isArabic ? 'ظاهر خلال 8 أسابيع' : 'Visible in 8 weeks' },
  ];
  const stats = mode === 'login' ? loginStats : registerStats;

  // Mini stats for mobile hero
  const mobileLoginStats = [
    { val: '12', lbl: isArabic ? 'يوم متواصل' : 'Day streak' },
    { val: '98%', lbl: isArabic ? 'الهدف' : 'Goal' },
    { val: '4.9', lbl: isArabic ? 'التقييم' : 'Rating' },
  ];
  const mobileRegisterStats = [
    { val: '200+', lbl: isArabic ? 'عميل' : 'Clients' },
    { val: '4.9★', lbl: isArabic ? 'تقييم' : 'Rating' },
    { val: '8w', lbl: isArabic ? 'نتائج' : 'Results' },
  ];
  const mobileStats = mode === 'login' ? mobileLoginStats : mobileRegisterStats;

  if (isCheckingAuth) {
    return (
      <AnimatePresence>
        <motion.div className="auth-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="loading-check">
            <Loader2 className="spinner-large" />
            <p>{isArabic ? 'جاري التحقق...' : 'Checking authentication...'}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (!isOpen) return null;

  const t = {
    loginTitle: isArabic ? 'مرحباً بعودتك' : 'Welcome back',
    loginSub: isArabic ? 'سجّل دخولك لمتابعة رحلتك مع RanLogic Team' : 'Sign in to continue your journey with RanLogic Team',
    registerTitle: isArabic ? 'ابدأ رحلتك' : 'Start your journey',
    registerSub: isArabic ? 'أنشئ حسابك  الآن' : 'Create your free account today',
    loginBtn: isArabic ? 'تسجيل الدخول' : 'Login',
    registerBtn: isArabic ? 'تسجيل' : 'Register',
    clientPortal: isArabic ? 'بوابة العملاء' : 'Client Portal',
    signIn: isArabic ? 'تسجيل الدخول لحسابي' : 'Sign in to my account',
    createAccount: isArabic ? 'إنشاء حساب عميل' : 'Create my client account',
    noAccount: isArabic ? 'ليس لديك حساب؟' : "Don't have an account?",
    createFree: isArabic ? 'أنشئ حساباً ' : 'Create one free',
    alreadyMember: isArabic ? 'لديك حساب بالفعل؟' : 'Already a member?',
    signInInstead: isArabic ? 'سجّل دخولك' : 'Sign in instead',
    ssl: isArabic ? '256-bit SSL' : '256-bit SSL',
    privacy: isArabic ? 'محمي بالكامل' : 'Privacy protected',
    neverShared: isArabic ? 'لا تُشارك أبداً' : 'Never shared',
    terms: isArabic ? 'أوافق على شروط الخدمة وسياسة الخصوصية. أؤكد أنني عميل وليس مدرباً.' : 'I agree to the Terms of Service and Privacy Policy. I confirm I am a client, not a trainer.',
    liveMembers: isArabic ? '+200 عميل نشط' : '200+ active clients',
    joinMembers: isArabic ? 'انضم لأكثر من 200 عضو' : 'Join 200+ members',
    onlineNow: isArabic ? 'متصلون الآن' : 'Online now',
    joinedThisWeek: isArabic ? 'انضموا هذا الأسبوع' : 'Joined this week',
    tagline: isArabic ? 'تحوّلك يبدأ هنا —  RanLogic Team ' : 'Your transformation starts here — RanLogic Team',
    mobileHeroLoginTitle: isArabic ? 'مرحباً بعودتك' : 'Welcome back',
    mobileHeroLoginSub: isArabic ? 'تابع رحلتك مع  RanLogic Team' : 'Continue your journey with RanLogic Team',
    mobileHeroRegisterTitle: isArabic ? 'ابدأ رحلتك' : 'Start your journey',
    mobileHeroRegisterSub: isArabic ? '+200 عضو يثقون بالمدرب RanLogic Team' : '200+ members trust RanLogic Team',
    nameLabel: isArabic ? 'الاسم الكامل' : 'Full name',
    emailLabel: isArabic ? 'البريد الإلكتروني' : 'Email address',
    passwordLabel: isArabic ? 'كلمة المرور' : 'Password',
    confirmPwLabel: isArabic ? 'تأكيد كلمة المرور' : 'Confirm password',
    genderLabel: isArabic ? 'الجنس (اختياري)' : 'Gender (optional)',
    male: isArabic ? 'ذكر' : 'Male',
    female: isArabic ? 'أنثى' : 'Female',
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
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="auth-card" dir={isArabic ? 'rtl' : 'ltr'}>

            {/* ════ LEFT PANEL ════ */}
            <div className="auth-left">
              <div className="auth-left__orb auth-left__orb--1" />
              <div className="auth-left__orb auth-left__orb--2" />
              <div className="auth-left__orb auth-left__orb--3" />

              {/* Top: logo + pill + avatars — always visible */}
              <div className="auth-left__top">
                <div className="auth-left__logo">
                  {logoData ? (
                    <img
                      src={logoData.file_url}
                      alt="RanLogic"
                      className="auth-left__logo-img"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <span className="auth-left__logo-text">Ran<span>Logic</span></span>
                  )}
                </div>

                <div className="auth-left__live-pill">
                  <span className="auth-left__live-dot" />
                  {mode === 'login' ? t.liveMembers : t.joinMembers}
                </div>

                <div className="auth-left__avatars">
                  <div className="av av--g">R</div>
                  <div className="av av--b">S</div>
                  <div className="av av--c">N</div>
                  <div className="av av--more">+8</div>
                  <span className="av-label">
                    {mode === 'login' ? t.onlineNow : t.joinedThisWeek}
                  </span>
                </div>
              </div>

              {/* Mobile-only: hero headline */}
              <div className="auth-left__mobile-headline">
                <h2>{mode === 'login' ? t.mobileHeroLoginTitle : t.mobileHeroRegisterTitle}</h2>
                <p>{mode === 'login' ? t.mobileHeroLoginSub : t.mobileHeroRegisterSub}</p>
              </div>

              {/* Mobile-only: mini stats row */}
              <div className="auth-left__mobile-stats">
                {mobileStats.map((s, i) => (
                  <div className="mini-stat" key={i}>
                    <div className="mini-stat__val">{s.val}</div>
                    <div className="mini-stat__lbl">{s.lbl}</div>
                  </div>
                ))}
              </div>

              {/* Desktop-only: stat cards + footer */}
              <div className="auth-left__bottom">
                <div className="auth-left__stats">
                  {stats.map((s, i) => (
                    <div className="stat-card" key={i}>
                      <div className="stat-card__icon">{s.icon}</div>
                      <div>
                        <div className="stat-card__label">{s.label}</div>
                        <div className="stat-card__value">{s.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="auth-left__footer">
                  {logoData ? (
                    <img
                      src={logoData.file_url}
                      alt="RanLogic"
                      className="auth-left__footer-logo-img"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <span className="auth-left__logo-text auth-left__logo-text--sm">
                      Ran<span>Logic</span>
                    </span>
                  )}
                  <div className="auth-left__footer-tagline">{t.tagline}</div>
                </div>
              </div>
            </div>

            {/* ════ RIGHT PANEL (Bottom Sheet on mobile) ════ */}
            <div className="auth-right" ref={formContainerRef}>
              <div className="auth-right__top">
                <div>
                  <div className="auth-right__client-tag">
                    <ShieldCheck className="auth-right__client-tag-icon" />
                    {t.clientPortal}
                  </div>
                  <h1 className="auth-right__title">
                    {mode === 'login' ? t.loginTitle : t.registerTitle}
                  </h1>
                  <p className="auth-right__sub">
                    {mode === 'login' ? t.loginSub : t.registerSub}
                  </p>
                </div>
                <div className="auth-right__tabs">
                  <button
                    className={`auth-tab ${mode === 'login' ? 'auth-tab--active' : ''}`}
                    onClick={() => mode !== 'login' && switchMode()}
                    type="button"
                  >
                    {t.loginBtn}
                  </button>
                  <button
                    className={`auth-tab ${mode === 'register' ? 'auth-tab--active' : ''}`}
                    onClick={() => mode !== 'register' && switchMode()}
                    type="button"
                  >
                    {t.registerBtn}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {errors.submit && (
                  <motion.div
                    className="auth-error-toast"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    <XCircle />
                    {errors.submit}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} noValidate className="auth-form">
                <AnimatePresence mode="wait">

                  {/* ── LOGIN ── */}
                  {mode === 'login' && (
                    <motion.div
                      key="login"
                      initial={{ opacity: 0, x: isArabic ? -30 : 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isArabic ? 30 : -30 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="ff">
                        <label className="ff__label">{t.emailLabel}</label>
                        <div className={`ff__wrap ${touched.email && errors.email ? 'ff__wrap--error' : ''} ${touched.email && !errors.email && formData.email ? 'ff__wrap--success' : ''}`}>
                          <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} placeholder={t.emailLabel} disabled={isSubmitting} autoComplete="email" />
                          {touched.email && !errors.email && formData.email && <CheckCircle className="ff__sfx ff__sfx--ok" />}
                          {touched.email && errors.email && <XCircle className="ff__sfx ff__sfx--err" />}
                        </div>
                        <AnimatePresence>
                          {touched.email && errors.email && (
                            <motion.span className="ff__error-msg" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                              {errors.email}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="ff">
                        <label className="ff__label">{t.passwordLabel}</label>
                        <div className={`ff__wrap ff__wrap--pw ${touched.password && errors.password ? 'ff__wrap--error' : ''} ${touched.password && !errors.password && formData.password ? 'ff__wrap--success' : ''}`}>
                          <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} onBlur={handleBlur} placeholder={t.passwordLabel} disabled={isSubmitting} autoComplete="current-password" />
                          <button type="button" className="ff__eye" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                            {showPassword ? <EyeOff /> : <Eye />}
                          </button>
                          {touched.password && !errors.password && formData.password && <CheckCircle className="ff__sfx ff__sfx--ok" />}
                          {touched.password && errors.password && <XCircle className="ff__sfx ff__sfx--err" />}
                        </div>
                        <AnimatePresence>
                          {touched.password && errors.password && (
                            <motion.span className="ff__error-msg" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                              {errors.password}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>

                      

                      <motion.button
                        type="submit"
                        className="auth-submit-btn"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? <Loader2 className="auth-spinner" /> : t.signIn}
                      </motion.button>

                      <p className="auth-switch-link">
                        {t.noAccount}{' '}
                        <button type="button" onClick={switchMode} disabled={isSubmitting}>{t.createFree}</button>
                      </p>

                      <div className="auth-trust-row">
                        <span><Lock /> {t.ssl}</span>
                        <span className="auth-trust-dot">·</span>
                        <span><Shield /> {t.privacy}</span>
                        <span className="auth-trust-dot">·</span>
                        <span><EyeOff /> {t.neverShared}</span>
                      </div>
                    </motion.div>
                  )}

                  {/* ── REGISTER ── */}
                  {mode === 'register' && (
                    <motion.div
                      key="register"
                      initial={{ opacity: 0, x: isArabic ? -30 : 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isArabic ? 30 : -30 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="ff">
                        <label className="ff__label">{t.nameLabel}</label>
                        <div className={`ff__wrap ${touched.name && errors.name ? 'ff__wrap--error' : ''} ${touched.name && !errors.name && formData.name ? 'ff__wrap--success' : ''}`}>
                          <input type="text" name="name" value={formData.name} onChange={handleChange} onBlur={handleBlur} placeholder={t.nameLabel} disabled={isSubmitting} autoComplete="name" />
                          {touched.name && !errors.name && formData.name && <CheckCircle className="ff__sfx ff__sfx--ok" />}
                          {touched.name && errors.name && <XCircle className="ff__sfx ff__sfx--err" />}
                        </div>
                        <AnimatePresence>
                          {touched.name && errors.name && (
                            <motion.span className="ff__error-msg" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                              {errors.name}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="ff">
                        <label className="ff__label">{t.emailLabel}</label>
                        <div className={`ff__wrap ${touched.email && errors.email ? 'ff__wrap--error' : ''} ${touched.email && !errors.email && formData.email ? 'ff__wrap--success' : ''}`}>
                          <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} placeholder={t.emailLabel} disabled={isSubmitting} autoComplete="email" />
                          {touched.email && !errors.email && formData.email && <CheckCircle className="ff__sfx ff__sfx--ok" />}
                          {touched.email && errors.email && <XCircle className="ff__sfx ff__sfx--err" />}
                        </div>
                        <AnimatePresence>
                          {touched.email && errors.email && (
                            <motion.span className="ff__error-msg" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                              {errors.email}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="ff">
                        <label className="ff__label">{t.passwordLabel}</label>
                        <div className={`ff__wrap ff__wrap--pw ${touched.password && errors.password ? 'ff__wrap--error' : ''} ${touched.password && !errors.password && formData.password && passwordStrength.score === 5 ? 'ff__wrap--success' : ''}`}>
                          <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} onBlur={handleBlur} placeholder={t.passwordLabel} disabled={isSubmitting} minLength={8} autoComplete="new-password" />
                          <button type="button" className="ff__eye" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                            {showPassword ? <EyeOff /> : <Eye />}
                          </button>
                          {touched.password && !errors.password && formData.password && passwordStrength.score === 5 && <CheckCircle className="ff__sfx ff__sfx--ok" />}
                          {touched.password && errors.password && <XCircle className="ff__sfx ff__sfx--err" />}
                        </div>
                        <AnimatePresence>
                          {touched.password && errors.password && (
                            <motion.span className="ff__error-msg" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                              {errors.password}
                            </motion.span>
                          )}
                        </AnimatePresence>
                        <AnimatePresence>
                          {touched.password && formData.password && (
                            <motion.div className="pw-strength" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                              <div className="pw-strength__bars">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <div key={i} className={`pw-strength__bar ${i <= passwordStrength.score ? `pw-strength__bar--${getStrengthClass()}` : ''}`} />
                                ))}
                                <span className={`pw-strength__label pw-strength__label--${getStrengthClass()}`}>
                                  {passwordStrength.feedback}
                                </span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="ff">
  <label className="ff__label">{t.confirmPwLabel}</label>
  <div className={`ff__wrap ff__wrap--pw ${touched.password_confirmation && errors.password_confirmation ? 'ff__wrap--error' : ''} ${touched.password_confirmation && !errors.password_confirmation && formData.password_confirmation ? 'ff__wrap--success' : ''}`}>
    <input type={showPasswordConfirmation ? 'text' : 'password'} name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} onBlur={handleBlur} placeholder={t.confirmPwLabel} disabled={isSubmitting} minLength={8} autoComplete="new-password" />
    <button type="button" className="ff__eye" onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)} tabIndex={-1}>
      {showPasswordConfirmation ? <EyeOff /> : <Eye />}
    </button>
    {touched.password_confirmation && !errors.password_confirmation && formData.password_confirmation && <CheckCircle className="ff__sfx ff__sfx--ok" />}
    {touched.password_confirmation && errors.password_confirmation && <XCircle className="ff__sfx ff__sfx--err" />}
  </div>
  <AnimatePresence>
    {touched.password_confirmation && errors.password_confirmation && (
      <motion.span className="ff__error-msg" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
        {errors.password_confirmation}
      </motion.span>
    )}
  </AnimatePresence>
</div>

<div className="ff">
  <label className="ff__label">{t.genderLabel}</label>
  <div className="ff__wrap">
    <select name="gender" value={formData.gender} onChange={handleChange} disabled={isSubmitting} className="ff__select">
      <option value="">{t.genderLabel}</option>
      <option value="male">{t.male}</option>
      <option value="female">{t.female}</option>
    </select>
  </div>
</div>

                      <div className="auth-agree">
                        <div
                          className={`auth-checkbox__box ${agreeTerms ? 'auth-checkbox__box--checked' : ''}`}
                          onClick={() => setAgreeTerms(!agreeTerms)}
                          style={{ marginTop: '2px', flexShrink: 0 }}
                        >
                          {agreeTerms && <CheckCircle style={{ fontSize: '9px', color: '#1C1C1C' }} />}
                        </div>
                        <span>{t.terms}</span>
                      </div>

                      <motion.button
                        type="submit"
                        className="auth-submit-btn auth-submit-btn--green"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? <Loader2 className="auth-spinner" /> : t.createAccount}
                      </motion.button>

                      <p className="auth-switch-link">
                        {t.alreadyMember}{' '}
                        <button type="button" onClick={switchMode} disabled={isSubmitting}>{t.signInInstead}</button>
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>

          <motion.button
            className="auth-close-btn"
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