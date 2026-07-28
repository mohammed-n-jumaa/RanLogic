import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Sun, Moon, ChevronDown, LogOut, ExternalLink, Loader } from 'lucide-react'
import useStore from '@/store/useStore'
import useAuthStore from '@/store/useAuthStore'
import useLinkProfileStore from '@/store/useLinkProfileStore'
import styles from './Header.module.css'

const PAGE_TITLES = {
  '/admin':           'Dashboard',
  '/admin/profile':   'Profile Settings',
  '/admin/links':     'Links Management',
  '/admin/themes':    'Themes',
  '/admin/analytics': 'Analytics',
  '/admin/preview':   'Preview',
}

const Header = () => {
  const location  = useLocation()
  const navigate  = useNavigate()
  const { darkMode, toggleDarkMode } = useStore()
  const { logout, isLoading }        = useAuthStore()
  const { profile }                  = useLinkProfileStore()

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const pageTitle = PAGE_TITLES[location.pathname] || 'Admin'
  const initials  = (profile.name || 'A')
    .split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

  const handleLogout = async () => {
    if (isLoggingOut) return
    setDropdownOpen(false)
    setIsLoggingOut(true)
    await logout()
    setIsLoggingOut(false)
    navigate('/admin/login', { replace: true })
  }

  const handleViewPublic = () => {
    setDropdownOpen(false)
    window.open('/', '_blank')
  }

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1 className={styles.pageTitle}>{pageTitle}</h1>
      </div>

      <div className={styles.right}>
        <button
          className={styles.iconBtn}
          onClick={handleViewPublic}
          aria-label="View public profile"
          title="View public profile"
        >
          <ExternalLink size={16} />
        </button>

        <button
          className={styles.iconBtn}
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
          title={darkMode ? 'Switch to light' : 'Switch to dark'}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className={styles.userMenu}>
          <button
            className={styles.userBtn}
            onClick={() => setDropdownOpen((p) => !p)}
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
            disabled={isLoading || isLoggingOut}
          >
            {profile.avatar
              ? <img src={profile.avatar} alt={profile.name} className={styles.avatar} />
              : <span className={styles.avatarFallback}>{initials}</span>
            }
            <span className={styles.userName}>{(profile.name || 'Admin').split(' ')[0]}</span>
            <ChevronDown
              size={14}
              className={`${styles.chevron} ${dropdownOpen ? styles.open : ''}`}
            />
          </button>

          {dropdownOpen && (
            <>
              <div className={styles.overlay} onClick={() => setDropdownOpen(false)} />
              <div className={styles.dropdown} role="menu">
                <div className={styles.dropdownHeader}>
                  <p className={styles.dropdownName}>{profile.name || 'Admin'}</p>
                  <p className={styles.dropdownBio}>{profile.bio || 'Administrator'}</p>
                </div>
                <div className={styles.dropdownDivider} />
                <button
                  className={styles.dropdownItem}
                  role="menuitem"
                  onClick={handleViewPublic}
                >
                  <ExternalLink size={14} /> View Public Profile
                </button>
                <button
                  className={`${styles.dropdownItem} ${styles.danger}`}
                  role="menuitem"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? (
                    <>
                      <Loader size={14} className={styles.spinner} /> Signing Out...
                    </>
                  ) : (
                    <>
                      <LogOut size={14} /> Sign Out
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header