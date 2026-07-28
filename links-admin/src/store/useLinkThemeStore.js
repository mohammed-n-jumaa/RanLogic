import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import linkThemeApi from '@/api/linkThemeApi'

const useLinkThemeStore = create(
  persist(
    (set) => ({
      activeTheme: 'minimal',
      isLoading:   false,

      fetch: async () => {
        set({ isLoading: true })
        try {
          const { data } = await linkThemeApi.get()
          set({ activeTheme: data.data.theme_id ?? 'minimal', isLoading: false })
        } catch {
          set({ isLoading: false })
        }
      },

      setActiveTheme: async (id) => {
        set({ activeTheme: id })
        try {
          await linkThemeApi.update(id)
        } catch {
          // optimistic — keep local value
        }
      },
    }),
    {
      name: 'link-theme-store',
      partialize: (s) => ({ activeTheme: s.activeTheme }),
    }
  )
)

export default useLinkThemeStore