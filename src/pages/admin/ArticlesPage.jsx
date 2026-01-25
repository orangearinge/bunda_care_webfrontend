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
import { useDebounce } from "@/hooks/useDebounce"
import { Plus, MoreHorizontal, Pencil, Trash2, Eye, Search, FileText } from "lucide-react"
import { TableSkeleton } from "@/components/admin/TableSkeleton"
import { EmptyState } from "@/components/admin/EmptyState"
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

    // Debounce search
    const debouncedSearch = useDebounce(filters.search, 500)

    // Prepare query params
    const queryParams = {
        page,
        limit,
        status: filters.status !== "ALL" ? filters.status : undefined,
        search: debouncedSearch || undefined,
        sort_by: filters.sort_by,
        sort_order: filters.sort_order
    }

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
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return "-"
        return date.toLocaleDateString("en-US", {
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
                                const lastIndex = value.lastIndexOf("_")
                                const sort_by = value.substring(0, lastIndex)
                                const sort_order = value.substring(lastIndex + 1)
                                setFilters((prev) => ({ ...prev, sort_by, sort_order }))
                                setPage(1)
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
                            {isLoading ? (
                                <TableSkeleton rows={limit} columns={5} />
                            ) : articles.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="p-0">
                                        <EmptyState
                                            icon={FileText}
                                            title="No articles found"
                                            description={filters.search || filters.status !== "ALL"
                                                ? "No articles match your search criteria. Try adjusting your filters."
                                                : "No articles have been created yet."}
                                            action={
                                                <Button onClick={() => navigate("/admin/articles/create")} size="sm">
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Create Your First Article
                                                </Button>
                                            }
                                        />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                articles.map((article) => (
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
                                )))}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-6 py-4 border-t">
                        <div className="text-sm text-muted-foreground">
                            {isLoading ? (
                                "Loading items..."
                            ) : (
                                <>
                                    Showing {articles.length} of {pagination.total} articles
                                </>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={!pagination.has_prev || isLoading}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => p + 1)}
                                disabled={!pagination.has_next || isLoading}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
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
