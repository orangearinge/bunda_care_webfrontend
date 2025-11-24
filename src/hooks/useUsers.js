import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { usersApi } from "@/api/usersApi"
import { toast } from "sonner"

// Query keys
export const userKeys = {
    all: ["users"],
    lists: () => [...userKeys.all, "list"],
    list: (filters) => [...userKeys.lists(), { filters }],
    details: () => [...userKeys.all, "detail"],
    detail: (id) => [...userKeys.details(), id],
}

// Hook to fetch users with pagination and filters
export const useUsers = (params = {}) => {
    return useQuery({
        queryKey: userKeys.list(params),
        queryFn: () => usersApi.getUsers(params),
        keepPreviousData: true,
        staleTime: 2 * 60 * 1000, // 2 minutes
    })
}

// Hook to fetch user by ID
export const useUser = (id) => {
    return useQuery({
        queryKey: userKeys.detail(id),
        queryFn: () => usersApi.getUserById(id),
        enabled: !!id,
        staleTime: 2 * 60 * 1000, // 2 minutes
    })
}

// Hook to update user role
export const useUpdateUserRole = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, role }) => usersApi.updateUserRole(id, role),
        onSuccess: (data, variables) => {
            // Invalidate and refetch users list
            queryClient.invalidateQueries(userKeys.lists())

            toast.success("User role updated successfully!")
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update user role")
        },
    })
}
