import apiClient from "@/lib/axios"

// Feedbacks API services
export const feedbacksApi = {
    // Get all feedbacks with pagination and filters
    getFeedbacks: async (params = {}) => {
        const response = await apiClient.get("/api/admin/feedbacks", { params })
        return response.data
    },

    // Trigger manual AI analysis for a feedback
    analyzeFeedback: async (id) => {
        const response = await apiClient.post(`/api/admin/feedbacks/${id}/analyze`)
        return response.data
    },
}

export default feedbacksApi
