"use client";

import { useEffect } from "react";
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
      })
    )
    .min(3, "At least three test cases are required"),
});

export default function UpdateProblemDialog({
  isOpen,
  onClose,
  problemId,
}: {
  isOpen: boolean;
  onClose: () => void;
  problemId: string;
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
      testCases: [
        { input: "", output: "", explanation: "" },
        { input: "", output: "", explanation: "" },
        { input: "", output: "", explanation: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "testCases",
  });

  useEffect(() => {
    const fetchProblemData = async () => {
      const dummyData = {
        title: "Sample Problem",
        difficulty: "medium",
        problemType: "coding",
        competitionMode: "general",
        topics: "math, algorithms",
        problemStatement: "Find the sum of two numbers.",
        constraints: "1 <= a, b <= 1000",
        timeLimit: "1",
        memoryLimit: "128",
        inputFormat: "Two integers a and b",
        outputFormat: "Sum of a and b",
        testCases: [
          { input: "1 2", output: "3", explanation: "1 + 2 = 3" },
          { input: "10 20", output: "30", explanation: "10 + 20 = 30" },
          { input: "100 200", output: "300", explanation: "100 + 200 = 300" },
        ],
      };
      Object.keys(dummyData).forEach((key) => {
        setValue(key, dummyData[key]);
      });
    };

    if (isOpen) {
      fetchProblemData();
    }
  }, [isOpen, setValue]);

  const handleUpdate = (data: any) => {
    console.log("Updated Data:", data);
    toast.success("Problem updated successfully!");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-scroll no-scrollbar px-12">
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
              onValueChange={(value) => setValue("difficulty", value)}
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
                <div key={field.id} className="space-y-2 p-2 border rounded-sm">
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
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
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

          <DialogFooter>
            <Button type="submit" className="w-full">
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
