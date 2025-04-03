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

export interface SupportedLang {
  name: string;
  version: string;
  user_code: string;
  language_id: string;
}

interface CodeEditorProps {
  onExecute: () => void;
  onSubmit: () => void;
}

export default function CodeEditor({ onExecute, onSubmit }: CodeEditorProps) {
  const languages = ["javascript", "python", "java", "cpp", "rust"];

  const [language, setLanguage] = useState(selectedLanguage);

  // Update the Monaco language whenever the selected language changes
  useEffect(() => {
    setLanguage(selectedLanguage.toLowerCase());
  }, [selectedLanguage]);

  return (
    <Card className="h-full border rounded-lg">
      <CardContent className="p-0 h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExecute}
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
              Submit
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <MonacoEditor
            height="100%"
            language={language} // Dynamically set the language
            value={code}
            theme="vs-dark" // Use the dark theme
            options={{
              fontSize: 14,
              minimap: { enabled: false }, // Disable the minimap
              scrollBeyondLastLine: false,
              wordWrap: "on",
              automaticLayout: true,
              lineNumbers: "on", // Show line numbers
            }}
            onChange={(value) => setCode(value || "")} // Update the code state
          />
        </div>
      </CardContent>
    </Card>
  );
}
