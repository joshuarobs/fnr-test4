'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { Label, Pie, PieChart } from 'recharts';

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
  ChartLegend,
  ChartLegendContent,
} from '@react-monorepo/shared';

// Sample data - replace with actual data from API
const chartData = [
  { department: 'bau', claims: 173, fill: 'hsl(var(--chart-1))' },
  { department: 'storm', claims: 200, fill: 'hsl(var(--chart-2))' },
  { department: 'motor', claims: 48, fill: 'hsl(var(--chart-3))' },
];

const chartConfig = {
  claims: {
    label: 'Claims',
  },
  bau: {
    label: 'BAU',
    color: 'hsl(var(--chart-1))',
  },
  storm: {
    label: 'Storm',
    color: 'hsl(var(--chart-2))',
  },
  motor: {
    label: 'Motor',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

/**
 * ClaimsThisMonthChart - Displays a pie chart showing the distribution of claims
 * across different departments (BAU, Storm, Motor) for the current month
 */
export const ClaimsThisMonthChart = () => {
  const totalClaims = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.claims, 0);
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Claims This Month</CardTitle>
        <CardDescription>By Department</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto max-h-[250px]">
          <PieChart width={500} height={300}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="claims"
              nameKey="department"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
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
                          {totalClaims.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Claims
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="department" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          <TrendingUp className="h-4 w-4" />
          Total claims this month
        </div>
        <div className="leading-none text-muted-foreground">
          Distribution across departments
        </div>
      </CardFooter>
    </Card>
  );
};
