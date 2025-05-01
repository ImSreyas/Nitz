import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Notifications() {
  return (
    <div>
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
    </div>
  );
}
