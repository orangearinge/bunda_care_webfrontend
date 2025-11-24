import { useState, useEffect } from "react"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { IngredientPicker } from "@/components/admin/IngredientPicker"
import { useCreateMenu, useUpdateMenu } from "@/hooks/useMenus"
import { toast } from "sonner"

const mealTypes = ["BREAKFAST", "LUNCH", "DINNER"]

export function MenuForm({ menu, open, onOpenChange }) {
    const [formData, setFormData] = useState({
        name: "",
        meal_type: "BREAKFAST",
        tags: "",
        is_active: true,
        ingredients: [],
    })

    const createMenuMutation = useCreateMenu()
    const updateMenuMutation = useUpdateMenu()

    // Update form data when menu changes
    useEffect(() => {
        if (menu) {
            setFormData(menu)
        } else {
            setFormData({
                name: "",
                meal_type: "BREAKFAST",
                tags: "",
                is_active: true,
                ingredients: [],
            })
        }
    }, [menu])

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!formData.name || !formData.meal_type || formData.ingredients.length === 0) {
            toast.error("Please fill in all required fields and add at least one ingredient")
            return
        }

        if (menu) {
            // Update existing menu
            updateMenuMutation.mutate(
                { id: menu.id, data: formData },
                {
                    onSuccess: () => {
                        onOpenChange(false)
                    },
                }
            )
        } else {
            // Create new menu
            createMenuMutation.mutate(formData, {
                onSuccess: () => {
                    onOpenChange(false)
                },
            })
        }
    }

    const isPending = createMenuMutation.isPending || updateMenuMutation.isPending

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>{menu ? "Edit Menu" : "Create New Menu"}</DrawerTitle>
                    <DrawerDescription>
                        {menu ? "Update menu details and ingredients" : "Add a new menu to your collection"}
                    </DrawerDescription>
                </DrawerHeader>
                <form onSubmit={handleSubmit} className="overflow-y-auto px-4 pb-4">
                    <div className="space-y-4 max-h-[60vh]">
                        <div className="grid gap-2">
                            <Label htmlFor="name">
                                Menu Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Healthy Breakfast Bowl"
                                required
                                disabled={isPending}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="meal_type">
                                Meal Type <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={formData.meal_type}
                                onValueChange={(value) => setFormData({ ...formData, meal_type: value })}
                                disabled={isPending}
                            >
                                <SelectTrigger id="meal_type">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {mealTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="tags">Tags</Label>
                            <Input
                                id="tags"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                placeholder="e.g., healthy,protein,fiber (comma separated)"
                                disabled={isPending}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="is_active">Active Status</Label>
                            <Switch
                                id="is_active"
                                checked={formData.is_active}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, is_active: checked })
                                }
                                disabled={isPending}
                            />
                        </div>

                        <IngredientPicker
                            value={formData.ingredients}
                            onChange={(ingredients) => setFormData({ ...formData, ingredients })}
                            disabled={isPending}
                        />
                    </div>
                </form>
                <DrawerFooter>
                    <Button onClick={handleSubmit} disabled={isPending}>
                        {isPending ? (menu ? "Updating..." : "Creating...") : (menu ? "Update Menu" : "Create Menu")}
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="outline" disabled={isPending}>Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
