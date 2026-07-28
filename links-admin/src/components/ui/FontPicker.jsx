import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Type } from 'lucide-react'
import { FONT_GROUPS } from '@/utils/fonts'
import styles from './FontPicker.module.css'

const FontPicker = ({ value = 'DM Sans', onChange, previewText = 'Aa' }) => {
  const [open, setOpen]       = useState(false)
  const [search, setSearch]   = useState('')
  const containerRef          = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filteredGroups = search.trim()
    ? [{ label: 'Results', fonts: FONT_GROUPS.flatMap((g) => g.fonts).filter((f) =>
        f.label.toLowerCase().includes(search.toLowerCase())
      )}]
    : FONT_GROUPS

  return (
    <div className={styles.wrap} ref={containerRef}>
      {/* Trigger button */}
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((p) => !p)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Type size={14} className={styles.typeIcon} />
        <span className={styles.triggerText} style={{ fontFamily: `'${value}', sans-serif` }}>
          {value}
        </span>
        <ChevronDown size={14} className={`${styles.chevron} ${open ? styles.open : ''}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className={styles.dropdown} role="listbox">
          {/* Search */}
          <div className={styles.searchWrap}>
            <input
              className={styles.searchInput}
              placeholder="Search fonts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>

          <div className={styles.list}>
            {filteredGroups.map((group) =>
              group.fonts.length === 0 ? null : (
                <div key={group.label}>
                  <p className={styles.groupLabel}>{group.label}</p>
                  {group.fonts.map((font) => (
                    <button
                      key={font.name}
                      type="button"
                      role="option"
                      aria-selected={value === font.name}
                      className={`${styles.fontOption} ${value === font.name ? styles.selected : ''}`}
                      onClick={() => { onChange(font.name); setOpen(false); setSearch('') }}
                    >
                      {/* Font name in its own typeface */}
                      <span
                        className={styles.fontPreview}
                        style={{ fontFamily: `'${font.name}', sans-serif` }}
                      >
                        {previewText} — {font.label}
                      </span>
                      {value === font.name && (
                        <span className={styles.checkmark}>✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )
            )}
            {filteredGroups.every((g) => g.fonts.length === 0) && (
              <p className={styles.noResult}>No fonts found</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default FontPicker
