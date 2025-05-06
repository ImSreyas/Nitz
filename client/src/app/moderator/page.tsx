"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function ModeratorDashboard() {
  const supabase = createClient();

  const [totalProblems, setTotalProblems] = useState<number | null>(null);
  const [unpublishedProblems, setUnpublishedProblems] = useState<number | null>(
    null
  );
  const [publishedProblems, setPublishedProblems] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  // Fetch problem statistics
  const fetchProblemStats = async () => {
    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      const moderatorId = user?.user?.id;

      if (!moderatorId) {
        console.error("Moderator not authenticated");
        return;
      }

      // Fetch total problems
      const { count: totalCount, error: totalError } = await supabase
        .from("tbl_problems")
        .select("id", { count: "exact" })
        .eq("moderator_id", moderatorId)
        .eq("is_deleted", false);

      // Fetch unpublished problems
      const { count: unpublishedCount, error: unpublishedError } = await supabase
        .from("tbl_problems")
        .select("id", { count: "exact" })
        .eq("moderator_id", moderatorId)
        .eq("publish_status", false)
        .eq("is_deleted", false);

      // Fetch published problems
      const { count: publishedCount, error: publishedError } = await supabase
        .from("tbl_problems")
        .select("id", { count: "exact" })
        .eq("moderator_id", moderatorId)
        .eq("publish_status", true)
        .eq("is_deleted", false);

      if (totalError || unpublishedError || publishedError) {
        console.error("Error fetching problem statistics");
      } else {
        setTotalProblems(totalCount || 0);
        setUnpublishedProblems(unpublishedCount || 0);
        setPublishedProblems(publishedCount || 0);
      }
    } catch (error) {
      console.error("Unexpected error fetching problem statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblemStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mx-auto px-10 py-8">
      <h1 className="text-xl font-bold mb-6">Moderator Dashboard</h1>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Problems */}
          <Card>
            <CardHeader>
              <CardTitle>Total Problems (Mine)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalProblems}</p>
            </CardContent>
          </Card>

          {/* Unpublished Problems */}
          <Card>
            <CardHeader>
              <CardTitle>Unpublished Problems</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{unpublishedProblems}</p>
            </CardContent>
          </Card>

          {/* Published Problems */}
          <Card>
            <CardHeader>
              <CardTitle>Published Problems</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{publishedProblems}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}