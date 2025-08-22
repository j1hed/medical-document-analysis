"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/line-chart"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"

const chartData = [
  { month: "January", diagnosticAccuracy: 89, patientSatisfaction: 92 },
  { month: "February", diagnosticAccuracy: 91, patientSatisfaction: 88 },
  { month: "March", diagnosticAccuracy: 94, patientSatisfaction: 90 },
  { month: "April", diagnosticAccuracy: 87, patientSatisfaction: 95 },
  { month: "May", diagnosticAccuracy: 96, patientSatisfaction: 89 },
  { month: "June", diagnosticAccuracy: 98, patientSatisfaction: 94 },
]

const chartConfig = {
  diagnosticAccuracy: {
    label: "Diagnostic Accuracy (%)",
    color: "hsl(var(--medical-primary))",
  },
  patientSatisfaction: {
    label: "Patient Satisfaction (%)",
    color: "hsl(var(--medical-accent))",
  },
} satisfies ChartConfig

export default function MedicalTrendsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Medical Analysis Trends
          <Badge variant="outline" className="text-green-600 bg-green-600/10 border-none ml-2">
            <TrendingUp className="h-4 w-4" />
            <span>+8.3%</span>
          </Badge>
        </CardTitle>
        <CardDescription>Performance Metrics - January to June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Line
              dataKey="diagnosticAccuracy"
              type="linear"
              stroke="var(--color-diagnosticAccuracy)"
              dot={false}
              strokeDasharray="4 4"
            />
            <Line dataKey="patientSatisfaction" type="linear" stroke="var(--color-patientSatisfaction)" />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
