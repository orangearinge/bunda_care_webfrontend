import { createContext, useContext, useEffect } from "react"
import { Navigate } from "react-router-dom"
import useAuthStore from "@/stores/authStore"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const { user, isAuthenticated, clearAuth } = useAuthStore()

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

