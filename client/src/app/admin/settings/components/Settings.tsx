"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

export default function Settings() {
  const supabase = createClient();

  const [points, setPoints] = useState({
    beginner: 3,
    easy: 5,
    medium: 10,
    hard: 15,
    complex: 20,
  });

  console.log(points);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from("tbl_difficulty_points")
        .select("*");
      if (error) {
        toast.error("Fetching failed");
      } else {
        const diffPointsObj = data.reduce((acc, item) => {
          acc[item.difficulty] = item.points;
          return acc;
        }, {});
        setPoints(diffPointsObj);
      }
    } catch {
      toast.error("An unexpected error occurred.");
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (difficulty: string, value: number) => {
    setPoints((prev) => ({
      ...prev,
      [difficulty]: value,
    }));
  };

  const saveChanges = async () => {
    try {
      const updates = Object.entries(points).map(([difficulty, points]) =>
        supabase
          .from("tbl_difficulty_points")
          .update({ points })
          .eq("difficulty", difficulty)
      );

      // Execute all updates
      const results = await Promise.all(updates);

      // Check for errors
      const hasError = results.some((result) => result.error);
      if (hasError) {
        toast.error("Failed to update some values. Please try again.");
      } else {
        toast.success("Points updated successfully!", {
          position: "top-center",
        });
      }
    } catch {
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Platform Settings</h2>
        <Button size="sm" onClick={saveChanges}>
          Save Changes
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Points & Tier System</CardTitle>
            <CardDescription>
              Configure how points are awarded and tier thresholds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Points Formula</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="beginner-points">Beginner Problem</Label>
                    <Input
                      id="beginner-points"
                      type="number"
                      value={points.beginner}
                      onChange={(e) =>
                        handleInputChange("beginner", Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="easy-points">Easy Problem</Label>
                    <Input
                      id="easy-points"
                      type="number"
                      value={points.easy}
                      onChange={(e) =>
                        handleInputChange("easy", Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medium-points">Medium Problem</Label>
                    <Input
                      id="medium-points"
                      type="number"
                      value={points.medium}
                      onChange={(e) =>
                        handleInputChange("medium", Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hard-points">Hard Problem</Label>
                    <Input
                      id="hard-points"
                      type="number"
                      value={points.hard}
                      onChange={(e) =>
                        handleInputChange("hard", Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="complex-points">Complex Problem</Label>
                    <Input
                      id="complex-points"
                      type="number"
                      value={points.complex}
                      onChange={(e) =>
                        handleInputChange("complex", Number(e.target.value))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
