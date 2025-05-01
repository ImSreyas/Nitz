import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertTriangle, CheckCircle, Clock, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Reports() {
  return (
    <div>
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
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+23 from last month</p>
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
            <p className="text-xs text-muted-foreground">+18 from last month</p>
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
                        : "secondary"
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
                                <p>I&apos;ll look into this issue right away.</p>
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
    </div>
  );
}
