"use client";

import React, { useEffect } from "react";
import ProblemPage from "./components/ProblemPage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DiscussionArea from "./components/DiscussionArea";
import Header from "./components/Header";
import { RoleContext } from "@/lib/types/common";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRoleStore } from "@/lib/store/useRoleStore";
import Solution from "./components/Solution";

type ProblemProp = {
  id: string;
  context?: RoleContext;
};

export default function Problem({ id, context = "user" }: ProblemProp) {
  const { setContext } = useRoleStore();

  const handleBack = () => {
    window.history.back();
  };

  useEffect(() => {
    setContext(context);
  }, [setContext, context]);

  return (
    <main className="min-h-screen bg-background">
      <div className="py-6 px-4 md:px-6">
        <Tabs defaultValue="description" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="p-3 rounded-lg"
                onClick={handleBack}
              >
                <ChevronLeft />
              </Button>
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="solution">Solution</TabsTrigger>
                <TabsTrigger value="discuss">Discuss</TabsTrigger>
              </TabsList>
            </div>

            <Header />
          </div>

          <TabsContent value="description" className="space-y-6">
            <ProblemPage problemId={id} />
          </TabsContent>

          <TabsContent value="discuss">
            <DiscussionArea problemId={id} />
          </TabsContent>

          <TabsContent value="solution">
            <Solution problemId={id} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
