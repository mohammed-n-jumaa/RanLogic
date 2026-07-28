import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, User, Link2, Palette,
  BarChart3, Smartphone, ChevronRight, X, Menu,
} from 'lucide-react'
import styles from './Sidebar.module.css'

// ── Nav items config ──────────────────────
const NAV_ITEMS = [
  { to: '/admin',          icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/admin/profile',   icon: User,            label: 'Profile'    },
  { to: '/admin/links',     icon: Link2,           label: 'Links'      },
  { to: '/admin/themes',    icon: Palette,         label: 'Themes'     },
  { to: '/admin/analytics', icon: BarChart3,       label: 'Analytics'  },
  { to: '/admin/preview',   icon: Smartphone,      label: 'Preview'    },
]

const Sidebar = () => {
  const navigate  = useNavigate()
  const location  = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => { setOpen(false) }, [location.pathname])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <button
        className={styles.hamburger}
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
      >
        <Menu size={22} />
      </button>

      {open && (
        <div
          className={styles.backdrop}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>

        <button
          className={styles.closeBtn}
          onClick={() => setOpen(false)}
          aria-label="Close navigation"
        >
          <X size={18} />
        </button>

        {/* ── Logo ── */}
        <button className={styles.logo} onClick={() => navigate('/admin')} aria-label="Go to dashboard">
          <span className={styles.logoIcon}>L</span>
          <span className={styles.logoText}>LinkAdmin</span>
        </button>

        {/* ── Navigation ── */}
        <nav className={styles.nav} aria-label="Main navigation">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin'}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <Icon size={18} className={styles.navIcon} />
              <span className={styles.navLabel}>{label}</span>
              <ChevronRight size={14} className={styles.navArrow} />
            </NavLink>
          ))}
        </nav>

        {/* ── Footer badge ── */}
        <div className={styles.sidebarFooter}>
          <span className={styles.version}>v1.0.0</span>
        </div>
      </aside>
    </>
  )
}

export default Sidebar