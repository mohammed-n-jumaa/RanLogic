import { create } from 'zustand'
import linkApi from '@/api/linkApi'

const useLinkStore = create((set, get) => ({
  links:   [],
  loading: false,
  saving:  false,
  error:   null,

  fetchLinks: async () => {
    set({ loading: true, error: null })
    try {
      const { data } = await linkApi.getAll()
      set({ links: data.data, loading: false })
    } catch {
      set({ loading: false, error: 'Failed to load links' })
    }
  },

  addLink: async (linkData) => {
    set({ saving: true })
    try {
      const { data } = await linkApi.create(linkData)
      set((s) => ({ links: [...s.links, data.data], saving: false }))
      return { success: true }
    } catch (err) {
      set({ saving: false })
      return { success: false, errors: err.response?.data?.errors || {} }
    }
  },

  updateLink: async (id, linkData) => {
    set({ saving: true })
    try {
      const { data } = await linkApi.update(id, linkData)
      set((s) => ({
        links:  s.links.map((l) => (l.id === id ? data.data : l)),
        saving: false,
      }))
      return { success: true }
    } catch (err) {
      set({ saving: false })
      return { success: false, errors: err.response?.data?.errors || {} }
    }
  },

  deleteLink: async (id) => {
    set({ saving: true })
    try {
      await linkApi.remove(id)
      set((s) => ({ links: s.links.filter((l) => l.id !== id), saving: false }))
      return { success: true }
    } catch {
      set({ saving: false })
      return { success: false }
    }
  },

  toggleLink: async (id) => {
    const prev = get().links
    set((s) => ({
      links: s.links.map((l) => (l.id === id ? { ...l, active: !l.active } : l)),
    }))
    try {
      const { data } = await linkApi.toggle(id)
      set((s) => ({
        links: s.links.map((l) => (l.id === id ? data.data : l)),
      }))
    } catch {
      set({ links: prev })
    }
  },

  reorderLinks: async (ordered) => {
    set({ links: ordered })
    try {
      await linkApi.reorder(ordered)
    } catch {
      get().fetchLinks()
    }
  },
}))

export default useLinkStore