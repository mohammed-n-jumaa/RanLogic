import styles from './StatCard.module.css'

const StatCard = ({ icon: Icon, iconColor, label, value, sub, accent = false }) => (
  <div className={`${styles.card} ${accent ? styles.accent : ''}`}>
    <div className={styles.top}>
      <span className={styles.label}>{label}</span>
      {Icon && (
        <span className={styles.iconWrap} style={{ '--icon-color': iconColor }}>
          <Icon size={16} />
        </span>
      )}
    </div>
    <p className={styles.value}>{value}</p>
    {sub && <p className={styles.sub}>{sub}</p>}
  </div>
)

export default StatCard
