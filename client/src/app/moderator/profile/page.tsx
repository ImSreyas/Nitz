"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export default function ModeratorProfilePage() {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [moderator, setModerator] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState(""); // State for the name input
  const [updating, setUpdating] = useState(false); // State for update process
  const [problemsAdded, setProblemsAdded] = useState(0); // State for problems added count

  // Fetch moderator data
  const fetchModeratorData = async () => {
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      const moderatorId = authData?.user?.id;

      if (authError || !moderatorId) {
        console.error("Error fetching authenticated moderator:", authError);
        return;
      }

      // Fetch moderator details
      const { data: moderatorData, error } = await supabase
        .from("tbl_moderators")
        .select("*")
        .eq("id", moderatorId)
        .single();

      if (error) {
        console.error("Error fetching moderator data:", error);
      } else {
        setModerator(moderatorData);
        setName(moderatorData.name || ""); // Set the current name in the input field
      }

      // Fetch total problems added by the moderator
      const { count, error: problemsError } = await supabase
        .from("tbl_problems")
        .select("id", { count: "exact" })
        .eq("moderator_id", moderatorId)
        .eq("is_deleted", false); // Exclude deleted problems

      if (problemsError) {
        console.error("Error fetching problems count:", problemsError);
      } else {
        setProblemsAdded(count || 0);
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
      const moderatorId = authData?.user?.id;

      const { error } = await supabase
        .from("tbl_moderators")
        .update({ name })
        .eq("id", moderatorId);

      if (error) {
        console.error("Error updating name:", error);
        toast.error("Failed to update name. Please try again.");
      } else {
        toast.success("Name updated successfully!");
        fetchModeratorData(); // Refresh moderator data
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchModeratorData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  if (!moderator) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-muted-foreground">No moderator data found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-16 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={`https://api.dicebear.com/6.x/initials/svg?seed=${moderator.username}`}
            />
            <AvatarFallback>{moderator.username[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{moderator.name || "Anonymous"}</h1>
            <p className="text-muted-foreground">@{moderator.username}</p>
          </div>
        </div>
        {/* <div className="mt-4 md:mt-0">
          <Badge
            className={`text-lg px-4 py-2 rounded-md ${
              moderator.permission >= 5
                ? "bg-gradient-to-r from-blue-500 to-green-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Permission Level: {moderator.permission}
          </Badge>
        </div> */}
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
        {/* Problems Added */}
        <Card>
          <CardHeader>
            <CardTitle>Problems Added</CardTitle>
            <CardDescription>Total problems added</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{problemsAdded}</p>
          </CardContent>
        </Card>

        {/* Blackpoints */}
        <Card>
          <CardHeader>
            <CardTitle>Blackpoints</CardTitle>
            <CardDescription>Penalties accumulated</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-red-500">
              {moderator.blackpoints}
            </p>
          </CardContent>
        </Card>

        {/* Account Created */}
        <Card>
          <CardHeader>
            <CardTitle>Account Created</CardTitle>
            <CardDescription>When your account was created</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {new Date(moderator.created_at).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}