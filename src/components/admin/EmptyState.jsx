import { IconMoodEmpty } from "@tabler/icons-react"

export function EmptyState({
    icon: Icon = IconMoodEmpty,
    title = "No data found",
    description = "Try adjusting your search or filter to find what you're looking for.",
    action = null
}) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
                <Icon className="size-12 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-4">
                {description}
            </p>
            {action && <div className="mt-2">{action}</div>}
        </div>
    )
}
