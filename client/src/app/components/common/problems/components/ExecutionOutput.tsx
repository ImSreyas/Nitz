/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle } from "lucide-react";

interface ExecutionOutputProps {
  testResult: {
    results: {
      testCaseId: string;
      input: string;
      expectedOutput: string;
      actualOutput: string;
      success: boolean;
    }[];
    standardError?: {
      message: string;
      details: string | null;
    };
  };
  activeTab: string;
  setActiveTab: React.Dispatch<
    React.SetStateAction<"test-cases" | "standard-error" | null>
  >;
  output?: {
    result: string;
    executionTime: string;
    hasError: boolean;
  };
}

export default function ExecutionOutput({
  testResult,
  activeTab,
  setActiveTab,
}: ExecutionOutputProps) {
  return (
    <div className="h-full">
      <Tabs
        defaultValue="test-cases"
        value={activeTab ?? undefined}
        onValueChange={(value) =>
          setActiveTab(value as "test-cases" | "standard-error" | null)
        }
        className="h-full"
      >
        <TabsList className="mb-4 border border-foreground/10">
          <TabsTrigger value="test-cases" className="text-[13px]">
            Test Cases
          </TabsTrigger>
          <TabsTrigger value="standard-error" className="text-[13px]">
            Standard Error
          </TabsTrigger>
        </TabsList>

        {/* Test Cases Tab */}
        <TabsContent value="test-cases" className="h-full">
          {testResult?.results?.length > 0 ? (
            <Accordion type="single" collapsible className="space-y-2 pb-4">
              {testResult.results.map((result: any, index: number) => (
                <AccordionItem
                  key={result.testCaseId}
                  value={result.testCaseId}
                  className="border-b-0"
                >
                  {result.isSubmit ? (
                    <div className="flex items-center justify-between px-4 py-2 bg-muted rounded-md border text-xs">
                      <span className="flex items-center gap-2 justify-between w-full pe-2">
                        <span>{`Test Case ${index + 1}`}</span>
                        {result.success ? (
                          <CheckCircle className="text-green-600" size={15} />
                        ) : (
                          <XCircle className="text-red-600" size={15} />
                        )}
                      </span>
                    </div>
                  ) : (
                    <>
                      <AccordionTrigger className="flex items-center justify-between px-4 py-2 bg-muted rounded-md border text-xs">
                        <span className="flex items-center gap-2 justify-between w-full pe-2">
                          <span>{`Test Case ${index + 1}`}</span>
                          {result.success ? (
                            <CheckCircle className="text-green-600" size={15} />
                          ) : (
                            <XCircle className="text-red-600" size={15} />
                          )}
                        </span>
                      </AccordionTrigger>

                      {/* Expanded details */}
                      <AccordionContent className="p-3 bg-card rounded-md border text-xs space-y-4 my-2">
                        <div>
                          <div className="flex">
                            <strong className="block text-muted-foreground mb-2 mr-2">
                              Status:
                            </strong>
                            {result.success ? (
                              <span className="text-green-600">Passed</span>
                            ) : (
                              <span className="text-red-600">Failed</span>
                            )}
                          </div>
                          <strong className="block text-muted-foreground mb-1">
                            Input:
                          </strong>
                          <pre className="bg-muted/20 p-2 rounded-md overflow-x-auto">
                            {result.input}
                          </pre>
                        </div>
                        <div>
                          <strong className="block text-muted-foreground mb-1">
                            Expected Output:
                          </strong>
                          <pre className="bg-muted/20 p-2 rounded-md overflow-x-auto">
                            {result.expectedOutput}
                          </pre>
                        </div>
                        <div>
                          <strong className="block text-muted-foreground mb-1">
                            Actual Output:
                          </strong>
                          <pre className="bg-muted/20 p-2 rounded-md overflow-x-auto">
                            {result.actualOutput}
                          </pre>
                        </div>
                      </AccordionContent>
                    </>
                  )}
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="flex items-center justify-center h-36 border border-dashed border-primary rounded-sm text-sm text-muted-foreground">
              <div className="flex flex-col items-center">
                <p>No test cases available.</p>
                <p className="text-muted-foreground/60 text-xs">
                  Run the code to show the testcase result
                </p>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Standard Error Tab */}
        <TabsContent value="standard-error" className="h-full pb-4">
          <div className="p-4 bg-card rounded-md border border-dashed mb-4 text-xs space-y-4 h-full overflow-auto">
            {testResult?.standardError ? (
              <>
                <div>
                  <strong className="block text-muted-foreground mb-1">
                    Error Message:
                  </strong>
                  <pre className="bg-muted/20 p-2 rounded-md overflow-x-auto">
                    {testResult.standardError.message ||
                      "No error message provided."}
                  </pre>
                </div>
                {testResult.standardError.details && (
                  <div>
                    <strong className="block text-muted-foreground mb-1">
                      Error Details:
                    </strong>
                    <pre className="bg-muted/20 p-2 rounded-md overflow-x-auto whitespace-break-spaces">
                      {testResult.standardError.details}
                    </pre>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">No standard error found.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
