import { Input } from "@/components/ui/input"
import { IconSearch, IconX } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

export function SearchBar({ value, onChange, placeholder = "Search...", onClear }) {
    return (
        <div className="relative flex items-center">
            <IconSearch className="absolute left-3 size-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-9 pr-9"
            />
            {value && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 size-7"
                    onClick={onClear}
                >
                    <IconX className="size-4" />
                </Button>
            )}
        </div>
    )
}
