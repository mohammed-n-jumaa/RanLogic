import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import ProtectedRoute from '@/components/layout/ProtectedRoute'
import PublicProfile from '@/pages/PublicProfile'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Profile from '@/pages/Profile'
import Links from '@/pages/Links'
import Themes from '@/pages/Themes'
import Analytics from '@/pages/Analytics'
import Preview from '@/pages/Preview'
import useAuthStore from '@/store/useAuthStore'

const App = () => {
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicProfile />} />
        <Route path="/admin/login" element={<Login />} />
        
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="links" element={<Links />} />
            <Route path="themes" element={<Themes />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="preview" element={<Preview />} />
          </Route>
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App