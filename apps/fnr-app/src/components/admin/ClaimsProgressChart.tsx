'use client';

import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@react-monorepo/shared';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@react-monorepo/shared';

// Chart data showing claims progress over 6 months
const chartData = [
  { month: 'January', totalActive: 186, pendingReview: 80 },
  { month: 'February', totalActive: 305, pendingReview: 200 },
  { month: 'March', totalActive: 237, pendingReview: 120 },
  { month: 'April', totalActive: 73, pendingReview: 190 },
  { month: 'May', totalActive: 209, pendingReview: 130 },
  { month: 'June', totalActive: 214, pendingReview: 140 },
];

const chartConfig = {
  totalActive: {
    label: 'Total Active Claims',
    color: 'hsl(var(--chart-1))',
  },
  pendingReview: {
    label: 'Claims Pending Review',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

/**
 * ClaimsProgressChart component displays a stacked area chart showing the total active claims
 * and claims pending review over a 6-month period. The chart includes tooltips and a footer
 * with trending information.
 */
export const ClaimsProgressChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Claims Progress</CardTitle>
        <CardDescription>
          Showing total claims activity for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
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
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="pendingReview"
              type="natural"
              fill="hsl(var(--chart-2))"
              fillOpacity={0.4}
              stroke="hsl(var(--chart-2))"
              stackId="a"
            />
            <Area
              dataKey="totalActive"
              type="natural"
              fill="hsl(var(--chart-1))"
              fillOpacity={0.4}
              stroke="hsl(var(--chart-1))"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
