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
    IconToolsKitchen2,
    IconPhoto,
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
import { EmptyState } from "@/components/admin/EmptyState"
import { TableSkeleton } from "@/components/admin/TableSkeleton"
import { useMenus, useDeleteMenu } from "@/hooks/useMenus"
import { useDebounce } from "@/hooks/useDebounce"
import { MENU_TARGET_ROLES, MENU_TARGET_ROLES_LIST, MEAL_TYPES, MEAL_TYPES_LIST } from "@/constants/roles"

export default function MenusPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [mealTypeFilter, setMealTypeFilter] = useState("ALL")
    const [statusFilter, setStatusFilter] = useState("ALL")
    const [targetRoleFilter, setTargetRoleFilter] = useState("ALL")
    const [editingMenu, setEditingMenu] = useState(null)
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
        ...(mealTypeFilter !== "ALL" && { meal_type: mealTypeFilter }),
        ...(statusFilter !== "ALL" && { is_active: statusFilter === "ACTIVE" }),
        ...(targetRoleFilter !== "ALL" && { target_role: targetRoleFilter }),
    }

    // Fetch menus with React Query
    const { data, isLoading, isError, isFetching } = useMenus(queryParams)
    const deleteMenuMutation = useDeleteMenu()

    // Cek apakah sedang searching
    const isSearching = searchQuery !== debouncedSearchQuery

    const menus = data?.items || []
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
            cell: ({ row }) => {
                const imageUrl = row.original.image_url
                return (
                    <div className="flex items-center gap-3">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={row.getValue("name")}
                                className="w-10 h-10 object-cover rounded-md border"
                            />
                        ) : (
                            <div className="w-10 h-10 bg-muted rounded-md border flex items-center justify-center">
                                <IconPhoto className="size-4 text-muted-foreground" />
                            </div>
                        )}
                        <div className="font-medium">{row.getValue("name")}</div>
                    </div>
                )
            },
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
            accessorKey: "target_role",
            header: "Target",
            cell: ({ row }) => {
                const role = row.getValue("target_role") || "ALL"
                let variant = "secondary"
                if (role === MENU_TARGET_ROLES.IBU) variant = "default"
                if (role.startsWith("ANAK")) variant = "outline"
                return <Badge variant={variant}>{role}</Badge>
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
            header: "Ingredients / Info",
            cell: ({ row }) => {
                const count = row.original.ingredients?.length || 0
                const isManual = row.original.nutrition_is_manual

                return (
                    <div className="flex flex-col gap-1">
                        <span className="text-sm text-muted-foreground">{count} items</span>
                        {isManual && (
                            <Badge variant="secondary" className="w-fit text-[10px] h-5 px-1.5 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200">
                                Manual Nutrition
                            </Badge>
                        )}
                    </div>
                )
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
                        isLoading={isSearching || isFetching}
                    />
                </div>
                <div className="flex items-center gap-4">
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
                                {MEAL_TYPES_LIST.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <Label htmlFor="status-filter" className="text-sm font-medium">
                            Status:
                        </Label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger id="status-filter" className="w-[140px]" size="sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Status</SelectItem>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="INACTIVE">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <Label htmlFor="role-filter" className="text-sm font-medium">
                            Target:
                        </Label>
                        <Select value={targetRoleFilter} onValueChange={setTargetRoleFilter}>
                            <SelectTrigger id="role-filter" className="w-[140px]" size="sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Roles</SelectItem>
                                {MENU_TARGET_ROLES_LIST.map((role) => (
                                    <SelectItem key={role} value={role}>
                                        {role === 'IBU' ? 'IBU' : role.replace('ANAK_', 'ANAK ')}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
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
                            <TableSkeleton rows={5} columns={columns.length} />
                        ) : isError ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="p-0">
                                    <EmptyState
                                        title="Failed to load menus"
                                        description="There was an error loading the menu data. Please try again."
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
                                        icon={IconToolsKitchen2}
                                        title="No menus found"
                                        description={searchQuery || mealTypeFilter !== "ALL" || statusFilter !== "ALL"
                                            ? "No menus match your search criteria. Try adjusting your filters."
                                            : "No menus have been created yet."}
                                        action={
                                            <Button onClick={handleCreateNew} size="sm">
                                                <IconPlus className="mr-2 size-4" />
                                                Create Your First Menu
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
                            {Math.min(page * limit, total)} of {total} menus
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

            {/* Create/Edit Menu Drawer */}
            <MenuForm
                menu={editingMenu}
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
            />
        </div>
    )
}
