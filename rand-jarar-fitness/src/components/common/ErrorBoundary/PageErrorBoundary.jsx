import { Component } from 'react';

class PageErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          padding: '2rem',
          textAlign: 'center',
          direction: 'rtl',
        }}>
          <div style={{ fontSize: '3rem' }}>⚡</div>
          <h2 style={{ margin: 0, color: '#FDB813', fontSize: '1.4rem' }}>
            حدث خطأ في تحميل هذه الصفحة
          </h2>
          <p style={{ margin: 0, color: '#888', fontSize: '0.95rem' }}>
            لا تقلق — باقي الموقع يعمل بشكل طبيعي
          </p>
          <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
            <button
              onClick={this.handleRetry}
              style={{
                padding: '0.7rem 1.5rem',
                background: '#FDB813',
                color: '#0a0a0a',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontFamily: 'inherit',
              }}
            >
              إعادة المحاولة
            </button>
            <button
              onClick={() => window.location.href = '/'}
              style={{
                padding: '0.7rem 1.5rem',
                background: 'rgba(255,255,255,0.08)',
                color: '#ccc',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '10px',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontFamily: 'inherit',
              }}
            >
              الرئيسية
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default PageErrorBoundary;