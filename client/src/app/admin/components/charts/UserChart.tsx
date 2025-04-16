import React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;
type MonthType = (typeof months)[number];

const chartConfig = {
  submissions: {
    label: "Submissions",
    color: "hsl(var(--chart-1))",
  },
  activeUsers: {
    label: "Active Users",
    color: "hsl(var(--chart-2))",
  },
  newUsers: {
    label: "New Users",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

const getRandomNumber = (start: number = 20, end: number = 90) => {
  return Math.floor(Math.random() * (end - start + 1)) + start;
};

const getLastSixMonths = (): string[] => {
  const currentMonth = new Date().getMonth();
  const lastSixMonths = [];

  for (let i = 7; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    lastSixMonths.push(months[monthIndex]);
  }

  return lastSixMonths;
};

export default function UserChart() {
  const data = getLastSixMonths().map((month) => ({
    month: month as MonthType,
    submissions: getRandomNumber(10, 100),
    activeUsers: getRandomNumber(50, 150),
    newUsers: getRandomNumber(5, 50),
  }));

  return (
    <div className="p-2 ps-0 border rounded-xl bg-card">
      <h2 className="text-md text-muted-foreground font-medium w-full text-center">users</h2>
      <ChartContainer config={chartConfig} className="p-2 flex-1">
        <AreaChart
          data={data}
          margin={{
            left: 12,
            right: 12,
            top: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            interval={0}
          />
          <YAxis />
          <Legend verticalAlign="top" height={36} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <defs>
            <linearGradient id="fillSubmissions" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(var(--chart-1))"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="hsl(var(--background))"
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="fillActiveUsers" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(var(--chart-2))"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="hsl(var(--background))"
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="fillNewUsers" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(var(--chart-3))"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="hsl(var(--background))"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <Area
            dataKey="submissions"
            type="natural"
            fill="url(#fillSubmissions)"
            fillOpacity={0.4}
            stroke="hsl(var(--chart-1))"
          />
          <Area
            dataKey="activeUsers"
            type="natural"
            fill="url(#fillActiveUsers)"
            fillOpacity={0.4}
            stroke="hsl(var(--chart-2))"
          />
          <Area
            dataKey="newUsers"
            type="natural"
            fill="url(#fillNewUsers)"
            fillOpacity={0.4}
            stroke="hsl(var(--chart-3))"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
