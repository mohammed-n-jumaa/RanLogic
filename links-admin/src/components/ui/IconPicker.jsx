import { useState } from 'react'
import { Link2 } from 'lucide-react'
import { SOCIAL_ICONS, ICON_GROUPS } from '@/utils/socialIcons'
import styles from './IconPicker.module.css'

const IconPicker = ({ value = 'globe', onChange }) => {
  const [open, setOpen] = useState(false)

  const CurrentIcon = SOCIAL_ICONS[value]?.component || Link2
  const currentLabel = SOCIAL_ICONS[value]?.label || 'Link'

  return (
    <div className={styles.wrap}>
      {/* Trigger */}
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((p) => !p)}
        title="Choose icon"
      >
        <CurrentIcon size={16} />
        <span className={styles.triggerLabel}>{currentLabel}</span>
        <span className={styles.triggerArrow}>▾</span>
      </button>

      {/* Modal overlay + grid */}
      {open && (
        <>
          <div className={styles.overlay} onClick={() => setOpen(false)} />
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>Choose Icon</span>
              <button className={styles.closeBtn} onClick={() => setOpen(false)}>✕</button>
            </div>
            <div className={styles.panelBody}>
              {ICON_GROUPS.map((group) => (
                <div key={group.label} className={styles.group}>
                  <p className={styles.groupLabel}>{group.label}</p>
                  <div className={styles.iconGrid}>
                    {group.keys.map((key) => {
                      const { component: Icon, label } = SOCIAL_ICONS[key]
                      return (
                        <button
                          key={key}
                          type="button"
                          title={label}
                          className={`${styles.iconBtn} ${value === key ? styles.selectedIcon : ''}`}
                          onClick={() => { onChange(key); setOpen(false) }}
                        >
                          <Icon size={18} />
                          <span className={styles.iconLabel}>{label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default IconPicker
