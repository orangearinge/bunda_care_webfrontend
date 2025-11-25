import { useState } from "react"
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    IconChevronLeft,
    IconChevronRight,
    IconDotsVertical,
    IconEdit,
    IconPlus,
    IconTrash,
    IconCarrot,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { IngredientForm } from "@/components/admin/IngredientForm"
import { SearchBar } from "@/components/admin/SearchBar"
import { EmptyState } from "@/components/admin/EmptyState"
import { TableSkeleton } from "@/components/admin/TableSkeleton"
import { useIngredients, useDeleteIngredient } from "@/hooks/useIngredients"
import { useDebounce } from "@/hooks/useDebounce"

export default function IngredientsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [editingIngredient, setEditingIngredient] = useState(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [page, setPage] = useState(1)
    const [limit] = useState(10)

    // Debounce search query untuk mengurangi API calls
    const debouncedSearchQuery = useDebounce(searchQuery, 500)

    // Build query params
    const queryParams = {
        page,
        limit,
        ...(debouncedSearchQuery && { search: debouncedSearchQuery }),
    }

    // Fetch ingredients with React Query
    const { data, isLoading, isError, isFetching } = useIngredients(queryParams)
    const deleteIngredientMutation = useDeleteIngredient()

    // Cek apakah sedang searching
    const isSearching = searchQuery !== debouncedSearchQuery

    const ingredients = data?.items || []
    const totalPages = data?.pages || 1
    const total = data?.total || 0

    const columns = [
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => <div className="w-12">{row.getValue("id")}</div>,
        },
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
        },
        {
            accessorKey: "alt_names",
            header: "Alternative Names",
            cell: ({ row }) => {
                const alt = row.getValue("alt_names")
                return <div className="text-muted-foreground">{alt || "-"}</div>
            },
        },
        {
            accessorKey: "calories",
            header: () => <div className="text-right">Calories</div>,
            cell: ({ row }) => {
                const calories = row.getValue("calories")
                return <div className="text-right tabular-nums">{calories}</div>
            },
        },
        {
            accessorKey: "protein_g",
            header: () => <div className="text-right">Protein (g)</div>,
            cell: ({ row }) => {
                const protein = row.getValue("protein_g")
                return <div className="text-right tabular-nums">{protein?.toFixed(1) || "0.0"}</div>
            },
        },
        {
            accessorKey: "carbs_g",
            header: () => <div className="text-right">Carbs (g)</div>,
            cell: ({ row }) => {
                const carbs = row.getValue("carbs_g")
                return <div className="text-right tabular-nums">{carbs?.toFixed(1) || "0.0"}</div>
            },
        },
        {
            accessorKey: "fat_g",
            header: () => <div className="text-right">Fat (g)</div>,
            cell: ({ row }) => {
                const fat = row.getValue("fat_g")
                return <div className="text-right tabular-nums">{fat?.toFixed(1) || "0.0"}</div>
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const ingredient = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                                <IconDotsVertical className="size-4" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => {
                                    setEditingIngredient(ingredient)
                                    setIsDrawerOpen(true)
                                }}
                            >
                                <IconEdit className="mr-2 size-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => deleteIngredientMutation.mutate(ingredient.id)}
                                className="text-destructive"
                                disabled={deleteIngredientMutation.isPending}
                            >
                                <IconTrash className="mr-2 size-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const table = useReactTable({
        data: ingredients,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        pageCount: totalPages,
    })

    const handlePrevious = () => {
        if (page > 1) setPage(page - 1)
    }

    const handleNext = () => {
        if (page < totalPages) setPage(page + 1)
    }

    const handleCreateNew = () => {
        setEditingIngredient(null)
        setIsDrawerOpen(true)
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Ingredient Management</h1>
                    <p className="text-muted-foreground">
                        Manage ingredient database with nutritional information
                    </p>
                </div>
                <Button onClick={handleCreateNew}>
                    <IconPlus className="mr-2 size-4" />
                    Create Ingredient
                </Button>
            </div>

            {/* Search */}
            <div className="max-w-sm">
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search ingredients..."
                    onClear={() => setSearchQuery("")}
                    isLoading={isSearching || isFetching}
                />
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
                                            : flexRender(header.column.columnDef.header, header.getContext())}
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
                                        title="Failed to load ingredients"
                                        description="There was an error loading the ingredient data. Please try again."
                                    />
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="transition-colors">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="p-0">
                                    <EmptyState
                                        icon={IconCarrot}
                                        title="No ingredients found"
                                        description={searchQuery
                                            ? "No ingredients match your search criteria. Try a different search term."
                                            : "No ingredients have been added yet."}
                                        action={
                                            <Button onClick={handleCreateNew} size="sm">
                                                <IconPlus className="mr-2 size-4" />
                                                Add Your First Ingredient
                                            </Button>
                                        }
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
                            {Math.min(page * limit, total)} of {total} ingredients
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
            </div>

            {/* Create/Edit Ingredient Drawer */}
            <IngredientForm
                ingredient={editingIngredient}
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
            />
        </div>
    )
}
