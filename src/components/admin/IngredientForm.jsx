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
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function IngredientForm({ ingredient, open, onOpenChange, onSave }) {
    const [formData, setFormData] = useState(
        ingredient || {
            name: "",
            alt_names: "",
            calories: 0,
            protein_g: 0,
            carbs_g: 0,
            fat_g: 0,
        }
    )

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!formData.name) {
            toast.error("Please enter an ingredient name")
            return
        }

        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 1000)),
            {
                loading: ingredient ? "Updating ingredient..." : "Creating ingredient...",
                success: () => {
                    onSave({ ...formData, id: ingredient?.id || Date.now() })
                    onOpenChange(false)
                    return ingredient ? "Ingredient updated successfully" : "Ingredient created successfully"
                },
                error: "Failed to save ingredient",
            }
        )
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>
                        {ingredient ? "Edit Ingredient" : "Create New Ingredient"}
                    </DrawerTitle>
                    <DrawerDescription>
                        {ingredient
                            ? "Update ingredient details and nutritional information"
                            : "Add a new ingredient to the database"}
                    </DrawerDescription>
                </DrawerHeader>
                <form onSubmit={handleSubmit} className="overflow-y-auto px-4 pb-4">
                    <div className="space-y-4 max-h-[60vh]">
                        <div className="grid gap-2">
                            <Label htmlFor="name">
                                Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Brown Rice"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="alt_names">Alternative Names</Label>
                            <Input
                                id="alt_names"
                                value={formData.alt_names}
                                onChange={(e) => setFormData({ ...formData, alt_names: e.target.value })}
                                placeholder="e.g., Beras Merah (optional)"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="calories">Calories (per 100g)</Label>
                                <Input
                                    id="calories"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={formData.calories}
                                    onChange={(e) =>
                                        setFormData({ ...formData, calories: parseFloat(e.target.value) || 0 })
                                    }
                                    placeholder="0"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="protein">Protein (g)</Label>
                                <Input
                                    id="protein"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={formData.protein_g}
                                    onChange={(e) =>
                                        setFormData({ ...formData, protein_g: parseFloat(e.target.value) || 0 })
                                    }
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="carbs">Carbohydrates (g)</Label>
                                <Input
                                    id="carbs"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={formData.carbs_g}
                                    onChange={(e) =>
                                        setFormData({ ...formData, carbs_g: parseFloat(e.target.value) || 0 })
                                    }
                                    placeholder="0"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="fat">Fat (g)</Label>
                                <Input
                                    id="fat"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={formData.fat_g}
                                    onChange={(e) =>
                                        setFormData({ ...formData, fat_g: parseFloat(e.target.value) || 0 })
                                    }
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>
                </form>
                <DrawerFooter>
                    <Button onClick={handleSubmit}>
                        {ingredient ? "Update Ingredient" : "Create Ingredient"}
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
