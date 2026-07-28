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
import './styles/global.scss';
import { trackPageView } from './utils/analytics.loader.js';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy.jsx';
import TermsOfService from './pages/TermsOfService/TermsOfService';
import RefundPolicy from './pages/RefundPolicy/RefundPolicy';
import ContactPage from './pages/ContactPage/ContactPage';
import CalorieCalculatorPage from './pages/CalorieCalculatorPage';
import MealCalculatorPage from './pages/MealCalculatorPage.jsx';
import authApi from './api/authApi.js';


const IS_PRODUCTION =
  import.meta.env?.PROD === true &&
  typeof window !== 'undefined' &&
  window.location.hostname !== 'localhost' &&
  !window.location.hostname.includes('127.0.0.1') &&
  window.location.port !== '4173';

function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    if (typeof trackPageView === 'function') {
      trackPageView(location.pathname + location.search);
    }
  }, [location]);

  return null;
}

function App() {
  const [loading, setLoading]       = useState(false);
const [showLoader, setShowLoader] = useState(false);
const [appVisible, setAppVisible] = useState(true);
const [isFirstVisit, setIsFirstVisit] = useState(false);
  useEffect(() => {
  import('react-onesignal').then(({ default: OneSignal }) => {
    OneSignal.init({
      appId: import.meta.env.VITE_ONESIGNAL_APP_ID,
      safari_web_id: 'web.onesignal.auto.212e621b-efc2-4b2a-9d36-9f4cd158ecec',
      notifyButton: { enable: false },
      allowLocalhostAsSecureOrigin: false,
    }).then(() => {
      if (authApi.isAuthenticated()) {
        OneSignal.Notifications.requestPermission().then(() => {
  OneSignal.User.PushSubscription.optIn();

  setTimeout(() => {
    const playerId = OneSignal.User.PushSubscription.id;
    if (playerId && authApi.isAuthenticated()) {
      import('./api/index.js').then(({ default: api }) => {
        api.post('/fcm-token', { onesignal_id: playerId })
          .then(() => localStorage.setItem('onesignal_id', playerId))
          .catch(console.error);
      });
    }
  }, 2000);
});
      }
    });
  });
}, []);
  // useEffect(() => {
  //   const preloadGif = new Image();
  //   preloadGif.src = '/fitness.gif';

  //   let timer;
  //   const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');

  //   if (!hasVisitedBefore) {
  //     setIsFirstVisit(true);
  //     timer = setTimeout(() => {
  //       setLoading(false);
  //       localStorage.setItem('hasVisitedBefore', 'true');
  //     }, 7000);
  //   } else {
  //     const hasVisitedThisSession = sessionStorage.getItem('hasVisitedThisSession');
  //     if (!hasVisitedThisSession) {
  //       timer = setTimeout(() => {
  //         setLoading(false);
  //         sessionStorage.setItem('hasVisitedThisSession', 'true');
  //       }, 3000);
  //     } else {
  //       setLoading(false);
  //     }
  //   }

  //   return () => { if (timer) clearTimeout(timer); };
  // }, []);
 

  useEffect(() => {
    if (!loading) {
      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => {
          setAppVisible(true);
          setTimeout(() => setShowLoader(false), 500);
          return () => cancelAnimationFrame(raf2);
        });
      });
      return () => cancelAnimationFrame(raf1);
    }
  }, [loading]);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        if (IS_PRODUCTION) {
          initAnalytics();
          initPerformanceMonitoring();
        } else {
          console.log('📊 Performance monitoring disabled in development');
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const message = isFirstVisit
    ? 'Welcome to RanLogic — Your Fitness & Nutrition Team'
    : 'Welcome back to RanLogic';

  return (
    <>
      <div className={`app-shell ${appVisible ? 'app-shell--visible' : ''}`}>
        <LanguageProvider>
          <InactivityProvider timeoutMinutes={30} warningMinutes={5}>
            <Router>
              <RouteTracker />
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/calorie-calculator" element={<CalorieCalculatorPage />} />
                  <Route path="/meal-calculator" element={<MealCalculatorPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/refund-policy" element={<RefundPolicy />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/payment/success" element={<SubscriptionSuccess />} />
                  <Route path="/payment/cancel" element={<SubscriptionCancel />} />

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

                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </AnimatePresence>
            </Router>
          </InactivityProvider>
        </LanguageProvider>
      </div>

      {showLoader && (
        <div className={`loader-overlay ${!loading ? 'loader-overlay--hide' : ''}`}>
          <LoadingSpinner message={message} />
        </div>
      )}
    </>
  );
}

export default App;