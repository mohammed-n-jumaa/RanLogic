import { useEffect, useMemo, useState } from 'react'
import { Link2, Loader } from 'lucide-react'
import linkPublicApi from '@/api/linkPublicApi'
import { getThemeById } from '@/utils/themes'
import { PROFILE_SOCIAL_ICONS, SOCIAL_ICONS } from '@/utils/socialIcons'
import styles from './PublicProfile.module.css'

// ─────────────────────────────────────────
// Overlay decorations (identical to original)
// ─────────────────────────────────────────

const OverlayDecor = ({ type, accent }) => {
  const rainDrops = useMemo(
    () => Array.from({ length: 40 }, () => ({
      left: `${Math.random() * 100}%`,
      dur: `${0.55 + Math.random() * 0.45}s`,
      del: `${Math.random() * 2}s`,
      op: 0.2 + Math.random() * 0.5,
    })),
    []
  )

  const snowFlakes = useMemo(
    () => Array.from({ length: 50 }, () => ({
      left: `${Math.random() * 100}%`,
      size: `${2 + Math.random() * 4}px`,
      dur: `${3 + Math.random() * 3}s`,
      del: `${Math.random() * 5}s`,
      op: 0.4 + Math.random() * 0.5,
    })),
    []
  )

  if (!type) return null

  return (
    <div
      className={`${styles.overlayDecor} ${styles[`decor_${type}`]}`}
      aria-hidden="true"
    >
      {type === 'sparks' && Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className={styles.spark}
          style={{
            left: `${10 + i * 11}%`,
            top: `${15 + (i % 3) * 25}%`,
            background: accent,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}

      {type === 'pulseLines' && Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={styles.pulseLine}
          style={{
            top: `${15 + i * 17}%`,
            background: `linear-gradient(90deg, transparent, ${accent}44, transparent)`,
            animationDelay: `${i * 0.6}s`,
          }}
        />
      ))}

      {type === 'rainDropsV2' && rainDrops.map((d, i) => (
        <div
          key={i}
          className={styles.rainDrop}
          style={{
            left: d.left,
            animationDuration: d.dur,
            animationDelay: d.del,
            opacity: d.op,
          }}
        />
      ))}

      {type === 'snowDrops' && snowFlakes.map((f, i) => (
        <div
          key={i}
          className={styles.snowFlake}
          style={{
            left: f.left,
            width: f.size,
            height: f.size,
            animationDuration: f.dur,
            animationDelay: f.del,
            opacity: f.op,
          }}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────

const ThemedAvatar = ({ theme, profile }) => {
  const initials = (profile.name || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const ringClass =
    theme.avatarFx === 'ironPulse' ? styles.ringIron
      : theme.avatarFx === 'voltPulse' ? styles.ringVolt
        : theme.avatarFx === 'firePulse' ? styles.ringFire
          : theme.avatarFx === 'glitch' ? styles.ringGlitch
            : styles.ringDefault

  const fallbackBg =
    theme.style === 'glass'
      ? 'rgba(255,255,255,0.12)'
      : theme.style === 'sport' || theme.style === 'gradient'
        ? `linear-gradient(135deg,${theme.accent}44,${theme.accent}22)`
        : theme.accent

  const fallbackColor =
    theme.style === 'sport' || theme.style === 'gradient' || theme.style === 'glass'
      ? theme.accent
      : theme.bg

  return (
    <div className={styles.avatarWrap}>
      <div className={ringClass} style={{ borderColor: `${theme.accent}66` }} />
      {theme.avatarFx && (
        <div className={styles.avatarGlow} style={{ background: `${theme.accent}33` }} />
      )}
      {profile.avatar ? (
        <img
          src={profile.avatar}
          alt={profile.name}
          className={styles.avatar}
        />
      ) : (
        <div
          className={`${styles.avatarFallback} ${theme.avatarFx === 'glitch' ? styles.glitchText : ''}`}
          style={{ background: fallbackBg, color: fallbackColor, border: `2px solid ${theme.accent}55` }}
        >
          {initials}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────

const LinkCard = ({ link, theme, onClickRecord }) => {
  const IconComp = SOCIAL_ICONS[link.icon]?.component || Link2
  const cardStyle = theme.cardStyle || {
    background: theme.card,
    border: `1px solid ${theme.accent}33`,
  }
  const animClass = theme.cardAnimClass ? styles[theme.cardAnimClass] : ''

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer noopener"
      className={`${styles.linkCard} ${animClass}`}
      style={{
        ...cardStyle,
        color: theme.text,
        fontFamily: `'${link.title_font || link.titleFont || 'DM Sans'}', sans-serif`,
      }}
      onClick={() => onClickRecord(link.id)}
    >
      {theme.id === 'iron-mode' && <span className={styles.metalSweep} aria-hidden="true" />}
      {theme.id === 'fire-gradient' && (
        <span
          className={styles.fireBar}
          style={{ background: `linear-gradient(90deg,${theme.accent},${theme.accent2 || theme.accent})` }}
          aria-hidden="true"
        />
      )}

      <span
        className={styles.linkIcon}
        style={{ background: `${theme.accent}22`, color: theme.accent }}
      >
        <IconComp size={18} />
      </span>
      <span className={styles.linkTitle}>{link.title}</span>
      <span className={styles.linkArrow} style={{ color: `${theme.accent}88` }}>›</span>
    </a>
  )
}

// ─────────────────────────────────────────
// Main component
// ─────────────────────────────────────────

const PublicProfile = () => {
  const [profile, setProfile] = useState(null)
  const [links, setLinks] = useState([])
  const [themeId, setThemeId] = useState('minimal')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    linkPublicApi.getProfile()
      .then(({ data }) => {
        setProfile(data.data.profile)
        setLinks(data.data.links)
        setThemeId(data.data.profile?.theme_id ?? 'minimal')
      })
      .finally(() => setIsLoading(false))
  }, [])

  const theme = getThemeById(themeId)

  const filledSocials = useMemo(() => {
    if (!profile) return []
    return Object.entries(PROFILE_SOCIAL_ICONS)
      .filter(([key]) => profile[key]?.trim())
      .map(([key, meta]) => ({ key, ...meta, url: profile[key] }))
  }, [profile])

  const handleLinkClick = (id) => {
    linkPublicApi.recordLinkClick(id).catch(() => { })
  }

  const handleSocialClick = (platform) => {
    linkPublicApi.recordSocialClick(platform).catch(() => { })
  }

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'grid', placeItems: 'center',
        background: '#0f0f0f',
      }}>
        <Loader size={28} style={{ animation: 'spin 1s linear infinite', color: '#a78bfa' }} />
      </div>
    )
  }

  if (!profile) {
    return (
      <div style={{
        minHeight: '100vh', display: 'grid', placeItems: 'center',
        background: '#0f0f0f', color: '#666', fontSize: 14,
      }}>
        Profile not found.
      </div>
    )
  }

  const screenAnimClass = theme.animClass ? styles[theme.animClass] : ''
  const nameGlitchClass = theme.avatarFx === 'glitch' ? styles.glitchText : ''
  const socialBounceClass = theme.avatarFx === 'voltPulse' ? styles.socialBounce : ''

  return (
    <div
      className={`${styles.root} ${screenAnimClass}`}
      style={theme.bgStyle || { background: theme.bg }}
    >
      {/* ── Rainy / Snowy night sky ── */}
      {(theme.id === 'rainy-night' || theme.id === 'snowy-night') && (
        <div className={styles.nightSky} aria-hidden="true">
          <div className={styles.moon} />
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={styles.star}
              style={{
                left: `${(i * 37 + 11) % 100}%`,
                top: `${(i * 23 + 7) % 45}%`,
                animationDelay: `${(i * 0.4) % 3}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* ── Gradient / glass background blobs ── */}
      {(theme.style === 'gradient' || theme.style === 'glass') && (
        <div className={styles.blobs} aria-hidden="true">
          <div className={styles.blob1} style={{ background: `${theme.accent}33` }} />
          <div className={styles.blob2} style={{ background: `${theme.accent2 || theme.accent}1a` }} />
        </div>
      )}

      {/* ── Overlay effects ── */}
      <OverlayDecor type={theme.overlayDecor} accent={theme.accent} />

      {/* ── Profile content ── */}
      <div className={styles.content}>

        <ThemedAvatar theme={theme} profile={profile} />

        <h1
          className={`${styles.name} ${nameGlitchClass}`}
          style={{
            color: theme.text,
            fontFamily: `'${profile.name_font || 'Syne'}', sans-serif`,
            textShadow: theme.style !== 'solid' ? '0 1px 12px rgba(0,0,0,0.5)' : 'none',
          }}
        >
          {profile.name || 'Your Name'}
        </h1>

        {profile.bio && (
          <p
            className={styles.bio}
            style={{
              color: `${theme.text}aa`,
              fontFamily: `'${profile.bio_font || 'DM Sans'}', sans-serif`,
              fontWeight: '500',
              fontSize: '17px',
              lineHeight: '1.5',
            }}
          >
            {profile.bio}
          </p>
        )}

        {/* ── Social circles ── */}
        {filledSocials.length > 0 && (
          <div className={`${styles.socials} ${socialBounceClass}`}>
            {filledSocials.map(({ key, icon: Icon, color, url, label }) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noreferrer noopener"
                className={styles.socialCircle}
                title={label}
                style={{
                  background: `${color}22`,
                  border: `1.5px solid ${color}55`,
                  color,
                }}
                onClick={() => handleSocialClick(key)}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        )}

        {/* ── Link cards ── */}
        <div className={styles.links}>
          {links.length === 0 ? (
            <p className={styles.emptyMsg} style={{ color: `${theme.text}44` }}>
              No links yet
            </p>
          ) : (
            links.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                theme={theme}
                onClickRecord={handleLinkClick}
              />
            ))
          )}
        </div>

      </div>
    </div>
  )
}

export default PublicProfile