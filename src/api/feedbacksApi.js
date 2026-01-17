import apiClient from "@/lib/axios"

// Feedbacks API services
export const feedbacksApi = {
    // Get all feedbacks with pagination and filters
    getFeedbacks: async (params = {}) => {
        const response = await apiClient.get("/api/admin/feedbacks", { params })
        return response.data
    },
}

export default feedbacksApi
