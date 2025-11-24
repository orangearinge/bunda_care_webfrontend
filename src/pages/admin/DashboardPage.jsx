import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { mockUserGrowthData, mockDashboardStats } from "@/data/mockData"
import { StatsCard } from "@/components/admin/StatsCard"

const chartConfig = {
    count: {
        label: "Users",
        color: "var(--primary)",
    },
}

export default function DashboardPage() {
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
                <StatsCard
                    title="Total Users"
                    value={mockDashboardStats.total_users.toLocaleString()}
                    change={mockDashboardStats.total_users_change}
                    trend="up"
                    description="User growth this month"
                    footer="Total registered users"
                />
                <StatsCard
                    title="Active Menus"
                    value={mockDashboardStats.total_active_menus}
                    change={mockDashboardStats.active_menus_change}
                    trend="up"
                    description="New menus added"
                    footer="Currently active menus"
                />
                <StatsCard
                    title="Total Ingredients"
                    value={mockDashboardStats.total_ingredients}
                    change={mockDashboardStats.ingredients_change}
                    trend="up"
                    description="Ingredient database growth"
                    footer="Available ingredients"
                />
                <StatsCard
                    title="Active Users Today"
                    value={mockDashboardStats.active_users_today}
                    change={mockDashboardStats.active_users_change}
                    trend="up"
                    description="Daily active users"
                    footer="Users active in last 24h"
                />
            </div>

            {/* User Growth Chart */}
            <Card className="@container/card">
                <CardHeader>
                    <CardTitle>User Growth</CardTitle>
                    <CardDescription>
                        Total registered users over time
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                    <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
                        <AreaChart data={mockUserGrowthData}>
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
                </CardContent>
            </Card>
        </div>
    )
}
