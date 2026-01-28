import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useUpdateUserRole } from "@/hooks/useUsers"
import { ROLES_LIST, USER_ROLES, getRoleLabel } from "@/constants/roles"



export function UserRoleDialog({ user, open, onOpenChange }) {
    const [selectedRole, setSelectedRole] = useState(user?.role || USER_ROLES.IBU_HAMIL)
    const updateRoleMutation = useUpdateUserRole()

    // Update selected role when user changes
    useEffect(() => {
        if (user?.role) {
            setSelectedRole(user.role)
        }
    }, [user])

    const handleSave = () => {
        if (!user) return

        updateRoleMutation.mutate(
            { id: user.id, role: selectedRole },
            {
                onSuccess: () => {
                    onOpenChange(false)
                },
            }
        )
    }

    if (!user) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit User Role</DialogTitle>
                    <DialogDescription>
                        Change the role for {user.name} ({user.email})
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="role">Role</Label>
                        <Select value={selectedRole} onValueChange={setSelectedRole} disabled={updateRoleMutation.isPending}>
                            <SelectTrigger id="role">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                {ROLES_LIST.map((role) => (
                                    <SelectItem key={role} value={role}>
                                        {getRoleLabel(role)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={updateRoleMutation.isPending}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={updateRoleMutation.isPending}>
                        {updateRoleMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
