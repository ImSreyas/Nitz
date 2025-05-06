import React from "react";
import GroupPage from "@/app/components/common/groups/GroupPage";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-background">
      <GroupPage id={id} context="user" />
    </div>
  );
}
