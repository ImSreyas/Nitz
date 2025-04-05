"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Send } from "lucide-react";
import { useEffect, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { getStarterCode } from "@/lib/api/common";
import { executeCode } from "@/lib/api/common";

type SupportedLanguage = {
  language_id: string;
  name: string;
  version: string;
  user_code: string | null;
};

type ProblemLanguagesResponse = {
  success: boolean;
  data: SupportedLanguage[];
};

interface CodeEditorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setTestResult: React.Dispatch<React.SetStateAction<any>>;
  problemId: string;
  onSubmit: () => void;
}

type Code = {
  python: string;
  javascript: string;
  java: string;
  cpp: string;
};

export default function CodeEditor({
  problemId,
  onSubmit,
  setTestResult,
}: CodeEditorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [starterCodes, setStarterCodes] = useState<SupportedLanguage[] | null>(
    null
  );
  const [code, setCode] = useState<Code>({
    python: "",
    javascript: "",
    java: "",
    cpp: "",
  });

  const handleExecute = async () => {
    const currentCode = code[selectedLanguage.toLowerCase() as keyof Code];
    // console.log(selectedLanguage, currentCode);
    const result = await executeCode(problemId, selectedLanguage, currentCode);
    console.log(result);
    setTestResult(result?.data);
  };

  useEffect(() => {
    const getData = async () => {
      const result = await getStarterCode(problemId);
      if (result?.data) {
        const data: ProblemLanguagesResponse = result.data;
        if (data.success) {
          setStarterCodes(data.data);

          if (data.data.length > 0) {
            setSelectedLanguage(data.data[0].name);

            const initialCodeState = data.data.reduce((acc, item) => {
              acc[item.name.toLowerCase() as keyof Code] = item.user_code || "";
              return acc;
            }, {} as Code);

            setCode(initialCodeState);
          }
        }
      }
    };

    getData();
  }, [problemId]);

  return (
    <Card className="h-full border rounded-lg">
      <CardContent className="p-0 h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <Select
            value={selectedLanguage}
            onValueChange={(value) => setSelectedLanguage(value)}
            defaultValue={starterCodes?.[0]?.name}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {starterCodes?.map((starterCode: SupportedLanguage, index) => (
                <SelectItem
                  key={starterCode.language_id}
                  value={starterCode.name}
                  defaultChecked={index == 0}
                  onClick={() => {
                    if (index === 0 && !selectedLanguage) {
                      setSelectedLanguage(starterCode.name);
                    }
                  }}
                >
                  {starterCode.name.charAt(0).toUpperCase() +
                    starterCode.name.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExecute}
              className="flex items-center gap-1"
            >
              <Play className="h-4 w-4" />
              Run
            </Button>
            <Button
              size="sm"
              onClick={onSubmit}
              className="flex items-center gap-1"
            >
              <Send className="h-4 w-4" />
              Update
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden p-2 ps-0">
          <MonacoEditor
            className="rounded-lg"
            height="100%"
            language={selectedLanguage.toLowerCase()}
            value={code[selectedLanguage.toLowerCase() as keyof Code]}
            onChange={(value) =>
              setCode((state) => ({
                ...state,
                [selectedLanguage.toLowerCase() as keyof Code]: value,
              }))
            }
            beforeMount={(monaco) => {
              monaco.editor.defineTheme("customTheme", {
                base: "vs-dark",
                inherit: true,
                rules: [],
                colors: { "editor.background": "#1c1917" },
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
      </CardContent>
    </Card>
  );
}
