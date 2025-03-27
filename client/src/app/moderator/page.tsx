"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  BarChart2,
  Calendar,
  CheckCircle,
  ChevronDown,
  Code,
  Edit,
  Eye,
  FileText,
  Flag,
  List,
  Lock,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Shield,
  Trash2,
  User,
  Users,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ModeratorDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="dark">
      <div className="flex min-h-screen w-full bg-background">
        <div className="flex flex-col flex-1">
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-4 md:p-6">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="problems">Problems</TabsTrigger>
                    <TabsTrigger value="contests">Contests</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                  </TabsList>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="today">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="yesterday">Yesterday</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="year">This Year</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Total Problems
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">1,248</div>
                        <p className="text-xs text-muted-foreground">
                          +24 from last month
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Active Contests
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">
                          2 ending this week
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Pending Reviews
                        </CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">27</div>
                        <p className="text-xs text-muted-foreground">
                          +12 since yesterday
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          User Reports
                        </CardTitle>
                        <Flag className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">9</div>
                        <p className="text-xs text-muted-foreground">
                          -2 from last week
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="lg:col-span-4">
                      <CardHeader>
                        <CardTitle>Problem Submissions</CardTitle>
                        <CardDescription>
                          Submission trends over the last 30 days
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pl-2">
                        <div className="h-[200px] w-full">
                          {/* Placeholder for chart */}
                          <div className="flex h-full w-full flex-col items-center justify-center rounded-md border border-dashed">
                            <BarChart2 className="h-8 w-8 text-muted-foreground" />
                            <div className="mt-2 text-sm text-muted-foreground">
                              Submission Analytics Chart
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="lg:col-span-3">
                      <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                          Latest actions on the platform
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-9 w-9">
                              <AvatarImage
                                src="/placeholder.svg"
                                alt="Avatar"
                              />
                              <AvatarFallback>TS</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">
                                Tom Smith created a new problem
                              </p>
                              <p className="text-sm text-muted-foreground">
                                &quot;Binary Tree Traversal&quot; - 12 minutes
                                ago
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <Avatar className="h-9 w-9">
                              <AvatarImage
                                src="/placeholder.svg"
                                alt="Avatar"
                              />
                              <AvatarFallback>JW</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">
                                Jane Wilson updated contest rules
                              </p>
                              <p className="text-sm text-muted-foreground">
                                &quot;Weekly Challenge #42&quot; - 45 minutes
                                ago
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <Avatar className="h-9 w-9">
                              <AvatarImage
                                src="/placeholder.svg"
                                alt="Avatar"
                              />
                              <AvatarFallback>RJ</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">
                                Robert Johnson flagged a submission
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Problem #324 - 1 hour ago
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <Avatar className="h-9 w-9">
                              <AvatarImage
                                src="/placeholder.svg"
                                alt="Avatar"
                              />
                              <AvatarFallback>AL</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">
                                Amy Lee responded to a user report
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Report #89 - 3 hours ago
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                      <CardHeader>
                        <CardTitle>Problem Categories</CardTitle>
                        <CardDescription>
                          Distribution by category
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-primary"></span>
                                <span>Data Structures</span>
                              </div>
                              <span className="font-medium">32%</span>
                            </div>
                            <Progress value={32} className="h-2" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                <span>Algorithms</span>
                              </div>
                              <span className="font-medium">28%</span>
                            </div>
                            <Progress
                              value={28}
                              className="h-2 bg-blue-100 dark:bg-blue-950"
                            >
                              <div
                                className="h-full bg-blue-500"
                                style={{ width: "28%" }}
                              />
                            </Progress>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                <span>Dynamic Programming</span>
                              </div>
                              <span className="font-medium">18%</span>
                            </div>
                            <Progress
                              value={18}
                              className="h-2 bg-green-100 dark:bg-green-950"
                            >
                              <div
                                className="h-full bg-green-500"
                                style={{ width: "18%" }}
                              />
                            </Progress>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                                <span>Graphs</span>
                              </div>
                              <span className="font-medium">14%</span>
                            </div>
                            <Progress
                              value={14}
                              className="h-2 bg-yellow-100 dark:bg-yellow-950"
                            >
                              <div
                                className="h-full bg-yellow-500"
                                style={{ width: "14%" }}
                              />
                            </Progress>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                <span>Others</span>
                              </div>
                              <span className="font-medium">8%</span>
                            </div>
                            <Progress
                              value={8}
                              className="h-2 bg-red-100 dark:bg-red-950"
                            >
                              <div
                                className="h-full bg-red-500"
                                style={{ width: "8%" }}
                              />
                            </Progress>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Difficulty Distribution</CardTitle>
                        <CardDescription>
                          Problems by difficulty level
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                <span>Easy</span>
                              </div>
                              <span className="font-medium">35%</span>
                            </div>
                            <Progress
                              value={35}
                              className="h-2 bg-green-100 dark:bg-green-950"
                            >
                              <div
                                className="h-full bg-green-500"
                                style={{ width: "35%" }}
                              />
                            </Progress>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                                <span>Medium</span>
                              </div>
                              <span className="font-medium">45%</span>
                            </div>
                            <Progress
                              value={45}
                              className="h-2 bg-yellow-100 dark:bg-yellow-950"
                            >
                              <div
                                className="h-full bg-yellow-500"
                                style={{ width: "45%" }}
                              />
                            </Progress>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                <span>Hard</span>
                              </div>
                              <span className="font-medium">20%</span>
                            </div>
                            <Progress
                              value={20}
                              className="h-2 bg-red-100 dark:bg-red-950"
                            >
                              <div
                                className="h-full bg-red-500"
                                style={{ width: "20%" }}
                              />
                            </Progress>
                          </div>
                        </div>
                        <div className="mt-6">
                          <h4 className="mb-2 text-sm font-medium">
                            Recommendations
                          </h4>
                          <div className="rounded-md bg-muted p-3 text-sm">
                            <p>
                              Consider adding more hard problems to balance the
                              distribution.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Upcoming Tasks</CardTitle>
                        <CardDescription>
                          Your scheduled activities
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-4">
                            <div className="mt-0.5 rounded-full bg-blue-100 p-1 dark:bg-blue-900">
                              <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium">
                                Review Weekly Contest
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Tomorrow, 10:00 AM
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-4">
                            <div className="mt-0.5 rounded-full bg-purple-100 p-1 dark:bg-purple-900">
                              <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium">
                                Create New Problem Set
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Wed, 2:30 PM
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-4">
                            <div className="mt-0.5 rounded-full bg-amber-100 p-1 dark:bg-amber-900">
                              <Users className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium">
                                Moderator Meeting
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Thu, 11:00 AM
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-4">
                            <div className="mt-0.5 rounded-full bg-green-100 p-1 dark:bg-green-900">
                              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium">
                                Finalize Monthly Report
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Fri, 5:00 PM
                              </p>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" className="mt-4 w-full">
                          <Plus className="mr-2 h-4 w-4" />
                          Add New Task
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Problems Tab */}
                <TabsContent value="problems" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">
                      Problem Management
                    </h2>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Problem
                    </Button>
                  </div>

                  <div className="flex flex-col gap-4 md:flex-row">
                    <div className="flex w-full flex-col gap-2 md:w-64">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Filters</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs"
                        >
                          Reset
                        </Button>
                      </div>
                      <Separator />
                      <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Status</label>
                          <Select defaultValue="all">
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="published">
                                Published
                              </SelectItem>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Difficulty
                          </label>
                          <Select defaultValue="all">
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="easy">Easy</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Category
                          </label>
                          <Select defaultValue="all">
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="arrays">Arrays</SelectItem>
                              <SelectItem value="strings">Strings</SelectItem>
                              <SelectItem value="dp">
                                Dynamic Programming
                              </SelectItem>
                              <SelectItem value="graphs">Graphs</SelectItem>
                              <SelectItem value="trees">Trees</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Created By
                          </label>
                          <Select defaultValue="all">
                            <SelectTrigger>
                              <SelectValue placeholder="Select creator" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="me">Me</SelectItem>
                              <SelectItem value="team">My Team</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button className="w-full">Apply Filters</Button>
                      </div>
                    </div>
                    <div className="flex-1">
                      <Card>
                        <CardHeader className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Input
                                placeholder="Search problems..."
                                className="h-9 w-[200px] md:w-[300px]"
                              />
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-9"
                                  >
                                    <Filter className="mr-2 h-4 w-4" />
                                    Sort
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    Newest First
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    Oldest First
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>A-Z</DropdownMenuItem>
                                  <DropdownMenuItem>Z-A</DropdownMenuItem>
                                  <DropdownMenuItem>
                                    Most Submissions
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-9"
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                Export
                              </Button>
                              <Select defaultValue="10">
                                <SelectTrigger className="h-9 w-[70px]">
                                  <SelectValue placeholder="10" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="10">10</SelectItem>
                                  <SelectItem value="20">20</SelectItem>
                                  <SelectItem value="50">50</SelectItem>
                                  <SelectItem value="100">100</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-0">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[50px]">ID</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Difficulty</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Submissions</TableHead>
                                <TableHead>Success Rate</TableHead>
                                <TableHead className="text-right">
                                  Actions
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {problemsData.map((problem) => (
                                <TableRow key={problem.id}>
                                  <TableCell className="font-medium">
                                    {problem.id}
                                  </TableCell>
                                  <TableCell>
                                    <div className="font-medium">
                                      {problem.title}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      Created {problem.created}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant="outline"
                                      className={
                                        problem.difficulty === "Easy"
                                          ? "border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-400"
                                          : problem.difficulty === "Medium"
                                          ? "border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-400"
                                          : "border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-400"
                                      }
                                    >
                                      {problem.difficulty}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="secondary">
                                      {problem.category}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant="outline"
                                      className={
                                        problem.status === "Published"
                                          ? "border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-400"
                                          : problem.status === "Draft"
                                          ? "border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400"
                                          : "border-gray-200 bg-gray-100 text-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400"
                                      }
                                    >
                                      {problem.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>{problem.submissions}</TableCell>
                                  <TableCell>{problem.successRate}</TableCell>
                                  <TableCell className="text-right">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8"
                                        >
                                          <MoreHorizontal className="h-4 w-4" />
                                          <span className="sr-only">
                                            Actions
                                          </span>
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                          <Eye className="mr-2 h-4 w-4" />
                                          View
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <Edit className="mr-2 h-4 w-4" />
                                          Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <Code className="mr-2 h-4 w-4" />
                                          Test Cases
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                          <Trash2 className="mr-2 h-4 w-4" />
                                          Delete
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                        <CardFooter className="flex items-center justify-between p-4">
                          <div className="text-sm text-muted-foreground">
                            Showing <strong>1-10</strong> of{" "}
                            <strong>248</strong> problems
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="icon" disabled>
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              1
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              2
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              3
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              ...
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              25
                            </Button>
                            <Button variant="outline" size="icon">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* Contests Tab */}
                <TabsContent value="contests" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">
                      Contest Management
                    </h2>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Contest
                    </Button>
                  </div>

                  <Tabs defaultValue="active" className="w-full">
                    <TabsList className="w-full justify-start">
                      <TabsTrigger
                        value="active"
                        className="flex-1 md:flex-none"
                      >
                        Active (3)
                      </TabsTrigger>
                      <TabsTrigger
                        value="upcoming"
                        className="flex-1 md:flex-none"
                      >
                        Upcoming (5)
                      </TabsTrigger>
                      <TabsTrigger value="past" className="flex-1 md:flex-none">
                        Past (24)
                      </TabsTrigger>
                      <TabsTrigger
                        value="drafts"
                        className="flex-1 md:flex-none"
                      >
                        Drafts (2)
                      </TabsTrigger>
                    </TabsList>

                    <div className="mt-4 space-y-4">
                      {contestsData.map((contest) => (
                        <Card key={contest.id}>
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle>{contest.title}</CardTitle>
                                <CardDescription>
                                  {contest.startDate} - {contest.endDate}
                                </CardDescription>
                              </div>
                              <Badge>{contest.status}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid gap-4 md:grid-cols-3">
                              <div>
                                <div className="text-sm font-medium text-muted-foreground">
                                  Participants
                                </div>
                                <div className="mt-1 text-lg font-semibold">
                                  {contest.participants}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-muted-foreground">
                                  Problems
                                </div>
                                <div className="mt-1 text-lg font-semibold">
                                  {contest.problems}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-muted-foreground">
                                  Duration
                                </div>
                                <div className="mt-1 text-lg font-semibold">
                                  {contest.duration}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            <Button variant="outline">View Details</Button>
                            <div className="flex gap-2">
                              <Button variant="outline" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    Clone Contest
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    Export Results
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    Send Notifications
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
                                    Cancel Contest
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </Tabs>
                </TabsContent>

                {/* Users Tab */}
                <TabsContent value="users" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">
                      User Management
                    </h2>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        Export Users
                      </Button>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Invite User
                      </Button>
                    </div>
                  </div>

                  <Card>
                    <CardHeader className="p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="Search users..."
                            className="h-9 w-[200px] md:w-[300px]"
                          />
                          <Select defaultValue="all">
                            <SelectTrigger className="h-9 w-[130px]">
                              <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Roles</SelectItem>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="moderator">
                                Moderator
                              </SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Select defaultValue="10">
                          <SelectTrigger className="h-9 w-[70px]">
                            <SelectValue placeholder="10" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]">ID</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead>Last Active</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {usersData.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">
                                {user.id}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage
                                      src={user.avatar}
                                      alt={user.name}
                                    />
                                    <AvatarFallback>
                                      {user.initials}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">
                                      {user.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      @{user.username}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={
                                    user.role === "Admin"
                                      ? "border-purple-200 bg-purple-100 text-purple-800 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-400"
                                      : user.role === "Moderator"
                                      ? "border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400"
                                      : "border-gray-200 bg-gray-100 text-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400"
                                  }
                                >
                                  {user.role}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={
                                    user.status === "Active"
                                      ? "border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-400"
                                      : user.status === "Suspended"
                                      ? "border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-400"
                                      : "border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-400"
                                  }
                                >
                                  {user.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{user.joined}</TableCell>
                              <TableCell>{user.lastActive}</TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Actions</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <User className="mr-2 h-4 w-4" />
                                      View Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit User
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <MessageSquare className="mr-2 h-4 w-4" />
                                      Send Message
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                      <Shield className="mr-2 h-4 w-4" />
                                      Change Role
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600">
                                      <Lock className="mr-2 h-4 w-4" />
                                      Suspend Account
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between p-4">
                      <div className="text-sm text-muted-foreground">
                        Showing <strong>1-10</strong> of <strong>142</strong>{" "}
                        users
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="icon" disabled>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          1
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          2
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          3
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          ...
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          15
                        </Button>
                        <Button variant="outline" size="icon">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* Reports Tab */}
                <TabsContent value="reports" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">
                      Reports & Flags
                    </h2>
                    <Button variant="outline">
                      <FileText className="mr-2 h-4 w-4" />
                      Export Reports
                    </Button>
                  </div>

                  <Tabs defaultValue="pending" className="w-full">
                    <TabsList className="w-full justify-start">
                      <TabsTrigger
                        value="pending"
                        className="flex-1 md:flex-none"
                      >
                        Pending (9)
                      </TabsTrigger>
                      <TabsTrigger
                        value="resolved"
                        className="flex-1 md:flex-none"
                      >
                        Resolved (24)
                      </TabsTrigger>
                      <TabsTrigger
                        value="dismissed"
                        className="flex-1 md:flex-none"
                      >
                        Dismissed (12)
                      </TabsTrigger>
                    </TabsList>

                    <div className="mt-4 space-y-4">
                      {reportsData.map((report) => (
                        <Card key={report.id}>
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle>Report #{report.id}</CardTitle>
                                <CardDescription>
                                  Reported {report.date} by {report.reporter}
                                </CardDescription>
                              </div>
                              <Badge
                                variant="outline"
                                className={
                                  report.priority === "High"
                                    ? "border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-400"
                                    : report.priority === "Medium"
                                    ? "border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-400"
                                    : "border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400"
                                }
                              >
                                {report.priority} Priority
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <div className="text-sm font-medium text-muted-foreground">
                                  Type
                                </div>
                                <div className="mt-1">{report.type}</div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-muted-foreground">
                                  Description
                                </div>
                                <div className="mt-1 rounded-md bg-muted p-3 text-sm">
                                  {report.description}
                                </div>
                              </div>
                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <div className="text-sm font-medium text-muted-foreground">
                                    Reported Content
                                  </div>
                                  <div className="mt-1">
                                    <Link
                                      href="#"
                                      className="text-primary hover:underline"
                                    >
                                      {report.content}
                                    </Link>
                                  </div>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-muted-foreground">
                                    Reported User
                                  </div>
                                  <div className="mt-1 flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage
                                        src="/placeholder.svg"
                                        alt="Avatar"
                                      />
                                      <AvatarFallback>
                                        {report.reportedUserInitials}
                                      </AvatarFallback>
                                    </Avatar>
                                    <Link
                                      href="#"
                                      className="text-primary hover:underline"
                                    >
                                      {report.reportedUser}
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            <Button variant="outline">View Details</Button>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                className="text-red-600 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-950"
                              >
                                <X className="mr-2 h-4 w-4" />
                                Dismiss
                              </Button>
                              <Button>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Resolve
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </Tabs>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// Mock data for problems
const problemsData = [
  {
    id: "P-1024",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays",
    status: "Published",
    submissions: "2,456",
    successRate: "72%",
    created: "2 days ago",
  },
  {
    id: "P-1025",
    title: "Binary Tree Inversion",
    difficulty: "Medium",
    category: "Trees",
    status: "Published",
    submissions: "1,892",
    successRate: "58%",
    created: "3 days ago",
  },
  {
    id: "P-1026",
    title: "Merge K Sorted Lists",
    difficulty: "Hard",
    category: "Linked Lists",
    status: "Published",
    submissions: "876",
    successRate: "32%",
    created: "5 days ago",
  },
  {
    id: "P-1027",
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stacks",
    status: "Published",
    submissions: "3,241",
    successRate: "68%",
    created: "1 week ago",
  },
  {
    id: "P-1028",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "Strings",
    status: "Draft",
    submissions: "0",
    successRate: "0%",
    created: "1 day ago",
  },
];

// Mock data for contests
const contestsData = [
  {
    id: "C-101",
    title: "Weekly Challenge #42",
    startDate: "Jun 15, 2023",
    endDate: "Jun 22, 2023",
    status: "Active",
    participants: "1,245",
    problems: "8",
    duration: "7 days",
  },
  {
    id: "C-102",
    title: "Algorithm Mastery",
    startDate: "Jun 10, 2023",
    endDate: "Jun 17, 2023",
    status: "Active",
    participants: "876",
    problems: "6",
    duration: "7 days",
  },
  {
    id: "C-103",
    title: "Data Structure Deep Dive",
    startDate: "Jun 12, 2023",
    endDate: "Jun 14, 2023",
    status: "Active",
    participants: "542",
    problems: "4",
    duration: "48 hours",
  },
];

// Mock data for users
const usersData = [
  {
    id: "U-5001",
    name: "John Smith",
    username: "johnsmith",
    email: "john.smith@example.com",
    role: "User",
    status: "Active",
    joined: "Jan 15, 2023",
    lastActive: "Today",
    avatar: "/placeholder.svg",
    initials: "JS",
  },
  {
    id: "U-5002",
    name: "Sarah Johnson",
    username: "sarahj",
    email: "sarah.j@example.com",
    role: "Moderator",
    status: "Active",
    joined: "Mar 22, 2023",
    lastActive: "Yesterday",
    avatar: "/placeholder.svg",
    initials: "SJ",
  },
  {
    id: "U-5003",
    name: "Michael Chen",
    username: "mchen",
    email: "m.chen@example.com",
    role: "Admin",
    status: "Active",
    joined: "Nov 10, 2022",
    lastActive: "2 days ago",
    avatar: "/placeholder.svg",
    initials: "MC",
  },
  {
    id: "U-5004",
    name: "Emily Wilson",
    username: "emilyw",
    email: "e.wilson@example.com",
    role: "User",
    status: "Suspended",
    joined: "Feb 05, 2023",
    lastActive: "1 month ago",
    avatar: "/placeholder.svg",
    initials: "EW",
  },
  {
    id: "U-5005",
    name: "David Lee",
    username: "dlee",
    email: "d.lee@example.com",
    role: "User",
    status: "Pending",
    joined: "Jun 01, 2023",
    lastActive: "1 week ago",
    avatar: "/placeholder.svg",
    initials: "DL",
  },
];

// Mock data for reports
const reportsData = [
  {
    id: "R-201",
    date: "Jun 12, 2023",
    reporter: "Alex Thompson",
    priority: "High",
    type: "Inappropriate Solution",
    description:
      "The solution contains code that intentionally provides incorrect answers to trick other users.",
    content: "Solution to Problem #P-1024",
    reportedUser: "user123",
    reportedUserInitials: "U1",
  },
  {
    id: "R-202",
    date: "Jun 13, 2023",
    reporter: "Jessica Miller",
    priority: "Medium",
    type: "Plagiarism",
    description:
      "This solution appears to be copied directly from a well-known algorithm website without proper attribution.",
    content: "Solution to Problem #P-1025",
    reportedUser: "coder456",
    reportedUserInitials: "C4",
  },
  {
    id: "R-203",
    date: "Jun 14, 2023",
    reporter: "Robert Wilson",
    priority: "Low",
    type: "Incorrect Test Case",
    description:
      "The test case for this problem doesn't match the problem description and is causing confusion.",
    content: "Test Case for Problem #P-1026",
    reportedUser: "N/A",
    reportedUserInitials: "NA",
  },
];

function Filter({ className, ...props }: React.ComponentProps<typeof List>) {
  return <List className={className} {...props} />;
}
