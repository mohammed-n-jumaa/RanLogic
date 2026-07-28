import { create } from 'zustand'
import linkAnalyticsApi from '@/api/linkAnalyticsApi'

const useLinkAnalyticsStore = create((set, get) => ({
  summary:   null,
  links:     [],
  socials:   [],
  period:    'week',
  isLoading: false,
  error:     null,

  setPeriod: (period) => {
    set({ period })
    get().fetchAll(period)
  },

  fetchAll: async (period) => {
    const p = period ?? get().period
    set({ isLoading: true, error: null })
    try {
      const [summaryRes, linksRes, socialsRes] = await Promise.all([
        linkAnalyticsApi.getSummary(p),
        linkAnalyticsApi.getLinks(p),
        linkAnalyticsApi.getSocials(p),
      ])
      set({
        summary:   summaryRes.data.data,
        links:     linksRes.data.data,
        socials:   socialsRes.data.data,
        isLoading: false,
      })
    } catch {
      set({ isLoading: false, error: 'Failed to load analytics' })
    }
  },
}))

export default useLinkAnalyticsStore