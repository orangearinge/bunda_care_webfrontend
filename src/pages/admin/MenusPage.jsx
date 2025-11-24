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
import { MenuForm } from "@/components/admin/MenuForm"
import { SearchBar } from "@/components/admin/SearchBar"
import { useMenus, useDeleteMenu } from "@/hooks/useMenus"
import { Skeleton } from "@/components/ui/skeleton"

export default function MenusPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [mealTypeFilter, setMealTypeFilter] = useState("ALL")
    const [editingMenu, setEditingMenu] = useState(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    // Build query params
    const queryParams = {
        ...(searchQuery && { search: searchQuery }),
        ...(mealTypeFilter !== "ALL" && { meal_type: mealTypeFilter }),
    }

    // Fetch menus with React Query
    const { data, isLoading, isError } = useMenus(queryParams)
    const deleteMenuMutation = useDeleteMenu()

    const menus = Array.isArray(data) ? data : data?.items || []

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
                if (!tags) return null
                const tagList = typeof tags === 'string' ? tags.split(",") : tags
                return (
                    <div className="flex flex-wrap gap-1">
                        {tagList.slice(0, 2).map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                                {typeof tag === 'string' ? tag.trim() : tag}
                            </Badge>
                        ))}
                        {tagList.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                                +{tagList.length - 2}
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
                const count = row.original.ingredients?.length || 0
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
                                onClick={() => deleteMenuMutation.mutate(menu.id)}
                                className="text-destructive"
                                disabled={deleteMenuMutation.isPending}
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
        data: menus,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

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
                        {isLoading ? (
                            [...Array(5)].map((_, i) => (
                                <TableRow key={i}>
                                    {columns.map((_, j) => (
                                        <TableCell key={j}>
                                            <Skeleton className="h-6 w-full" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : isError ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-destructive">
                                    Failed to load menus
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
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

            {/* Create/Edit Menu Drawer */}
            <MenuForm
                menu={editingMenu}
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
            />
        </div>
    )
}
