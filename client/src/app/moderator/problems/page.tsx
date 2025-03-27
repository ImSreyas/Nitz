"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const problems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    submissions: 1200,
    successRate: "85%",
    submissionData: [
      { month: "January", submissions: 10 },
      { month: "February", submissions: 50 },
      { month: "March", submissions: 40 },
      { month: "April", submissions: 90 },
      { month: "May", submissions: 70 },
      { month: "June", submissions: 60 },
    ],
  },
  {
    id: 2,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    tags: ["String", "Sliding Window"],
    submissions: 800,
    successRate: "60%",
    submissionData: [
      { month: "January", submissions: 30 },
      { month: "February", submissions: 70 },
      { month: "March", submissions: 25 },
      { month: "April", submissions: 90 },
      { month: "May", submissions: 50 },
      { month: "June", submissions: 80 },
    ],
  },
  {
    id: 3,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    tags: ["Array", "Binary Search"],
    submissions: 500,
    successRate: "40%",
    submissionData: [
      { month: "January", submissions: 15 },
      { month: "February", submissions: 35 },
      { month: "March", submissions: 10 },
      { month: "April", submissions: 50 },
      { month: "May", submissions: 20 },
      { month: "June", submissions: 40 },
    ],
  },
  {
    id: 4,
    title: "Valid Parentheses",
    difficulty: "Easy",
    tags: ["String", "Stack"],
    submissions: 1500,
    successRate: "90%",
    submissionData: [
      { month: "January", submissions: 100 },
      { month: "February", submissions: 120 },
      { month: "March", submissions: 80 },
      { month: "April", submissions: 150 },
      { month: "May", submissions: 90 },
      { month: "June", submissions: 110 },
    ],
  },
  {
    id: 5,
    title: "Merge Intervals",
    difficulty: "Medium",
    tags: ["Array", "Sorting"],
    submissions: 700,
    successRate: "65%",
    submissionData: [
      { month: "January", submissions: 40 },
      { month: "February", submissions: 60 },
      { month: "March", submissions: 30 },
      { month: "April", submissions: 80 },
      { month: "May", submissions: 50 },
      { month: "June", submissions: 70 },
    ],
  },
];

const chartConfig = {
  submissions: {
    label: "Submissions",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function ProblemsPage() {
  return (
    <div className="container p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {problems.map((problem) => (
          <Card
            key={problem.id}
            className="hover:shadow-xl transition-shadow flex flex-col border border-muted/50"
          >
            <CardHeader className="bg-muted/10 p-4 rounded-t-md">
              <CardTitle className="text-lg font-semibold">
                {problem.title}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-2">
                <Badge
                  variant={
                    problem.difficulty === "Easy"
                      ? "default"
                      : problem.difficulty === "Medium"
                      ? "secondary"
                      : "destructive"
                  }
                  className={`${
                    problem.difficulty === "Medium" && "bg-orange-600"
                  } px-2 py-1 text-sm`}
                >
                  {problem.difficulty}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {problem.successRate} Success Rate
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow p-4 flex flex-col justify-between">
              <div className="flex flex-wrap gap-2 mb-4">
                {problem.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <ChartContainer config={chartConfig} className="p-2">
                <AreaChart
                  data={problem.submissionData}
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
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <defs>
                    <linearGradient
                      id="fillSubmissions"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--primary))"
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
                    stroke="hsl(var(--primary))"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="p-4">
              <Button variant="outline" className="w-full">
                View Problem
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
