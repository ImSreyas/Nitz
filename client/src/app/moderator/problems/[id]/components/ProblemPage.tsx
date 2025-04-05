"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProblemStatement from "./ProblemStatement";
import CodeEditor from "./CodeEditor";
import TestCaseInput from "./TestCaseInput";
import ExecutionOutput from "./ExecutionOutput";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { getProblem } from "@/lib/api/moderator";

type ProblemResponse = {
  success: boolean;
  data: Problem[];
};

type Problem = {
  problem_id: string;
  problem_number: number;
  title: string;
  difficulty: string;
  problem_type: string;
  competition_mode: string;
  topics: string[];
  problem_statement: string;
  constraints: string;
  time_limit: string;
  memory_limit: string;
  input_format: string;
  output_format: string;
  moderator_id: string;
  created_at: string;
  test_cases: TestCase[];
};

export type TestCase = {
  test_case_id: string;
  input: string;
  output: string;
  explanation: string;
};

export default function ProblemPage({ problemId }: { problemId: string }) {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [testCase, setTestCase] = useState<TestCase[] | null>(null);
  const [output, setOutput] = useState({
    result: "",
    executionTime: "",
    hasError: false,
  });
  const [testResult, setTestResult] = useState({});

  useEffect(() => {
    const fetchProblemData = async () => {
      const result = await getProblem(problemId);
      if (result?.data) {
        const data: ProblemResponse = result.data;
        if (data?.success && data.data.length > 0) {
          const fetchedProblem = data.data[0];
          setProblem(fetchedProblem);
          setTestCase(fetchedProblem.test_cases || null);
        }
      }
    };
    fetchProblemData();
  }, [problemId]);

  const handleSubmit = () => {
    setOutput({
      result: "Accepted",
      executionTime: `${Math.floor(Math.random() * 100)}ms`,
      hasError: false,
    });
  };

  if (!problem) return <div>Loading...</div>;

  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-6rem)] gap-2">
      <ResizablePanel defaultSize={50} minSize={30}>
        <ProblemStatement
          problem={problem.problem_statement}
          problemTitle={problem.title}
          problemNum={problem.problem_number}
          difficulty={problem.difficulty}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50} minSize={30}>
        <ResizablePanelGroup direction="vertical" className="gap-2">
          <ResizablePanel defaultSize={50} minSize={20}>
            <CodeEditor problemId={problemId} onSubmit={handleSubmit} setTestResult={setTestResult} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={20}>
            <div className="h-full p-5 bg-card rounded-sm overflow-y-scroll">
              <Tabs defaultValue="test-case" className="h-full">
                <TabsList className=""> 
                  <TabsTrigger value="test-case">Test Case</TabsTrigger>
                  <TabsTrigger value="test-result">Test Result</TabsTrigger>
                </TabsList>
                <TabsContent value="test-case" className="h-full overflow-auto">
                  <TestCaseInput testCases={testCase} />
                </TabsContent>
                <TabsContent value="test-result">
                  <ExecutionOutput testResult={testResult} output={output} />
                </TabsContent>
              </Tabs>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
