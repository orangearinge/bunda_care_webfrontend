import axios from "axios"
import useAuthStore from "@/stores/authStore"

// Create axios instance with base configuration
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
    headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
    },
    timeout: 10000, // 10 seconds timeout
})

// Request interceptor to add token to all requests
apiClient.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor to handle errors globally
apiClient.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        // Handle 401 Unauthorized - redirect to login
        if (error.response?.status === 401) {
            // Clear auth state in store (which also handles localStorage)
            useAuthStore.getState().clearAuth()

            // Redirect to login if not already there
            if (window.location.pathname !== "/login") {
                window.location.href = "/login"
            }
        }

        // Standardize error response
        const errorMessage = error.response?.data?.message || error.message || "An error occurred"
        const errorCode = error.response?.data?.error || "UNKNOWN_ERROR"

        return Promise.reject({
            message: errorMessage,
            code: errorCode,
            status: error.response?.status,
            originalError: error,
        })
    }
)

export default apiClient
