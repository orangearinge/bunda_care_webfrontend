import { useState, useEffect } from "react"
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
import { useIngredients } from "@/hooks/useIngredients"
import { Skeleton } from "@/components/ui/skeleton"

export function IngredientPicker({ value = [], onChange, disabled }) {
    const [ingredients, setIngredients] = useState(value)
    // Fetch all ingredients for picker (use high limit to get all)
    const { data, isLoading } = useIngredients({ limit: 1000 })

    // Handle paginated response
    const availableIngredients = data?.items || []

    // Sync with parent value
    useEffect(() => {
        setIngredients(value)
    }, [value])

    const addRegularIngredient = () => {
        const newIngredients = [...ingredients, { ingredient_id: "", quantity_g: 0, display_text: "" }]
        setIngredients(newIngredients)
        onChange(newIngredients)
    }

    const addManualIngredient = () => {
        const newIngredients = [...ingredients, { ingredient_id: "", quantity_g: null, display_text: "" }]
        setIngredients(newIngredients)
        onChange(newIngredients)
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
            const ingredient = availableIngredients.find((i) => i.id === parseInt(value))
            if (ingredient) {
                newIngredients[index].ingredient_name = ingredient.name
            }
        }
        setIngredients(newIngredients)
        onChange(newIngredients)
    }

    return (
        <div className="space-y-8">
            {/* Bahan Utama Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <Label className="text-base font-semibold">Bahan Utama (Berdasarkan Berat)</Label>
                        <p className="text-xs text-muted-foreground mt-1">Gunakan ini untuk bahan yang ingin dihitung nilai gizinya secara otomatis.</p>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addRegularIngredient}
                        disabled={disabled || isLoading}
                    >
                        <IconPlus className="mr-2 size-4" />
                        Tambah Bahan Berat
                    </Button>
                </div>

                {isLoading ? (
                    <Skeleton className="h-12 w-full" />
                ) : ingredients.filter(ing => ing.quantity_g !== null).length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center p-3 border border-dashed rounded-lg bg-muted/20">
                        Belum ada bahan terukur. Klik "Tambah Bahan Berat".
                    </div>
                ) : (
                    <div className="space-y-3">
                        {ingredients.map((ingredient, index) => {
                            if (ingredient.quantity_g === null) return null;
                            return (
                                <div key={index} className="flex flex-col gap-2 p-3 border rounded-lg bg-muted/5">
                                    <div className="flex items-end gap-2">
                                        <div className="flex-1 grid grid-cols-2 gap-2">
                                            <div className="space-y-2">
                                                <Label>Pilih Bahan</Label>
                                                <Select
                                                    value={ingredient.ingredient_id?.toString() || ""}
                                                    onValueChange={(value) => updateIngredient(index, "ingredient_id", value)}
                                                    disabled={disabled}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {availableIngredients.map((ing) => (
                                                            <SelectItem key={ing.id} value={ing.id.toString()}>{ing.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Berat (Gram)</Label>
                                                <Input
                                                    type="number"
                                                    value={ingredient.quantity_g ?? ""}
                                                    onChange={(e) => updateIngredient(index, "quantity_g", parseFloat(e.target.value) || 0)}
                                                    placeholder="Contoh: 100"
                                                    disabled={disabled}
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeIngredient(index)}
                                            className="text-destructive mb-0.5"
                                            disabled={disabled}
                                        >
                                            <IconTrash className="size-4" />
                                        </Button>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Kustom Teks Display (Opsional)</Label>
                                        <Input
                                            value={ingredient.display_text || ""}
                                            onChange={(e) => updateIngredient(index, "display_text", e.target.value)}
                                            placeholder="Contoh: 1 porsi, 3 lembar, Secukupnya"
                                            className="h-8 text-xs"
                                            disabled={disabled}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="border-t pt-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <Label className="text-base font-semibold">Bahan Lainnya (Hanya Teks Display)</Label>
                        <p className="text-xs text-muted-foreground mt-1">Gunakan ini untuk bahan tanpa berat pasti (misal: "Secukupnya", "3 sdm garam").</p>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addManualIngredient}
                        disabled={disabled || isLoading}
                    >
                        <IconPlus className="mr-2 size-4" />
                        Tambah Bahan Teks
                    </Button>
                </div>

                {ingredients.filter(ing => ing.quantity_g === null).length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center p-3 border border-dashed rounded-lg bg-muted/20">
                        Belum ada bahan teks manual. Klik "Tambah Bahan Teks".
                    </div>
                ) : (
                    <div className="space-y-3">
                        {ingredients.map((ingredient, index) => {
                            if (ingredient.quantity_g !== null) return null;
                            return (
                                <div key={index} className="flex items-end gap-2">
                                    <div className="flex-1 space-y-2">
                                        <Label>Teks Display (Muncul di App)</Label>
                                        <Input
                                            value={ingredient.display_text || ""}
                                            onChange={(e) => updateIngredient(index, "display_text", e.target.value)}
                                            placeholder="Contoh: 3 sdm garam, Secukupnya"
                                            disabled={disabled}
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeIngredient(index)}
                                        className="text-destructive"
                                        disabled={disabled}
                                    >
                                        <IconTrash className="size-4" />
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
