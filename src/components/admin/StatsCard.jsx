import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export function StatsCard({ title, value, change, trend, description, footer }) {
    const isPositive = trend === "up"
    const TrendIcon = isPositive ? IconTrendingUp : IconTrendingDown

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardDescription>{title}</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {value}
                </CardTitle>
                <CardAction>
                    <Badge variant="outline">
                        <TrendIcon className="size-4" />
                        {change > 0 ? "+" : ""}{change}%
                    </Badge>
                </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                    {description} <TrendIcon className="size-4" />
                </div>
                <div className="text-muted-foreground">{footer}</div>
            </CardFooter>
        </Card>
    )
}
