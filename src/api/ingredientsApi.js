import apiClient from "@/lib/axios"

// Ingredients API services
export const ingredientsApi = {
    // Get all ingredients
    getIngredients: async (params = {}) => {
        const response = await apiClient.get("/api/ingredients", { params })
        return response.data
    },

    // Get ingredient by ID
    getIngredientById: async (id) => {
        const response = await apiClient.get(`/api/ingredients/${id}`)
        return response.data
    },

    // Create new ingredient
    createIngredient: async (ingredientData) => {
        const response = await apiClient.post("/api/ingredients", ingredientData)
        return response.data
    },

    // Update ingredient
    updateIngredient: async (id, ingredientData) => {
        const response = await apiClient.put(`/api/ingredients/${id}`, ingredientData)
        return response.data
    },

    // Delete ingredient
    deleteIngredient: async (id) => {
        const response = await apiClient.delete(`/api/ingredients/${id}`)
        return response.data
    },
}

export default ingredientsApi
