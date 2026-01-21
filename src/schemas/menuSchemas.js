import { z } from "zod"

export const menuSchema = z.object({
    name: z
        .string()
        .min(1, "Menu name is required")
        .min(3, "Menu name must be at least 3 characters")
        .max(100, "Menu name must not exceed 100 characters"),
    meal_type: z.enum(["BREAKFAST", "LUNCH", "DINNER"], {
        errorMap: () => ({ message: "Please select a valid meal type" }),
    }),
    tags: z.string().optional(),
    image_url: z.string().optional().nullable(),
    is_active: z.boolean().default(true),
    description: z.string().optional(),
    cooking_instructions: z.string().optional(),
    cooking_time_minutes: z.preprocess((val) => {
        if (val === "" || val === null || val === undefined) return null;
        const parsed = parseInt(val, 10);
        return isNaN(parsed) ? null : parsed;
    }, z.number().min(0, "Cooking time must be positive").nullable().optional()),
    target_role: z.string().optional().default("IBU"),
    ingredients: z
        .array(
            z.object({
                ingredient_id: z.union([z.number(), z.string()]).optional().nullable(),
                id: z.number().optional().nullable(),
                name: z.string().optional().nullable(),
                quantity_g: z.number().min(0, "Quantity must be positive").optional().nullable(),
                display_text: z.string().optional().nullable(), // e.g., "3 lembar", "Secukupnya"
            })
        )
        .min(1, "At least one ingredient is required"),

    // Manual Nutrition Override (Golden Override)
    nutrition_is_manual: z.boolean().optional().default(false),
    serving_unit: z.string().optional().nullable(),
    manual_calories: z.preprocess((val) => {
        if (val === "" || val === null || val === undefined) return null;
        const parsed = parseInt(val, 10);
        return isNaN(parsed) ? null : parsed;
    }, z.number().min(0, "Calories must be positive").nullable().optional()),
    manual_protein_g: z.preprocess((val) => {
        if (val === "" || val === null || val === undefined) return null;
        const parsed = parseFloat(val);
        return isNaN(parsed) ? null : parsed;
    }, z.number().min(0, "Protein must be positive").nullable().optional()),
    manual_carbs_g: z.preprocess((val) => {
        if (val === "" || val === null || val === undefined) return null;
        const parsed = parseFloat(val);
        return isNaN(parsed) ? null : parsed;
    }, z.number().min(0, "Carbs must be positive").nullable().optional()),
    manual_fat_g: z.preprocess((val) => {
        if (val === "" || val === null || val === undefined) return null;
        const parsed = parseFloat(val);
        return isNaN(parsed) ? null : parsed;
    }, z.number().min(0, "Fat must be positive").nullable().optional()),
})
