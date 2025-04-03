"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

interface ExecutionOutputProps {
  output: {
    result: string
    executionTime: string
    hasError: boolean
  }
}

export default function ExecutionOutput({ output }: ExecutionOutputProps) {
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
              <Badge
                variant={output.hasError ? "destructive" : "outline"}
                className={output.hasError ? "" : "bg-green-100 text-green-800 hover:bg-green-100"}
              >
                {output.hasError ? "Error" : "Success"}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {output.executionTime}
              </div>
            </div>
            <pre className="whitespace-pre-wrap break-all">{output.result}</pre>
          </div>
        </TabsContent>
        <TabsContent value="errors" className="h-[calc(100%-2.5rem)] m-0">
          <div className="bg-muted rounded-md p-4 h-full overflow-auto font-mono">
            {output.hasError ? (
              <pre className="text-red-500 whitespace-pre-wrap break-all">{output.result}</pre>
            ) : (
              <p className="text-muted-foreground">No errors to display.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



