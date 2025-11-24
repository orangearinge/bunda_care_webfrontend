import { useState } from "react"
import { IconTrash, IconPlus } from "@tabler/icons-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { mockIngredients } from "@/data/mockData"

export function IngredientPicker({ value = [], onChange }) {
    const [ingredients, setIngredients] = useState(value)

    const addIngredient = () => {
        setIngredients([...ingredients, { ingredient_id: "", quantity_g: 0 }])
    }

    const removeIngredient = (index) => {
        const newIngredients = ingredients.filter((_, i) => i !== index)
        setIngredients(newIngredients)
        onChange(newIngredients)
    }

    const updateIngredient = (index, field, value) => {
        const newIngredients = [...ingredients]
        newIngredients[index][field] = value
        if (field === "ingredient_id") {
            const ingredient = mockIngredients.find((i) => i.id === parseInt(value))
            if (ingredient) {
                newIngredients[index].ingredient_name = ingredient.name
            }
        }
        setIngredients(newIngredients)
        onChange(newIngredients)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label>Ingredients</Label>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addIngredient}
                >
                    <IconPlus className="mr-2 size-4" />
                    Add Ingredient
                </Button>
            </div>

            {ingredients.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center p-4 border border-dashed rounded-lg">
                    No ingredients added. Click "Add Ingredient" to start.
                </div>
            ) : (
                <div className="space-y-3">
                    {ingredients.map((ingredient, index) => (
                        <div key={index} className="flex items-end gap-2">
                            <div className="flex-1 grid grid-cols-2 gap-2">
                                <div className="space-y-2">
                                    <Label htmlFor={`ingredient-${index}`}>Ingredient</Label>
                                    <Select
                                        value={ingredient.ingredient_id?.toString() || ""}
                                        onValueChange={(value) =>
                                            updateIngredient(index, "ingredient_id", value)
                                        }
                                    >
                                        <SelectTrigger id={`ingredient-${index}`}>
                                            <SelectValue placeholder="Select ingredient" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mockIngredients.map((ing) => (
                                                <SelectItem key={ing.id} value={ing.id.toString()}>
                                                    {ing.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`quantity-${index}`}>Quantity (g)</Label>
                                    <Input
                                        id={`quantity-${index}`}
                                        type="number"
                                        min="0"
                                        value={ingredient.quantity_g || ""}
                                        onChange={(e) =>
                                            updateIngredient(index, "quantity_g", parseInt(e.target.value) || 0)
                                        }
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeIngredient(index)}
                                className="text-destructive hover:text-destructive"
                            >
                                <IconTrash className="size-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
