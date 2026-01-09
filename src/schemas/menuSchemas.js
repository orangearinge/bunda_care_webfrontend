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
    cooking_time_minutes: z.number().min(0, "Cooking time must be positive").optional(),
    ingredients: z
        .array(
            z.object({
                ingredient_id: z.union([z.number(), z.string()]).optional(),
                id: z.number().optional(),
                name: z.string().optional(),
                quantity_g: z.number().min(0, "Quantity must be positive"),
            })
        )
        .min(1, "At least one ingredient is required"),
})
