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
import { CalendarDays, CircleUserRound, Database, Search } from "lucide-react";
import { getAllProblems } from "@/lib/api/common";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Problem {
  id: string;
  problem_number: string;
  problem_title: string;
  difficulty: "beginner" | "easy" | "medium" | "hard" | "complex";
  username: string;
  added_date: string;
  topics: string[];
  status: string;
  publish_status: boolean;
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

export default function ProblemsList({
  context = "moderator",
}: {
  context?: "moderator" | "admin";
}) {
  const [problems, setProblems] = useState<Problem[] | null>(null);
  const [filteredProblems, setFilteredProblems] = useState<Problem[] | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<
    "title" | "difficulty" | "date" | null
  >(null);
  const [difficultyFilter, setDifficultyFilter] = useState<
    "beginner" | "easy" | "medium" | "hard" | "complex" | null
  >(null);
  const [publishStatusFilter, setPublishStatusFilter] = useState<
    boolean | null
  >(null);
  const [approvalStatusFilter, setApprovalStatusFilter] = useState<
    "pending" | "approved" | "rejected" | "archived" | "deprecated" | null
  >(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = context === "moderator" ? 3 : 6;

  const getProblems = async () => {
    const response = await getAllProblems(context);
    if (response?.status === 200) {
      setProblems(response.data);
      setFilteredProblems(response.data);
    } else {
      console.log("No problems data found");
    }
  };

  useEffect(() => {
    getProblems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter and sort logic
  useEffect(() => {
    if (problems) {
      let updatedProblems = [...problems];

      // Search filter
      if (searchQuery) {
        updatedProblems = updatedProblems.filter((problem) =>
          problem.problem_title
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        );
      }

      // Difficulty filter
      if (difficultyFilter) {
        updatedProblems = updatedProblems.filter(
          (problem) => problem.difficulty === difficultyFilter
        );
      }

      // Publish status filter
      if (publishStatusFilter !== null) {
        updatedProblems = updatedProblems.filter(
          (problem) => problem.publish_status === publishStatusFilter
        );
      }

      // Approval status filter
      if (approvalStatusFilter) {
        updatedProblems = updatedProblems.filter(
          (problem) => problem.status === approvalStatusFilter
        );
      }

      // Sort
      if (sortOption === "title") {
        updatedProblems.sort((a, b) =>
          a.problem_title.localeCompare(b.problem_title)
        );
      } else if (sortOption === "difficulty") {
        const difficultyOrder = [
          "beginner",
          "easy",
          "medium",
          "hard",
          "complex",
        ];
        updatedProblems.sort(
          (a, b) =>
            difficultyOrder.indexOf(a.difficulty) -
            difficultyOrder.indexOf(b.difficulty)
        );
      } else if (sortOption === "date") {
        updatedProblems.sort((a, b) => {
          const dateA = new Date(a.added_date);
          const dateB = new Date(b.added_date);
          return dateB.getTime() - dateA.getTime();
        });
      }

      setFilteredProblems(updatedProblems);
      setCurrentPage(1); // Reset to the first page after filtering
    }
  }, [
    searchQuery,
    sortOption,
    difficultyFilter,
    publishStatusFilter,
    approvalStatusFilter,
    problems,
  ]);

  // Pagination logic
  const totalPages = Math.ceil((filteredProblems?.length || 0) / itemsPerPage);
  const paginatedProblems = filteredProblems?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Button>
        );
      }
    } else {
      if (currentPage > 2) {
        pages.push(
          <Button
            key={1}
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(1)}
          >
            1
          </Button>
        );
        if (currentPage > 3) {
          pages.push(
            <span key="start-ellipsis" className="px-2 text-muted-foreground">
              ...
            </span>
          );
        }
      }

      for (
        let i = Math.max(1, currentPage - 1);
        i <= Math.min(totalPages, currentPage + 1);
        i++
      ) {
        pages.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Button>
        );
      }

      if (currentPage < totalPages - 1) {
        if (currentPage < totalPages - 2) {
          pages.push(
            <span key="end-ellipsis" className="px-2 text-muted-foreground">
              ...
            </span>
          );
        }
        pages.push(
          <Button
            key={totalPages}
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </Button>
        );
      }
    }

    return pages;
  };

  return (
    <div className="container p-8">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        {/* Search */}
        <div className="relative w-full md:w-1/3">
          <Search
            className="absolute top-1/2 -translate-y-1/2 left-2.5"
            size={18}
          />
          <Input
            type="search"
            placeholder="Search problems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9"
          />
        </div>

        {/* Sort and Filter */}
        <div className="flex gap-4 w-full md:w-auto">
          {/* Sort */}
          <Select
            onValueChange={(value) =>
              setSortOption(value as "title" | "difficulty" | "date")
            }
          >
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="difficulty">Difficulty</SelectItem>
              <SelectItem value="date">Date</SelectItem>
            </SelectContent>
          </Select>

          {/* Filter by Difficulty */}
          <Select
            onValueChange={(value) => {
              if (value === "all") {
                setDifficultyFilter(null);
              } else {
                setDifficultyFilter(
                  value as
                    | "beginner"
                    | "easy"
                    | "medium"
                    | "hard"
                    | "complex"
                    | null
                );
              }
            }}
          >
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Filter by Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
              <SelectItem value="complex">Complex</SelectItem>
            </SelectContent>
          </Select>

          {/* Filter by Publish Status */}
          <Select
            onValueChange={(value) => {
              if (value === "all") {
                setPublishStatusFilter(null);
              } else {
                setPublishStatusFilter(value === "true");
              }
            }}
          >
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Filter by Publish Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">Published</SelectItem>
              <SelectItem value="false">Unpublished</SelectItem>
            </SelectContent>
          </Select>

          {/* Filter by Approval Status */}
          <Select
            onValueChange={(value) => {
              if (value === "all") {
                setApprovalStatusFilter(null);
              } else {
                setApprovalStatusFilter(
                  value as
                    | "pending"
                    | "approved"
                    | "rejected"
                    | "archived"
                    | "deprecated"
                );
              }
            }}
          >
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Filter by Approval Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
              <SelectItem value="deprecated">Deprecated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Problems Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {paginatedProblems?.length === 0 && (
          <div className="col-span-full text-center flex flex-col justify-center items-center gap-2 p-8 border border-dashed rounded-lg h-96">
            <div className="w-fit">
              <Database />
            </div>
            <div>
              <p className="">
                No problems found matching the selected filters.
              </p>
              <p className="text-muted-foreground text-sm">
                Please change the filters
              </p>
            </div>
          </div>
        )}
        {paginatedProblems?.map((problem) => (
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
                <div className="flex items-center gap-2">
                  <div>
                    {problem.publish_status ? (
                      <Badge className="text-xs px-2 py-1 bg-muted/20 text-green-500 border-accent">
                        Published
                      </Badge>
                    ) : (
                      <Badge className="text-xs px-2 py-1 bg-muted/20 text-yellow-500 border-accent">
                        Unpublished
                      </Badge>
                    )}
                  </div>
                  <div>
                    <Badge className="text-xs px-2 py-1 border-accent text-primary-foreground bg-primary ">
                      {problem.status}
                    </Badge>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 flex-grow flex flex-col justify-between">
              <div className="mb-4 flex gap-2">
                {context === "admin" && (
                  <div className="flex items-center text-sm rounded-sm px-2 py-1 bg-accent w-fit text-muted-foreground max-w-fit line-clamp-1 truncate">
                    <CircleUserRound className="mr-2" size={16} />
                    {problem.username}
                  </div>
                )}

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
            <CardFooter className="p-6 pt-0 bg-muted/5">
              <Link href={`./problems/${problem.id}`} className="w-full">
                <Button variant="outline" className="w-full">
                  View Problem
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex gap-2 justify-end items-center mt-4">
        <div className="flex items-center gap-2">{renderPagination()}</div>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
