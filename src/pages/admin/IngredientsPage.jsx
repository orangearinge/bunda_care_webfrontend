import { useState, useMemo } from "react"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
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
import { mockIngredients } from "@/data/mockData"
import { IngredientForm } from "@/components/admin/IngredientForm"
import { SearchBar } from "@/components/admin/SearchBar"
import { toast } from "sonner"

export default function IngredientsPage() {
    const [data, setData] = useState(mockIngredients)
    const [searchQuery, setSearchQuery] = useState("")
    const [editingIngredient, setEditingIngredient] = useState(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })

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
                return <div className="text-right tabular-nums">{protein.toFixed(1)}</div>
            },
        },
        {
            accessorKey: "carbs_g",
            header: () => <div className="text-right">Carbs (g)</div>,
            cell: ({ row }) => {
                const carbs = row.getValue("carbs_g")
                return <div className="text-right tabular-nums">{carbs.toFixed(1)}</div>
            },
        },
        {
            accessorKey: "fat_g",
            header: () => <div className="text-right">Fat (g)</div>,
            cell: ({ row }) => {
                const fat = row.getValue("fat_g")
                return <div className="text-right tabular-nums">{fat.toFixed(1)}</div>
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
                                onClick={() => handleDelete(ingredient.id)}
                                className="text-destructive"
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

    const filteredData = useMemo(() => {
        return data.filter((ingredient) => {
            const searchLower = searchQuery.toLowerCase()
            return (
                ingredient.name.toLowerCase().includes(searchLower) ||
                ingredient.alt_names?.toLowerCase().includes(searchLower)
            )
        })
    }, [data, searchQuery])

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        state: {
            pagination,
        },
    })

    const handleSave = (savedIngredient) => {
        if (editingIngredient) {
            setData((prev) =>
                prev.map((ing) => (ing.id === savedIngredient.id ? savedIngredient : ing))
            )
        } else {
            setData((prev) => [...prev, savedIngredient])
        }
    }

    const handleDelete = (id) => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 800)),
            {
                loading: "Deleting ingredient...",
                success: () => {
                    setData((prev) => prev.filter((ing) => ing.id !== id))
                    return "Ingredient deleted successfully"
                },
                error: "Failed to delete ingredient",
            }
        )
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
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No ingredients found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
                    {Math.min(
                        (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                        filteredData.length
                    )}{" "}
                    of {filteredData.length} ingredients
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <IconChevronLeft className="size-4" />
                        Previous
                    </Button>
                    <div className="text-sm">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
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
                onSave={handleSave}
            />
        </div>
    )
}
