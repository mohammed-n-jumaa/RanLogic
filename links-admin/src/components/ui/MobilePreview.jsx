import useLinkProfileStore from '@/store/useLinkProfileStore'
import useLinkStore from '@/store/useLinkStore'
import useLinkThemeStore from '@/store/useLinkThemeStore'
import { getThemeById } from '@/utils/themes'
import { PROFILE_SOCIAL_ICONS, SOCIAL_ICONS } from '@/utils/socialIcons'
import { Link2 } from 'lucide-react'
import styles from './MobilePreview.module.css'

const OverlayDecor = ({ type, accent }) => {
  if (!type) return null
  return (
    <div className={`${styles.overlayDecor} ${styles[`decor_${type}`]}`} aria-hidden="true">
      {type === 'sparks' && Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className={styles.spark} style={{
          left: `${10 + i * 11}%`,
          top:  `${15 + (i % 3) * 25}%`,
          background: accent,
          animationDelay: `${i * 0.3}s`,
        }} />
      ))}
      {type === 'pulseLines' && Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className={styles.pulseLine} style={{
          top: `${15 + i * 17}%`,
          background: `linear-gradient(90deg, transparent, ${accent}44, transparent)`,
          animationDelay: `${i * 0.6}s`,
        }} />
      ))}
      {type === 'rainDropsV2' && Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className={styles.rainDrop}
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${0.6 + Math.random() * 0.4}s`,
            animationDelay: `${Math.random() * 2}s`,
            opacity: 0.2 + Math.random() * 0.5
          }}
        />
      ))}
      {type === 'snowDrops' && Array.from({ length: 40 }).map((_, i) => {
        const size = `${2 + Math.random() * 4}px`
        return (
          <div
            key={i}
            className={styles.snowFlake}
            style={{
              left: `${Math.random() * 100}%`,
              width: size,
              height: size,
              animationDuration: `${3 + Math.random() * 3}s`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.4 + Math.random() * 0.5
            }}
          />
        )
      })}
    </div>
  )
}

const AvatarWithFx = ({ theme, profile }) => {
  const initials = (profile.name || 'U')
    .split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

  const ringClass = theme.avatarFx === 'ironPulse' ? styles.ironRing
    : theme.avatarFx === 'voltPulse'               ? styles.voltRing
    : theme.avatarFx === 'firePulse'               ? styles.fireRing
    : theme.avatarFx === 'glitch'                  ? styles.glitchRing
    : styles.avatarRing

  const avatarBg = theme.style === 'glass'
    ? 'rgba(255,255,255,0.12)'
    : theme.style === 'sport' || theme.style === 'gradient'
      ? `linear-gradient(135deg,${theme.accent}44,${theme.accent}22)`
      : theme.accent

  const avatarColor = (theme.style === 'sport' || theme.style === 'gradient' || theme.style === 'glass')
    ? theme.accent
    : theme.bg

  return (
    <div className={styles.avatarWrap}>
      <div className={ringClass} style={{ borderColor: theme.accent + '66' }} />
      {theme.avatarFx && (
        <div className={styles.avatarGlow} style={{ background: theme.accent + '33' }} />
      )}
      {profile.avatar
        ? <img src={profile.avatar} alt={profile.name} className={styles.avatar} />
        : (
          <div
            className={`${styles.avatarFallback} ${theme.avatarFx === 'glitch' ? styles.glitchText : ''}`}
            style={{
              background: avatarBg,
              color: avatarColor,
              border: `2px solid ${theme.accent}55`,
            }}
          >
            {initials}
          </div>
        )
      }
    </div>
  )
}

const LinkCard = ({ link, theme, compact }) => {
  const IconComp = SOCIAL_ICONS[link.icon]?.component || Link2
  const cardSt = theme.cardStyle || {
    background: theme.card,
    border: `1px solid ${theme.accent}33`,
  }
  const animCls = theme.cardAnimClass ? styles[theme.cardAnimClass] : ''

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer"
      className={`${styles.linkCard} ${animCls}`}
      style={{
        ...cardSt,
        color: theme.text,
        fontFamily: `'${link.title_font || link.titleFont || 'DM Sans'}', sans-serif`,
        textDecoration: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {theme.id === 'iron-mode' && <div className={styles.metalSweep} />}
      {theme.id === 'fire-gradient' && (
        <div className={styles.fireBar} style={{
          background: `linear-gradient(90deg,${theme.accent},${theme.accent2})`,
        }} />
      )}
      <span className={styles.linkCardIcon} style={{ background: theme.accent + '22', color: theme.accent }}>
        <IconComp size={compact ? 12 : 16} />
      </span>
      <span className={styles.linkCardTitle}>{link.title}</span>
      <span className={styles.linkCardArrow} style={{ color: theme.accent + '88' }}>›</span>
    </a>
  )
}

const MobilePreview = ({ compact = false }) => {
  const { profile }    = useLinkProfileStore()
  const { links }      = useLinkStore()
  const { activeTheme } = useLinkThemeStore()

  const theme  = getThemeById(activeTheme)
  const active = links.filter((l) => l.active).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  const filledSocials = Object.entries(PROFILE_SOCIAL_ICONS)
    .filter(([key]) => profile[key] && profile[key].trim() !== '')
    .map(([key, meta]) => ({ key, ...meta, url: profile[key] }))

  const iconSize   = compact ? 11 : 15
  const screenAnim = theme.animClass ? styles[theme.animClass] : ''
  const nameGlitch = theme.avatarFx === 'glitch' ? styles.glitchText : ''

  return (
    <div className={`${styles.phoneWrap} ${compact ? styles.compact : ''}`}>
      <div className={styles.phone}>
        <div className={styles.notch} />

        <div
          className={`${styles.screen} ${screenAnim}`}
          style={theme.bgStyle || { background: theme.bg }}
        >
          {theme.id === 'rainy-night' && (
            <div className={styles.nightSky} aria-hidden="true">
              <div className={styles.miniMoon} />
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className={styles.star} style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 40}%`,
                  animationDelay: `${Math.random() * 3}s`
                }} />
              ))}
            </div>
          )}

          {(theme.style === 'gradient' || theme.style === 'glass') && (
            <div className={styles.decorBlobs} aria-hidden="true">
              <div className={styles.blob1} style={{ background: theme.accent + '33' }} />
              <div className={styles.blob2} style={{ background: (theme.accent2 || theme.accent) + '1a' }} />
            </div>
          )}

          <OverlayDecor type={theme.overlayDecor} accent={theme.accent} />

          <div className={styles.content}>
            <AvatarWithFx theme={theme} profile={profile} compact={compact} />

            <p
              className={`${styles.name} ${nameGlitch}`}
              style={{
                fontFamily: `'${profile.name_font || profile.nameFont || 'Syne'}', sans-serif`,
                color: theme.text,
                textShadow: theme.style !== 'solid' ? '0 1px 10px rgba(0,0,0,0.5)' : 'none',
              }}
            >
              {profile.name || 'Your Name'}
            </p>

            <p
              className={styles.bio}
              style={{
                fontFamily: `'${profile.bio_font || profile.bioFont || 'DM Sans'}', sans-serif`,
                color: theme.text + 'aa',
              }}
            >
              {profile.bio || 'Your bio goes here'}
            </p>

            {filledSocials.length > 0 && (
              <div className={`${styles.socialCircles} ${theme.avatarFx === 'voltPulse' ? styles.socialBounce : ''}`}>
                {filledSocials.map(({ key, icon: Icon, color, url, label }) => (
                  <a
                    key={key} href={url} target="_blank" rel="noreferrer"
                    className={styles.socialCircle} title={label}
                    style={{ background: color + '22', border: `1.5px solid ${color}55`, color }}
                  >
                    <Icon size={iconSize} />
                  </a>
                ))}
              </div>
            )}

            <div className={styles.linkCards}>
              {active.map((link) => (
                <LinkCard key={link.id} link={link} theme={theme} compact={compact} />
              ))}
              {active.length === 0 && (
                <p className={styles.emptyMsg} style={{ color: theme.text + '44' }}>
                  No active links yet
                </p>
              )}
            </div>
          </div>
        </div>

        <div className={styles.homeBar} />
      </div>
    </div>
  )
}

export default MobilePreview