import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { LanguageProvider } from './contexts/LanguageContext';
import { InactivityProvider } from './contexts/InactivityContext';
import Home from './pages/Home';
const FAQPage = lazy(() => import('./pages/FAQPage'));
const AuthPage = lazy(() => import('./pages/AuthPage.jsx'));
const Profile = lazy(() => import('./pages/ProfilePage.jsx'));
const Plans = lazy(() => import('./pages/Plans.jsx'));
const SubscriptionSuccess = lazy(() => import('./pages/SubscriptionSuccess'));
import ProtectedRoute from './features/auth/ProtectedRoute';
const SubscriptionCancel = lazy(() => import('./pages/SubscriptionCancel'));
import { initAnalytics } from './utils/analytics.loader';
import { initPerformanceMonitoring } from './utils/performance.utils';
import './styles/global.scss';
import { trackPageView } from './utils/analytics.loader.js';
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy/PrivacyPolicy.jsx'));
const TermsOfService = lazy(() => import('./pages/TermsOfService/TermsOfService'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy/RefundPolicy'));
const ContactPage = lazy(() => import('./pages/ContactPage/ContactPage'));
const CalorieCalculatorPage = lazy(() => import('./pages/CalorieCalculatorPage'));
const MealCalculatorPage = lazy(() => import('./pages/MealCalculatorPage.jsx'));
import authApi from './api/authApi.js';
import useOneSignal from './hooks/useOneSignal';
import ErrorBoundary from './components/common/ErrorBoundary/ErrorBoundary';
import PageErrorBoundary from './components/common/ErrorBoundary/PageErrorBoundary';
const NotFound = lazy(() => import('./pages/NotFound'));
import useNetworkStatus from './hooks/useNetworkStatus';
import OfflineBanner from './components/common/OfflineBanner/OfflineBanner';

const IS_PRODUCTION =
  import.meta.env?.PROD === true &&
  typeof window !== 'undefined' &&
  window.location.hostname !== 'localhost' &&
  !window.location.hostname.includes('127.0.0.1') &&
  window.location.port !== '4173';

function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    if (typeof trackPageView === 'function') {
      trackPageView(location.pathname + location.search);
    }
  }, [location]);

  return null;
}

function App() {
  
  const [loading, setLoading] = useState(false);
  const [appVisible, setAppVisible] = useState(true);
  const isOnline = useNetworkStatus();
  useOneSignal();

 useEffect(() => {
    if (!loading) {
      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => {
          setAppVisible(true);
        });
        return () => cancelAnimationFrame(raf2);
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

  return (
    <>
      <ErrorBoundary>
      <div className={`app-shell ${appVisible ? 'app-shell--visible' : ''}`}>
        <LanguageProvider>
          <InactivityProvider timeoutMinutes={30} warningMinutes={5}>
            <Router>
              <RouteTracker />
              <AnimatePresence mode="wait">
  <Suspense fallback={null}>
    <Routes>
                  <Route path="/" element={<PageErrorBoundary><Home /></PageErrorBoundary>} />
                  <Route path="/faq" element={<PageErrorBoundary><FAQPage /></PageErrorBoundary>} />
                  <Route path="/auth" element={<PageErrorBoundary><AuthPage /></PageErrorBoundary>} />
                  <Route path="/calorie-calculator" element={<PageErrorBoundary><CalorieCalculatorPage /></PageErrorBoundary>} />
                  <Route path="/meal-calculator" element={<PageErrorBoundary><MealCalculatorPage /></PageErrorBoundary>} />
                  <Route path="/privacy-policy" element={<PageErrorBoundary><PrivacyPolicy /></PageErrorBoundary>} />
                  <Route path="/terms-of-service" element={<PageErrorBoundary><TermsOfService /></PageErrorBoundary>} />
                  <Route path="/refund-policy" element={<PageErrorBoundary><RefundPolicy /></PageErrorBoundary>} />
                  <Route path="/contact" element={<PageErrorBoundary><ContactPage /></PageErrorBoundary>} />
                  <Route path="/payment/success" element={<PageErrorBoundary><SubscriptionSuccess /></PageErrorBoundary>} />
                  <Route path="/payment/cancel" element={<PageErrorBoundary><SubscriptionCancel /></PageErrorBoundary>} />

                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <PageErrorBoundary><Profile /></PageErrorBoundary>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/plans"
                    element={
                      <ProtectedRoute>
                        <PageErrorBoundary><Plans /></PageErrorBoundary>
                      </ProtectedRoute>
                    }
                  />

                  <Route path="*" element={<PageErrorBoundary><NotFound /></PageErrorBoundary>} />
                </Routes>
            </Suspense>
          </AnimatePresence>
            </Router>
          </InactivityProvider>
        </LanguageProvider>
      </div>
      </ErrorBoundary>
      {!isOnline && <OfflineBanner />}
    </>
  );
}

export default App;