import { create } from "zustand"
import { persist } from "zustand/middleware"

// Auth store with persistence
const useAuthStore = create(
    persist(
        (set, get) => ({
            // State
            user: null,
            token: null,
            isAuthenticated: false,

            // Actions
            setAuth: (user, token) => {
                set({ user, token, isAuthenticated: true })
            },

            clearAuth: () => {
                set({ user: null, token: null, isAuthenticated: false })
            },

            updateUser: (userData) => {
                set({ user: userData })
            },

            // Getters
            getToken: () => get().token,
            getUser: () => get().user,
        }),
        {
            name: "bunda-care-auth", // localStorage key
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
)

export default useAuthStore
