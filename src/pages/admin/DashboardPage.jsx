import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { StatsCard } from "@/components/admin/StatsCard"
import { useDashboardStats, useUserGrowth } from "@/hooks/useDashboard"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const chartConfig = {
    count: {
        label: "Users",
        color: "var(--primary)",
    },
}

export default function DashboardPage() {
    const [days, setDays] = React.useState(30)
    const { data: stats, isLoading: statsLoading, isError: statsError } = useDashboardStats()
    const { data: userGrowthData, isLoading: growthLoading, isError: growthError } = useUserGrowth(days)

    return (
        <div className="flex flex-col gap-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome to Bunda Care Admin Panel. Here's an overview of your platform.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                {statsLoading ? (
                    <>
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-[140px] rounded-lg" />
                        ))}
                    </>
                ) : statsError ? (
                    <div className="col-span-full text-center p-8 text-destructive">
                        Failed to load statistics
                    </div>
                ) : (
                    <>
                        <StatsCard
                            title="Total Users"
                            value={stats?.total_users?.toLocaleString() || "0"}
                            change={stats?.total_users_change || 0}
                            trend="up"
                            description="User growth this month"
                            footer="Total registered users"
                        />
                        <StatsCard
                            title="Active Menus"
                            value={stats?.total_active_menus || "0"}
                            change={stats?.active_menus_change || 0}
                            trend="up"
                            description="New menus added"
                            footer="Currently active menus"
                        />
                        <StatsCard
                            title="Total Ingredients"
                            value={stats?.total_ingredients || "0"}
                            change={stats?.ingredients_change || 0}
                            trend="up"
                            description="Ingredient database growth"
                            footer="Available ingredients"
                        />
                        <StatsCard
                            title="Total Articles"
                            value={stats?.total_articles?.toLocaleString() || "0"}
                            change={stats?.articles_change || 0}
                            trend="up"
                            description="Article database growth"
                            footer="Total articles"
                        />
                        <StatsCard
                            title="Active Users Today"
                            value={stats?.active_users_today || "0"}
                            change={stats?.active_users_change || 0}
                            trend="up"
                            description="Daily active users"
                            footer="Users active in last 24h"
                        />
                    </>
                )}
            </div>

            {/* User Growth Chart */}
            <Card className="@container/card">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>User Growth</CardTitle>
                            <CardDescription>
                                Total registered users over time
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Label htmlFor="days-filter" className="text-sm font-medium">
                                Range:
                            </Label>
                            <Select value={days.toString()} onValueChange={(val) => setDays(Number(val))}>
                                <SelectTrigger id="days-filter" className="w-[140px]" size="sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="7">Last 7 days</SelectItem>
                                    <SelectItem value="30">Last 30 days</SelectItem>
                                    <SelectItem value="90">Last 90 days</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                    {growthLoading ? (
                        <Skeleton className="h-[300px] w-full" />
                    ) : growthError ? (
                        <div className="h-[300px] flex items-center justify-center text-destructive">
                            Failed to load user growth data
                        </div>
                    ) : (
                        <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
                            <AreaChart data={userGrowthData}>
                                <defs>
                                    <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    minTickGap={32}
                                    tickFormatter={(value) => {
                                        const date = new Date(value)
                                        return date.toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })
                                    }}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={
                                        <ChartTooltipContent
                                            labelFormatter={(value) => {
                                                return new Date(value).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })
                                            }}
                                            indicator="dot"
                                        />
                                    }
                                />
                                <Area
                                    dataKey="count"
                                    type="natural"
                                    fill="url(#fillCount)"
                                    stroke="var(--color-count)"
                                />
                            </AreaChart>
                        </ChartContainer>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
