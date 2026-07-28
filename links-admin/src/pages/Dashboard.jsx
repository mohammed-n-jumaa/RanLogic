import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link2, MousePointerClick, Flame, Eye, ArrowRight, TrendingUp, Loader } from 'lucide-react'
import useLinkDashboardStore from '@/store/useLinkDashboardStore'
import useLinkProfileStore from '@/store/useLinkProfileStore'
import StatCard from '@/components/ui/StatCard'
import styles from './Dashboard.module.css'

const Dashboard = () => {
  const navigate = useNavigate()

  const { stats, links, isLoading, fetch } = useLinkDashboardStore()
  const { profile } = useLinkProfileStore()

  useEffect(() => { fetch() }, [])

  const initials = (profile.name || 'A')
    .split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

  if (isLoading && !stats) {
    return (
      <div className={styles.page} style={{ alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
        <Loader size={28} style={{ animation: 'spin 1s linear infinite', color: 'var(--accent)' }} />
      </div>
    )
  }

  return (
    <div className={styles.page}>

      {/* ── Profile Hero Card ── */}
      <div className={styles.hero}>
        <div className={styles.heroLeft}>
          {profile.avatar
            ? <img src={profile.avatar} alt={profile.name} className={styles.heroAvatar} />
            : <div className={styles.heroAvatarFallback}>{initials}</div>
          }
          <div>
            <h2 className={styles.heroName}>{profile.name || 'Admin'}</h2>
            <p className={styles.heroBio}>{profile.bio || ''}</p>
          </div>
        </div>
        <div className={styles.heroActions}>
          <button className={styles.btnAccent} onClick={() => navigate('/preview')}>
            <Eye size={15} /> Preview Page
          </button>
          <button className={styles.btnGhost} onClick={() => navigate('/profile')}>
            Edit Profile <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className={styles.statsGrid}>
        <StatCard
          icon={Link2}
          iconColor="#6366f1"
          label="Total Links"
          value={stats?.totalLinks ?? 0}
          sub={`${stats?.activeLinks ?? 0} active`}
        />
        <StatCard
          icon={MousePointerClick}
          iconColor="#f59e0b"
          label="Today's Clicks"
          value={stats?.todayClicks ?? 0}
          sub="last 24 hours"
        />
        <StatCard
          icon={TrendingUp}
          iconColor="#22c55e"
          label="Total Clicks"
          value={(stats?.totalClicks ?? 0).toLocaleString()}
          sub="all time"
        />
        <StatCard
          icon={Flame}
          iconColor="#ef4444"
          label="Top Link"
          value={stats?.topLinkClicks ?? 0}
          sub={stats?.topLinkTitle ?? '—'}
          accent
        />
      </div>

      {/* ── Quick Actions ── */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Quick Actions</h3>
        <div className={styles.actionsGrid}>
          {[
            { label: 'Add New Link',   path: '/links',     emoji: '🔗' },
            { label: 'Change Theme',   path: '/themes',    emoji: '🎨' },
            { label: 'View Analytics', path: '/analytics', emoji: '📊' },
            { label: 'Edit Profile',   path: '/profile',   emoji: '👤' },
          ].map(({ label, path, emoji }) => (
            <button
              key={path}
              className={styles.actionCard}
              onClick={() => navigate(path)}
            >
              <span className={styles.actionEmoji}>{emoji}</span>
              <span className={styles.actionLabel}>{label}</span>
              <ArrowRight size={14} className={styles.actionArrow} />
            </button>
          ))}
        </div>
      </section>

      {/* ── Recent Links ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Recent Links</h3>
          <button className={styles.seeAll} onClick={() => navigate('/links')}>
            See all <ArrowRight size={13} />
          </button>
        </div>
        <div className={styles.linksList}>
          {links.slice(0, 4).map((link) => (
            <div key={link.id} className={styles.linkRow}>
              <div className={styles.linkInfo}>
                <span className={`${styles.linkDot} ${link.active ? styles.dotActive : ''}`} />
                <div>
                  <p className={styles.linkTitle}>{link.title}</p>
                  <p className={styles.linkUrl}>{link.url}</p>
                </div>
              </div>
              <span className={styles.linkClicks}>{link.clicks ?? 0} clicks</span>
            </div>
          ))}
          {links.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: 13, padding: '16px 0' }}>
              No links yet.
            </p>
          )}
        </div>
      </section>

    </div>
  )
}

export default Dashboard