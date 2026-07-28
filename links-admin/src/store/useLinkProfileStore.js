import { create } from 'zustand'
import LinkProfileApi from '@/api/linkProfile'

const SOCIAL_KEYS = [
  'instagram', 'tiktok', 'youtube', 'twitter',
  'linkedin', 'facebook', 'github', 'twitch',
  'telegram', 'whatsapp', 'discord', 'snapchat',
  'pinterest', 'website', 'podcast',
]

const DEFAULT_PROFILE = {
  name: '', bio: '', avatar: null,
  name_font: 'Syne', bio_font: 'DM Sans',
  ...Object.fromEntries(SOCIAL_KEYS.map((k) => [k, ''])),
}

// دالة مساعدة لتنظيف البيانات: تحويل null إلى سلسلة فارغة
const sanitizeProfile = (data) => {
  const sanitized = { ...data }
  SOCIAL_KEYS.forEach(key => {
    if (sanitized[key] === null || sanitized[key] === undefined) {
      sanitized[key] = ''
    }
  })
  // التأكد من أن name و bio ليست null
  if (sanitized.name === null) sanitized.name = ''
  if (sanitized.bio === null) sanitized.bio = ''
  if (sanitized.name_font === null) sanitized.name_font = 'Syne'
  if (sanitized.bio_font === null) sanitized.bio_font = 'DM Sans'
  
  return sanitized
}

const useLinkProfileStore = create((set, get) => ({
  profile:   { ...DEFAULT_PROFILE },
  isLoading: false,
  isSaving:  false,
  error:     null,

  fetch: async () => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await LinkProfileApi.get()

      const cleanData = sanitizeProfile(data.data)
      set({ profile: { ...DEFAULT_PROFILE, ...cleanData }, isLoading: false })
    } catch (error) {
      console.error('Fetch error:', error)
      set({ isLoading: false, error: 'Failed to load profile' })
    }
  },

  updateField: (updates) =>
    set((s) => ({ profile: { ...s.profile, ...updates } })),

  save: async () => {
    const { profile } = get()
    set({ isSaving: true, error: null })
    try {

        const payload = {
        name:      profile.name || '',
        bio:       profile.bio || '',
        name_font: profile.name_font || 'Syne',
        bio_font:  profile.bio_font || 'DM Sans',
      }
      
      SOCIAL_KEYS.forEach(key => {
        payload[key] = (profile[key] === null || profile[key] === undefined) ? '' : profile[key]
      })
      
      const { data } = await LinkProfileApi.update(payload)
      
      const cleanData = sanitizeProfile(data.data)
      set({ profile: { ...DEFAULT_PROFILE, ...cleanData }, isSaving: false })
      return true
    } catch (error) {
      console.error('Save error:', error.response?.data)
      set({ isSaving: false, error: error.response?.data?.message || 'Failed to save profile' })
      return false
    }
  },

  uploadPhoto: async (file) => {
    set({ isSaving: true, error: null })
    try {
      const { data } = await LinkProfileApi.uploadPhoto(file)
      set((s) => ({
        profile: { ...s.profile, avatar: data.data.avatar },
        isSaving: false,
      }))
      return true
    } catch (error) {
      console.error('Upload error:', error)
      set({ isSaving: false, error: 'Failed to upload photo' })
      return false
    }
  },

  deletePhoto: async () => {
    set({ isSaving: true, error: null })
    try {
      await LinkProfileApi.deletePhoto()
      set((s) => ({
        profile: { ...s.profile, avatar: null },
        isSaving: false,
      }))
      return true
    } catch (error) {
      console.error('Delete error:', error)
      set({ isSaving: false, error: 'Failed to delete photo' })
      return false
    }
  },
}))

export default useLinkProfileStore