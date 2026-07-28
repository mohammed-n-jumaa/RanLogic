import { useEffect } from 'react'
import { BarChart3, TrendingUp, ExternalLink, Filter, Loader, Share2 } from 'lucide-react'
import { Instagram, Youtube, Twitter, Facebook, Github, Linkedin } from 'lucide-react'
import useLinkAnalyticsStore from '@/store/useLinkAnalyticsStore'
import styles from './Analytics.module.css'

const FILTERS = [
  { id: 'today', label: 'Today' },
  { id: 'week',  label: 'Week'  },
  { id: 'month', label: 'Month' },
]

// أيقونات السوشيال
const PLATFORM_ICONS = {
  instagram: Instagram,
  youtube:   Youtube,
  twitter:   Twitter,
  facebook:  Facebook,
  github:    Github,
  linkedin:  Linkedin,
}

const PLATFORM_COLORS = {
  instagram: '#e1306c',
  youtube:   '#ff0000',
  twitter:   '#1da1f2',
  facebook:  '#1877f2',
  github:    '#333',
  linkedin:  '#0077b5',
  tiktok:    '#010101',
  telegram:  '#0088cc',
  whatsapp:  '#25d366',
  discord:   '#5865f2',
  twitch:    '#9146ff',
  snapchat:  '#fffc00',
  pinterest: '#e60023',
  website:   '#6366f1',
  podcast:   '#8b5cf6',
}

const Analytics = () => {
  const { summary, links, socials, period, isLoading, error, fetchAll, setPeriod } =
    useLinkAnalyticsStore()

  useEffect(() => { fetchAll() }, [])

  const totalClicks       = summary?.total_clicks        ?? 0
  const totalSocialClicks = summary?.total_social_clicks ?? 0
  const topLink           = summary?.top_link            ?? '—'
  const activeLinks       = summary?.active_links        ?? 0

  const maxClicks       = links[0]?.period_clicks   || 1
  const maxSocialClicks = socials[0]?.clicks        || 1
  const topLinks        = links.slice(0, 5)

  if (isLoading) {
    return (
      <div className={styles.page} style={{ alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
        <Loader size={28} style={{ animation: 'spin 1s linear infinite', color: 'var(--accent)' }} />
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.page}>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '48px 0' }}>{error}</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>

      {/* ── Summary cards ── */}
      <div className={styles.summaryRow}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}><BarChart3 size={20} /></div>
          <div>
            <p className={styles.summaryValue}>{totalClicks.toLocaleString()}</p>
            <p className={styles.summaryLabel}>Link Clicks</p>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}><Share2 size={20} /></div>
          <div>
            <p className={styles.summaryValue}>{totalSocialClicks.toLocaleString()}</p>
            <p className={styles.summaryLabel}>Social Clicks</p>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}><TrendingUp size={20} /></div>
          <div>
            <p className={styles.summaryValue}>{topLink}</p>
            <p className={styles.summaryLabel}>Top Performing</p>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}><ExternalLink size={20} /></div>
          <div>
            <p className={styles.summaryValue}>{activeLinks}</p>
            <p className={styles.summaryLabel}>Active Links</p>
          </div>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className={styles.filterBar}>
        <div className={styles.filterLeft}>
          <Filter size={14} />
          <span>Showing:</span>
        </div>
        <div className={styles.filterBtns}>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              className={`${styles.filterBtn} ${period === f.id ? styles.active : ''}`}
              onClick={() => setPeriod(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {/* ── Top Links ── */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>🔥 Top Links</h2>
          <div className={styles.topList}>
            {topLinks.map((link, i) => (
              <div key={link.id} className={styles.topItem}>
                <div className={styles.topRank}>#{i + 1}</div>
                <div className={styles.topInfo}>
                  <div className={styles.topName}>{link.title}</div>
                  <div className={styles.barWrap}>
                    <div
                      className={styles.bar}
                      style={{ width: `${(link.period_clicks / maxClicks) * 100}%` }}
                    />
                  </div>
                </div>
                <div className={styles.topClicks}>{link.period_clicks.toLocaleString()}</div>
              </div>
            ))}
            {topLinks.length === 0 && (
              <p className={styles.empty}>No links yet.</p>
            )}
          </div>
        </section>

        {/* ── Social Media Analytics ── */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>📱 Social Media Clicks</h2>
          <div className={styles.topList}>
            {socials.map((s) => {
              const Icon  = PLATFORM_ICONS[s.platform]
              const color = PLATFORM_COLORS[s.platform] ?? 'var(--accent)'
              return (
                <div key={s.platform} className={styles.topItem}>
                  <div
                    className={styles.topRank}
                    style={{ background: `${color}22`, color, borderRadius: 8, padding: '4px 6px' }}
                  >
                    {Icon ? <Icon size={16} /> : s.platform[0].toUpperCase()}
                  </div>
                  <div className={styles.topInfo}>
                    <div className={styles.topName} style={{ textTransform: 'capitalize' }}>
                      {s.platform}
                    </div>
                    <div className={styles.barWrap}>
                      <div
                        className={styles.bar}
                        style={{
                          width: `${(s.clicks / maxSocialClicks) * 100}%`,
                          background: color,
                        }}
                      />
                    </div>
                  </div>
                  <div className={styles.topClicks}>{s.clicks.toLocaleString()}</div>
                </div>
              )
            })}
            {socials.length === 0 && (
              <p className={styles.empty}>No social clicks yet.</p>
            )}
          </div>
        </section>
      </div>

      {/* ── All Links Table ── */}
      <section className={styles.card} style={{ marginTop: 20 }}>
        <h2 className={styles.cardTitle}>📋 All Links</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Link Name</th>
                <th>Status</th>
                <th className={styles.right}>Clicks</th>
                <th className={styles.right}>Share</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => {
                const share = totalClicks > 0
                  ? ((link.period_clicks / totalClicks) * 100).toFixed(1)
                  : '0.0'
                return (
                  <tr key={link.id}>
                    <td>
                      <div className={styles.linkCell}>
                        <span className={styles.linkTitle}>{link.title}</span>
                        <span className={styles.linkUrl}>{link.url}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${link.is_active ? styles.badgeOn : styles.badgeOff}`}>
                        {link.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className={styles.right}>
                      <strong>{link.period_clicks.toLocaleString()}</strong>
                    </td>
                    <td className={styles.right}>
                      <span className={styles.share}>{share}%</span>
                    </td>
                  </tr>
                )
              })}
              {links.length === 0 && (
                <tr>
                  <td colSpan={4} className={styles.emptyRow}>No data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  )
}

export default Analytics