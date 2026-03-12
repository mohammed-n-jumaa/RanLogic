import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Dumbbell } from 'lucide-react';
import authApi from '../../api/authApi';
import './Login.scss';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
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
          Object.keys(response.errors).forEach(key => {
            backendErrors[key] = response.errors[key][0];
          });
          setErrors(prev => ({ ...prev, ...backendErrors }));
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

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Side - Brand */}
        <div className="login-brand">
          <div className="brand-content">
            <div className="brand-logo">
              <Dumbbell size={48} />
            </div>
            <h1>Rand Jarar</h1>
            <p className="brand-subtitle">Admin Dashboard</p>
            <p className="brand-description">
              لوحة التحكم الإدارية للمدرب الشخصي
            </p>
            
            {/* Feature Cards */}
            <div className="brand-features">
              <div className="feature-item">
                <div className="feature-icon">👑</div>
                <span>مدير النظام</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔒</div>
                <span>صلاحية كاملة</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">⚙️</div>
                <span>إدارة الموقع</span>
              </div>
            </div>
          </div>
          <div className="brand-decoration">
            <div className="decoration-circle circle-1"></div>
            <div className="decoration-circle circle-2"></div>
            <div className="decoration-circle circle-3"></div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-section">
          <div className="login-form-container">
            <div className="login-header">
              <h2>تسجيل الدخول للإدارة</h2>
              <p>مساحة إدارية حصرية للمدربين والمشرفين</p>
              
              {/* Admin Only Notice */}
              <div className="admin-notice">
                <div className="notice-icon">⚠️</div>
                <p className="notice-text">
                  هذا المسار مخصص فقط للمدربين  
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="login-form" noValidate>
              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email">البريد الإلكتروني الإداري</label>
                <div className={`input-wrapper ${errors.email ? 'error' : ''}`}>
                  <Mail className="input-icon" size={20} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="admin@randjarar.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password">كلمة المرور الإدارية</label>
                <div className={`input-wrapper ${errors.password ? 'error' : ''}`}>
                  <Lock className="input-icon" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="كلمة المرور الإدارية"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    tabIndex="-1"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="submit-error">
                  <div className="error-icon">❌</div>
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
                    <span className="spinner"></span>
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  <>
                    <span className="lock-icon">🔐</span>
                    دخول الإدارة
                  </>
                )}
              </button>

           

        
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;