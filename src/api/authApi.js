import apiClient from "@/lib/axios"

// Authentication API services
export const authApi = {
    // Login
    login: async (credentials) => {
        const response = await apiClient.post("/api/auth/login", credentials)
        return response.data
    },

    // Logout
    logout: async () => {
        const response = await apiClient.post("/api/auth/logout")
        return response.data
    },
}

export default authApi
