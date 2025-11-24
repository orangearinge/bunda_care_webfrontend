import { useQuery } from "@tanstack/react-query"
import { dashboardApi } from "@/api/dashboardApi"

// Query keys
export const dashboardKeys = {
    stats: ["dashboard", "stats"],
    userGrowth: ["dashboard", "userGrowth"],
}

// Hook to fetch dashboard statistics
export const useDashboardStats = () => {
    return useQuery({
        queryKey: dashboardKeys.stats,
        queryFn: dashboardApi.getStats,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    })
}

// Hook to fetch user growth data
export const useUserGrowth = () => {
    return useQuery({
        queryKey: dashboardKeys.userGrowth,
        queryFn: dashboardApi.getUserGrowth,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    })
}
