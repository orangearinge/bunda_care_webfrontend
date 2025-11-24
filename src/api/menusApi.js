import apiClient from "@/lib/axios"

// Menus API services
export const menusApi = {
    // Get all menus
    getMenus: async (params = {}) => {
        const response = await apiClient.get("/api/menus", { params })
        return response.data
    },

    // Get menu by ID
    getMenuById: async (id) => {
        const response = await apiClient.get(`/api/menus/${id}`)
        return response.data
    },

    // Create new menu
    createMenu: async (menuData) => {
        const response = await apiClient.post("/api/menus", menuData)
        return response.data
    },

    // Update menu
    updateMenu: async (id, menuData) => {
        const response = await apiClient.put(`/api/menus/${id}`, menuData)
        return response.data
    },

    // Delete menu
    deleteMenu: async (id) => {
        const response = await apiClient.delete(`/api/menus/${id}`)
        return response.data
    },
}

export default menusApi
