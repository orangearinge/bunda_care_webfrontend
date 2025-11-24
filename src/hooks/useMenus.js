import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { menusApi } from "@/api/menusApi"
import { toast } from "sonner"

// Query keys
export const menuKeys = {
    all: ["menus"],
    lists: () => [...menuKeys.all, "list"],
    list: (filters) => [...menuKeys.lists(), { filters }],
    details: () => [...menuKeys.all, "detail"],
    detail: (id) => [...menuKeys.details(), id],
}

// Hook to fetch all menus
export const useMenus = (params = {}) => {
    return useQuery({
        queryKey: menuKeys.list(params),
        queryFn: () => menusApi.getMenus(params),
        keepPreviousData: true,
        staleTime: 2 * 60 * 1000, // 2 minutes
    })
}

// Hook to fetch menu by ID
export const useMenu = (id) => {
    return useQuery({
        queryKey: menuKeys.detail(id),
        queryFn: () => menusApi.getMenuById(id),
        enabled: !!id,
        staleTime: 2 * 60 * 1000, // 2 minutes
    })
}

// Hook to create menu
export const useCreateMenu = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: menusApi.createMenu,
        onSuccess: () => {
            // Invalidate menus list
            queryClient.invalidateQueries(menuKeys.lists())
            toast.success("Menu created successfully!")
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create menu")
        },
    })
}

// Hook to update menu
export const useUpdateMenu = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }) => menusApi.updateMenu(id, data),
        onSuccess: (data, variables) => {
            // Invalidate menus list and detail
            queryClient.invalidateQueries(menuKeys.lists())
            queryClient.invalidateQueries(menuKeys.detail(variables.id))
            toast.success("Menu updated successfully!")
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update menu")
        },
    })
}

// Hook to delete menu
export const useDeleteMenu = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: menusApi.deleteMenu,
        onMutate: async (deletedId) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries(menuKeys.lists())

            // Snapshot previous value
            const previousMenus = queryClient.getQueriesData(menuKeys.lists())

            // Optimistically update
            queryClient.setQueriesData(menuKeys.lists(), (old) => {
                if (!old) return old
                return {
                    ...old,
                    items: old.items?.filter((menu) => menu.id !== deletedId) || [],
                }
            })

            return { previousMenus }
        },
        onSuccess: () => {
            toast.success("Menu deleted successfully!")
        },
        onError: (error, deletedId, context) => {
            // Rollback on error
            if (context?.previousMenus) {
                context.previousMenus.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data)
                })
            }
            toast.error(error.message || "Failed to delete menu")
        },
        onSettled: () => {
            // Always refetch after error or success
            queryClient.invalidateQueries(menuKeys.lists())
        },
    })
}
