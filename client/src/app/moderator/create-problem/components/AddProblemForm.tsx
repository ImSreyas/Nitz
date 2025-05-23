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
          userCode: `# User writes solution here
def addTwoNumbers(a, b):
    # Your code here
    return a + b`,
          logicCode: `# Logic to transform inputs and compare outputs
if __name__ == "__main__":
    import sys
    if len(sys.argv) != 4:
        print("0:Invalid number of arguments")
        sys.exit(1)

    a = int(sys.argv[1])
    b = int(sys.argv[2])
    expected = int(sys.argv[3])

    result = addTwoNumbers(a, b)

    if result == expected:
        print(f"1:{result}")
    else:
        print(f"0:{result}")`,
        },
        {
          language: "java",
          userCode: `// User writes solution here
class Solution {
    public int addTwoNumbers(int a, int b) {
        // Your code here
        return a + b;
    }
}`,
          logicCode: `// Logic to transform inputs and compare outputs
public class Main {
    public static void main(String[] args) {
        if (args.length != 3) {
            System.out.println("0:Invalid number of arguments");
            return;
        }

        try {
            int a = Integer.parseInt(args[0]);
            int b = Integer.parseInt(args[1]);
            int expected = Integer.parseInt(args[2]);

            Solution sol = new Solution();
            int output = sol.addTwoNumbers(a, b);

            if (output == expected) {
                System.out.println("1:" + output);
            } else {
                System.out.println("0:" + output);
            }
        } catch (Exception e) {
            System.out.println("0:Error - " + e.getMessage());
        }
    }
}`,
        },
        {
          language: "cpp",
          userCode: `#include <iostream>
#include <string>
#include <cstdlib>

int addTwoNumbers(int a, int b) {
    // Your code here
    return a + b;
}`,
          logicCode: `// Logic to transform inputs and compare outputs
int main(int argc, char* argv[]) {
    if (argc != 4) {
        std::cout << "0:Invalid number of arguments" << std::endl;
        return 1;
    }

    int a = std::stoi(argv[1]);
    int b = std::stoi(argv[2]);
    int expected = std::stoi(argv[3]);

    int result = addTwoNumbers(a, b);

    if (result == expected) {
        std::cout << "1:" << result << std::endl;
    } else {
        std::cout << "0:" << result << std::endl;
    }

    return 0;
}`,
        },
        {
          language: "rust",
          userCode: `// User writes solution here
pub fn add_two_numbers(a: i32, b: i32) -> i32 {
    // Your code here
    a + b
}`,
          logicCode: `// Logic to transform inputs and compare outputs
use std::env;

fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() != 4 {
        println!("0:Invalid number of arguments");
        return;
    }

    let a: i32 = args[1].parse().unwrap();
    let b: i32 = args[2].parse().unwrap();
    let expected: i32 = args[3].parse().unwrap();

    let result = add_two_numbers(a, b);

    if result == expected {
        println!("1:{}", result);
    } else {
        println!("0:{}", result);
    }
}`,
        },
        {
          language: "go",
          userCode: `// User writes solution here
package main

import (
    "fmt"
    "os"
    "strconv"
)

func AddTwoNumbers(a int, b int) int {
    // Your code here
    return a + b
}`,
          logicCode: `// Logic to transform inputs and compare outputs

func main() {
    if len(os.Args) != 4 {
        fmt.Println("0:Invalid number of arguments")
        return
    }

    a, _ := strconv.Atoi(os.Args[1])
    b, _ := strconv.Atoi(os.Args[2])
    expected, _ := strconv.Atoi(os.Args[3])

    result := AddTwoNumbers(a, b)

    if result == expected {
        fmt.Printf("1:%d\\n", result)
    } else {
        fmt.Printf("0:%d\\n", result)
    }
}`,
        },
        {
          language: "c",
          userCode: `// User writes solution here
#include <stdio.h>
#include <stdlib.h>

int addTwoNumbers(int a, int b) {
    // Your code here
    return a + b;
}`,
          logicCode: `// Logic to transform inputs and compare outputs

int main(int argc, char* argv[]) {
    if (argc != 4) {
        printf("0:Invalid number of arguments\\n");
        return 1;
    }

    int a = atoi(argv[1]);
    int b = atoi(argv[2]);
    int expected = atoi(argv[3]);

    int result = addTwoNumbers(a, b);

    if (result == expected) {
        printf("1:%d\\n", result);
    } else {
        printf("0:%d\\n", result);
    }

    return 0;
}`,
        },
        {
          language: "swift",
          userCode: `// User writes solution here
func addTwoNumbers(_ a: Int, _ b: Int) -> Int {
    // Your code here
    return a + b
}`,
          logicCode: `// Logic to transform inputs and compare outputs
import Foundation

if CommandLine.arguments.count != 4 {
    print("0:Invalid number of arguments")
    exit(1)
}

let a = Int(CommandLine.arguments[1])!
let b = Int(CommandLine.arguments[2])!
let expected = Int(CommandLine.arguments[3])!

let result = addTwoNumbers(a, b)

if result == expected {
    print("1:\\(result)")
} else {
    print("0:\\(result)")
}`,
        },
        {
          language: "kotlin",
          userCode: `// User writes solution here
fun addTwoNumbers(a: Int, b: Int): Int {
    // Your code here
    return a + b
}`,
          logicCode: `// Logic to transform inputs and compare outputs
fun main(args: Array<String>) {
    if (args.size != 3) {
        println("0:Invalid number of arguments")
        return
    }

    val a = args[0].toInt()
    val b = args[1].toInt()
    val expected = args[2].toInt()

    val result = addTwoNumbers(a, b)

    if (result == expected) {
        println("1:$result")
    } else {
        println("0:$result")
    }
}`,
        },
      ],
    },
  });

  const languages = [
    "python",
    "java",
    "c",
    "cpp",
    "rust",
    "go",
    "swift",
    "kotlin",
  ];
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
              <p className="whitespace-nowrap font-semibold">
                Problem added successfully
              </p>
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
                <p className="whitespace-nowrap font-semibold">
                  {data.errorMessage}
                </p>
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
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 3xl:grid-cols-2 gap-4">
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
                      fontSize: 13,
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
                      fontSize: 13,
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
