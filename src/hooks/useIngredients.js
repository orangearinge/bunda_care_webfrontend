import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ingredientsApi } from "@/api/ingredientsApi"
import { toast } from "sonner"

// Query keys
export const ingredientKeys = {
    all: ["ingredients"],
    lists: () => [...ingredientKeys.all, "list"],
    list: (filters) => [...ingredientKeys.lists(), { filters }],
    details: () => [...ingredientKeys.all, "detail"],
    detail: (id) => [...ingredientKeys.details(), id],
}

// Hook to fetch all ingredients
export const useIngredients = (params = {}) => {
    return useQuery({
        queryKey: ingredientKeys.list(params),
        queryFn: () => ingredientsApi.getIngredients(params),
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000, // 5 minutes (ingredients don't change often)
    })
}

// Hook to fetch ingredient by ID
export const useIngredient = (id) => {
    return useQuery({
        queryKey: ingredientKeys.detail(id),
        queryFn: () => ingredientsApi.getIngredientById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

// Hook to create ingredient
export const useCreateIngredient = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ingredientsApi.createIngredient,
        onSuccess: () => {
            queryClient.invalidateQueries(ingredientKeys.lists())
            toast.success("Ingredient created successfully!")
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create ingredient")
        },
    })
}

// Hook to update ingredient
export const useUpdateIngredient = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }) => ingredientsApi.updateIngredient(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(ingredientKeys.lists())
            queryClient.invalidateQueries(ingredientKeys.detail(variables.id))
            toast.success("Ingredient updated successfully!")
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update ingredient")
        },
    })
}

// Hook to delete ingredient
export const useDeleteIngredient = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ingredientsApi.deleteIngredient,
        onMutate: async (deletedId) => {
            await queryClient.cancelQueries(ingredientKeys.lists())
            const previousIngredients = queryClient.getQueriesData(ingredientKeys.lists())

            // Optimistically update
            queryClient.setQueriesData(ingredientKeys.lists(), (old) => {
                if (!old) return old
                return {
                    ...old,
                    items: old.items?.filter((ingredient) => ingredient.id !== deletedId) || [],
                }
            })

            return { previousIngredients }
        },
        onSuccess: () => {
            toast.success("Ingredient deleted successfully!")
        },
        onError: (error, deletedId, context) => {
            if (context?.previousIngredients) {
                context.previousIngredients.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data)
                })
            }
            toast.error(error.message || "Failed to delete ingredient")
        },
        onSettled: () => {
            queryClient.invalidateQueries(ingredientKeys.lists())
        },
    })
}
