import React from "react";
import Problem from "@/app/components/common/problems/Problem";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function page({ params }: { params: Promise<any> }) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-background">
      <Problem id={id} context="user" />
    </div>
  );
}
