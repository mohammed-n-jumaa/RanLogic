import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import AuthService from '@/api/Auth'

const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isLoading: false,
      error: null,
      user: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null })
        
        try {
          const result = await AuthService.login(email, password)
          
          if (result.success) {
            set({
              isAuthenticated: true,
              isLoading: false,
              error: null,
              user: result.data
            })
            return true
          }
          
          set({
            isAuthenticated: false,
            isLoading: false,
            error: result.error
          })
          return false
        } catch (error) {
          set({
            isAuthenticated: false,
            isLoading: false,
            error: 'An unexpected error occurred'
          })
          return false
        }
      },

      logout: async () => {
        set({ isLoading: true })
        await AuthService.logout()
        set({
          isAuthenticated: false,
          isLoading: false,
          error: null,
          user: null
        })
      },

      logoutAll: async () => {
        set({ isLoading: true })
        await AuthService.logoutAll()
        set({
          isAuthenticated: false,
          isLoading: false,
          error: null,
          user: null
        })
      },

      checkAuth: async () => {
        if (!AuthService.isAuthenticated()) {
          set({
            isAuthenticated: false,
            user: null,
            error: null
          })
          return false
        }
        
        set({ isLoading: true })
        
        try {
          const result = await AuthService.getCurrentUser()
          
          if (result.success) {
            set({
              isAuthenticated: true,
              isLoading: false,
              user: result.data,
              error: null
            })
            return true
          }
          
          set({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            error: result.error
          })
          return false
        } catch (error) {
          set({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            error: error.message
          })
          return false
        }
      },

      clearError: () => set({ error: null }),
      
      getUser: () => get().user,
      
      hasActiveSubscription: () => {
        const user = get().user
        return user?.has_active_subscription === true
      }
    }),
    {
      name: 'linktree-auth',
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        user: state.user 
      }),
    }
  )
)

export default useAuthStore