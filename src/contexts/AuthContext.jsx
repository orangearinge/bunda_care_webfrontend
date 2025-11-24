import { createContext, useContext, useEffect } from "react"
import { Navigate } from "react-router-dom"
import useAuthStore from "@/stores/authStore"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore()

    // Sync with localStorage on mount (in case token exists but zustand state is empty)
    useEffect(() => {
        const token = localStorage.getItem("authToken")
        const storedUser = localStorage.getItem("admin_user")

        // If token exists but zustand state is not authenticated, restore from localStorage
        if (token && storedUser && !isAuthenticated) {
            try {
                const parsedUser = JSON.parse(storedUser)
                setAuth(parsedUser, token)
            } catch (error) {
                // If parsing fails, clear invalid data
                clearAuth()
            }
        }
    }, [])

    const value = {
        user,
        isAuthenticated,
        // We'll handle login through React Query mutation
        logout: clearAuth,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider")
    }
    return context
}

// Protected Route Component
export function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return children
}

