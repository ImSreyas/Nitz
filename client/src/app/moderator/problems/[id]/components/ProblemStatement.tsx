"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Bookmark, Share2 } from "lucide-react";

export default function ProblemStatement({
  problem,
  problemNum,
  problemTitle,
  difficulty,
}: {
  problem: string;
  problemNum: string;
  problemTitle: string;
  difficulty: string;
}) {
  return (
    <div className="h-full flex flex-col border rounded-sm">
      <Card className="flex-1 border-0 rounded-none overflow-hidden">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 px-4 py-3 border-b">
          <div>
            <CardTitle className="text-2xl font-bold">
              {problemNum}. {problemTitle}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant="outline"
                className="bg-green-100 text-green-800 hover:bg-green-100"
              >
                {difficulty}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Acceptance Rate: 75%
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <ThumbsDown className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 h-[calc(100%-4rem)]">
          <ScrollArea className="h-full p-4">
            <div className="space-y-4">{problem}</div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
