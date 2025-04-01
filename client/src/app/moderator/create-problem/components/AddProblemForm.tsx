"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import MonacoEditor from "@monaco-editor/react";
import { useState } from "react";
import { addProblem } from "@/lib/api/moderator";
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
  starterCode: z.array(
    z.object({
      language: z.string(),
      userCode: z.string().optional(),
      logicCode: z.string().optional(),
    })
  ),
});

export default function AddProblemForm() {
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
      starterCode: [
        {
          language: "python",
          userCode:
            "# User writes solution here\ndef addTwoNumbers(a, b):\n    # Your code here",
          logicCode:
            "# Logic to transform inputs and compare outputs\ndef transform_input(input_args):\n    return list(map(int, input_args))\n\ndef transform_output(output):\n    return str(output)",
        },
        {
          language: "javascript",
          userCode:
            "// User writes solution here\nfunction addTwoNumbers(a, b) {\n  // Your code here\n}",
          logicCode:
            "// Logic to transform inputs and compare outputs\nfunction transformInput(inputArgs) {\n  return inputArgs.map(Number);\n}\n\nfunction transformOutput(output) {\n  return output.toString();\n}",
        },
        {
          language: "java",
          userCode:
            "// User writes solution here\npublic class Solution {\n  public int addTwoNumbers(int a, int b) {\n    // Your code here\n  }\n}",
          logicCode:
            "// Logic to transform inputs and compare outputs\npublic class TestRunner {\n  public static int[] transformInput(String[] inputArgs) {\n    int[] result = new int[inputArgs.length];\n    for (int i = 0; i < inputArgs.length; i++) {\n      result[i] = Integer.parseInt(inputArgs[i]);\n    }\n    return result;\n  }\n  \n  public static String transformOutput(int output) {\n    return Integer.toString(output);\n  }\n}",
        },
        {
          language: "cpp",
          userCode:
            "// User writes solution here\nint addTwoNumbers(int a, int b) {\n  // Your code here\n}",
          logicCode:
            "// Logic to transform inputs and compare outputs\n#include <vector>\n#include <string>\n#include <sstream>\n\nstd::vector<int> transformInput(std::vector<std::string> inputArgs) {\n  std::vector<int> result;\n  for (const auto& arg : inputArgs) {\n    result.push_back(std::stoi(arg));\n  }\n  return result;\n}\n\nstd::string transformOutput(int output) {\n  return std::to_string(output);\n}",
        },
        {
          language: "rust",
          userCode:
            "// User writes solution here\npub fn add_two_numbers(a: i32, b: i32) -> i32 {\n    // Your code here\n}",
          logicCode:
            "// Logic to transform inputs and compare outputs\npub fn transform_input(input_args: Vec<&str>) -> Vec<i32> {\n    input_args.iter()\n        .map(|s| s.parse().unwrap())\n        .collect()\n}\n\npub fn transform_output(output: i32) -> String {\n    output.to_string()\n}",
        },
      ],
    },
  });

  const languages = ["python", "javascript", "java", "cpp", "rust"];
  const [currentSelectedLanguage, setCurrentSelectedLanguage] = useState<
    (typeof languages)[number] | null
  >("python");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "testCases",
  });

  const onSubmit = async (data: typeof problemSchema._output) => {
    const result = await addProblem(data);
    if (result) {
      const data = result.data;
      if (data?.success) {
          toast.custom(
            () => (
              <div className="rounded-md pr-10 pl-6 overflow-hidden  py-3 shadow-lg bg-primary text-primary-foreground">
                <button
                  onClick={() => toast.dismiss()}
                  className="absolute top-[50%] right-4 -translate-y-[50%] text-sm text-primary-foreground bg-transparent border-none cursor-pointer"
                >
                  ✕
                </button>{" "}
                <p className="whitespace-nowrap font-semibold">Problem added successfully</p>
              </div>
            ),
            {
              position: "bottom-right",
            }
          );
      } else {
        if (data.errorCode === "23505") {
          toast.custom(
            () => (
              <div className="rounded-md pr-10 pl-6 overflow-hidden py-3 shadow-lg bg-destructive text-destructive-foreground">
                <button
                  onClick={() => toast.dismiss()}
                  className="absolute top-[50%] right-4 -translate-y-[50%] text-sm text-destructive-foreground bg-transparent border-none cursor-pointer"
                >
                  ✕
                </button>{" "}
                <p className="whitespace-nowrap font-semibold">{data.errorMessage}</p>
              </div>
            ),
            {
              position: "bottom-right",
            }
          );
        }

      }
    }
  };

  const handleUserCodeChange = (newCode: string | undefined) => {
    setValue(
      "starterCode",
      watch("starterCode").map((item) => {
        if (item.language === currentSelectedLanguage) {
          return { ...item, userCode: newCode || "" };
        }
        return item;
      })
    );
  };

  const handleLogicCodeChange = (newCode: string | undefined) => {
    setValue(
      "starterCode",
      watch("starterCode").map((item) => {
        if (item.language === currentSelectedLanguage) {
          return { ...item, logicCode: newCode || "" };
        }
        return item;
      })
    );
  };

  const currentStarterCode = watch("starterCode").find(
    (item) => item.language === currentSelectedLanguage
  );

  return (
    <div className="container px-4 py-10">
      <Card className="p-6 shadow-lg max-w-6xl mx-auto bg-background">
        <CardHeader>
          <CardTitle className="text-2xl">Add a New Problem</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-4"
          >
            {/* Title Field */}
            <div className="">
              <label className="text-sm mb-2 block">Title</label>
              <Input {...register("title")} placeholder="Enter problem title" />
              {errors.title && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Difficulty, Problem Type, and Competition Mode */}
            <div>
              <label className="text-sm mb-2 block">Difficulty</label>
              <Select
                {...register("difficulty")}
                value={watch("difficulty")}
                onValueChange={(value) =>
                  setValue("difficulty", value as "easy" | "medium" | "hard")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select difficulty">
                    {watch("difficulty")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                  <SelectItem value="complex">Complex</SelectItem>
                </SelectContent>
              </Select>
              {errors.difficulty && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.difficulty.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm mb-2 block">Problem Type</label>
              <Select
                {...register("problemType")}
                value={watch("problemType")}
                onValueChange={(value) =>
                  setValue("problemType", value as "coding" | "debugging")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select problem type">
                    {watch("problemType")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="coding">Coding</SelectItem>
                  <SelectItem value="debugging">Debugging</SelectItem>
                </SelectContent>
              </Select>
              {errors.problemType && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.problemType.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm mb-2 block">Competition Mode</label>
              <Select
                {...register("competitionMode")}
                value={watch("competitionMode")}
                onValueChange={(value) =>
                  setValue(
                    "competitionMode",
                    value as "general" | "competitive"
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select competition mode">
                    {watch("competitionMode")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="competitive">Competitive</SelectItem>
                </SelectContent>
              </Select>
              {errors.competitionMode && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.competitionMode.message}
                </p>
              )}
            </div>
            <div className="col-span-2">
              <label className="text-sm mb-2 block">Problem Statement</label>
              <Textarea
                {...register("problemStatement")}
                placeholder="Enter the problem statement"
                rows={5}
              />
              {errors.problemStatement && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.problemStatement.message}
                </p>
              )}
            </div>
            <div className="col-span-2">
              <h3 className="text-lg font-semibold mb-3 mt-1">Starter Code</h3>
              <div>
                <label className="text-sm mb-2 block">Language</label>
                <Select
                  value={currentSelectedLanguage || ""}
                  onValueChange={(value) => {
                    setCurrentSelectedLanguage(value);
                  }}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select language">
                      {currentSelectedLanguage
                        ? currentSelectedLanguage.charAt(0).toUpperCase() +
                          currentSelectedLanguage.slice(1)
                        : null}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-4 grid grid-cols-1 3xl:grid-cols-2 gap-4">
                <div className="rounded-lg">
                  <label className="text-sm mb-2 block">User Code</label>
                  <MonacoEditor
                    className="rounded-lg"
                    height="300px"
                    language={currentSelectedLanguage || "python"}
                    value={currentStarterCode?.userCode || ""}
                    onChange={handleUserCodeChange}
                    beforeMount={(monaco) => {
                      monaco.editor.defineTheme("customTheme", {
                        base: "vs-dark",
                        inherit: true,
                        rules: [],
                        colors: { "editor.background": "#0b0707" },
                      });
                    }}
                    onMount={(editor, monaco) => {
                      monaco.editor.setTheme("customTheme");
                    }}
                    options={{
                      minimap: { enabled: false },
                      padding: { top: 16, bottom: 10 },
                      fontFamily: "Cascadia Code",
                      scrollbar: {
                        verticalScrollbarSize: 10,
                        horizontalScrollbarSize: 10,
                      },
                      tabSize: 4,
                      insertSpaces: true,
                    }}
                  />
                </div>
                <div className="rounded-lg">
                  <label className="text-sm mb-2 block">Logic Code</label>
                  <MonacoEditor
                    className="rounded-lg"
                    height="300px"
                    language={currentSelectedLanguage || "python"}
                    value={currentStarterCode?.logicCode || ""}
                    onChange={handleLogicCodeChange}
                    beforeMount={(monaco) => {
                      monaco.editor.defineTheme("customTheme", {
                        base: "vs-dark",
                        inherit: true,
                        rules: [],
                        colors: { "editor.background": "#0b0707" },
                      });
                    }}
                    onMount={(editor, monaco) => {
                      monaco.editor.setTheme("customTheme");
                    }}
                    options={{
                      minimap: { enabled: false },
                      padding: { top: 16, bottom: 10 },
                      fontFamily: "Cascadia Code",
                      scrollbar: {
                        verticalScrollbarSize: 10,
                        horizontalScrollbarSize: 10,
                      },
                      tabSize: 4,
                      insertSpaces: true,
                    }}
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm mb-2 block">Constraints</label>
              <Textarea
                {...register("constraints")}
                placeholder="Enter constraints"
                rows={4}
              />
              {errors.constraints && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.constraints.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm mb-2 block">Topics</label>
              <Textarea
                {...register("topics")}
                placeholder="Enter topics (comma-separated)"
                rows={4}
              />
              {errors.topics && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.topics.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm mb-2 block">Time Limit (seconds)</label>
              <Input
                {...register("timeLimit")}
                placeholder="Enter time limit in seconds"
              />
              {errors.timeLimit && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.timeLimit.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm mb-2 block">Memory Limit (MB)</label>
              <Input
                {...register("memoryLimit")}
                placeholder="Enter memory limit in MB"
              />
              {errors.memoryLimit && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.memoryLimit.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm mb-2 block">Input Format</label>
              <Textarea
                {...register("inputFormat")}
                placeholder="Describe the input format"
                rows={4}
              />
              {errors.inputFormat && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.inputFormat.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm mb-2 block">Output Format</label>
              <Textarea
                {...register("outputFormat")}
                placeholder="Describe the output format"
                rows={4}
              />
              {errors.outputFormat && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.outputFormat.message}
                </p>
              )}
            </div>
            <div className="col-span-2">
              <h3 className="text-lg font-semibold mb-3 mt-1">Test Cases</h3>
              <div className="grid grid-cols-2 gap-4">
                {fields.map((field, index) => (
                  <Card
                    key={field.id}
                    className="p-4 border flex flex-col gap-4"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        TestCase {index + 1}
                      </span>
                      {/* Hide delete button for the first three test cases */}
                      {index >= 3 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                    <Input
                      {...register(`testCases.${index}.input`)}
                      placeholder="Input"
                    />
                    <Input
                      {...register(`testCases.${index}.output`)}
                      placeholder="Output"
                    />
                    <Textarea
                      {...register(`testCases.${index}.explanation`)}
                      placeholder="Explanation (optional)"
                      rows={4}
                    />
                  </Card>
                ))}
                <Card className="border-dashed border-2 border-primary flex items-center justify-center min-h-64">
                  <Button
                    type="button"
                    onClick={() =>
                      append({ input: "", output: "", explanation: "" })
                    }
                    className="w-full h-full text-foreground !bg-transparent"
                  >
                    + Add Test Case
                  </Button>
                </Card>
              </div>
            </div>
            <div className="col-span-2">
              <Button type="submit" className="w-full mt-4">
                Add Problem
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
