"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Search } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";

interface Group {
  group_id: string;
  name: string;
  description: string | null;
  no_of_members: number;
  points: number;
  created_at: string;
}

type RoleContext = "admin" | "user" | "moderator";

export default function Groups({ context }: { context: RoleContext }) {
  const supabase = createClient();
  const [groups, setGroups] = useState<Group[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sortOption, setSortOption] = useState<
    "alphabetical" | "creation_time" | "members" | "points"
  >("alphabetical");

  // Zod schema for group creation
  const groupSchema = z.object({
    name: z.string().min(3, "Group name must be at least 3 characters long"),
    description: z.string().optional(),
  });

  type GroupFormValues = z.infer<typeof groupSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Fetch groups the user is a member of
  const fetchGroups = async () => {
    setLoading(true);

    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      const userId = userData?.user?.id;

      if (!userId || userError) {
        console.error("User not authenticated or failed to fetch user");
        return;
      }

      // Step 1: Get group IDs for the user
      const { data: groupMemberData, error: groupMemberError } = await supabase
        .from("tbl_group_members")
        .select("group_id")
        .eq("user_id", userId);

      if (groupMemberError) {
        console.error("Error fetching group memberships:", groupMemberError);
        return;
      }

      const groupIds = groupMemberData?.map((item) => item.group_id) || [];

      if (groupIds.length === 0) {
        setGroups([]);
        setFilteredGroups([]);
        return;
      }

      // Step 2: Fetch groups with those group_ids
      const { data: groupsData, error: groupsError } = await supabase
        .from("tbl_groups")
        .select(
          "group_id, name, description, no_of_members, points, created_at"
        )
        .in("group_id", groupIds);

      if (groupsError) {
        console.error("Error fetching groups:", groupsError);
      } else {
        setGroups(groupsData || []);
        setFilteredGroups(groupsData || []);
      }
    } catch (err) {
      console.error("Unexpected error fetching groups:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new group
  const addGroup = async (data: GroupFormValues) => {
    setLoading(true);
    try {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;

      if (!userId) {
        console.error("User not authenticated");
        return;
      }

      const { data: groupData, error } = await supabase
        .from("tbl_groups")
        .insert({
          name: data.name,
          description: data.description,
          created_by: userId,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating group:", error);
      } else {
        // Add the current user as the first member of the group
        await supabase.from("tbl_group_members").insert({
          group_id: groupData.group_id,
          user_id: userId,
        });

        fetchGroups(); // Refresh the groups list
        reset(); // Reset the form
        setIsDialogOpen(false); // Close the dialog
      }
    } catch (error) {
      console.error("Error adding group:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    const filtered = groups.filter((group) =>
      group.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredGroups(filtered);
  };

  // Handle sorting
  const handleSortChange = (value: string) => {
    setSortOption(value as typeof sortOption);

    const sortedGroups = [...filteredGroups];
    switch (value) {
      case "alphabetical":
        sortedGroups.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "creation_time":
        sortedGroups.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "members":
        sortedGroups.sort((a, b) => b.no_of_members - a.no_of_members);
        break;
      case "points":
        sortedGroups.sort((a, b) => b.points - a.points);
        break;
      default:
        break;
    }
    setFilteredGroups(sortedGroups);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Groups</h1>
        <div className="flex gap-4 items-center w-full md:w-auto">
          <div className="relative">
            <Search
              className="absolute top-1/2 -translate-y-1/2 left-3"
              size={18}
            />
            <Input
              type="search"
              placeholder="Search groups..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full md:w-auto xl:w-[300px] pl-10"
            />
          </div>
          <Select value={sortOption} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
              <SelectItem value="creation_time">Creation Time</SelectItem>
              <SelectItem value="members">Group Members</SelectItem>
              <SelectItem value="points">Points</SelectItem>
            </SelectContent>
          </Select>
          {context === "user" && (
            <Button onClick={() => setIsDialogOpen(true)}>Create Group</Button>
          )}
        </div>
      </div>

      {/* Groups Cards */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
        </div>
      ) : filteredGroups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGroups.map((group) => (
            <Link href={`/groups/${group.group_id}`} key={group.group_id}>
              <Card
                key={group.group_id}
                className="relative border overflow-hidden h-full"
              >
                <CardHeader>
                  <CardTitle className="text-lg font-bold z-10">
                    {group.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="w-2/3">
                  <p className="text-sm text-muted-foreground">
                    {group.description || "No description available"}
                  </p>
                  <div className="mt-4">
                    <div className="text-sm font-medium">
                      Members: {group.no_of_members}
                    </div>
                    <div className="text-sm font-medium">
                      Points: {group.points}
                    </div>
                  </div>
                </CardContent>
                {/* Image on the right side */}
                <div className="absolute top-0 right-0 w-1/3 h-full">
                  <div className="relative w-full h-full">
                    <Image
                      src="/wave.webp"
                      alt="Group Image"
                      fill
                      className="object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-l from-card/20 to-card pointer-events-none" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          No groups found.
        </div>
      )}

      {/* Create Group Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Group</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(addGroup)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Group Name
              </label>
              <Input
                {...register("name")}
                placeholder="Enter group name"
                className="w-full"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <Textarea
                {...register("description")}
                placeholder="Enter group description (optional)"
                className="w-full"
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                Create Group
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
