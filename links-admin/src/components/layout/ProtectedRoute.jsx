import { Navigate, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useAuthStore from '@/store/useAuthStore'

const ProtectedRoute = () => {
  const { isAuthenticated, checkAuth, isLoading } = useAuthStore()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth()
      setIsChecking(false)
    }
    verifyAuth()
  }, [checkAuth])

  if (isChecking || isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    )
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />
}

export default ProtectedRoute