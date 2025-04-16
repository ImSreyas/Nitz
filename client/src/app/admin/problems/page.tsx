"use client";

import React, { useEffect, useState } from "react";
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
import { CalendarDays, CircleUserRound } from "lucide-react";
import { getAllProblems } from "@/lib/api/common";
import Link from "next/link";
interface Problem {
  id: string;
  problem_number: string;
  problem_title: string;
  difficulty: "beginner" | "easy" | "medium" | "hard" | "complex";
  username: string;
  added_date: string;
  topics: string[];
}

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

const chartConfig = {
  submissions: {
    label: "Submissions",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[] | null>(null);
  const getProblems = async () => {
    const response = await getAllProblems();
    if (response?.status === 200) {
      setProblems(response.data);
    } else {
      console.log("No problems data found");
    }
  };
  useEffect(() => {
    getProblems();
  }, []);

  return (
    <div className="container p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {problems?.map((problem) => (
          <Card
            key={problem.problem_number}
            className="hover:shadow-lg transition-shadow flex flex-col border border-muted/30 rounded-lg pt-3 overflow-hidden relative"
          >
            <CardHeader className="bg-muted/10 p-6 pb-3">
              <CardTitle className="text-xl font-semibold">
                <span className="">{problem.problem_number}.</span>{" "}
                <span className="">{problem.problem_title}</span>
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-3">
                <div
                  className={`${
                    problem.difficulty === "beginner"
                      ? "text-difficulty-beginner"
                      : problem.difficulty === "easy"
                      ? "text-difficulty-easy"
                      : problem.difficulty === "medium"
                      ? "text-difficulty-medium"
                      : problem.difficulty === "hard"
                      ? "text-difficulty-hard"
                      : problem.difficulty === "complex"
                      ? "text-difficulty-complex"
                      : "--text-white"
                  } px-6 py-1.5 text-xs bg-accent rounded-bl-sm text-black font-medium absolute top-0 right-0`}
                >
                  {problem.difficulty}
                </div>
                <div className="font-semibold text-xs px-2 py-1 bg-primary text-primary-foreground rounded-sm">
                  {getRandomNumber(30, 80)}% Success Rate
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 flex-grow flex flex-col justify-between">
              <div className="mb-4 flex gap-2">
                <div className="flex items-center text-sm rounded-sm px-2 py-1 bg-accent w-fit text-muted-foreground">
                  <CircleUserRound className="mr-2" size={16} />
                  {problem.username}
                </div>
                <div className="flex items-center text-sm text-muted-foreground rounded-sm px-2 py-1 bg-accent w-fit">
                  <CalendarDays className="mr-2" size={16} />
                  {new Date(problem.added_date).toLocaleDateString("en-GB")}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {problem.topics.map((topic, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2 py-1 bg-muted/20 text-muted-foreground border-accent hover:cursor-pointer"
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
              <ChartContainer config={chartConfig} className="p-2 flex-1">
                <AreaChart
                  data={getLastSixMonths().map((month) => ({
                    month: month as MonthType,
                    submissions: getRandomNumber(10, 100),
                  }))}
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
                    interval={0}
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
            <CardFooter className="p-6 bg-muted/5">
            <Link href={`/moderator/problems/${problem.id}`} className="w-full">
              <Button  variant="outline" className="w-full">
                View Problem
              </Button>
            </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
