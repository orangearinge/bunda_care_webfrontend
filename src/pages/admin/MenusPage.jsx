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
import { Badge } from "@/components/ui/badge"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { mockMenus } from "@/data/mockData"
import { MenuForm } from "@/components/admin/MenuForm"
import { SearchBar } from "@/components/admin/SearchBar"
import { toast } from "sonner"

export default function MenusPage() {
    const [data, setData] = useState(mockMenus)
    const [searchQuery, setSearchQuery] = useState("")
    const [mealTypeFilter, setMealTypeFilter] = useState("ALL")
    const [editingMenu, setEditingMenu] = useState(null)
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
            accessorKey: "meal_type",
            header: "Meal Type",
            cell: ({ row }) => {
                const type = row.getValue("meal_type")
                return <Badge variant="outline">{type}</Badge>
            },
        },
        {
            accessorKey: "tags",
            header: "Tags",
            cell: ({ row }) => {
                const tags = row.getValue("tags")
                return (
                    <div className="flex flex-wrap gap-1">
                        {tags.split(",").slice(0, 2).map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                                {tag.trim()}
                            </Badge>
                        ))}
                        {tags.split(",").length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                                +{tags.split(",").length - 2}
                            </Badge>
                        )}
                    </div>
                )
            },
        },
        {
            accessorKey: "is_active",
            header: "Status",
            cell: ({ row }) => {
                const isActive = row.getValue("is_active")
                return (
                    <Badge variant={isActive ? "default" : "outline"}>
                        {isActive ? "Active" : "Inactive"}
                    </Badge>
                )
            },
        },
        {
            id: "ingredients",
            header: "Ingredients",
            cell: ({ row }) => {
                const count = row.original.ingredients.length
                return <div className="text-sm text-muted-foreground">{count} items</div>
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const menu = row.original
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
                                    setEditingMenu(menu)
                                    setIsDrawerOpen(true)
                                }}
                            >
                                <IconEdit className="mr-2 size-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleDelete(menu.id)}
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
        return data.filter((menu) => {
            const matchesSearch = menu.name.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesMealType = mealTypeFilter === "ALL" || menu.meal_type === mealTypeFilter
            return matchesSearch && matchesMealType
        })
    }, [data, searchQuery, mealTypeFilter])

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

    const handleSave = (savedMenu) => {
        if (editingMenu) {
            setData((prev) => prev.map((menu) => (menu.id === savedMenu.id ? savedMenu : menu)))
        } else {
            setData((prev) => [...prev, savedMenu])
        }
    }

    const handleDelete = (id) => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 800)),
            {
                loading: "Deleting menu...",
                success: () => {
                    setData((prev) => prev.filter((menu) => menu.id !== id))
                    return "Menu deleted successfully"
                },
                error: "Failed to delete menu",
            }
        )
    }

    const handleCreateNew = () => {
        setEditingMenu(null)
        setIsDrawerOpen(true)
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
                    <p className="text-muted-foreground">
                        Create and manage food menus with nutritional information
                    </p>
                </div>
                <Button onClick={handleCreateNew}>
                    <IconPlus className="mr-2 size-4" />
                    Create Menu
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1 max-w-sm">
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search menus..."
                        onClear={() => setSearchQuery("")}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Label htmlFor="meal-filter" className="text-sm font-medium">
                        Meal Type:
                    </Label>
                    <Select value={mealTypeFilter} onValueChange={setMealTypeFilter}>
                        <SelectTrigger id="meal-filter" className="w-[140px]" size="sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Types</SelectItem>
                            <SelectItem value="BREAKFAST">BREAKFAST</SelectItem>
                            <SelectItem value="LUNCH">LUNCH</SelectItem>
                            <SelectItem value="DINNER">DINNER</SelectItem>
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
                                    No menus found.
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
                    of {filteredData.length} menus
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

            {/* Create/Edit Menu Drawer */}
            <MenuForm
                menu={editingMenu}
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                onSave={handleSave}
            />
        </div>
    )
}
