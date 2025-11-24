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
                // Store token in localStorage for axios interceptor
                if (token) {
                    localStorage.setItem("authToken", token)
                }
                set({ user, token, isAuthenticated: true })
            },

            clearAuth: () => {
                // Clear token from localStorage
                localStorage.removeItem("authToken")
                localStorage.removeItem("admin_user") // Clear old format too
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
