import apiClient from "@/lib/axios"

/**
 * Articles API Service
 * Handles all article-related API calls
 */
export const articlesApi = {
    // Get all articles (admin - with pagination & filtering)
    getArticles: async (params = {}) => {
        const response = await apiClient.get("/api/articles", { params })
        return response.data
    },

    // Get article by ID (admin)
    getArticleById: async (id) => {
        const response = await apiClient.get(`/api/articles/${id}`)
        return response.data
    },

    // Create new article
    createArticle: async (articleData) => {
        const response = await apiClient.post("/api/articles", articleData)
        return response.data
    },

    // Update article
    updateArticle: async (id, articleData) => {
        const response = await apiClient.put(`/api/articles/${id}`, articleData)
        return response.data
    },

    // Delete article (soft delete)
    deleteArticle: async (id) => {
        const response = await apiClient.delete(`/api/articles/${id}`)
        return response.data
    },

    // Get published articles (public - for preview)
    getPublishedArticles: async (params = {}) => {
        const response = await apiClient.get("/api/public/articles", { params })
        return response.data
    },

    // Get published article by slug (public - for preview)
    getPublishedArticleBySlug: async (slug) => {
        const response = await apiClient.get(`/api/public/articles/${slug}`)
        return response.data
    },
}

export default articlesApi
