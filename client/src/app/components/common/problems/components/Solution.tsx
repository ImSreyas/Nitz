"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRoleStore } from "@/lib/store/useRoleStore";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { addProblemSolution, getProblemSolution } from "@/lib/api/moderator";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"; 

// Define the schema for validation using Zod
const solutionSchema = z.object({
  solution: z.string().min(10, "Solution must be at least 10 characters long"),
});

type SolutionFormValues = z.infer<typeof solutionSchema>;

export default function Solution({ problemId }: { problemId: string }) {
  const { context } = useRoleStore();
  const [solution, setSolution] = React.useState<string>("");

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<SolutionFormValues>({
    resolver: zodResolver(solutionSchema),
    defaultValues: {
      solution: "",
    },
  });

  const getSolution = async () => {
    try {
      const response = await getProblemSolution(problemId);
      if (response && response.data && response.data.success) {
        setSolution(response.data.data);
        setValue("solution", response.data.data);
      } else {
        console.log(
          "Error fetching solution:",
          response?.data?.error || "Unknown error"
        );
      }
    } catch {
      console.log("Error fetching solution:");
    }
  };

  useEffect(() => {
    getSolution();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: SolutionFormValues) => {
    try {
      const response = await addProblemSolution(problemId, data.solution);
      if (response && response.data && response.data.success) {
        toast.success("Solution submitted successfully!");
      } else {
        toast.error(
          response?.data?.error ||
            "Error submitting solution. Please try again."
        );
      }
    } catch {
      toast.error("Error submitting solution. Please try again.");
    }
  };

  return (
    <div className="rounded-lg border p-6">
      <h2 className="text-2xl font-bold mb-4">Solution</h2>
      {context !== "user" ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Textarea
              {...register("solution")}
              placeholder="Write your solution and explanation here..."
              className="px-6 py-4 bg-card"
              rows={15}
            />
            {errors.solution && (
              <p className="text-red-500 text-sm mt-1">
                {errors.solution.message}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              type="button"
              onClick={() => setValue("solution", "")}
            >
              Clear
            </Button>
            <Button type="submit" className="w-fit">
              Submit Solution
            </Button>
          </div>
        </form>
      ) : (
        <div className="card py-6 px-10 rounded-md bg-card">
          <SyntaxHighlighter
            className="text-sm"
            language="python" 
            style={oneDark} 
            wrapLines={true} 
            showLineNumbers={true} 
          >
            {solution || "No solution available."}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
}
