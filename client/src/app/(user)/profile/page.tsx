/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const tierTitles = [
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Diamond",
  "Crown",
  "Ace",
  "Conqueror",
];

export default function ProfilePage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState(""); // State for the name input
  const [updating, setUpdating] = useState(false); // State for update process

  // Fetch user data
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();
      const userId = authData?.user?.id;

      if (authError || !userId) {
        console.error("Error fetching authenticated user:", authError);
        return;
      }

      const { data: userData, error } = await supabase
        .from("tbl_users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user data:", error);
      } else {
        setUser(userData);
        setName(userData.name || ""); // Set the current name in the input field
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle name update
  const handleUpdateName = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    setUpdating(true);
    try {
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id;

      const { error } = await supabase
        .from("tbl_users")
        .update({ name })
        .eq("id", userId);

      if (error) {
        console.error("Error updating name:", error);
        toast.error("Failed to update name. Please try again.");
      } else {
        toast.success("Name updated successfully!");
        fetchUserData(); // Refresh user data
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-muted-foreground">No user data found.</p>
      </div>
    );
  }

  const tierTitle = user.tier ? tierTitles[user.tier - 1] : "Unranked";

  return (
    <div className="container mx-auto px-16 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.username}`}
            />
            <AvatarFallback>{user.username[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{user.name || "Anonymous"}</h1>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <Badge
            className={`text-lg px-4 py-2 rounded-md ${
              user.tier === 8
                ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                : user.tier >= 5
                ? "bg-gradient-to-r from-blue-500 to-green-500 text-white"
                : "bg-gradient-to-r from-pink-600 to-purple-500 text-white"
            }`}
          >
            {tierTitle}
          </Badge>
        </div>
      </div>

      {/* Update Name Button */}
      <div className="mb-8">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Update Name</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Name</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Button
                onClick={handleUpdateName}
                disabled={updating}
                className="w-full"
              >
                {updating ? (
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                ) : null}
                Submit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Performance Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Points Card */}
        <Card>
          <CardHeader>
            <CardTitle>Total Points</CardTitle>
            <CardDescription>Your overall performance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{user.points}</p>
          </CardContent>
        </Card>

        {/* Points Today */}
        <Card>
          <CardHeader>
            <CardTitle>Points Today</CardTitle>
            <CardDescription>Points earned today</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{user.points_today}</p>
          </CardContent>
        </Card>

        {/* Completed Problems */}
        <Card>
          <CardHeader>
            <CardTitle>Completed Problems</CardTitle>
            <CardDescription>Problems solved so far</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{user.completed_problems}</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>This Week</CardTitle>
            <CardDescription>Points earned this week</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{user.points_this_week}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>This Month</CardTitle>
            <CardDescription>Points earned this month</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{user.points_this_month}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>This Year</CardTitle>
            <CardDescription>Points earned this year</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{user.points_this_year}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
