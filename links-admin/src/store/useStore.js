import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const MOCK_ANALYTICS = [
  { id: '1', linkId: '1', clicks: 142, date: new Date().toISOString() },
  { id: '2', linkId: '2', clicks: 87,  date: new Date().toISOString() },
  { id: '3', linkId: '3', clicks: 230, date: new Date().toISOString() },
  { id: '4', linkId: '4', clicks: 54,  date: new Date().toISOString() },
]

const useStore = create(
  persist(
    (set, get) => ({

      profile: {
        name:      'Mohammed Al-Rashidi',
        bio:       'Developer & Creator 🚀',
        avatar:    null,
        nameFont:  'Syne',
        bioFont:   'DM Sans',
        // Social platforms
        instagram: '', tiktok:    '', youtube:   '', twitter:  '',
        linkedin:  '', facebook:  '', github:    '', twitch:   '',
        telegram:  '', whatsapp:  '', discord:   '', snapchat: '',
        pinterest: '', website:   '', podcast:   '',
      },
      updateProfile: (updates) =>
        set((s) => ({ profile: { ...s.profile, ...updates } })),

      // ─── Links ────────────────────────────────────────────────
      links: [
        { id: '1', title: 'My Portfolio',    url: 'https://example.com',   icon: 'globe',     active: true,  order: 0, clicks: 142, titleFont: 'DM Sans' },
        { id: '2', title: 'GitHub',           url: 'https://github.com',    icon: 'github',    active: true,  order: 1, clicks: 87,  titleFont: 'DM Sans' },
        { id: '3', title: 'YouTube Channel',  url: 'https://youtube.com',   icon: 'youtube',   active: true,  order: 2, clicks: 230, titleFont: 'DM Sans' },
        { id: '4', title: 'Instagram',        url: 'https://instagram.com', icon: 'instagram', active: false, order: 3, clicks: 54,  titleFont: 'DM Sans' },
      ],

      addLink:      (link) => set((s) => ({
        links: [...s.links, { ...link, id: Date.now().toString(), order: s.links.length, clicks: 0 }],
      })),
      updateLink:   (id, updates) => set((s) => ({
        links: s.links.map((l) => (l.id === id ? { ...l, ...updates } : l)),
      })),
      deleteLink:   (id) => set((s) => ({ links: s.links.filter((l) => l.id !== id) })),
      reorderLinks: (ordered) => set({ links: ordered }),
      toggleLink:   (id) => set((s) => ({
        links: s.links.map((l) => (l.id === id ? { ...l, active: !l.active } : l)),
      })),

      // ─── Theme ────────────────────────────────────────────────
      activeTheme: 'minimal',
      setActiveTheme: (id) => set({ activeTheme: id }),

      // ─── Dark mode ────────────────────────────────────────────
      darkMode: false,
      toggleDarkMode: () => set((s) => {
        const next = !s.darkMode
        document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light')
        return { darkMode: next }
      }),

      // ─── Analytics ────────────────────────────────────────────
      analytics: MOCK_ANALYTICS,
      analyticsFilter: 'week',
      setAnalyticsFilter: (f) => set({ analyticsFilter: f }),

      // ─── Computed helpers ──────────────────────────────────────
      getTotalClicks: () => get().links.reduce((a, l) => a + l.clicks, 0),
      getTopLink:     () => [...get().links].sort((a, b) => b.clicks - a.clicks)[0] || null,
      getTodayClicks: () => 47,
    }),
    {
      name: 'linktree-admin-store',
      partialize: (s) => ({
        profile: s.profile, links: s.links,
        activeTheme: s.activeTheme, darkMode: s.darkMode,
      }),
    }
  )
)

export default useStore
