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
    is_active: z.boolean().default(true),
    ingredients: z
        .array(
            z.object({
                id: z.number(),
                name: z.string(),
                quantity_g: z.number().min(0, "Quantity must be positive"),
            })
        )
        .min(1, "At least one ingredient is required"),
})
