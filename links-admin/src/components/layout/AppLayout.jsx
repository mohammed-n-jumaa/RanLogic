import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Sidebar from './Sidebar'
import Header from './Header'
import useLinkProfileStore from '@/store/useLinkProfileStore'
import useLinkThemeStore from '@/store/useLinkThemeStore'
import styles from './AppLayout.module.css'

const AppLayout = () => {
  const fetchProfile = useLinkProfileStore((s) => s.fetch)
  const fetchTheme   = useLinkThemeStore((s) => s.fetch)

  useEffect(() => {
    fetchProfile()
    fetchTheme()
  }, [])

  return (
    <div className={styles.layout}>
      <Sidebar />

      <div className={styles.body}>
        <Header />

        <main className={styles.main}>
          <Outlet />
        </main>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background:  'var(--bg-card)',
            color:       'var(--text-primary)',
            border:      '1px solid var(--border)',
            fontFamily:  'var(--font-body)',
            fontSize:    '13px',
            borderRadius:'10px',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
        }}
      />
    </div>
  )
}

export default AppLayout