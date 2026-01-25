import { useState, useMemo, useEffect } from "react"
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { IconChevronLeft, IconChevronRight, IconMessageReport, IconSearch, IconEye, IconSparkles } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { SearchBar } from "@/components/admin/SearchBar"
import { EmptyState } from "@/components/admin/EmptyState"
import { TableSkeleton } from "@/components/admin/TableSkeleton"
import { useFeedbacks, useAnalyzeFeedback } from "@/hooks/useFeedbacks"
import { useDebounce } from "@/hooks/useDebounce"
import { FeedbackDetailDialog } from "@/components/admin/FeedbackDetailDialog"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

export default function FeedbacksPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [classificationFilter, setClassificationFilter] = useState("ALL")
    const [page, setPage] = useState(1)
    const [limit] = useState(10)
    const [selectedFeedback, setSelectedFeedback] = useState(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)

    // Debounce search query
    const debouncedSearchQuery = useDebounce(searchQuery, 500)

    // Build query params
    const queryParams = {
        page,
        limit,
        ...(debouncedSearchQuery && { search: debouncedSearchQuery }),
        ...(classificationFilter !== "ALL" && { classification: classificationFilter }),
    }

    const { data, isLoading, isError, isFetching } = useFeedbacks(queryParams)
    const analyzeMutation = useAnalyzeFeedback()

    // Reset page when search query changes
    useEffect(() => {
        setPage(1)
    }, [debouncedSearchQuery])

    const isSearching = searchQuery !== debouncedSearchQuery

    const feedbacks = data?.items || []
    const totalPages = data?.pagination?.total_pages || 1
    const total = data?.pagination?.total || 0

    const columns = [
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => <div className="w-12">{row.getValue("id")}</div>,
        },
        {
            accessorKey: "user_name",
            header: "User",
            cell: ({ row }) => <div className="font-medium">{row.getValue("user_name") || "Anonymous"}</div>
        },
        {
            accessorKey: "comment",
            header: "Comment",
            cell: ({ row }) => <div className="max-w-[400px] truncate" title={row.getValue("comment")}>{row.getValue("comment")}</div>,
        },
        {
            accessorKey: "classification",
            header: "AI Analysis",
            cell: ({ row }) => {
                let classification = row.getValue("classification")

                // Handle raw JSON-like string from database if any
                if (classification && (classification.startsWith('{') || classification.includes('"prediction"'))) {
                    try {
                        const parsed = typeof classification === 'string' ? JSON.parse(classification.replace(/'/g, '"')) : classification
                        classification = parsed.prediction || classification
                    } catch (e) {
                        // Fallback if not valid JSON
                        if (classification.includes("'prediction': 'positive'")) classification = "positive"
                        else if (classification.includes("'prediction': 'negative'")) classification = "negative"
                    }
                }

                if (!classification) return <Badge variant="outline">Pending</Badge>

                const label = classification.toLowerCase()
                const isPositive = label === "positif" || label === "positive"
                const isNegative = label === "negatif" || label === "negative"

                const displayText = label === "positive" ? "Positif" : (label === "negative" ? "Negatif" : classification)

                return (
                    <Badge
                        variant={isPositive ? "default" : (isNegative ? "destructive" : "secondary")}
                        className="border-none px-3"
                    >
                        {displayText}
                    </Badge>
                )
            },
        },
        {
            accessorKey: "rating",
            header: "Rating",
            cell: ({ row }) => <div className="font-medium text-center w-12">{row.getValue("rating")}</div>,
        },
        {
            accessorKey: "created_at",
            header: "Date",
            cell: ({ row }) => {
                const val = row.getValue("created_at")
                if (!val) return "-"
                const date = new Date(val)
                return date.toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                })
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const feedback = row.original
                const needsAnalysis = !feedback.classification

                return (
                    <div className="flex items-center gap-1">
                        {needsAnalysis && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                            disabled={analyzeMutation.isPending}
                                            onClick={() => analyzeMutation.mutate(feedback.id)}
                                        >
                                            <IconSparkles className={`size-4 ${analyzeMutation.isPending ? 'animate-pulse' : ''}`} />
                                            <span className="sr-only">Analyze with AI</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Run AI Analysis manually</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() => {
                                setSelectedFeedback(row.original)
                                setIsDetailOpen(true)
                            }}
                        >
                            <IconEye className="size-4" />
                            <span className="sr-only">View Details</span>
                        </Button>
                    </div>
                )
            },
        },
    ]

    const table = useReactTable({
        data: feedbacks,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: totalPages,
    })

    const handlePrevious = () => {
        if (page > 1) setPage(page - 1)
    }

    const handleNext = () => {
        if (page < totalPages) setPage(page + 1)
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Feedback Management</h1>
                <p className="text-muted-foreground">
                    Monitor user feedback and AI sentiment analysis
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1 max-w-sm">
                    <SearchBar
                        placeholder="Search feedback..."
                        value={searchQuery}
                        onChange={setSearchQuery}
                        onClear={() => setSearchQuery("")}
                        isLoading={isSearching || isFetching}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Label htmlFor="classification-filter" className="text-sm font-medium">
                        Classification:
                    </Label>
                    <Select value={classificationFilter} onValueChange={(val) => {
                        setClassificationFilter(val)
                        setPage(1)
                    }}>
                        <SelectTrigger id="classification-filter" className="w-[140px]" size="sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Status</SelectItem>
                            <SelectItem value="Positif">Positif</SelectItem>
                            <SelectItem value="Negatif">Negatif</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Data Table */}
            <div className="rounded-lg border">
                <Table>
                    <TableHeader className="bg-muted/50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableSkeleton rows={5} columns={columns.length} />
                        ) : isError ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="p-0">
                                    <EmptyState
                                        title="Failed to load feedbacks"
                                        description="There was an error loading the data."
                                    />
                                </TableCell>
                            </TableRow>
                        ) : feedbacks.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="transition-colors"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="p-0">
                                    <EmptyState
                                        icon={IconMessageReport}
                                        title="No feedback found"
                                        description={searchQuery || classificationFilter !== "ALL"
                                            ? "No feedback matches your criteria."
                                            : "No feedback has been submitted yet."}
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    {isLoading ? (
                        "Loading..."
                    ) : (
                        <>
                            Showing {(page - 1) * limit + 1} to{" "}
                            {Math.min(page * limit, total)} of {total} feedbacks
                        </>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrevious}
                        disabled={page === 1 || isLoading}
                    >
                        <IconChevronLeft className="size-4" />
                        Previous
                    </Button>
                    <div className="text-sm">
                        Page {page} of {totalPages}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNext}
                        disabled={page >= totalPages || isLoading}
                    >
                        Next
                        <IconChevronRight className="size-4" />
                    </Button>
                </div>
                {/* Feedback Detail Dialog */}
                <FeedbackDetailDialog
                    feedback={selectedFeedback}
                    open={isDetailOpen}
                    onOpenChange={setIsDetailOpen}
                />
            </div>
        </div>
    )
}
