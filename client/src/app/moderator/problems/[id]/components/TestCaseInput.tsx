"use client"

import { Textarea } from "@/components/ui/textarea"

interface TestCaseInputProps {
  testCase: string
  setTestCase: (testCase: string) => void
}

export default function TestCaseInput({ testCase, setTestCase }: TestCaseInputProps) {
  return (
    <div className="h-full">
      <Textarea
        value={testCase}
        onChange={(e) => setTestCase(e.target.value)}
        className="font-mono h-full resize-none border-0 focus-visible:ring-0"
        placeholder="Enter your test case here..."
      />
    </div>
  )
}

