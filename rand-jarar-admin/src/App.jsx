import React, { lazy, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Login from './pages/Login/Login';
import apiClient from './api/apiClient';
import './App.scss';

// Pages are code-split so the login screen doesn't download the whole panel
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const LogoBranding = lazy(() => import('./pages/Content/LogoBranding'));
const HeroSection = lazy(() => import('./pages/Content/HeroSection'));
const Certifications = lazy(() => import('./pages/Content/Certifications'));
const AboutCoach = lazy(() => import('./pages/Content/AboutCoach'));
const Testimonials = lazy(() => import('./pages/Content/Testimonials'));
const FooterManagement = lazy(() => import('./pages/Content/Footer/FooterManagement'));
const FAQ = lazy(() => import('./pages/Content/FAQ'));
const ClientsList = lazy(() => import('./pages/Training/ClientsList/ClientsList'));
const ClientDetails = lazy(() => import('./pages/Training/ClientDetails/ClientDetails'));
const ChatList = lazy(() => import('./pages/Chat/ChatList/ChatList'));
const ChatRoom = lazy(() => import('./pages/Chat/ChatRoom/ChatRoom'));
const PayPalSubscriptions = lazy(() => import('./pages/Subscriptions/PayPalSubscriptions'));
const BankTransferSubscriptions = lazy(() => import('./pages/Subscriptions/BankTransferSubscriptions'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const ExerciseLibrary = lazy(() => import('./pages/Training/ExerciseLibrary/ExerciseLibrary'));
const AllUsersList = lazy(() => import('./pages/Training/AllUsersList/AllUsersList'));
const AdminPlans = lazy(() => import('./pages/Subscriptions/AdminPlans'));
const Coupons = lazy(() => import('./pages/Subscriptions/Coupons/Coupons'));
const SiteColors = lazy(() => import('./pages/Content/SiteColors/SiteColors'));

/**
 * Registers the device for OneSignal push once the admin is signed in
 * (also right after a fresh login, not only on page reload).
 */
const PushRegistration = () => {
  const { isAuthenticated } = useAuth();
  const oneSignalRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    if (!oneSignalRef.current) {
      oneSignalRef.current = import('react-onesignal').then(({ default: OneSignal }) =>
        OneSignal.init({
          appId: import.meta.env.VITE_ONESIGNAL_APP_ID,
          notifyButton: { enable: false },
          allowLocalhostAsSecureOrigin: false,
        }).then(() => OneSignal)
      );
    }

    oneSignalRef.current
      .then((OneSignal) =>
        OneSignal.Notifications.requestPermission().then(() => {
          OneSignal.User.PushSubscription.optIn();
          const playerId = OneSignal.User.PushSubscription.id;
          if (playerId) {
            apiClient.post('/fcm-token', { onesignal_id: playerId });
          }
        })
      )
      .catch((error) => console.error('OneSignal error:', error));
  }, [isAuthenticated]);

  return null;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PushRegistration />
        <NotificationProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="content">
                  <Route index element={<Navigate to="logo" replace />} />
                  <Route path="logo" element={<LogoBranding />} />
                  <Route path="hero" element={<HeroSection />} />
                  <Route path="certifications" element={<Certifications />} />
                  <Route path="AboutCoach" element={<AboutCoach />} />
                  <Route path="testimonials" element={<Testimonials />} />
                  <Route path="faq" element={<FAQ />} />
                  <Route path="footer" element={<FooterManagement />} />
                </Route>
                <Route path="training">
                  <Route index element={<Navigate to="clients" replace />} />
                  <Route path="clients" element={<ClientsList />} />
                  <Route path="client/:clientId" element={<ClientDetails />} />
                  <Route path="exercise-library" element={<ExerciseLibrary />} />
                  <Route path="all-users" element={<AllUsersList />} />
                </Route>
                <Route path="chat">
                  <Route index element={<ChatList />} />
                  <Route path=":clientId" element={<ChatRoom />} />
                </Route>
                <Route path="BankTransferSubscriptions" element={<BankTransferSubscriptions />} />
                <Route path="PayPalSubscriptions" element={<PayPalSubscriptions />} />
                <Route path="plans" element={<AdminPlans />} />
                <Route path="coupons" element={<Coupons />} />
                <Route path="site-colors" element={<SiteColors />} />
                <Route path="settings">
                  <Route index element={<Navigate to="profile" replace />} />
                  <Route path="profile" element={<Profile />} />
                </Route>
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
