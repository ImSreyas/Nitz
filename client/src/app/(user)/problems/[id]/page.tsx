import React from "react";
import Problem from "@/app/components/common/problems/Problem";

export default async function page({ params }: { params: { id: string } }) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-background">
      <Problem id={id} context="user" />
    </div>
  );
}
