import { useMutation } from "@tanstack/react-query"
import { authApi } from "@/api/authApi"
import useAuthStore from "@/stores/authStore"
import { toast } from "sonner"

// Login mutation hook
export const useLogin = () => {
    const { setAuth } = useAuthStore()

    return useMutation({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            // Store token and user data
            const { token, user } = data
            setAuth(user, token)

            toast.success("Login successful!")
        },
        onError: (error) => {
            toast.error(error.message || "Login failed. Please check your credentials.")
        },
    })
}

// Logout mutation hook
export const useLogout = () => {
    const { clearAuth } = useAuthStore()

    return useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            // Clear auth state
            clearAuth()
            toast.success("Logged out successfully!")
        },
        onError: (error) => {
            // Even if the API call fails, we should still clear local auth state
            clearAuth()
            console.error("Logout error:", error)
            toast.info("Logged out locally")
        },
    })
}
