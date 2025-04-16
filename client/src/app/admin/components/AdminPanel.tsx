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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Overview from "./Overview";
import User from "./User";
import Moderators from "./Moderators";


export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Tabs
      defaultValue="overview"
      className=""
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <header className="flex justify-center h-16 items-center gap-4 bg-background px-6">
        <TabsList className="flex gap w-fit max-w-4xl">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline-block translate-y-[1px]">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline-block translate-y-[1px]">Users</span>
          </TabsTrigger>
          <TabsTrigger value="moderators" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline-block translate-y-[1px]">Moderators</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline-block translate-y-[1px]">Reports</span>
          </TabsTrigger>
          <TabsTrigger value="problems" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline-block translate-y-[1px]">Problems</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline-block translate-y-[1px]">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline-block translate-y-[1px]">Settings</span>
          </TabsTrigger>
        </TabsList>
      </header>

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
      <TabsContent value="reports" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Reports Management</h2>
          <div className="flex items-center gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reports</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-review">In Review</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="bug">Bug</SelectItem>
                <SelectItem value="feedback">Feedback</SelectItem>
                <SelectItem value="abuse">Abuse</SelectItem>
                <SelectItem value="plagiarism">Plagiarism</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Reports
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">
                +23 from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Reports
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">-5 from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Resolved Reports
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">133</div>
              <p className="text-xs text-muted-foreground">
                +18 from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Reported By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  id: 1,
                  type: "Bug",
                  title: "Incorrect test case in Problem #342",
                  reportedBy: "johndoe",
                  status: "pending",
                  created: "2023-07-15",
                },
                {
                  id: 2,
                  type: "Plagiarism",
                  title: "Solution copied from external source",
                  reportedBy: "alicesmith",
                  status: "in-review",
                  created: "2023-07-14",
                },
                {
                  id: 3,
                  type: "Feedback",
                  title: "Confusing problem description",
                  reportedBy: "bobjohnson",
                  status: "resolved",
                  created: "2023-07-12",
                },
                {
                  id: 4,
                  type: "Abuse",
                  title: "Inappropriate comment in forum",
                  reportedBy: "carolwilliams",
                  status: "pending",
                  created: "2023-07-15",
                },
                {
                  id: 5,
                  type: "Bug",
                  title: "Submission system error",
                  reportedBy: "davebrown",
                  status: "resolved",
                  created: "2023-07-10",
                },
              ].map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.id}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        report.type === "Bug"
                          ? "default"
                          : report.type === "Plagiarism"
                          ? "destructive"
                          : report.type === "Feedback"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {report.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{report.title}</TableCell>
                  <TableCell>{report.reportedBy}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        report.status === "pending"
                          ? "outline"
                          : report.status === "in-review"
                          ? "default"
                          : "success"
                      }
                    >
                      {report.status === "pending"
                        ? "Pending"
                        : report.status === "in-review"
                        ? "In Review"
                        : "Resolved"}
                    </Badge>
                  </TableCell>
                  <TableCell>{report.created}</TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View report</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[625px]">
                        <DialogHeader>
                          <DialogTitle>
                            Report #{report.id}: {report.title}
                          </DialogTitle>
                          <DialogDescription>
                            Reported by <strong>{report.reportedBy}</strong> on{" "}
                            {report.created}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label>Description</Label>
                            <div className="rounded-md bg-muted p-4 text-sm">
                              This is a detailed description of the report. It
                              includes all the information provided by the user
                              who submitted the report.
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <Label>Comments</Label>
                            <div className="space-y-4">
                              <div className="flex gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                                  <AvatarFallback>M</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 rounded-md bg-muted p-2 text-sm">
                                  <p className="font-medium">
                                    Michael (Moderator)
                                  </p>
                                  <p>I'll look into this issue right away.</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    2 hours ago
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="comment">Add Comment</Label>
                            <Textarea
                              id="comment"
                              placeholder="Type your comment here..."
                            />
                          </div>
                        </div>
                        <DialogFooter className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              Assign to Moderator
                            </Button>
                            <Button
                              variant={
                                report.status === "resolved"
                                  ? "outline"
                                  : "default"
                              }
                              size="sm"
                            >
                              {report.status === "resolved"
                                ? "Reopen"
                                : "Mark as Resolved"}
                            </Button>
                          </div>
                          <Button type="submit">Submit Comment</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing <strong>1</strong> to <strong>5</strong> of{" "}
            <strong>156</strong> reports
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </TabsContent>

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
      <TabsContent value="notifications" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Notification Center</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Send Notification</CardTitle>
              <CardDescription>
                Create and send notifications to users of the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Notification Title</Label>
                  <Input id="title" placeholder="Enter notification title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Enter notification message"
                    className="min-h-[120px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Recipients</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="active">Active Users</SelectItem>
                      <SelectItem value="moderators">Moderators</SelectItem>
                      <SelectItem value="contestants">
                        Contest Participants
                      </SelectItem>
                      <SelectItem value="custom">Custom Filter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="schedule" />
                  <Label htmlFor="schedule">Schedule for later</Label>
                </div>
                <Button className="w-full">Send Notification</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>
                View and manage recently sent notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    title: "New Contest Announcement",
                    recipients: "All Users",
                    sent: "2023-07-15",
                    status: "Sent",
                  },
                  {
                    id: 2,
                    title: "System Maintenance",
                    recipients: "All Users",
                    sent: "2023-07-10",
                    status: "Sent",
                  },
                  {
                    id: 3,
                    title: "New Features Released",
                    recipients: "Active Users",
                    sent: "2023-07-05",
                    status: "Sent",
                  },
                  {
                    id: 4,
                    title: "Weekly Challenge Reminder",
                    recipients: "Contest Participants",
                    sent: "2023-07-18",
                    status: "Scheduled",
                  },
                ].map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">
                        To: {notification.recipients} • {notification.sent}
                      </p>
                    </div>
                    <Badge
                      variant={
                        notification.status === "Sent" ? "outline" : "default"
                      }
                    >
                      {notification.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Notifications
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    {
                      name: "Contest Announcements",
                      sent: 12,
                      read: 9,
                      clicked: 6,
                    },
                    { name: "System Updates", sent: 8, read: 7, clicked: 3 },
                    {
                      name: "Feature Releases",
                      sent: 5,
                      read: 4,
                      clicked: 2,
                    },
                    {
                      name: "Weekly Reminders",
                      sent: 15,
                      read: 10,
                      clicked: 7,
                    },
                    { name: "Special Events", sent: 6, read: 5, clicked: 4 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="sent" name="Sent" fill="#8884d8" />
                  <Bar dataKey="read" name="Read" fill="#82ca9d" />
                  <Bar dataKey="clicked" name="Clicked" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Settings Tab */}
      <TabsContent value="settings" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Platform Settings</h2>
          <Button size="sm">Save Changes</Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Points & Tier System</CardTitle>
              <CardDescription>
                Configure how points are awarded and tier thresholds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Points Formula</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="easy-points">Easy Problem</Label>
                      <Input id="easy-points" type="number" defaultValue={10} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="medium-points">Medium Problem</Label>
                      <Input
                        id="medium-points"
                        type="number"
                        defaultValue={20}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hard-points">Hard Problem</Label>
                      <Input id="hard-points" type="number" defaultValue={30} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expert-points">Expert Problem</Label>
                      <Input
                        id="expert-points"
                        type="number"
                        defaultValue={50}
                      />
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Tier Thresholds</Label>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bronze-threshold">Bronze</Label>
                        <Input
                          id="bronze-threshold"
                          type="number"
                          defaultValue={0}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="silver-threshold">Silver</Label>
                        <Input
                          id="silver-threshold"
                          type="number"
                          defaultValue={500}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gold-threshold">Gold</Label>
                        <Input
                          id="gold-threshold"
                          type="number"
                          defaultValue={1500}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="platinum-threshold">Platinum</Label>
                        <Input
                          id="platinum-threshold"
                          type="number"
                          defaultValue={3000}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="diamond-threshold">Diamond</Label>
                        <Input
                          id="diamond-threshold"
                          type="number"
                          defaultValue={5000}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Moderation Settings</CardTitle>
              <CardDescription>
                Configure moderation thresholds and automated actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Auto-Flag Thresholds</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="problem-reports">Problem Reports</Label>
                      <Input
                        id="problem-reports"
                        type="number"
                        defaultValue={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user-reports">User Reports</Label>
                      <Input id="user-reports" type="number" defaultValue={3} />
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Blackpoint System</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="max-blackpoints">
                        Max Allowed Blackpoints
                      </Label>
                      <Input
                        id="max-blackpoints"
                        type="number"
                        defaultValue={10}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="blackpoint-reset">
                        Reset Period (days)
                      </Label>
                      <Input
                        id="blackpoint-reset"
                        type="number"
                        defaultValue={90}
                      />
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Automated Actions</Label>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="auto-block" defaultChecked />
                      <Label htmlFor="auto-block">
                        Auto-block users at max blackpoints
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="auto-review" defaultChecked />
                      <Label htmlFor="auto-review">
                        Auto-assign reports to moderators
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="auto-notify" defaultChecked />
                      <Label htmlFor="auto-notify">
                        Notify admins of flagged content
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Streak & Reward System</CardTitle>
              <CardDescription>
                Configure how streaks and rewards work
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Streak Rewards</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="streak-7">7 Day Streak</Label>
                      <Input id="streak-7" type="number" defaultValue={50} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="streak-30">30 Day Streak</Label>
                      <Input id="streak-30" type="number" defaultValue={200} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="streak-100">100 Day Streak</Label>
                      <Input id="streak-100" type="number" defaultValue={500} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="streak-365">365 Day Streak</Label>
                      <Input
                        id="streak-365"
                        type="number"
                        defaultValue={2000}
                      />
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Daily Challenges</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="daily-challenges" defaultChecked />
                    <Label htmlFor="daily-challenges">
                      Enable daily challenges
                    </Label>
                  </div>
                  <div className="space-y-2 mt-2">
                    <Label htmlFor="daily-reward">Daily Challenge Reward</Label>
                    <Input id="daily-reward" type="number" defaultValue={15} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Backup & Data Management</CardTitle>
              <CardDescription>
                Configure backup settings and manage platform data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Automated Backups</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="auto-backup" defaultChecked />
                    <Label htmlFor="auto-backup">
                      Enable automated backups
                    </Label>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="space-y-2">
                      <Label htmlFor="backup-frequency">
                        Backup Frequency (hours)
                      </Label>
                      <Input
                        id="backup-frequency"
                        type="number"
                        defaultValue={24}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="backup-retention">
                        Retention Period (days)
                      </Label>
                      <Input
                        id="backup-retention"
                        type="number"
                        defaultValue={30}
                      />
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Data Management</Label>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" className="justify-start">
                      <Download className="mr-2 h-4 w-4" />
                      Export All Platform Data
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Upload className="mr-2 h-4 w-4" />
                      Import Data
                    </Button>
                    <Button variant="destructive" className="justify-start">
                      <Trash className="mr-2 h-4 w-4" />
                      Purge Inactive User Data
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
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