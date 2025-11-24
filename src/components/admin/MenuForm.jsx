import { useState } from "react"
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
import { toast } from "sonner"

const mealTypes = ["BREAKFAST", "LUNCH", "DINNER"]

export function MenuForm({ menu, open, onOpenChange, onSave }) {
    const [formData, setFormData] = useState(
        menu || {
            name: "",
            meal_type: "BREAKFAST",
            tags: "",
            is_active: true,
            ingredients: [],
        }
    )

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!formData.name || !formData.meal_type || formData.ingredients.length === 0) {
            toast.error("Please fill in all required fields and add at least one ingredient")
            return
        }

        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 1000)),
            {
                loading: menu ? "Updating menu..." : "Creating menu...",
                success: () => {
                    onSave({ ...formData, id: menu?.id || Date.now() })
                    onOpenChange(false)
                    return menu ? "Menu updated successfully" : "Menu created successfully"
                },
                error: "Failed to save menu",
            }
        )
    }

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
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="meal_type">
                                Meal Type <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={formData.meal_type}
                                onValueChange={(value) => setFormData({ ...formData, meal_type: value })}
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
                            />
                        </div>

                        <IngredientPicker
                            value={formData.ingredients}
                            onChange={(ingredients) => setFormData({ ...formData, ingredients })}
                        />
                    </div>
                </form>
                <DrawerFooter>
                    <Button onClick={handleSubmit}>
                        {menu ? "Update Menu" : "Create Menu"}
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
