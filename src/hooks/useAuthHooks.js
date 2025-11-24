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

            // Also store in old format for compatibility
            localStorage.setItem("admin_user", JSON.stringify(user))

            toast.success("Login successful!")
        },
        onError: (error) => {
            toast.error(error.message || "Login failed. Please check your credentials.")
        },
    })
}
