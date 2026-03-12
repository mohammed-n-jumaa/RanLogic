import React from 'react';
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

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Route - Login */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes - Admin Only - Wrapped in Layout */}
            <Route
              path="/"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Layout />
                </ProtectedRoute>
              }
            >
              {/* Dashboard - Default Route */}
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* Content Management Routes */}
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
              
              {/* Training Routes */}
              <Route path="training">
                <Route index element={<Navigate to="clients" replace />} />
                <Route path="clients" element={<ClientsList />} />
                <Route path="client/:clientId" element={<ClientDetails />} />
              </Route>

              {/* Chat Routes */}
              <Route path="chat">
                <Route index element={<ChatList />} />
                <Route path=":clientId" element={<ChatRoom />} />
              </Route>

              {/* Subscriptions Route */}
              <Route path="BankTransferSubscriptions" element={<BankTransferSubscriptions />} />
              <Route path="PayPalSubscriptions" element={<PayPalSubscriptions />} />

              {/* Settings Routes */}
              <Route path="settings">
                <Route index element={<Navigate to="profile" replace />} />
                <Route path="profile" element={<Profile />} />
              </Route>
              
              {/* Catch-all redirect to dashboard */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;