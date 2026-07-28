import { create } from 'zustand'
import linkAnalyticsApi from '@/api/linkAnalyticsApi'
import linkApi from '@/api/linkApi'

const useLinkDashboardStore = create((set) => ({
  stats:     null,
  links:     [],
  isLoading: false,
  error:     null,

  fetch: async () => {
    set({ isLoading: true, error: null })
    try {
      const [summaryRes, linksRes] = await Promise.all([
        linkAnalyticsApi.getSummary('today'),
        linkApi.getAll(),
      ])

      const summary = summaryRes.data.data
      const links   = linksRes.data.data

      const topLink = [...links].sort((a, b) => (b.clicks ?? 0) - (a.clicks ?? 0))[0] ?? null

      set({
        stats: {
          totalLinks:   links.length,
          activeLinks:  links.filter((l) => l.active).length,
          todayClicks:  summary.total_clicks,
          totalClicks:  links.reduce((s, l) => s + (l.clicks ?? 0), 0),
          topLinkTitle: topLink?.title ?? '—',
          topLinkClicks: topLink?.clicks ?? 0,
        },
        links,
        isLoading: false,
      })
    } catch {
      set({ isLoading: false, error: 'Failed to load dashboard' })
    }
  },
}))

export default useLinkDashboardStore