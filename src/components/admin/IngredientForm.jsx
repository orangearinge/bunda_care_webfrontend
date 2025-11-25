import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { ingredientSchema } from "@/schemas/ingredientSchemas"

export function IngredientForm({ ingredient, open, onOpenChange }) {
    const createIngredientMutation = useCreateIngredient()
    const updateIngredientMutation = useUpdateIngredient()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(ingredientSchema),
        defaultValues: {
            name: "",
            alt_names: "",
            calories: 0,
            protein_g: 0,
            carbs_g: 0,
            fat_g: 0,
        },
    })

    // Update form data when ingredient changes
    useEffect(() => {
        if (ingredient) {
            reset(ingredient)
        } else {
            reset({
                name: "",
                alt_names: "",
                calories: 0,
                protein_g: 0,
                carbs_g: 0,
                fat_g: 0,
            })
        }
    }, [ingredient, reset])

    const onSubmit = (data) => {
        if (ingredient) {
            // Update existing ingredient
            updateIngredientMutation.mutate(
                { id: ingredient.id, data },
                {
                    onSuccess: () => {
                        onOpenChange(false)
                    },
                }
            )
        } else {
            // Create new ingredient
            createIngredientMutation.mutate(data, {
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
                <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto px-4 pb-4">
                    <div className="space-y-4 max-h-[60vh]">
                        <div className="grid gap-2">
                            <Label htmlFor="name">
                                Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                {...register("name")}
                                placeholder="e.g., Brown Rice"
                                disabled={isPending}
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="alt_names">Alternative Names</Label>
                            <Input
                                id="alt_names"
                                {...register("alt_names")}
                                placeholder="e.g., Beras Merah (optional)"
                                disabled={isPending}
                            />
                            {errors.alt_names && (
                                <p className="text-sm text-destructive">{errors.alt_names.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="calories">Calories (per 100g)</Label>
                                <Input
                                    id="calories"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    {...register("calories", { valueAsNumber: true })}
                                    placeholder="0"
                                    disabled={isPending}
                                />
                                {errors.calories && (
                                    <p className="text-sm text-destructive">{errors.calories.message}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="protein">Protein (g)</Label>
                                <Input
                                    id="protein"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    {...register("protein_g", { valueAsNumber: true })}
                                    placeholder="0"
                                    disabled={isPending}
                                />
                                {errors.protein_g && (
                                    <p className="text-sm text-destructive">{errors.protein_g.message}</p>
                                )}
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
                                    {...register("carbs_g", { valueAsNumber: true })}
                                    placeholder="0"
                                    disabled={isPending}
                                />
                                {errors.carbs_g && (
                                    <p className="text-sm text-destructive">{errors.carbs_g.message}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="fat">Fat (g)</Label>
                                <Input
                                    id="fat"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    {...register("fat_g", { valueAsNumber: true })}
                                    placeholder="0"
                                    disabled={isPending}
                                />
                                {errors.fat_g && (
                                    <p className="text-sm text-destructive">{errors.fat_g.message}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
                <DrawerFooter>
                    <Button onClick={handleSubmit(onSubmit)} disabled={isPending}>
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