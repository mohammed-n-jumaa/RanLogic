import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { LanguageProvider } from './contexts/LanguageContext';
import { InactivityProvider } from './contexts/InactivityContext';
import Home from './pages/Home';
import FAQPage from './pages/FAQPage';
import AuthPage from './pages/AuthPage.jsx';
import Profile from './Profile/Profile-Clean.jsx';
import Plans from './pages/Plans.jsx';
import SubscriptionSuccess from './pages/SubscriptionSuccess';
import LoadingSpinner from './components/LoadingSpinner';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import SubscriptionCancel from './pages/SubscriptionCancel';
import { initAnalytics } from './utils/analytics.loader';
import { initPerformanceMonitoring } from './utils/performance.utils';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService/TermsOfService';
import RefundPolicy from './pages/RefundPolicy/RefundPolicy';
import ContactPage from './pages/ContactPage/ContactPage';
import CalorieCalculatorPage from './pages/CalorieCalculatorPage';
import './styles/global.scss';


const IS_PRODUCTION = import.meta.env?.PROD === true &&
  typeof window !== 'undefined' &&
  window.location.hostname !== 'localhost' &&
  !window.location.hostname.includes('127.0.0.1') &&
  window.location.port !== '4173';

function RouteTracker() {
  const location = useLocation();

  useEffect(() => {

    if (IS_PRODUCTION) {
      trackPageView(location.pathname + location.search);
    }
  }, [location]);

  return null;
}

function App() {
  const [loading, setLoading] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {

    const preloadGif = new Image();
    preloadGif.src = '/fitness.gif';

    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');

    if (!hasVisitedBefore) {
      setIsFirstVisit(true);
      const timer = setTimeout(() => {
        setLoading(false);
        localStorage.setItem('hasVisitedBefore', 'true');
      }, 9000);

      return () => clearTimeout(timer);
    } else {
      const hasVisitedThisSession = sessionStorage.getItem('hasVisitedThisSession');

      if (!hasVisitedThisSession) {
        const timer = setTimeout(() => {
          setLoading(false);
          sessionStorage.setItem('hasVisitedThisSession', 'true');
        }, 4000);

        return () => clearTimeout(timer);
      } else {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!loading) {

      setTimeout(() => {

        if (IS_PRODUCTION) {

          initAnalytics();


          initPerformanceMonitoring();
        } else {

          console.log('📊 Performance monitoring disabled in development');
        }
      }, 1000);
    }
  }, [loading]);

  useEffect(() => {
    const initPageEffects = () => {
      document.documentElement.style.scrollBehavior = 'smooth';

      const style = document.createElement('style');
      style.textContent = `
        html {
          scroll-behavior: smooth;
        }

        * {
          scroll-margin-top: 80px;
        }

        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(253, 184, 19, 0.05);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #FDB813, #F9A825);
          border-radius: 10px;
          transition: background 0.3s;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #F9A825, #F57F17);
        }

        .cursor-dot {
          width: 8px;
          height: 8px;
          background: #FDB813;
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          transition: transform 0.2s;
        }

        .cursor-ring {
          width: 40px;
          height: 40px;
          border: 2px solid rgba(253, 184, 19, 0.3);
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          z-index: 9998;
          transition: all 0.3s;
        }
      `;
      document.head.appendChild(style);

      if (window.innerWidth > 768) {
        const cursorDot = document.createElement('div');
        cursorDot.className = 'cursor-dot';

        const cursorRing = document.createElement('div');
        cursorRing.className = 'cursor-ring';

        document.body.appendChild(cursorDot);
        document.body.appendChild(cursorRing);

        const moveCursor = (e) => {
          cursorDot.style.left = `${e.clientX}px`;
          cursorDot.style.top = `${e.clientY}px`;

          setTimeout(() => {
            cursorRing.style.left = `${e.clientX}px`;
            cursorRing.style.top = `${e.clientY}px`;
          }, 100);
        };

        document.addEventListener('mousemove', moveCursor);

        const interactiveElements = document.querySelectorAll('button, a, .nav-link');
        interactiveElements.forEach((el) => {
          el.addEventListener('mouseenter', () => {
            cursorDot.style.transform = 'scale(2)';
            cursorRing.style.transform = 'scale(1.5)';
            cursorRing.style.borderColor = '#FDB813';
          });

          el.addEventListener('mouseleave', () => {
            cursorDot.style.transform = 'scale(1)';
            cursorRing.style.transform = 'scale(1)';
            cursorRing.style.borderColor = 'rgba(253, 184, 19, 0.3)';
          });
        });

        return () => {
          document.removeEventListener('mousemove', moveCursor);
          if (cursorDot.parentNode) document.body.removeChild(cursorDot);
          if (cursorRing.parentNode) document.body.removeChild(cursorRing);
          if (style.parentNode) document.head.removeChild(style);
        };
      }

      return () => {
        if (style.parentNode) document.head.removeChild(style);
      };
    };

    if (!loading) {
      return initPageEffects();
    }
  }, [loading]);

  if (loading) {
    const message = isFirstVisit
      ? "Welcome to the world of health and fitness with Rand Jarrar"
      : "Welcome back";

    return <LoadingSpinner message={message} minDuration={isFirstVisit ? 5000 : 3000} />;
  }

  return (
    <LanguageProvider>
      <InactivityProvider
        timeoutMinutes={30}
        warningMinutes={5}
      >
        <Router>
          <RouteTracker />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/auth" element={<AuthPage />} />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/plans"
                element={
                  <ProtectedRoute>
                    <Plans />
                  </ProtectedRoute>
                }
              />
              <Route path="/calorie-calculator" element={<CalorieCalculatorPage />} />
              <Route path="/payment/success" element={<SubscriptionSuccess />} />
              <Route path="/payment/cancel" element={<SubscriptionCancel />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </AnimatePresence>
        </Router>
      </InactivityProvider>
    </LanguageProvider>
  );
}

export default App;