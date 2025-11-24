import { createContext, useContext, useState } from "react"
import { Navigate } from "react-router-dom"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        // Check if user is stored in localStorage
        const stored = localStorage.getItem("admin_user")
        return stored ? JSON.parse(stored) : null
    })

    const login = (email, password) => {
        // Mock login - accept any email/password
        const mockUser = {
            id: 1,
            name: "Admin User",
            email: email,
            role: "ADMIN",
            avatar: "/avatars/admin.jpg",
        }

        setUser(mockUser)
        localStorage.setItem("admin_user", JSON.stringify(mockUser))
        return Promise.resolve(mockUser)
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem("admin_user")
    }

    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
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
