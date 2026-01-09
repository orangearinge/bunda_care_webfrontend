import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useArticles } from "@/hooks/useArticles"
import { ArrowLeft, Pencil, Loader2, Calendar, Clock } from "lucide-react"

export default function ArticlePreviewPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { useGetArticle } = useArticles()
    const { data: article, isLoading } = useGetArticle(id)

    const formatDate = (dateString) => {
        if (!dateString) return "Not published"
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

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
        <div className="container mx-auto py-6 max-w-4xl">
            {/* Header Actions */}
            <div className="flex items-center justify-between mb-6">
                <Button variant="ghost" onClick={() => navigate("/admin/articles")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Articles
                </Button>
                <Button onClick={() => navigate(`/admin/articles/${id}/edit`)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Article
                </Button>
            </div>

            {/* Article Content */}
            <Card>
                <CardContent className="p-8">
                    {/* Status Badge */}
                    <div className="mb-4">
                        <Badge variant={article.status === "published" ? "default" : "secondary"}>
                            {article.status}
                        </Badge>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

                    {/* Meta Information */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Created: {formatDate(article.created_at)}</span>
                        </div>
                        {article.published_at && (
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>Published: {formatDate(article.published_at)}</span>
                            </div>
                        )}
                    </div>

                    {/* Excerpt */}
                    {article.excerpt && (
                        <p className="text-lg text-muted-foreground mb-6 font-medium italic border-l-4 border-primary pl-4">
                            {article.excerpt}
                        </p>
                    )}

                    {/* Cover Image */}
                    {article.cover_image && (
                        <div className="mb-8 rounded-lg overflow-hidden">
                            <img
                                src={article.cover_image}
                                alt={article.title}
                                className="w-full h-auto"
                                onError={(e) => {
                                    e.target.style.display = "none"
                                }}
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div
                        className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
