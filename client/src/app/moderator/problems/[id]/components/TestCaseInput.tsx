"use client";

import { TestCase } from "./ProblemPage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TestCaseInputProps {
  testCases: TestCase[] | null;
}

export default function TestCaseInput({ testCases }: TestCaseInputProps) {
  if (!testCases) return <div>Loading...</div>;

  return (
    <div className="h-full">
      <Tabs defaultValue={testCases[0]?.test_case_id} className="h-full">
        <TabsList className="flex w-fit mb-4 border-b border-muted">
          {testCases.map((testCase, index) => (
            <TabsTrigger
              key={testCase.test_case_id}
              value={testCase.test_case_id}
              className="text-[13px]"
            >
              {`Test Case ${index + 1}`}
            </TabsTrigger>
          ))}
        </TabsList>

        {testCases.map((testCase) => (
          <TabsContent
            key={testCase.test_case_id}
            value={testCase.test_case_id}
          >
            <div className="p-4 border rounded-md bg-card text-xs space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <strong className="block text-muted-foreground mb-1">
                    Input:
                  </strong>
                  <pre className="bg-muted/20 p-2 rounded-md overflow-x-auto border">
                    {testCase.input}
                  </pre>
                </div>
                <div className="flex-1">
                  <strong className="block text-muted-foreground mb-1">
                    Output:
                  </strong>
                  <pre className="bg-muted/20 p-2 rounded-md overflow-x-auto border">
                    {testCase.output}
                  </pre>
                </div>
              </div>

              <div>
                <strong className="block text-muted-foreground mb-1">
                  Explanation:
                </strong>
                <pre className="bg-muted/20 p-2 rounded-md overflow-x-auto border">
                  {testCase.explanation || "No explanation provided."}
                </pre>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
