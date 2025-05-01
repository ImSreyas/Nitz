"use client";

import React from "react";
import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Calendar,
  Download,
  FileText,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Overview from "./dashboard/Overview";
import User from "./users/components/User";
import Moderators from "./moderators/Moderators";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Tabs
      defaultValue="overview"
      className=""
      value={activeTab}
      onValueChange={setActiveTab}
    >
      {/* Overview Tab */}
      <TabsContent value="overview" className="space-y-4 p-6">
        <Overview />
      </TabsContent>

      {/* Users Tab */}
      <TabsContent value="users" className="p-6">
        <User />
      </TabsContent>

      {/* Moderators Tab */}
      <TabsContent value="moderators" className="p-6">
        <Moderators />
      </TabsContent>

      {/* Reports Tab */}
      <TabsContent value="reports" className="p-6"></TabsContent>

      {/* Problems Tab */}
      <TabsContent value="problems" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Problem Management</h2>
          <Button size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Problem
          </Button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search problems..."
                className="pl-8 w-[250px] md:w-[300px]"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Accuracy</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  id: 1,
                  title: "Two Sum",
                  difficulty: "Easy",
                  tags: ["Arrays", "Hash Table"],
                  status: "published",
                  author: "admin",
                  submissions: 12450,
                  accuracy: 78,
                },
                {
                  id: 2,
                  title: "Longest Substring Without Repeating Characters",
                  difficulty: "Medium",
                  tags: ["String", "Sliding Window"],
                  status: "published",
                  author: "sarah",
                  submissions: 8320,
                  accuracy: 62,
                },
                {
                  id: 3,
                  title: "Median of Two Sorted Arrays",
                  difficulty: "Hard",
                  tags: ["Arrays", "Binary Search"],
                  status: "flagged",
                  author: "michael",
                  submissions: 4210,
                  accuracy: 41,
                },
                {
                  id: 4,
                  title: "Valid Parentheses",
                  difficulty: "Easy",
                  tags: ["Stack", "String"],
                  status: "published",
                  author: "admin",
                  submissions: 10120,
                  accuracy: 85,
                },
                {
                  id: 5,
                  title: "Merge K Sorted Lists",
                  difficulty: "Hard",
                  tags: ["Linked List", "Heap"],
                  status: "draft",
                  author: "emily",
                  submissions: 0,
                  accuracy: 0,
                },
              ].map((problem) => (
                <TableRow key={problem.id}>
                  <TableCell className="font-medium">{problem.id}</TableCell>
                  <TableCell className="font-medium">{problem.title}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        problem.difficulty === "Easy"
                          ? "success"
                          : problem.difficulty === "Medium"
                          ? "default"
                          : problem.difficulty === "Hard"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {problem.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {problem.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        problem.status === "published"
                          ? "success"
                          : problem.status === "draft"
                          ? "outline"
                          : problem.status === "flagged"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {problem.status.charAt(0).toUpperCase() +
                        problem.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{problem.author}</TableCell>
                  <TableCell>{problem.submissions.toLocaleString()}</TableCell>
                  <TableCell>
                    {problem.accuracy > 0 ? (
                      <div className="flex items-center gap-2">
                        <Progress
                          value={problem.accuracy}
                          className="h-2 w-16"
                        />
                        <span>{problem.accuracy}%</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View problem</DropdownMenuItem>
                        <DropdownMenuItem>Edit problem</DropdownMenuItem>
                        <DropdownMenuItem>Assign reviewer</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {problem.status === "flagged" ? (
                          <DropdownMenuItem>Unflag problem</DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem>Flag problem</DropdownMenuItem>
                        )}
                        {problem.status === "published" ? (
                          <DropdownMenuItem>Unpublish</DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem>Publish</DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive">
                          Archive problem
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Problems by Topic and Difficulty</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { name: "Arrays", easy: 45, medium: 32, hard: 18 },
                    { name: "Strings", easy: 38, medium: 28, hard: 12 },
                    { name: "DP", easy: 15, medium: 42, hard: 25 },
                    { name: "Graphs", easy: 12, medium: 35, hard: 28 },
                    { name: "Trees", easy: 22, medium: 30, hard: 15 },
                    { name: "Math", easy: 30, medium: 25, hard: 20 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="easy" name="Easy" stackId="a" fill="#4ade80" />
                  <Bar
                    dataKey="medium"
                    name="Medium"
                    stackId="a"
                    fill="#facc15"
                  />
                  <Bar dataKey="hard" name="Hard" stackId="a" fill="#f87171" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Contests Tab */}
      <TabsContent value="contests" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Contest Management</h2>
          <Button size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Contest
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Upcoming Contests
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                Next contest in 2 days
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ongoing Contests
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">
                1,245 active participants
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Past Contests
              </CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48</div>
              <p className="text-xs text-muted-foreground">
                +3 from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>Contest Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Problems</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  id: 1,
                  name: "Weekly Challenge #42",
                  status: "upcoming",
                  startTime: "2023-07-20 14:00 UTC",
                  duration: "2 hours",
                  participants: 0,
                  problems: 5,
                },
                {
                  id: 2,
                  name: "Algorithm Sprint",
                  status: "ongoing",
                  startTime: "2023-07-15 10:00 UTC",
                  duration: "3 days",
                  participants: 845,
                  problems: 8,
                },
                {
                  id: 3,
                  name: "Data Structures Showdown",
                  status: "ongoing",
                  startTime: "2023-07-16 18:00 UTC",
                  duration: "24 hours",
                  participants: 400,
                  problems: 6,
                },
                {
                  id: 4,
                  name: "Weekly Challenge #41",
                  status: "finished",
                  startTime: "2023-07-13 14:00 UTC",
                  duration: "2 hours",
                  participants: 752,
                  problems: 5,
                },
                {
                  id: 5,
                  name: "Summer Coding Cup",
                  status: "finished",
                  startTime: "2023-07-01 09:00 UTC",
                  duration: "5 days",
                  participants: 1245,
                  problems: 12,
                },
              ].map((contest) => (
                <TableRow key={contest.id}>
                  <TableCell className="font-medium">{contest.id}</TableCell>
                  <TableCell className="font-medium">{contest.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        contest.status === "upcoming"
                          ? "outline"
                          : contest.status === "ongoing"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {contest.status.charAt(0).toUpperCase() +
                        contest.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{contest.startTime}</TableCell>
                  <TableCell>{contest.duration}</TableCell>
                  <TableCell>{contest.participants.toLocaleString()}</TableCell>
                  <TableCell>{contest.problems}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Edit contest</DropdownMenuItem>
                        <DropdownMenuItem>Manage problems</DropdownMenuItem>
                        {contest.status === "finished" && (
                          <DropdownMenuItem>View results</DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {contest.status === "upcoming" ? (
                          <>
                            <DropdownMenuItem>Reschedule</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Cancel contest
                            </DropdownMenuItem>
                          </>
                        ) : contest.status === "ongoing" ? (
                          <DropdownMenuItem className="text-destructive">
                            End contest
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem>Archive contest</DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Contest Participation Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={[
                    { name: "Week 36", participants: 520 },
                    { name: "Week 37", participants: 580 },
                    { name: "Week 38", participants: 650 },
                    { name: "Week 39", participants: 590 },
                    { name: "Week 40", participants: 680 },
                    { name: "Week 41", participants: 752 },
                    { name: "Week 42", participants: 0 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Line
                    type="monotone"
                    dataKey="participants"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Notifications Tab */}
      <TabsContent value="notifications" className="p-6"></TabsContent>

      {/* Settings Tab */}
      <TabsContent value="settings" className="p-6"></TabsContent>
    </Tabs>
  );
}

function Clock(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CheckCircle(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function Eye(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function History(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}

function Trash(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function Upload(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}
