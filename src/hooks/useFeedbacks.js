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
