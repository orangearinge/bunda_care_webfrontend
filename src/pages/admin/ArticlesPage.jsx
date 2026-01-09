import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useArticles } from "@/hooks/useArticles"
import { Plus, MoreHorizontal, Pencil, Trash2, Eye, Loader2, Search, FileText } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function ArticlesPage() {
    const navigate = useNavigate()
    const { useGetArticles, deleteArticle } = useArticles()

    // State for filters & pagination
    const [page, setPage] = useState(1)
    const [limit] = useState(10)
    const [filters, setFilters] = useState({
        search: "",
        status: "ALL",
        sort_by: "created_at",
        sort_order: "desc",
    })

    // Prepare query params
    const queryParams = {
        page,
        limit,
        ...filters
    }
    // Clean empty filters
    Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === "" || queryParams[key] === "ALL") delete queryParams[key]
    })

    // Fetch data using Hook
    const { data, isLoading } = useGetArticles(queryParams)
    const articles = data?.items || []
    const pagination = data?.pagination || { total: 0, has_next: false, has_prev: false }

    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        articleId: null,
        articleTitle: "",
    })

    // Handle delete
    const handleDelete = async () => {
        await deleteArticle(deleteDialog.articleId)
        setDeleteDialog({ open: false, articleId: null, articleTitle: "" })
    }

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return "-"
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Articles</h1>
                    <p className="text-muted-foreground">Manage your blog articles and content</p>
                </div>
                <Button onClick={() => navigate("/admin/articles/create")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Article
                </Button>
            </div>

            {/* Filters Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                    <CardDescription>Search and filter articles</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search articles..."
                                    value={filters.search}
                                    onChange={(e) => {
                                        setFilters((prev) => ({ ...prev, search: e.target.value }))
                                        setPage(1) // Reset page on search
                                    }}
                                    className="pl-8"
                                />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <Select
                            value={filters.status}
                            onValueChange={(value) => {
                                setFilters((prev) => ({ ...prev, status: value }))
                                setPage(1)
                            }}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Status</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Sort */}
                        <Select
                            value={`${filters.sort_by}_${filters.sort_order}`}
                            onValueChange={(value) => {
                                const [sort_by, sort_order] = value.split("_")
                                setFilters((prev) => ({ ...prev, sort_by, sort_order }))
                            }}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="created_at_desc">Newest First</SelectItem>
                                <SelectItem value="created_at_asc">Oldest First</SelectItem>
                                <SelectItem value="title_asc">Title (A-Z)</SelectItem>
                                <SelectItem value="title_desc">Title (Z-A)</SelectItem>
                                <SelectItem value="published_at_desc">Recently Published</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Articles Table */}
            <Card>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : articles.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="font-semibold text-lg">No articles found</h3>
                            <p className="text-muted-foreground mb-4">
                                Get started by creating your first article
                            </p>
                            <Button onClick={() => navigate("/admin/articles/create")}>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Article
                            </Button>
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead>Published</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {articles.map((article) => (
                                        <TableRow key={article.id}>
                                            <TableCell>
                                                <div className="flex items-start gap-3">
                                                    {article.cover_image && (
                                                        <img
                                                            src={article.cover_image}
                                                            alt={article.title}
                                                            className="w-16 h-16 object-cover rounded"
                                                            onError={(e) => {
                                                                e.target.style.display = "none"
                                                            }}
                                                        />
                                                    )}
                                                    <div>
                                                        <p className="font-medium">{article.title}</p>
                                                        {article.excerpt && (
                                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                                {article.excerpt}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        article.status === "published"
                                                            ? "default"
                                                            : "secondary"
                                                    }
                                                >
                                                    {article.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{formatDate(article.created_at)}</TableCell>
                                            <TableCell>{formatDate(article.published_at)}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                navigate(`/admin/articles/${article.id}/preview`)
                                                            }
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                navigate(`/admin/articles/${article.id}/edit`)
                                                            }
                                                        >
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                setDeleteDialog({
                                                                    open: true,
                                                                    articleId: article.id,
                                                                    articleTitle: article.title,
                                                                })
                                                            }
                                                            className="text-destructive"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Pagination */}
                            <div className="flex items-center justify-between px-6 py-4 border-t">
                                <p className="text-sm text-muted-foreground">
                                    Showing {articles.length} of {pagination.total} articles
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={!pagination.has_prev}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage((p) => p + 1)}
                                        disabled={!pagination.has_next}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false, articleId: null, articleTitle: "" })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the article "{deleteDialog.articleTitle}". This action
                            cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
