/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock } from "lucide-react";

interface ExecutionOutputProps {
  testResult: any;
  output: {
    result: string;
    executionTime: string;
    hasError: boolean;
  };
}

export default function ExecutionOutput({
  testResult,
  output,
}: ExecutionOutputProps) {
  console.log(testResult);

  return (
    <div className="h-full">
      <Tabs defaultValue="output" className="h-full">
        <TabsList className="mb-2">
          <TabsTrigger value="output">Output</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
        </TabsList>
        <TabsContent value="output" className="h-[calc(100%-2.5rem)] m-0">
          <div className="bg-muted rounded-md p-4 h-full overflow-auto font-mono">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1 text-xs text-foreground">
                <Clock className="h-3 w-3" />
                <span className="translate-y-[2px]">
                  {Math.floor(Math.random() * 100)}ms
                </span>
              </div>
            </div>
            <div className="space-y-2">
              {testResult?.results?.map((result: any) => (
                <div
                  className="bg-card p-2 rounded-sm border"
                  key={result.testCaseId}
                >
                  <p>
                    <strong>Input:</strong> {result.input}
                  </p>
                  <p>
                    <strong>Expected Output:</strong> {result.expectedOutput}
                  </p>
                  <p>
                    <strong>Actual Output:</strong> {result.actualOutput}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {result.success ? (
                      <span className="text-green-600">Passed</span>
                    ) : (
                      <span className="text-red-600">Failed</span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="errors" className="h-[calc(100%-2.5rem)] m-0">
          <div className="bg-muted rounded-md p-4 h-full overflow-auto font-mono">
            {output.hasError ? (
              <pre className="text-red-500 whitespace-pre-wrap break-all">
                {testResult?.standardError?.message || "Unknown Error"}
              </pre>
            ) : (
              <p className="text-muted-foreground">
                {testResult?.standardError?.details || "No Error Found"}
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
