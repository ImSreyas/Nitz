"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getProblem, updateProblem } from "@/lib/api/moderator";

export const problemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  difficulty: z.enum(["beginner", "easy", "medium", "hard", "complex"]),
  problemType: z.enum(["coding", "debugging"]),
  competitionMode: z.enum(["general", "competitive"]),
  topics: z.string().min(1, "Topics are required"),
  problemStatement: z
    .string()
    .min(10, "Problem statement must be at least 10 characters long"),
  constraints: z.string().min(5, "Constraints must be specified"),
  timeLimit: z.string().min(1, "Time limit is required"),
  memoryLimit: z.string().min(1, "Memory limit is required"),
  inputFormat: z.string().min(5, "Input format is required"),
  outputFormat: z.string().min(5, "Output format is required"),
  testCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
        explanation: z.string().optional(),
        test_case_id: z.string().optional(),
      })
    )
    .min(3, "At least three test cases are required"),
});

export default function UpdateProblemDialog({
  isOpen,
  onClose,
  problemId,
  onUpdate,
}: {
  isOpen: boolean;
  onClose: () => void;
  problemId: string;
  onUpdate: () => void;
}) {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: "",
      difficulty: "beginner",
      problemType: "coding",
      competitionMode: "general",
      topics: "",
      problemStatement: "",
      constraints: "",
      timeLimit: "",
      memoryLimit: "",
      inputFormat: "",
      outputFormat: "",
      testCases: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "testCases",
  });

  const [testCaseDeleteArray, setTestCaseDeleteArray] = useState<string[]>([]);

  const fetchProblemData = async () => {
    try {
      const response = await getProblem(problemId);
      if (response?.data?.success) {
        const problemData = response?.data?.data[0];
        if (!problemData) {
          toast.error("Problem not found.");
          return;
        }

        // Set the fetched problem data into the form
        (Object.keys(problemData) as Array<keyof typeof problemData>).forEach(
          (key) => {
            if (key === "topics") {
              return;
            }
            setValue(key as keyof typeof problemSchema._type, problemData[key]);
          }
        );
        setValue("timeLimit", problemData.time_limit);
        setValue("memoryLimit", problemData.memory_limit);
        setValue("problemStatement", problemData.problem_statement);
        setValue("inputFormat", problemData.input_format);
        setValue("outputFormat", problemData.output_format);
        setValue("competitionMode", problemData.competition_mode);
        setValue("problemType", problemData.problem_type);
        setValue("testCases", problemData.test_cases);
        setValue(
          "topics",
          Array.isArray(problemData.topics) && problemData.topics.length > 0
            ? problemData.topics.join(", ")
            : ""
        );
        setTestCaseDeleteArray([]);
      } else {
        toast.error("Failed to fetch problem details.");
      }
    } catch (error) {
      console.error("Error fetching problem details:", error);
      toast.error("An error occurred while fetching problem details.");
    }
  };
  useEffect(() => {
    if (isOpen) {
      fetchProblemData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, problemId, setValue]);

  const handleUpdate = async (data: z.infer<typeof problemSchema>) => {
    try {
      const reponse = await updateProblem(problemId, data, testCaseDeleteArray);
      if (reponse?.data?.success) {
        toast.success("Problem updated successfully!");
        onUpdate();
      } else {
        toast.error("Failed to update problem.");
      }
    } catch {
      toast.error("Failed to update problem.");
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-scroll px-16 py-12 max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Problem</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              {...register("title")}
              placeholder="Problem Title"
              className="w-full"
            />
            {errors.title && (
              <p className="text-red-500 text-xs">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Difficulty</label>
            <Select
              value={watch("difficulty")}
              onValueChange={(value) =>
                setValue(
                  "difficulty",
                  value as "beginner" | "easy" | "medium" | "hard" | "complex"
                )
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
                <SelectItem value="complex">Complex</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Competition Mode
            </label>

            <Select
              value={watch("competitionMode")}
              onValueChange={(value) =>
                setValue("competitionMode", value as "general" | "competitive")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Competitive Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="competitive">Competitive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Problem Type
            </label>

            <Select
              value={watch("problemType")}
              onValueChange={(value) =>
                setValue("problemType", value as "coding" | "debugging")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Problem Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="coding">Coding</SelectItem>
                <SelectItem value="debugging">Debugging</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Topics</label>
            <Input
              {...register("topics")}
              placeholder="Comma-separated topics (e.g., math, algorithms)"
              className="w-full"
            />
            {errors.topics && (
              <p className="text-red-500 text-xs">{errors.topics.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Time Limit</label>
            <Input
              {...register("timeLimit")}
              placeholder="Time limit in seconds"
              className="w-full"
            />
            {errors.timeLimit && (
              <p className="text-red-500 text-xs">{errors.timeLimit.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Memory Limit
            </label>
            <Input
              {...register("memoryLimit")}
              placeholder="Memory limit in MB"
              className="w-full"
            />
            {errors.memoryLimit && (
              <p className="text-red-500 text-xs">
                {errors.memoryLimit.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Problem Statement
            </label>
            <Textarea
              {...register("problemStatement")}
              placeholder="Problem Statement"
              className="w-full"
            />
            {errors.problemStatement && (
              <p className="text-red-500 text-xs">
                {errors.problemStatement.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Constraints
            </label>
            <Textarea
              {...register("constraints")}
              placeholder="Constraints"
              className="w-full"
            />
            {errors.constraints && (
              <p className="text-red-500 text-xs">
                {errors.constraints.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Input Format
            </label>
            <Textarea
              {...register("inputFormat")}
              placeholder="Input Format"
              className="w-full"
            />
            {errors.inputFormat && (
              <p className="text-red-500 text-xs">
                {errors.inputFormat.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Output Format
            </label>
            <Textarea
              {...register("outputFormat")}
              placeholder="Output Format"
              className="w-full"
            />
            {errors.outputFormat && (
              <p className="text-red-500 text-xs">
                {errors.outputFormat.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm">Test Cases</h4>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-3 p-4 border rounded-sm">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Input
                    </label>
                    <Input
                      {...register(`testCases.${index}.input`)}
                      placeholder="Input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Output
                    </label>
                    <Input
                      {...register(`testCases.${index}.output`)}
                      placeholder="Output"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Explanation (optional)
                    </label>
                    <Textarea
                      {...register(`testCases.${index}.explanation`)}
                      placeholder="Explanation (optional)"
                    />
                  </div>
                  {fields.length > 3 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        remove(index);
                        if (field.test_case_id) {
                          setTestCaseDeleteArray((prev) => [
                            ...prev,
                            ...(field.test_case_id ? [field.test_case_id] : []),
                          ]);
                        }
                      }}
                      className="!mt-4"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => append({ input: "", output: "", explanation: "" })}
            >
              Add Test Case
            </Button>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="w-40 max-w-[30%]"
              onClick={() => fetchProblemData()}
            >
              Reset
            </Button>
            <Button type="submit" className="w-full graw">
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
