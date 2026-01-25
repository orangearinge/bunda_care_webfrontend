import { useQuery } from "@tanstack/react-query"
import { feedbacksApi } from "@/api/feedbacksApi"

// Query keys
export const feedbackKeys = {
    all: ["feedbacks"],
    lists: () => [...feedbackKeys.all, "list"],
    list: (filters) => [...feedbackKeys.lists(), { filters }],
}

// Hook to fetch feedbacks with pagination and filters
export const useFeedbacks = (params = {}) => {
    return useQuery({
        queryKey: feedbackKeys.list(params),
        queryFn: () => feedbacksApi.getFeedbacks(params),
        keepPreviousData: true,
        staleTime: 2 * 60 * 1000,
    })
}

// Hook to trigger manual AI analysis
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useAnalyzeFeedback = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id) => feedbacksApi.analyzeFeedback(id),
        onSuccess: (newItem) => {
            toast.success("AI Analysis completed successfully")

            // Optimistic Update via setQueriesData to update cache instanty without refetch
            queryClient.setQueriesData({ queryKey: feedbackKeys.lists() }, (oldData) => {
                if (!oldData?.items) return oldData

                return {
                    ...oldData,
                    items: oldData.items.map((item) =>
                        item.id === newItem.id
                            ? { ...item, classification: newItem.classification }
                            : item
                    )
                }
            })

            // Invalidate feedback lists to refresh UI eventually
            queryClient.invalidateQueries(feedbackKeys.lists())
        },
        onError: (error) => {
            toast.error(error.message || "Failed to analyze feedback")
        }
    })
}
