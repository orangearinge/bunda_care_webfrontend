import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
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
import { Textarea } from "@/components/ui/textarea"
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
import { ImageUpload } from "@/components/admin/ImageUpload"
import { useCreateMenu, useUpdateMenu } from "@/hooks/useMenus"
import { menuSchema } from "@/schemas/menuSchemas"
import { MEAL_TYPES, MEAL_TYPES_LIST, MENU_TARGET_ROLES } from "@/constants/roles"

const targetRolesLabels = {
    ALL: "All Users",
    [MENU_TARGET_ROLES.IBU]: "Mothers (Ibu)",
    ANAK: "Children (General)",
    [MENU_TARGET_ROLES.ANAK_6_8]: "Infant (6-8 Months)",
    [MENU_TARGET_ROLES.ANAK_9_11]: "Infant (9-11 Months)",
    [MENU_TARGET_ROLES.ANAK_12_23]: "Toddler (12-23 Months)",
}

const targetRolesOptions = [
    { value: "ALL", label: targetRolesLabels.ALL },
    { value: MENU_TARGET_ROLES.IBU, label: targetRolesLabels[MENU_TARGET_ROLES.IBU] },
    { value: "ANAK", label: targetRolesLabels.ANAK },
    { value: MENU_TARGET_ROLES.ANAK_6_8, label: targetRolesLabels[MENU_TARGET_ROLES.ANAK_6_8] },
    { value: MENU_TARGET_ROLES.ANAK_9_11, label: targetRolesLabels[MENU_TARGET_ROLES.ANAK_9_11] },
    { value: MENU_TARGET_ROLES.ANAK_12_23, label: targetRolesLabels[MENU_TARGET_ROLES.ANAK_12_23] },
]

