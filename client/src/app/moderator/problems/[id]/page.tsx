import React from "react";
import ProblemPage from "./components/ProblemPage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DiscussionArea from "./components/DiscussionArea";
import Header from "./components/Header";

export default async function page({ params }: { params: { id: string } }) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-background">
      <div className="py-6 px-4 md:px-6">
        <Tabs defaultValue="description" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="solution">Solution</TabsTrigger>
              <TabsTrigger value="submissions">Submissions</TabsTrigger>
              <TabsTrigger value="discuss">Discuss</TabsTrigger>
            </TabsList>
            <Header />
          </div>

          <TabsContent value="description" className="space-y-6">
            <ProblemPage problemId={id} />
          </TabsContent>

          <TabsContent value="discuss">
            <DiscussionArea />
          </TabsContent>

          <TabsContent value="solution">
            <div className="rounded-lg border p-6">
              <h2 className="text-2xl font-bold mb-4">Solution</h2>
              <p>
                This section would contain official solutions and explanations.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="submissions">
            <div className="rounded-lg border p-6">
              <h2 className="text-2xl font-bold mb-4">Your Submissions</h2>
              <p>This section would contain your previous submissions.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
