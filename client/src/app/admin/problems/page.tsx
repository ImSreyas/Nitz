import ProblemsList from "@/app/components/common/problems/ProblemsList";
import React from "react";

export default function page() {
  return (
    <div className="px-6 lg:px-8 xl:px-12 mt-3">
      <ProblemsList context="admin" />
    </div>
  );
}
