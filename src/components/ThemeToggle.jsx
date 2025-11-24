import { IconMoon, IconSun } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/ThemeContext"

export function ThemeToggle({ className }) {
    const { theme, toggleTheme } = useTheme()

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={className}
            aria-label="Toggle theme"
        >
            {theme === "light" ? (
                <IconMoon className="size-5" />
            ) : (
                <IconSun className="size-5" />
            )}
        </Button>
    )
}
