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
        // Increase timeout to 60 seconds (60000ms) for AI operations
        const response = await apiClient.post(`/api/admin/feedbacks/${id}/analyze`, {}, {
            timeout: 60000
        })
        return response.data
    },
}

export default feedbacksApi
