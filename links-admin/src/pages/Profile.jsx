import { useEffect, useRef, useState } from 'react'
import { Upload, X, ChevronDown, ChevronUp } from 'lucide-react'
import useLinkProfileStore              from '@/store/useLinkProfileStore'
import useAutoSave                      from '@/hooks/useAutoSave'
import FontPicker                       from '@/components/ui/FontPicker'
import MobilePreview                    from '@/components/ui/MobilePreview'
import { PROFILE_SOCIAL_ICONS }         from '@/utils/socialIcons'
import styles                           from './Profile.module.css'

const XIcon = ({ size = 16, color = "currentColor" }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    fill={color}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.741-8.855L1.254 2.25H8.08l4.259 5.631L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const SOCIAL_ORDER = [
  { key: 'instagram', tier: 1 },
  { key: 'tiktok',    tier: 1 },
  { key: 'youtube',   tier: 1 },
  { key: 'twitter',   tier: 1 },
  { key: 'linkedin',  tier: 2 },
  { key: 'facebook',  tier: 2 },
  { key: 'github',    tier: 2 },
  { key: 'twitch',    tier: 2 },
  { key: 'telegram',  tier: 2 },
  { key: 'whatsapp',  tier: 2 },
  { key: 'discord',   tier: 2 },
  { key: 'snapchat',  tier: 2 },
  { key: 'pinterest', tier: 2 },
  { key: 'website',   tier: 2 },
  { key: 'podcast',   tier: 2 },
]

const Profile = () => {
  const { profile, isLoading, isSaving, fetch, updateField, save, uploadPhoto, deletePhoto } =
    useLinkProfileStore()

  const fileInputRef = useRef(null)
  const [showMore, setShowMore] = useState(false)

  useEffect(() => { fetch() }, [])

  useAutoSave(profile, save)

  const handleChange = (key) => (e) => updateField({ [key]: e.target.value })

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { alert('Image must be under 2MB'); return }
    await uploadPhoto(file)
    e.target.value = ''
  }

  const handleRemoveAvatar = async () => { await deletePhoto() }

  const initials = (profile.name || 'U')
    .split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

  const tier1       = SOCIAL_ORDER.filter((s) => s.tier === 1)
  const tier2       = SOCIAL_ORDER.filter((s) => s.tier === 2)
  const filledTier2 = tier2.filter((s) => profile[s.key]).length

  if (isLoading) return <div className={styles.page} style={{ alignItems: 'center', justifyContent: 'center' }}>Loading...</div>

  return (
    <div className={styles.page}>

      <div className={styles.formCol}>

        <section className={styles.card}>
          <h3 className={styles.cardTitle}>Profile Photo</h3>
          <div className={styles.avatarSection}>
            <div className={styles.avatarPreview}>
              {profile.avatar
                ? <img src={profile.avatar} alt="avatar" className={styles.avatarImg} />
                : <span className={styles.avatarInitials}>{initials}</span>
              }
              {profile.avatar && (
                <button className={styles.removeAvatar} onClick={handleRemoveAvatar} disabled={isSaving}>
                  <X size={11} />
                </button>
              )}
            </div>
            <div>
              <button className={styles.uploadBtn} onClick={() => fileInputRef.current?.click()} disabled={isSaving}>
                <Upload size={14} /> Upload Photo
              </button>
              <p className={styles.uploadHint}>JPG, PNG or GIF · Max 2MB</p>
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*"
            style={{ display: 'none' }} onChange={handleAvatarChange} />
        </section>

        <section className={styles.card}>
          <h3 className={styles.cardTitle}>Basic Info</h3>

          <div className={styles.fieldGroup}>
            <div className={styles.labelRow}>
              <label className={styles.label}>Display Name</label>
              <span className={styles.charCount}>{(profile.name || '').length}/60</span>
            </div>
            <input
              className={styles.input}
              value={profile.name || ''}
              onChange={handleChange('name')}
              placeholder="Your name"
              maxLength={60}
              style={{ fontFamily: `'${profile.name_font || 'Syne'}', sans-serif` }}
            />
            <div className={styles.fontRow}>
              <span className={styles.fontLabel}>🔤 Font</span>
              <FontPicker
                value={profile.name_font || 'Syne'}
                onChange={(f) => updateField({ name_font: f })}
                previewText={profile.name || 'Your Name'}
              />
            </div>
          </div>

          <div className={styles.fieldGroup} style={{ marginBottom: 0 }}>
            <div className={styles.labelRow}>
              <label className={styles.label}>Bio / Description</label>
              <span className={styles.charCount}>{(profile.bio || '').length}/160</span>
            </div>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              value={profile.bio || ''}
              onChange={handleChange('bio')}
              placeholder="Short description about you..."
              maxLength={160}
              rows={3}
              style={{ fontFamily: `'${profile.bio_font || 'DM Sans'}', sans-serif` }}
            />
            <div className={styles.fontRow}>
              <span className={styles.fontLabel}>🔤 Font</span>
              <FontPicker
                value={profile.bio_font || 'DM Sans'}
                onChange={(f) => updateField({ bio_font: f })}
                previewText={profile.bio || 'Your bio'}
              />
            </div>
          </div>
        </section>

        <section className={styles.card}>
          <h3 className={styles.cardTitle}>Social Platforms</h3>
          <p className={styles.cardSub}>
            أضف رابطك في أي منصة — ستظهر تلقائياً كـ <strong>دوائر</strong> أسفل اسمك في المعاينة
          </p>

          <div className={styles.socialList}>
            {tier1.map(({ key }) => {
              const isTwitter = key === 'twitter'
              const meta = isTwitter 
                ? { ...PROFILE_SOCIAL_ICONS[key], icon: XIcon, color: '#ffffff', bgColor: '#000000' }
                : PROFILE_SOCIAL_ICONS[key]
              
              return (
                <SocialPlatformRow
                  key={key}
                  platformKey={key}
                  meta={meta}
                  value={profile[key] || ''}
                  onChange={handleChange(key)}
                  isTwitter={isTwitter}
                />
              )
            })}

            <button className={styles.showMoreBtn} onClick={() => setShowMore((p) => !p)}>
              {showMore
                ? <><ChevronUp size={14} /> Show fewer</>
                : <>
                    <ChevronDown size={14} />
                    {tier2.length} more platforms
                    {filledTier2 > 0 && (
                      <span className={styles.filledBadge}>{filledTier2} filled</span>
                    )}
                  </>
              }
            </button>

            {showMore && tier2.map(({ key }) => {
              const isTwitter = key === 'twitter'
              const meta = isTwitter 
                ? { ...PROFILE_SOCIAL_ICONS[key], icon: XIcon, color: '#ffffff', bgColor: '#000000' }
                : PROFILE_SOCIAL_ICONS[key]
              
              return (
                <SocialPlatformRow
                  key={key}
                  platformKey={key}
                  meta={meta}
                  value={profile[key] || ''}
                  onChange={handleChange(key)}
                  isTwitter={isTwitter}
                />
              )
            })}
          </div>
        </section>

      </div>

      <div className={styles.previewCol}>
        <div className={styles.previewSticky}>
          <div className={styles.previewHeader}>
            <span className={styles.liveBadge}>● Live Preview</span>
            <span className={styles.previewHint}>Updates as you type</span>
          </div>
          <MobilePreview compact />
        </div>
      </div>

    </div>
  )
}

const SocialPlatformRow = ({ platformKey, meta, value, onChange, isTwitter }) => {
  const { icon: Icon, label, color, bgColor } = meta
  const isFilled = value && value.trim() !== ''

  return (
    <div className={styles.socialRow}>
      <div
        className={styles.socialIcon}
        style={isTwitter ? {
          background: bgColor || '#000000',
          border: '1px solid #333333',
          color: color || '#ffffff',
        } : {
          background: color + '18',
          border: `1px solid ${color}40`,
          color: color,
        }}
      >
        <Icon size={16} />
      </div>

      <div className={styles.socialInputWrap}>
        <div className={styles.socialLabelRow}>
          <span className={styles.socialLabel}>{label}</span>
          {isFilled && (
            <span className={styles.activeIndicator}>
              <span className={styles.activeDot} />
              سيظهر كدائرة
            </span>
          )}
        </div>
        <input
          className={styles.input}
          value={value}
          onChange={onChange}
          placeholder={`https://${platformKey}.com/username`}
          type="url"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  )
}

export default Profile