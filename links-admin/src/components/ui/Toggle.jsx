import styles from './Toggle.module.css'

const Toggle = ({ checked, onChange, label, size = 'md', disabled = false }) => (
  <label className={`${styles.wrap} ${styles[size]} ${disabled ? styles.disabled : ''}`}>
    <input
      type="checkbox"
      className={styles.input}
      checked={checked}
      onChange={(e) => !disabled && onChange(e.target.checked)}
      disabled={disabled}
    />
    {/* Track + thumb rendered as siblings to the hidden input */}
    <span className={`${styles.track} ${checked ? styles.trackOn : ''}`}>
      <span className={`${styles.thumb} ${checked ? styles.thumbOn : ''}`} />
    </span>
    {label && <span className={styles.label}>{label}</span>}
  </label>
)

export default Toggle
