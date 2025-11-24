import apiClient from "@/lib/axios"

// Users API services
export const usersApi = {
    // Get all users with pagination and filters
    getUsers: async (params = {}) => {
        const response = await apiClient.get("/admin/users", { params })
        return response.data
    },

    // Get user by ID
    getUserById: async (id) => {
        const response = await apiClient.get(`/admin/users/${id}`)
        return response.data
    },

    // Update user role
    updateUserRole: async (id, role) => {
        const response = await apiClient.put(`/admin/users/${id}/role`, { role })
        return response.data
    },
}

export default usersApi
