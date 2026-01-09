import { useParams } from "react-router-dom"
import ArticleForm from "@/components/articles/ArticleForm"
import { useArticles } from "@/hooks/useArticles"
import { Loader2 } from "lucide-react"

export default function EditArticlePage() {
    const { id } = useParams()
    const { useGetArticle } = useArticles()
    const { data: article, isLoading, error } = useGetArticle(id)

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!article) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-2xl font-bold mb-2">Article Not Found</h2>
                <p className="text-muted-foreground">The article you're looking for doesn't exist.</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6">
            <ArticleForm article={article} isEdit={true} />
        </div>
    )
}
