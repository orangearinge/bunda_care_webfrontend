import apiClient from "@/lib/axios"

// Dashboard API services
export const dashboardApi = {
    // Get dashboard statistics
    getStats: async () => {
        const response = await apiClient.get("/admin/dashboard/stats")
        return response.data
    },

    // Get user growth data
    getUserGrowth: async (days = 30) => {
        const response = await apiClient.get("/admin/dashboard/user-growth", {
            params: { days }
        })
        return response.data
    },
}

export default dashboardApi
