import { Component } from 'react';
import './ErrorBoundary.scss';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught:', error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary__bg">
            <div className="error-boundary__circle error-boundary__circle--1" />
            <div className="error-boundary__circle error-boundary__circle--2" />
            <div className="error-boundary__circle error-boundary__circle--3" />
          </div>

          <div className="error-boundary__content">
            <div className="error-boundary__icon">
              <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="60" cy="60" r="56" stroke="#FDB813" strokeWidth="3" strokeDasharray="8 6" />
                <path d="M60 20C60 20 85 45 85 65C85 78.8 74.8 90 60 90C45.2 90 35 78.8 35 65C35 45 60 20 60 20Z" fill="#FDB813" opacity="0.15"/>
                <path d="M60 30C60 30 80 50 80 65C80 76 71 85 60 85C49 85 40 76 40 65C40 50 60 30 60 30Z" stroke="#FDB813" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M55 58L65 68M65 58L55 68" stroke="#FDB813" strokeWidth="3" strokeLinecap="round"/>
                <path d="M48 78C52 82 56 84 60 84C64 84 68 82 72 78" stroke="#FDB813" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
              </svg>
            </div>

            <div className="error-boundary__badge">
              ⚡ خطأ غير متوقع
            </div>

            <h1 className="error-boundary__title">
              عذراً! حدث خطأ ما
            </h1>

            <p className="error-boundary__subtitle">
              فريقنا يعمل على إصلاح المشكلة. جرّب إعادة تحميل الصفحة
              أو العودة للصفحة الرئيسية.
            </p>

            <div className="error-boundary__stats">
              <div className="error-boundary__stat">
                <span className="error-boundary__stat-icon">🏋️</span>
                <span className="error-boundary__stat-text">التدريبات متاحة</span>
              </div>
              <div className="error-boundary__stat-divider" />
              <div className="error-boundary__stat">
                <span className="error-boundary__stat-icon">🥗</span>
                <span className="error-boundary__stat-text">التغذية متاحة</span>
              </div>
              <div className="error-boundary__stat-divider" />
              <div className="error-boundary__stat">
                <span className="error-boundary__stat-icon">💬</span>
                <span className="error-boundary__stat-text">الدعم متاح</span>
              </div>
            </div>

            <div className="error-boundary__actions">
              <button className="error-boundary__btn error-boundary__btn--primary" onClick={this.handleReload}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 2v6h-6" /><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M3 22v-6h6" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
                </svg>
                إعادة تحميل
              </button>

              <button className="error-boundary__btn error-boundary__btn--secondary" onClick={this.handleGoHome}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                الصفحة الرئيسية
              </button>
            </div>

            <div className="error-boundary__pulse-bar">
              <div className="error-boundary__pulse-dot" />
              <span>النظام يعمل — المشكلة مؤقتة</span>
            </div>
          </div>

          <div className="error-boundary__footer">
            <p>RanLogic Fitness © {new Date().getFullYear()}</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;