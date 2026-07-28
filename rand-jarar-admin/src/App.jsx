import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import LogoBranding from './pages/Content/LogoBranding';
import HeroSection from './pages/Content/HeroSection';
import Certifications from './pages/Content/Certifications';
import AboutCoach from './pages/Content/AboutCoach';
import Testimonials from './pages/Content/Testimonials';
import FooterManagement from './pages/Content/Footer/FooterManagement';
import FAQ from './pages/Content/FAQ';
import ClientsList from './pages/Training/ClientsList/ClientsList';
import ClientDetails from './pages/Training/ClientDetails/ClientDetails';
import ChatList from './pages/Chat/ChatList/ChatList';
import ChatRoom from './pages/Chat/ChatRoom/ChatRoom';
import PayPalSubscriptions from './pages/Subscriptions/PayPalSubscriptions';
import BankTransferSubscriptions from './pages/Subscriptions/BankTransferSubscriptions';
import Profile from './pages/Profile/Profile';
import authApi from './api/authApi';
import './App.scss';
import ExerciseLibrary from './pages/Training/ExerciseLibrary/ExerciseLibrary';
import AllUsersList from './pages/Training/AllUsersList/AllUsersList';
import AdminPlans from './pages/Subscriptions/AdminPlans';

function App() {

  useEffect(() => {
    import('react-onesignal').then(({ default: OneSignal }) => {
      OneSignal.init({
        appId: import.meta.env.VITE_ONESIGNAL_APP_ID,
        notifyButton: { enable: false },
        allowLocalhostAsSecureOrigin: false,
      }).then(() => {
        if (authApi.isAuthenticated()) {
          OneSignal.Notifications.requestPermission().then(() => {
            OneSignal.User.PushSubscription.optIn();
            const playerId = OneSignal.User.PushSubscription.id;
            if (playerId) {
              import('./api/apiClient.js').then(({ default: apiClient }) => {
                apiClient.post('/fcm-token', { onesignal_id: playerId });
              });
            }
          });
        }
      });
    });
  }, []);

  return (
    <ThemeProvider>
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

              <Route path="settings">
                <Route index element={<Navigate to="profile" replace />} />
                <Route path="profile" element={<Profile />} />
              </Route>
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;