export function MenuForm({ menu, open, onOpenChange }) {
    const createMenuMutation = useCreateMenu()
    const updateMenuMutation = useUpdateMenu()

    const {
        register,
        handleSubmit,
        control,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(menuSchema),
        defaultValues: {
            name: "",
            meal_type: MEAL_TYPES.BREAKFAST,
            tags: "",
            image_url: "",
            is_active: true,
            description: "",
            cooking_instructions: "",
            cooking_time_minutes: null,
            target_role: "ALL",
            ingredients: [],
            nutrition_is_manual: false,
            serving_unit: "",
            manual_calories: null,
            manual_protein_g: null,
            manual_carbs_g: null,
            manual_fat_g: null,
        },
    })

    // Watch nutrition_is_manual to show/hide manual fields
    const nutritionIsManual = watch("nutrition_is_manual")

    // Update form data when menu changes
    useEffect(() => {
        if (menu) {
            // Format menu data for form
            const formattedMenu = {
                ...menu,
                description: menu.description || "",
                cooking_instructions: menu.cooking_instructions || "",
                cooking_time_minutes: menu.cooking_time_minutes === null ? "" : menu.cooking_time_minutes,
                target_role: menu.target_role || "ALL",
                tags: menu.tags || "",
                ingredients: menu.ingredients?.map(ing => ({
                    ingredient_id: ing.ingredient_id || ing.id,
                    quantity_g: ing.quantity_g,
                    display_text: ing.display_text || ing.display_quantity || "",
                    name: ing.name // Keep name for display
                })) || [],
                nutrition_is_manual: menu.nutrition_is_manual || false,
                serving_unit: menu.serving_unit || "",
                manual_calories: (menu.manual_calories !== undefined && menu.manual_calories !== null) ? menu.manual_calories : null,
                manual_protein_g: (menu.manual_protein_g !== undefined && menu.manual_protein_g !== null) ? menu.manual_protein_g : null,
                manual_carbs_g: (menu.manual_carbs_g !== undefined && menu.manual_carbs_g !== null) ? menu.manual_carbs_g : null,
                manual_fat_g: (menu.manual_fat_g !== undefined && menu.manual_fat_g !== null) ? menu.manual_fat_g : null,
            }
            console.log('Loading menu for edit:', formattedMenu) // Debug log
            reset(formattedMenu)
        } else {
            reset({
                name: "",
                meal_type: MEAL_TYPES.BREAKFAST,
                tags: "",
                image_url: "",
                is_active: true,
                description: "",
                cooking_instructions: "",
                cooking_time_minutes: null,
                target_role: "ALL",
                ingredients: [],
                nutrition_is_manual: false,
                serving_unit: "",
                manual_calories: null,
                manual_protein_g: null,
                manual_carbs_g: null,
                manual_fat_g: null,
            })
        }
    }, [menu, reset])

    const onSubmit = (data) => {
        // Format ingredients data for API
        const formattedIngredients = data.ingredients
            .map(ing => {
                const ingredientId = ing.ingredient_id || ing.id

                // Skip if no ingredient_id
                return {
                    ingredient_id: ingredientId ? (typeof ingredientId === 'string' ? parseInt(ingredientId) : ingredientId) : null,
                    quantity_g: (ing.quantity_g !== null && ing.quantity_g !== undefined && ing.quantity_g !== "") ? (typeof ing.quantity_g === 'string' ? parseFloat(ing.quantity_g) : ing.quantity_g) : null,
                    display_text: ing.display_text || null
                }
            })
            // Filter out ingredients that have NOTHING (no ID and no text)
            .filter(ing => ing.ingredient_id !== null || (ing.display_text && ing.display_text.trim() !== ""))

        const formattedData = {
            ...data,
            ingredients: formattedIngredients,
            cooking_time_minutes: data.cooking_time_minutes === "" || data.cooking_time_minutes === undefined ? null : Number(data.cooking_time_minutes),
            // Manual nutrition fields
            nutrition_is_manual: data.nutrition_is_manual || false,
            serving_unit: data.serving_unit || null,
            manual_calories: data.manual_calories || null,
            manual_protein_g: data.manual_protein_g || null,
            manual_carbs_g: data.manual_carbs_g || null,
            manual_fat_g: data.manual_fat_g || null,
        }

        console.log('Submitting menu data:', formattedData) // Debug log

        if (menu) {
            // Update existing menu
            updateMenuMutation.mutate(
                { id: menu.id, data: formattedData },
                {
                    onSuccess: () => {
                        onOpenChange(false)
                    },
                }
            )
        } else {
            // Create new menu
            createMenuMutation.mutate(formattedData, {
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
                <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto px-4 pb-4">
                    <div className="space-y-4 max-h-[60vh]">
                        <div className="grid gap-2">
                            <Label htmlFor="name">
                                Menu Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                {...register("name")}
                                placeholder="e.g., Healthy Breakfast Bowl"
                                disabled={isPending}
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="meal_type">
                                Meal Type <span className="text-destructive">*</span>
                            </Label>
                            <Controller
                                name="meal_type"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={isPending}
                                    >
                                        <SelectTrigger id="meal_type">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {MEAL_TYPES_LIST.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.meal_type && (
                                <p className="text-sm text-destructive">{errors.meal_type.message}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="target_role">
                                Target Role <span className="text-destructive">*</span>
                            </Label>
                            <Controller
                                name="target_role"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={isPending}
                                    >
                                        <SelectTrigger id="target_role">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {targetRolesOptions.map((role) => (
                                                <SelectItem key={role.value} value={role.value}>
                                                    {role.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.target_role && (
                                <p className="text-sm text-destructive">{errors.target_role.message}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="tags">Tags</Label>
                            <Input
                                id="tags"
                                {...register("tags")}
                                placeholder="e.g., healthy,protein,fiber (comma separated)"
                                disabled={isPending}
                            />
                            {errors.tags && (
                                <p className="text-sm text-destructive">{errors.tags.message}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                {...register("description")}
                                placeholder="Describe the menu, its nutritional benefits, or special features..."
                                disabled={isPending}
                                rows={3}
                            />
                            {errors.description && (
                                <p className="text-sm text-destructive">{errors.description.message}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="cooking_time_minutes">Cooking Time (minutes)</Label>
                            <Input
                                id="cooking_time_minutes"
                                type="number"
                                {...register("cooking_time_minutes")}
                                placeholder="e.g., 30"
                                disabled={isPending}
                                min="0"
                            />
                            {errors.cooking_time_minutes && (
                                <p className="text-sm text-destructive">{errors.cooking_time_minutes.message}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="cooking_instructions">Cooking Instructions</Label>
                            <Textarea
                                id="cooking_instructions"
                                {...register("cooking_instructions")}
                                placeholder="Step-by-step cooking instructions..."
                                disabled={isPending}
                                rows={4}
                            />
                            {errors.cooking_instructions && (
                                <p className="text-sm text-destructive">{errors.cooking_instructions.message}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Controller
                                name="image_url"
                                control={control}
                                render={({ field }) => (
                                    <ImageUpload
                                        value={field.value}
                                        onChange={field.onChange}
                                        disabled={isPending}
                                        uploadType="menu"
                                        label="Menu Image"
                                    />
                                )}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="is_active">Active Status</Label>
                            <Controller
                                name="is_active"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        id="is_active"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={isPending}
                                    />
                                )}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Controller
                                name="ingredients"
                                control={control}
                                render={({ field }) => (
                                    <IngredientPicker
                                        value={field.value}
                                        onChange={field.onChange}
                                        disabled={isPending}
                                    />
                                )}
                            />
                            {errors.ingredients && (
                                <p className="text-sm text-destructive">{errors.ingredients.message}</p>
                            )}
                        </div>

                        {/* Manual Nutrition Override Section */}
                        <div className="border-t pt-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="nutrition_is_manual" className="text-base font-semibold">
                                        Manual Nutrition Override
                                    </Label>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Use this to enter pre-calculated nutrition values instead of auto-calculating from ingredients
                                    </p>
                                </div>
                                <Controller
                                    name="nutrition_is_manual"
                                    control={control}
                                    render={({ field }) => (
                                        <Switch
                                            id="nutrition_is_manual"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={isPending}
                                        />
                                    )}
                                />
                            </div>

                            {nutritionIsManual && (
                                <div className="space-y-4 pl-4 border-l-2 border-primary/20">
                                    <div className="grid gap-2">
                                        <Label htmlFor="serving_unit">Serving Unit</Label>
                                        <Input
                                            id="serving_unit"
                                            {...register("serving_unit")}
                                            placeholder="e.g., Porsi, Mangkok, Piring"
                                            disabled={isPending}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            The unit of measurement for one serving (e.g., "Porsi", "Mangkok")
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="manual_calories">
                                                Calories (kcal) <span className="text-primary">*</span>
                                            </Label>
                                            <Input
                                                id="manual_calories"
                                                type="number"
                                                min="0"
                                                step="1"
                                                {...register("manual_calories")}
                                                placeholder="e.g., 698"
                                                disabled={isPending}
                                            />
                                            {errors.manual_calories && (
                                                <p className="text-sm text-destructive">{errors.manual_calories.message}</p>
                                            )}
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="manual_protein_g">
                                                Protein (g) <span className="text-primary">*</span>
                                            </Label>
                                            <Input
                                                id="manual_protein_g"
                                                type="number"
                                                min="0"
                                                step="0.1"
                                                {...register("manual_protein_g")}
                                                placeholder="e.g., 36.0"
                                                disabled={isPending}
                                            />
                                            {errors.manual_protein_g && (
                                                <p className="text-sm text-destructive">{errors.manual_protein_g.message}</p>
                                            )}
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="manual_carbs_g">
                                                Carbs (g) <span className="text-primary">*</span>
                                            </Label>
                                            <Input
                                                id="manual_carbs_g"
                                                type="number"
                                                min="0"
                                                step="0.1"
                                                {...register("manual_carbs_g")}
                                                placeholder="e.g., 40.5"
                                                disabled={isPending}
                                            />
                                            {errors.manual_carbs_g && (
                                                <p className="text-sm text-destructive">{errors.manual_carbs_g.message}</p>
                                            )}
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="manual_fat_g">
                                                Fat (g) <span className="text-primary">*</span>
                                            </Label>
                                            <Input
                                                id="manual_fat_g"
                                                type="number"
                                                min="0"
                                                step="0.1"
                                                {...register("manual_fat_g")}
                                                placeholder="e.g., 27.9"
                                                disabled={isPending}
                                            />
                                            {errors.manual_fat_g && (
                                                <p className="text-sm text-destructive">{errors.manual_fat_g.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-primary/5 p-3 rounded-lg">
                                        <p className="text-xs text-muted-foreground">
                                            <strong>Note:</strong> When manual nutrition is enabled, these values will be used instead of calculating from ingredients.
                                            This is useful for complex recipes where laboratory-tested nutrition data is available.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </form>
                <DrawerFooter>
                    <Button onClick={handleSubmit(onSubmit)} disabled={isPending}>
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
