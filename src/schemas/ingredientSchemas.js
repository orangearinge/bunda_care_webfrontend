import { z } from "zod"

export const ingredientSchema = z.object({
    name: z
        .string()
        .min(1, "Ingredient name is required")
        .min(2, "Ingredient name must be at least 2 characters")
        .max(100, "Ingredient name must not exceed 100 characters"),
    alt_names: z.string().optional(),
    calories: z
        .number({ invalid_type_error: "Calories must be a number" })
        .min(0, "Calories cannot be negative")
        .max(10000, "Calories value seems too high"),
    protein_g: z
        .number({ invalid_type_error: "Protein must be a number" })
        .min(0, "Protein cannot be negative")
        .max(1000, "Protein value seems too high"),
    carbs_g: z
        .number({ invalid_type_error: "Carbohydrates must be a number" })
        .min(0, "Carbohydrates cannot be negative")
        .max(1000, "Carbohydrates value seems too high"),
    fat_g: z
        .number({ invalid_type_error: "Fat must be a number" })
        .min(0, "Fat cannot be negative")
        .max(1000, "Fat value seems too high"),
})
