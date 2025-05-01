"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Cpu, FileText, RefreshCcw, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import {
  deleteProblem,
  getPublishStatus,
  setPublishStatus,
} from "@/lib/api/moderator";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import UpdateProblemDialog from "./UpdateProblemDialog";
import { useRoleStore } from "@/lib/store/useRoleStore";

type PublishStatus = "unpublished" | "published";
type ProblemStatementType = {
  problemId: string;
  problem: string;
  problemNum: number;
  problemTitle: string;
  difficulty: string;
  competitionMode: string;
  constraints: string;
  inputFormat: string;
  outputFormat: string;
  memoryLimit: string;
  timeLimit: string;
  testCases: { input: string; output: string; explanation?: string }[];
};

function TitleCard({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <div
      className={`${className} block bg-muted text-foreground w-fit px-2 py-0.5 font-semibold rounded-sm text-sm border border-foreground/10`}
    >
      {title}
    </div>
  );
}

export default function ProblemStatement({
  problemId,
  problem,
  problemNum,
  problemTitle,
  difficulty,
  competitionMode,
  constraints,
  inputFormat,
  outputFormat,
  memoryLimit,
  timeLimit,
  testCases,
}: ProblemStatementType) {
  const [status, setStatus] = useState<PublishStatus>("unpublished");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false); // State for update dialog

  const { context } = useRoleStore();

  useEffect(() => {
    const fetchPublishStatus = async () => {
      const result = await getPublishStatus(problemId);
      if (result) {
        if (result.data) {
          const data = result.data;
          if (data?.success) {
            const fetchedStatus = data?.data?.status
              ? "published"
              : "unpublished";
            setStatus(fetchedStatus);
          } else {
            toast.error("Something went wrong", { position: "top-right" });
          }
        }
      }
    };

    fetchPublishStatus();
  }, [problemId]);

  const handleStatusChange = async (value: PublishStatus) => {
    setStatus(value);
    const result = await setPublishStatus(problemId, value);
    if (result) {
      if (result?.data) {
        const data = result.data;
        if (data?.success) {
          toast.success("Status updated successfully", {
            position: "top-right",
          });
        } else {
          toast.error("Something went wrong", { position: "top-right" });
        }
      }
    }
  };

  const handleDelete = async () => {
    console.log(`Deleting problem: ${problemTitle}`);
    const result = await deleteProblem(problemId);
    if (result) {
      if (result.data) {
        const data = result.data;
        if (data?.success) {
          toast.success("Problem deleted successfully", {
            position: "top-right",
          });
          redirect("/moderator/problems");
        } else {
          toast.error("Something went wrong", { position: "top-right" });
        }
      }
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="flex flex-col border rounded-sm relative h-[calc(100vh-6rem)]">
      <Card className="flex-1 border-0 rounded-none overflow-hidden pb-6">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 px-4 py-3 border-b">
          <div>
            <CardTitle className="text-xl font-bold">
              {problemNum}. {problemTitle}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <div
                className={`${
                  difficulty === "beginner"
                    ? "text-difficulty-beginner"
                    : difficulty === "easy"
                    ? "text-difficulty-easy"
                    : difficulty === "medium"
                    ? "text-difficulty-medium"
                    : difficulty === "hard"
                    ? "text-difficulty-hard"
                    : difficulty === "complex"
                    ? "text-difficulty-complex"
                    : "--text-white"
                } text-xs border px-3 py-1 bg-accent rounded-sm`}
              >
                {difficulty}
              </div>
              {context !== "user" && (
                <span className="text-sm text-muted-foreground">
                  Competition Mode:{" "}
                  <span className="text-foreground">{competitionMode}</span>
                </span>
              )}
            </div>
          </div>
          {context !== "user" && (
            <div className="flex items-center gap-2">
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[150px] h-8 text-xs">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unpublished">Unpublished</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsUpdateDialogOpen(true)} // Open update dialog
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-4 h-[calc(100%-4rem)] overflow-y-scroll">
          <div className="space-y-4 no-scrollbar">
            {/* Problem Statement */}
            <div>
              <TitleCard title="Problem statement" />
              <p className="mt-3 px-2 text-sm">{problem}</p>
            </div>

            {/* Test Cases */}
            <div className="space-y-4">
              <TitleCard title="Examples" />
              {testCases.map((testCase, index) => (
                <Card
                  key={index}
                  className="p-4 border rounded-md bg-card text-xs"
                >
                  <div>
                    <div className="block mb-1 text-primary font-medium">
                      Example {index + 1}
                    </div>
                    <p>
                      <span className="font-medium">Input:</span>{" "}
                      <span className="">{testCase.input}</span>
                    </p>
                    <p>
                      <span className="font-medium">Output:</span>{" "}
                      <span className="">{testCase.output}</span>
                    </p>
                    {testCase.explanation && (
                      <p>
                        <span className="font-medium">Explanation:</span>{" "}
                        {testCase.explanation}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {/* Constraints */}
            <div>
              <TitleCard title="Constraints" />
              <p className="mt-3 px-2 text-xs">{constraints || "None"}</p>
            </div>

            {/* Input/Output Format */}
            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div>
                <div className="flex items-center">
                  <FileText className="inline-block mr-2 text-muted-foreground h-4 w-4" />
                  <div className="text-sm">Input format</div>
                </div>
                <p className="text-xs mt-2">{inputFormat || "None"}</p>
              </div>
              <div>
                <div className="flex items-center">
                  <FileText className="inline-block mr-2 text-muted-foreground h-4 w-4" />
                  <div className="text-sm">Output format</div>
                </div>
                <p className="text-xs mt-2">{outputFormat || "None"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Section */}
      <div className="relative w-full bottom-0 left-0 border-t bg-card p-4 text-xs flex justify-between items-center">
        <div className="flex items-center gap-4 w-full">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-muted-foreground" />
            <span>
              <strong>Memory Limit:</strong> {memoryLimit} MB
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-muted-foreground" />
            <span>
              <strong>Time Limit:</strong> {timeLimit} seconds
            </span>
          </div>
        </div>
      </div>

      {/* Dialog for Delete Confirmation */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure to delete this problem?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground/90 truncate w-full">
            Problem Title:{" "}
            <span className="font-medium text-muted-foreground ">
              {problemTitle}
            </span>
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for Update Problem */}
      <UpdateProblemDialog
        isOpen={isUpdateDialogOpen}
        onClose={() => setIsUpdateDialogOpen(false)}
        problemId={problemId}
      />
    </div>
  );
}
