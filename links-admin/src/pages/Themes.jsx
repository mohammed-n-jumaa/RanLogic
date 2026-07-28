import { useState, useEffect } from 'react'
import useLinkThemeStore from '@/store/useLinkThemeStore'

import { THEMES } from '@/utils/themes'
import { Check, Palette, Zap, Sparkles } from 'lucide-react'
import linkThemeApi from '@/api/linkThemeApi'
import styles from './Themes.module.css'

const STYLE_META = {
  gradient: { label: 'Animated', icon: '✦', color: '#a78bfa' },
  sport:    { label: 'Sport',    icon: '⚡', color: '#facc15' },
  glass:    { label: 'Glass',    icon: '◈', color: '#67e8f9' },
  solid:    { label: 'Clean',    icon: '◻', color: '#94a3b8' },
  pattern:  { label: 'Pattern',  icon: '▦', color: '#fb923c' },
}

const ThemePreviewMini = ({ theme }) => {
  const screenAnimCls = theme.animClass ? styles[theme.animClass] : ''
  return (
    <div
      className={`${styles.previewScreen} ${screenAnimCls}`}
      style={theme.bgStyle || { background: theme.bg }}
    >
      {(theme.style === 'gradient' || theme.style === 'glass') && (
        <>
          <div className={styles.miniBlob1} style={{ background: theme.accent + '40' }} />
          <div className={styles.miniBlob2} style={{ background: (theme.accent2 || theme.accent) + '25' }} />
        </>
      )}

      {theme.overlayDecor === 'scanlines' && <div className={styles.miniScanlines} />}
      {theme.overlayDecor === 'grid' && <div className={styles.miniGrid} />}
      {theme.overlayDecor === 'pulseLines' && (
        <div className={styles.miniPulseWrap}>
          {[0,1,2].map(i => (
            <div key={i} className={styles.miniPulseLine}
              style={{ top: `${20 + i * 25}%`, background: `linear-gradient(90deg,transparent,${theme.accent}55,transparent)`, animationDelay: `${i * 0.5}s` }} />
          ))}
        </div>
      )}

      <div className={styles.miniContent}>
        <div className={styles.miniAvatarWrap}>
          {theme.avatarFx && (
            <div className={styles.miniAvatarGlow} style={{ background: theme.accent + '55' }} />
          )}
          <div className={styles.miniAvatar} style={{ background: theme.accent + '44', borderColor: theme.accent + '77' }}>
            <div className={styles.miniAvatarInner} style={{ background: theme.accent }} />
          </div>
        </div>

        <div className={styles.miniName} style={{ background: theme.text + '99', width: '52%' }} />
        <div className={styles.miniBio}  style={{ background: theme.text + '55', width: '38%' }} />

        {[90, 80, 72].map((w, i) => {
          const cs = theme.cardStyle || {}
          return (
            <div key={i} className={styles.miniLink}
              style={{ ...cs, width: `${w}%`, position: 'relative', overflow: 'hidden' }}
            >
              {theme.id === 'fire-gradient' && (
                <div className={styles.miniFireBar}
                  style={{ background: `linear-gradient(90deg,${theme.accent},${theme.accent2})` }} />
              )}
              {theme.id === 'iron-mode' && <div className={styles.miniSweep} />}
              <span className={styles.miniLinkDot} style={{ background: theme.accent }} />
              <span className={styles.miniLinkBar} style={{ background: theme.text + '66' }} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

const ThemeCard = ({ theme, isActive, onSelect, saving }) => {
  const [hovered, setHovered] = useState(false)
  const meta = STYLE_META[theme.style] || STYLE_META.solid

  return (
    <button
      className={`${styles.card} ${isActive ? styles.cardActive : ''}`}
      onClick={() => onSelect(theme.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-pressed={isActive}
      disabled={saving}
      style={{ '--card-accent': theme.accent }}
    >
      <div className={styles.cardPreview}>
        <ThemePreviewMini theme={theme} />

        <div className={styles.styleBadge}
          style={{ color: meta.color, borderColor: meta.color + '44', background: meta.color + '18' }}
        >
          <span>{meta.icon}</span><span>{meta.label}</span>
        </div>

        <div className={`${styles.cardOverlay} ${hovered || isActive ? styles.overlayVisible : ''}`}>
          {isActive
            ? <span className={styles.overlayActive} style={{ background: theme.accent, color: '#111' }}>
                <Check size={13} strokeWidth={3} /> Applied
              </span>
            : <span className={styles.overlayApply}><Zap size={12} /> Apply</span>
          }
        </div>
      </div>

      <div className={styles.cardFooter}>
        <span className={styles.cardAccentDot} style={{ background: theme.accent }} />
        <span className={styles.cardName}>{theme.name}</span>
        {isActive && (
          <span className={styles.cardCheckBadge} style={{ background: theme.accent }}>
            <Check size={9} strokeWidth={3} />
          </span>
        )}
      </div>
    </button>
  )
}

const Themes = () => {
  const { activeTheme, setActiveTheme } = useLinkThemeStore()
  const [justApplied, setJustApplied] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState(null)

  useEffect(() => {
    linkThemeApi.get()
      .then(res => {
        if (res.data?.data?.theme_id) {
          setActiveTheme(res.data.data.theme_id)
        }
      })
      .catch(() => {})
  }, [setActiveTheme])

  const handleSelect = async (id) => {
    if (saving || id === activeTheme) return

    setActiveTheme(id)
    setSaving(true)
    setError(null)

    try {
      await linkThemeApi.update(id)
      setJustApplied(id)
      setTimeout(() => setJustApplied(null), 2000)
    } catch {
      setError('Failed to save theme. Please try again.')
      setTimeout(() => setError(null), 3000)
    } finally {
      setSaving(false)
    }
  }

  const activeData = THEMES.find(t => t.id === activeTheme)
  const sportCount = THEMES.filter(t => t.style === 'sport').length
  const animCount  = THEMES.filter(t => t.style === 'gradient').length

  return (
    <div className={styles.page}>

      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}><Palette size={20} /></div>
          <div>
            <h1 className={styles.pageTitle}>Themes</h1>
            <p className={styles.pageSubtitle}>
              {animCount} animated · {sportCount} sport · {THEMES.length} total
            </p>
          </div>
        </div>
        {activeData && (
          <div className={styles.currentBadge}>
            <span className={styles.currentDot} style={{ background: activeData.accent }} />
            <span className={styles.currentLabel}>Active:</span>
            <span className={styles.currentName}>{activeData.name}</span>
            {saving && <span className={styles.currentLabel}>· Saving…</span>}
          </div>
        )}
      </div>

      <div className={styles.legend}>
        {Object.entries(STYLE_META).map(([k, v]) => (
          <span key={k} className={styles.legendItem} style={{ color: v.color }}>
            {v.icon} {v.label}
          </span>
        ))}
      </div>

      <div className={styles.grid}>
        {THEMES.map(t => (
          <ThemeCard
            key={t.id}
            theme={t}
            isActive={activeTheme === t.id}
            onSelect={handleSelect}
            saving={saving}
          />
        ))}
      </div>

      <div className={`${styles.toast} ${justApplied ? styles.toastVisible : ''}`}>
        <Sparkles size={13} />
        Theme applied! Open Preview to see it live.
      </div>

      {error && (
        <div className={`${styles.toast} ${styles.toastVisible}`} style={{ background: '#ef4444' }}>
          {error}
        </div>
      )}
    </div>
  )
}

export default Themes