"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { USDAFood } from "@/types"



const chartConfig = {
    calories: {
        label: "Calories",
    },
    protein: {
        label: "Protein",
        color: "hsl(var(--chart-1))",
    },
    fat: {
        label: "Fat",
        color: "hsl(var(--chart-2))",
    },
    carbs: {
        label: "Carbs",
        color: "hsl(var(--chart-3))",
    },
    other: {
        label: "Other",
        color: "hsl(var(--chart-5))",
    },
} satisfies ChartConfig

export function MacroBreakdownPie({ nutritionFacts }: { nutritionFacts: Omit<USDAFood, 'embedding' | 'fts'> }) {

    const totalCalories = nutritionFacts.kcal || 0
    const totalMacroCalories = ((nutritionFacts.protein ?? 0) * 4) + ((nutritionFacts.fat ?? 0) * 9) + ((nutritionFacts.carbs ?? 0) * 4)

    const nonMacroCalories = totalCalories - totalMacroCalories

    const chartData = [
        { macro: "protein", calories: (nutritionFacts.protein ?? 0) * 4, weight: nutritionFacts.protein ?? 0, fill: "var(--color-protein)" },
        { macro: "fat", calories: (nutritionFacts.fat ?? 0) * 9, weight: nutritionFacts.fat ?? 0, fill: "var(--color-fat)" },
        { macro: "carbs", calories: (nutritionFacts.carbs ?? 0) * 4, weight: nutritionFacts.carbs ?? 0, fill: "var(--color-carbs)" },
        { macro: "other", calories: nonMacroCalories < 0 ? 0 : nonMacroCalories, weight: 0, fill: "var(--color-other)" },
    ]

    return (
        <Card className="w-full ">
            <CardHeader>
                <CardTitle>Macro Breakdown</CardTitle>
                <CardDescription>Calories from macronutrients</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square w-48 relative"
                >
                    <PieChart>
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    hideLabel
                                    formatter={(value, name, item, index) => (
                                        <>
                                            <div
                                                className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                                                style={
                                                    {
                                                        "--color-bg": `var(--color-${name})`,
                                                    } as React.CSSProperties
                                                }
                                            />
                                            {chartConfig[name as keyof typeof chartConfig]?.label || name}
                                            <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                                                {name === 'fat' ? Math.round(parseFloat(value.toString())) / 9 : Math.round(parseFloat(value.toString())) / 4}
                                                <span className="font-normal text-muted-foreground">
                                                    g
                                                </span>
                                            </div>
                                        </>
                                    )}
                                />
                            }
                            cursor={false}
                            defaultIndex={1}
                        />
                        <Pie
                            data={chartData}
                            dataKey="calories"
                            nameKey="macro"
                            innerRadius={52}
                            strokeWidth={3}
                            startAngle={450}
                            endAngle={90}

                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalCalories.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Calories
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                        <ChartLegend
                            content={<ChartLegendContent nameKey="macro" />}
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
