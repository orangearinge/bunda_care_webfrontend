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
import { Button } from "@/components/ui/button"
import { useCreateIngredient, useUpdateIngredient } from "@/hooks/useIngredients"
import { toast } from "sonner"

export function IngredientForm({ ingredient, open, onOpenChange }) {
    const [formData, setFormData] = useState({
        name: "",
        alt_names: "",
        calories: 0,
        protein_g: 0,
        carbs_g: 0,
        fat_g: 0,
    })

    const createIngredientMutation = useCreateIngredient()
    const updateIngredientMutation = useUpdateIngredient()

    // Update form data when ingredient changes
    useEffect(() => {
        if (ingredient) {
            setFormData(ingredient)
        } else {
            setFormData({
                name: "",
                alt_names: "",
                calories: 0,
                protein_g: 0,
                carbs_g: 0,
                fat_g: 0,
            })
        }
    }, [ingredient])

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!formData.name) {
            toast.error("Please enter an ingredient name")
            return
        }

        if (ingredient) {
            // Update existing ingredient
            updateIngredientMutation.mutate(
                { id: ingredient.id, data: formData },
                {
                    onSuccess: () => {
                        onOpenChange(false)
                    },
                }
            )
        } else {
            // Create new ingredient
            createIngredientMutation.mutate(formData, {
                onSuccess: () => {
                    onOpenChange(false)
                },
            })
        }
    }

    const isPending = createIngredientMutation.isPending || updateIngredientMutation.isPending

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
                                disabled={isPending}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="alt_names">Alternative Names</Label>
                            <Input
                                id="alt_names"
                                value={formData.alt_names}
                                onChange={(e) => setFormData({ ...formData, alt_names: e.target.value })}
                                placeholder="e.g., Beras Merah (optional)"
                                disabled={isPending}
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
                                    disabled={isPending}
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
                                    disabled={isPending}
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
                                    disabled={isPending}
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
                                    disabled={isPending}
                                />
                            </div>
                        </div>
                    </div>
                </form>
                <DrawerFooter>
                    <Button onClick={handleSubmit} disabled={isPending}>
                        {isPending ? (ingredient ? "Updating..." : "Creating...") : (ingredient ? "Update Ingredient" : "Create Ingredient")}
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="outline" disabled={isPending}>Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
