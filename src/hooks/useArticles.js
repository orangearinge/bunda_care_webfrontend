import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { articlesApi } from "@/api/articlesApi"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

export const useArticles = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    // 1. Fetch Articles List
    const useGetArticles = (params) => {
        return useQuery({
            queryKey: ["articles", params],
            queryFn: () => articlesApi.getArticles(params),
            keepPreviousData: true,
            onError: (error) => {
                toast.error(error.message || "Failed to fetch articles")
            },
        })
    }

    // 2. Fetch Single Article
    const useGetArticle = (id) => {
        return useQuery({
            queryKey: ["article", id],
            queryFn: () => articlesApi.getArticleById(id),
            enabled: !!id, // Only run if ID is provided
            onError: (error) => {
                toast.error(error.message || "Failed to fetch article")
            },
        })
    }

    // 3. Create Article Mutation
    const createArticleMutation = useMutation({
        mutationFn: articlesApi.createArticle,
        onSuccess: () => {
            queryClient.invalidateQueries(["articles"])
            toast.success("Article created successfully!")
            navigate("/admin/articles")
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create article")
        },
    })

    // 4. Update Article Mutation
    const updateArticleMutation = useMutation({
        mutationFn: ({ id, data }) => articlesApi.updateArticle(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries(["articles"])
            queryClient.invalidateQueries(["article", data.id])
            toast.success("Article updated successfully!")
            navigate("/admin/articles")
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update article")
        },
    })

    // 5. Delete Article Mutation
    const deleteArticleMutation = useMutation({
        mutationFn: articlesApi.deleteArticle,
        onSuccess: () => {
            queryClient.invalidateQueries(["articles"])
            toast.success("Article deleted successfully")
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete article")
        },
    })

    return {
        useGetArticles,
        useGetArticle,
        createArticle: createArticleMutation.mutateAsync,
        isCreating: createArticleMutation.isPending,
        updateArticle: updateArticleMutation.mutateAsync,
        isUpdating: updateArticleMutation.isPending,
        deleteArticle: deleteArticleMutation.mutateAsync,
        isDeleting: deleteArticleMutation.isPending,
    }
}
