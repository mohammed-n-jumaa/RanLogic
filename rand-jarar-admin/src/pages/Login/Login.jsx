import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Dumbbell,
  Crown,
  ShieldCheck,
  Settings2,
  ShieldAlert,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import authApi from '../../api/authApi';
import './Login.scss';

// Generates one continuous, perfectly-periodic ECG path so that shifting it
// by exactly half its rendered width creates a seamless infinite scroll.
const buildPulsePath = () => {
  const unit = [
    [0, 50], [24, 50], [36, 50], [46, 50],
    [54, 14], [62, 86], [70, 38], [78, 50],
    [100, 50]
  ];
  const repeats = 16;
  let d = `M0,${unit[0][1]}`;
  for (let r = 0; r < repeats; r++) {
    unit.forEach(([x, y], i) => {
      if (r === 0 && i === 0) return;
      d += ` L${x + r * 100},${y}`;
    });
  }
  return d;
};

const FEATURES = [
  { icon: Crown, label: 'مدير النظام' },
  { icon: ShieldCheck, label: 'صلاحية كاملة' },
  { icon: Settings2, label: 'إدارة الموقع' }
];

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const pulsePath = useMemo(buildPulsePath, []);

  // Check if already authenticated AND is admin
  useEffect(() => {
    if (authApi.isAuthenticated()) {
      const user = authApi.getUser();
      if (user && user.role === 'admin') {
        navigate('/dashboard');
      } else {
        // If authenticated but not admin, clear auth data and show message
        authApi.clearAuthData();
        setErrors({
          submit: 'ليس لديك صلاحية الدخول إلى لوحة التحكم الإدارية'
        });
      }
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }

    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 6) {
      newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear submit error
    if (errors.submit) {
      setErrors((prev) => ({
        ...prev,
        submit: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    // Validate form
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Call login API
      const response = await authApi.login(formData.email, formData.password);

      if (response.success) {
        // Check if user is admin
        const user = response.data.user;
        if (user.role !== 'admin') {
          // User is not admin, clear auth data and show error
          authApi.clearAuthData();
          setErrors({
            submit: 'ليس لديك صلاحية الدخول إلى لوحة التحكم الإدارية. هذا الحساب مخصص للمدربة فقط.'
          });
          setIsLoading(false);
          return;
        }

        // Success - admin user, redirect to dashboard
        console.log('Admin login successful:', response.data);

        // Small delay for better UX
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      } else {
        // Login failed - show error
        setErrors({
          submit: response.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
        });

        // Handle validation errors from backend
        if (response.errors) {
          const backendErrors = {};
          Object.keys(response.errors).forEach((key) => {
            backendErrors[key] = response.errors[key][0];
          });
          setErrors((prev) => ({ ...prev, ...backendErrors }));
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        submit: 'حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowcaseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    e.currentTarget.style.setProperty('--mx', x.toFixed(3));
    e.currentTarget.style.setProperty('--my', y.toFixed(3));
  };

  const handleShowcaseLeave = (e) => {
    e.currentTarget.style.setProperty('--mx', 0);
    e.currentTarget.style.setProperty('--my', 0);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Showcase Side */}
        <div
          className="login-showcase"
          onMouseMove={handleShowcaseMove}
          onMouseLeave={handleShowcaseLeave}
        >
          <div className="showcase-glow" aria-hidden="true">
            <span className="glow-orb orb-a" />
            <span className="glow-orb orb-b" />
            <span className="glow-mesh" />
          </div>

          <div className="showcase-content">
            <div className="logo-mark">
              <span className="logo-ring" aria-hidden="true" />
              <Dumbbell size={30} />
            </div>

            <h1 className="brand-name">Rand Jarar</h1>
            <p className="brand-role">مدربة شخصية معتمدة</p>
            <p className="brand-description">
              لوحة التحكم الإدارية لإدارة العميلات والبرامج التدريبية
            </p>

            <div className="pulse-panel">
              <div className="pulse-status">
                <span className="status-dot" />
                النظام متصل الآن
              </div>
              <div className="pulse-track" aria-hidden="true">
                <svg
                  className="pulse-line pulse-line--glow"
                  viewBox="0 0 1600 100"
                  preserveAspectRatio="none"
                >
                  <path d={pulsePath} />
                </svg>
                <svg
                  className="pulse-line pulse-line--core"
                  viewBox="0 0 1600 100"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ff5d94" />
                      <stop offset="55%" stopColor="#ff8fb5" />
                      <stop offset="100%" stopColor="#9b6bff" />
                    </linearGradient>
                  </defs>
                  <path d={pulsePath} stroke="url(#pulseGradient)" />
                </svg>
              </div>
            </div>

            <div className="feature-grid">
              {FEATURES.map(({ icon: Icon, label }, index) => (
                <div className="feature-item" style={{ '--i': index }} key={label}>
                  <span className="feature-icon">
                    <Icon size={17} />
                  </span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="login-panel">
          <div className="login-card">
            <div className="login-header">
              <h2>تسجيل الدخول للإدارة</h2>
              <p>مساحة إدارية حصرية للمدربين والمشرفين</p>

              <div className="access-notice">
                <ShieldAlert size={18} className="notice-icon" />
                <p className="notice-text">هذا المسار مخصص فقط للمدربين</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="login-form" noValidate>
              {/* Email Field */}
              <div className="form-group">
                <div className={`input-wrapper ${errors.email ? 'error' : ''}`}>
                  <Mail className="input-icon" size={19} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder=" "
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    autoComplete="email"
                  />
                  <label htmlFor="email">البريد الإلكتروني الإداري</label>
                </div>
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              {/* Password Field */}
              <div className="form-group">
                <div className={`input-wrapper ${errors.password ? 'error' : ''}`}>
                  <Lock className="input-icon" size={19} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder=" "
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <label htmlFor="password">كلمة المرور الإدارية</label>
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    tabIndex="-1"
                    aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="submit-error">
                  <AlertCircle size={18} className="error-icon" />
                  <span>{errors.submit}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className={`submit-btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="btn-spinner" />
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  <>
                    <Lock size={17} />
                    دخول الإدارة
                  </>
                )}
              </button>

              <a className="back-link" href="https://ranlogic.com">
                <ArrowLeft size={15} />
                العودة إلى الموقع الرئيسي
              </a>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;