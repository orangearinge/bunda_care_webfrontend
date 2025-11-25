import { useState } from "react"
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { IconChevronLeft, IconChevronRight, IconDotsVertical, IconUserEdit, IconUsers } from "@tabler/icons-react"
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
import { UserRoleDialog } from "@/components/admin/UserRoleDialog"
import { SearchBar } from "@/components/admin/SearchBar"
import { EmptyState } from "@/components/admin/EmptyState"
import { TableSkeleton } from "@/components/admin/TableSkeleton"
import { useUsers } from "@/hooks/useUsers"
import { useDebounce } from "@/hooks/useDebounce"

export default function UsersPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [roleFilter, setRoleFilter] = useState("ALL")
    const [editingUser, setEditingUser] = useState(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [page, setPage] = useState(1)
    const [limit] = useState(10)

    // Debounce search query untuk mengurangi API calls
    const debouncedSearchQuery = useDebounce(searchQuery, 500)

    // Build query params
    const queryParams = {
        page,
        limit,
        ...(debouncedSearchQuery && { search: debouncedSearchQuery }),
        ...(roleFilter !== "ALL" && { role: roleFilter }),
    }

    // Fetch users with React Query
    const { data, isLoading, isError, isFetching } = useUsers(queryParams)

    // Cek apakah sedang searching (user mengetik tapi belum di-debounce)
    const isSearching = searchQuery !== debouncedSearchQuery

    const users = data?.items || []
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
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => {
                const role = row.getValue("role")
                return (
                    <Badge variant={role === "ADMIN" ? "default" : "outline"}>
                        {role}
                    </Badge>
                )
            },
        },
        {
            accessorKey: "createdAt",
            header: "Created At",
            cell: ({ row }) => {
                const date = new Date(row.getValue("createdAt"))
                return date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                })
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const user = row.original
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
                                    setEditingUser(user)
                                    setIsDialogOpen(true)
                                }}
                            >
                                <IconUserEdit className="mr-2 size-4" />
                                Edit Role
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const table = useReactTable({
        data: users,
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

    return (
        <div className="flex flex-col gap-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                <p className="text-muted-foreground">
                    Manage users, view details, and update roles
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1 max-w-sm">
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search by name or email..."
                        onClear={() => setSearchQuery("")}
                        isLoading={isSearching || isFetching}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Label htmlFor="role-filter" className="text-sm font-medium">
                        Role:
                    </Label>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger id="role-filter" className="w-[140px]" size="sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Roles</SelectItem>
                            <SelectItem value="ADMIN">ADMIN</SelectItem>
                            <SelectItem value="IBU_HAMIL">IBU_HAMIL</SelectItem>
                            <SelectItem value="IBU_MENYUSUI">IBU_MENYUSUI</SelectItem>
                            <SelectItem value="ANAK_BALITA">ANAK_BALITA</SelectItem>
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
                                        title="Failed to load users"
                                        description="There was an error loading the user data. Please try again."
                                    />
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
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
                                        icon={IconUsers}
                                        title="No users found"
                                        description={searchQuery || roleFilter !== "ALL"
                                            ? "No users match your search criteria. Try adjusting your filters."
                                            : "No users have been registered yet."}
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
                            {Math.min(page * limit, total)} of {total} users
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

            {/* Edit Role Dialog */}
            <UserRoleDialog
                user={editingUser}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            />
        </div>
    )
}
