"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, MessageSquare } from "lucide-react"
import { useState } from "react"

export default function DiscussionArea() {
  const [comment, setComment] = useState("")

  const dummyComments = [
    {
      id: 1,
      user: "User1",
      avatar: "U1",
      content: "Great problem! I learned a lot about hash maps from this.",
      likes: 12,
      replies: 3,
      time: "2 days ago",
    },
    {
      id: 2,
      user: "User2",
      avatar: "U2",
      content:
        "I found a faster solution using a single pass through the array. The time complexity is O(n) and space complexity is O(n).",
      likes: 24,
      replies: 5,
      time: "1 day ago",
    },
    {
      id: 3,
      user: "User3",
      avatar: "U3",
      content: "Can someone explain why we need to use a hash map here? Couldn't we just use a nested loop?",
      likes: 3,
      replies: 8,
      time: "12 hours ago",
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Discussion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Add your comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="resize-none"
            />
            <Button className="w-full sm:w-auto">Post Comment</Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {dummyComments.map((comment) => (
          <Card key={comment.id}>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarFallback>{comment.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{comment.user}</div>
                    <div className="text-xs text-muted-foreground">{comment.time}</div>
                  </div>
                  <p className="mt-2 text-sm">{comment.content}</p>
                  <div className="mt-4 flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{comment.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{comment.replies}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

