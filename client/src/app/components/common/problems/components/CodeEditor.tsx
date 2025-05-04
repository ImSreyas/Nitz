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
import { Play, Send, ListRestart } from "lucide-react";
import { useEffect, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { getStarterCode, executeCode } from "@/lib/api/common";
import { updateStarterCode } from "@/lib/api/moderator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { DialogOverlay } from "@radix-ui/react-dialog";
import { Spinner } from "@/components/ui/spinner";
import { useRoleStore } from "@/lib/store/useRoleStore";
import confetti from "canvas-confetti";
import Image from "next/image";
import { useExecutionStore } from "@/lib/store/useExecutionStore";

type SupportedLanguage = {
  language_id: string;
  name: string;
  version: string;
  user_code: string | null;
  logic_code: string | null;
};

type ProblemLanguagesResponse = {
  success: boolean;
  data: SupportedLanguage[];
};

interface CodeEditorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setTestResult: React.Dispatch<React.SetStateAction<any>>;
  executingState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  problemId: string;
  onSubmit?: () => void;
}

type CodeLanguages = {
  python?: string;
  javascript?: string;
  java?: string;
  cpp?: string;
};

type Code = {
  userCode: CodeLanguages;
  logicCode: CodeLanguages;
};

export default function CodeEditor({
  problemId,
  setTestResult,
  executingState,
}: CodeEditorProps) {
  const [selectedLanguage, setSelectedLanguage] =
    useState<keyof CodeLanguages>("python");
  const [starterCodes, setStarterCodes] = useState<SupportedLanguage[] | null>(
    null
  );
  const [initialCode, setInitialCode] = useState<Code>({
    userCode: {
      python: "",
      javascript: "",
      java: "",
      cpp: "",
    },
    logicCode: {
      python: "",
      javascript: "",
      java: "",
      cpp: "",
    },
  });

  const [code, setCode] = useState<Code>({
    userCode: {
      python: "",
      javascript: "",
      java: "",
      cpp: "",
    },
    logicCode: {
      python: "",
      javascript: "",
      java: "",
      cpp: "",
    },
  });
  const [codeType, setCodeType] = useState<"user_code" | "logic_code">(
    "user_code"
  );
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isExecuting, setIsExecuting] = executingState;
  const [pointsAwarded, setPointsAwarded] = useState<string | null>(null);

  const { context } = useRoleStore();
  const { setIsExecutingComplete } = useExecutionStore();

  const handleConfetti = () => {
    const end = Date.now() + 3 * 1000;
    const colors = ["#FF00C7", "#00FFFF", "#FF4D4D", "#8A2BE2", "#FF6EC7"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 5,
        angle: 60,
        spread: 60,
        startVelocity: 60,
        origin: { x: 0, y: 0.7 },
        colors: colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 60,
        startVelocity: 60,
        origin: { x: 1, y: 0.7 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  const handleExecute = async ({
    mode = "run",
  }: {
    mode: "run" | "submit";
  }) => {
    setIsExecuting(true);
    const currentUserCode =
      code?.userCode[selectedLanguage.toLowerCase() as keyof CodeLanguages];
    const currentLogicCode =
      code?.logicCode[selectedLanguage.toLowerCase() as keyof CodeLanguages];
    const result = await executeCode(
      problemId,
      selectedLanguage,
      currentUserCode || "",
      currentLogicCode || "",
      mode
    );
    if (result?.data?.success) {
      setTestResult(result?.data);
      if (mode === "submit") {
        if (result?.data?.isSubmitSuccess) {
          toast.success("You passed all test cases", {
            position: "top-center",
          });
          handleConfetti();
          console.log("points awarded", result.data.pointsAwarded);
          setPointsAwarded("+" + String(result?.data?.pointsAwarded) || "0");
          setTimeout(() => {
            setPointsAwarded(null);
          }, 6000);
        } else {
          toast.error("You failed some test cases", { position: "top-center" });
        }
      }
    } else {
      toast.error("Failed to execute the code.");
      setTestResult({
        results: [],
        standardError: undefined,
      });
    }
    setIsExecuting(false);
    setIsExecutingComplete(true);
  };

  const handleConfirmReset = () => {
    setCode((state: Code) => ({
      ...state,
      [(codeType === "user_code" ? "userCode" : "logicCode") as keyof Code]: {
        ...state[
          (codeType === "user_code" ? "userCode" : "logicCode") as keyof Code
        ],
        [selectedLanguage.toLowerCase() as keyof CodeLanguages]:
          initialCode[
            (codeType === "user_code" ? "userCode" : "logicCode") as keyof Code
          ][selectedLanguage.toLowerCase() as keyof CodeLanguages] || "",
      },
    }));
    setIsResetDialogOpen(false);
  };

  const handleConfirmUpdate = async () => {
    const codeToUpdate =
      code[codeType === "user_code" ? "userCode" : "logicCode"][
        selectedLanguage.toLowerCase() as keyof CodeLanguages
      ];

    try {
      const result = await updateStarterCode(
        problemId,
        selectedLanguage,
        codeType,
        codeToUpdate || ""
      );

      if (result?.data?.success) {
        toast.success("Code updated successfully!", { position: "top-right" });

        setInitialCode((state: Code) => ({
          ...state,
          [codeType === "user_code" ? "userCode" : "logicCode"]: {
            ...state[codeType === "user_code" ? "userCode" : "logicCode"],
            [selectedLanguage.toLowerCase() as keyof CodeLanguages]:
              codeToUpdate,
          },
        }));
      } else {
        toast.error("Failed to update the code.", { position: "top-right" });
      }
    } catch (error) {
      console.log("Error updating code:", error);
      toast.error("An error occurred while updating the code.", {
        position: "top-right",
      });
    }

    setIsUpdateDialogOpen(false);
  };

  useEffect(() => {
    const getData = async () => {
      const result = await getStarterCode(problemId, context);
      if (result?.data) {
        console.log(result.data);
        const data: ProblemLanguagesResponse = result.data;
        if (data.success) {
          setStarterCodes(data.data);

          if (data.data.length > 0) {
            setSelectedLanguage(data.data[0].name as keyof CodeLanguages);

            const initialUserCodeState = data.data.reduce((acc, item) => {
              acc[item.name.toLowerCase() as keyof CodeLanguages] =
                item.user_code || "";
              return acc;
            }, {} as CodeLanguages);

            const initialLogicCodeState = data.data.reduce((acc, item) => {
              acc[item.name.toLowerCase() as keyof CodeLanguages] =
                item.logic_code || "";
              return acc;
            }, {} as CodeLanguages);

            setCode({
              userCode: initialUserCodeState,
              logicCode: initialLogicCodeState,
            });
            setInitialCode({
              userCode: initialUserCodeState,
              logicCode: initialLogicCodeState,
            });
          }
        }
      }
    };

    getData();
  }, [problemId, context]);

  return (
    <Card className="h-full border rounded-lg">
      {pointsAwarded && (
        <div className="fixed inset-0 w-screen h-screen z-40 flex items-center justify-center">
          {/* <div className="p-8 rounded-full w-fit text-[2rem] text-primary-foreground font-bold bg-primary animate-rotate-fade">
            {pointsAwarded || "+12"}
          </div> */}
          <div className="relative animate-rotate-fade">
            <Image
              className=""
              src="/icons/coin3.png"
              width={130}
              height={130}
              alt="coin"
            />
            <div className="coiny absolute text-[2.2rem] text-[#fcf486] font-bold top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2">
              {pointsAwarded || "00"}
            </div>
          </div>
        </div>
      )}
      <CardContent className="p-0 h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex gap-3 items-center">
            <Select
              value={selectedLanguage}
              onValueChange={(value) =>
                setSelectedLanguage(value as keyof CodeLanguages)
              }
              defaultValue={starterCodes?.[0]?.name}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                {starterCodes?.map((starterCode: SupportedLanguage, index) => (
                  <SelectItem
                    key={`${starterCode.language_id}`}
                    value={starterCode.name}
                    defaultChecked={index == 0}
                    onClick={() => {
                      if (index === 0 && !selectedLanguage) {
                        setSelectedLanguage(
                          starterCode.name as keyof CodeLanguages
                        );
                      }
                    }}
                  >
                    {starterCode.name.charAt(0).toUpperCase() +
                      starterCode.name.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              {context !== "user" && (
                <ToggleGroup
                  type="single"
                  value={codeType}
                  onValueChange={(value) =>
                    value && setCodeType(value as "user_code" | "logic_code")
                  }
                  className="flex gap-0"
                >
                  <ToggleGroupItem
                    value="user_code"
                    className={`px-4 py-2 text-xs border !rounded-md font-semibold !rounded-r-none ${
                      codeType === "user_code"
                        ? "!bg-primary !text-primary-foreground"
                        : ""
                    }`}
                  >
                    UserCode
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="logic_code"
                    className={`px-4 py-2 text-xs !rounded-md font-semibold !rounded-l-none border ${
                      codeType === "logic_code"
                        ? "!bg-primary !text-primary-foreground"
                        : ""
                    }`}
                  >
                    LogicCode
                  </ToggleGroupItem>
                </ToggleGroup>
              )}

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsResetDialogOpen(true)}
                      className="flex items-center justify-center"
                    >
                      <ListRestart className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-background text-foreground border">
                    Reset{" "}
                    {codeType === "user_code" ? "User Code" : "Logic Code"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleExecute({ mode: "run" });
              }}
              className="flex items-center gap-1"
            >
              {isExecuting ? (
                <Spinner className="mr-1" />
              ) : (
                <Play className="h-4 w-4 mr-1" />
              )}
              <span>Run</span>
            </Button>
            {context !== "user" ? (
              <Button
                size="sm"
                onClick={() => setIsUpdateDialogOpen(true)}
                className="flex items-center gap-1"
              >
                <Send className="h-4 w-4" />
                Update
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => setIsSubmitDialogOpen(true)}
                className="flex items-center gap-1"
              >
                <Send className="h-4 w-4" />
                Submit
              </Button>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-hidden p-2 ps-0">
          <MonacoEditor
            className="rounded-lg"
            height="100%"
            language={selectedLanguage.toLowerCase()}
            value={
              (code as Code)[
                codeType === "user_code" ? "userCode" : "logicCode"
              ][selectedLanguage.toLowerCase() as keyof CodeLanguages] || ""
            }
            onChange={(value) =>
              setCode((state: Code) => ({
                ...state,
                [codeType === "user_code" ? "userCode" : "logicCode"]: {
                  ...state[codeType === "user_code" ? "userCode" : "logicCode"],
                  [selectedLanguage.toLowerCase() as keyof Code]: value,
                },
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
              fontSize: 13,
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

      {/* Reset Confirmation Dialog */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Code</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to reset the code for{" "}
            <strong>{selectedLanguage}</strong>
            {context !== "user" && " in "}
            {context !== "user" && (
              <strong>
                {codeType === "user_code" ? "User Code?" : "Logic Code?"}
              </strong>
            )}
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsResetDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmReset}>
              Yes, Reset
            </Button>
          </DialogFooter>
        </DialogContent>
        <DialogOverlay className="fixed inset-0 backdrop-blur-sm z-40" />
      </Dialog>

      {/* Update Confirmation Dialog */}
      {context !== "user" ? (
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Code</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to update the code for{" "}
              <strong>{selectedLanguage}</strong> in{" "}
              <strong>
                {codeType === "user_code" ? "User Code" : "Logic Code"}
              </strong>
              ?
            </p>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsUpdateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="default" onClick={handleConfirmUpdate}>
                Yes, Update
              </Button>
            </DialogFooter>
          </DialogContent>
          <DialogOverlay className="fixed inset-0 backdrop-blur-sm z-40" />
        </Dialog>
      ) : (
        <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit Code</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to submit the{" "}
              <strong>{selectedLanguage}</strong> Code?
            </p>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsSubmitDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  handleExecute({ mode: "submit" });
                  setIsSubmitDialogOpen(false);
                }}
              >
                Yes, Submit
              </Button>
            </DialogFooter>
          </DialogContent>
          <DialogOverlay className="fixed inset-0 backdrop-blur-sm z-40" />
        </Dialog>
      )}
    </Card>
  );
}
