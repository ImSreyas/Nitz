"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useRoleStore } from "@/lib/store/useRoleStore";
import { addProblemDiscussion, getProblemDiscussions } from "@/lib/api/common";
import { toast } from "sonner";
import { Database } from "lucide-react";

interface Discussion {
  discussion_id: string;
  user_name: string;
  message: string;
  posted_at: string;
  blackpoints: number;
}

export default function DiscussionArea({ problemId }: { problemId: string }) {
  const [comment, setComment] = useState("");
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const { context } = useRoleStore();

  // Fetch discussions from the API
  const fetchDiscussions = async () => {
    try {
      const response = await getProblemDiscussions(problemId);
      if (response?.data?.success) {
        setDiscussions(response.data.data);
      } else {
        console.error("Failed to fetch discussions.");
      }
    } catch (error) {
      console.error("Error fetching discussions:", error);
    }
  };

  // Add a new discussion
  const handleAddDiscussion = async () => {
    if (!comment.trim()) {
      return;
    }

    try {
      const response = await addProblemDiscussion(problemId, comment);
      if (response?.data?.success) {
        setComment("");
        fetchDiscussions();
        toast.success("Discussion added successfully!");
      } else {
        console.error("Failed to add discussion.");
      }
    } catch (error) {
      console.error("Error adding discussion:", error);
    }
  };

  useEffect(() => {
    fetchDiscussions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="relative">
        <Card className="sticky top-8">
          <CardHeader>
            <CardTitle>Discussion</CardTitle>
          </CardHeader>
          {context === "user" && (
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Add your comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="resize-none px-6 py-4"
                  rows={18}
                />
                <div className="flex justify-end !mt-6">
                  <Button className="w-full" onClick={handleAddDiscussion}>
                    Post Comment
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      <div className="space-y-4">
        {discussions.length === 0 && (
          <div className="flex items-center justify-center h-full border rounded-lg border-dashed bg-card">
            <div className="flex justify-center items-center flex-col gap-2 text-muted-foreground">
              <Database />
              <div className="text-center">
                <p className="text-muted-foreground">No discussions yet.</p>
                <p className="text-muted-foreground/70 text-sm">
                  Add a comment to start the discussion
                </p>
              </div>
            </div>
          </div>
        )}
        {discussions.map((discussion) => (
          <Card key={discussion.discussion_id} className="h-fit">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarFallback>
                    {discussion.user_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{discussion.user_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(discussion.posted_at).toLocaleString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </div>
                  </div>
                  <p className="mt-2 text-sm">{discussion.message}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
