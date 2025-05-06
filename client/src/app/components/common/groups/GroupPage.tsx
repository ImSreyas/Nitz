"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DoorOpen, Loader2, LogOut, Trash2, UserRoundPlus } from "lucide-react";
import Image from "next/image";
import NavBar from "./Nav";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Group {
  group_id: string;
  name: string;
  description: string | null;
  no_of_members: number;
  points: number;
  created_at: string;
  created_by: string;
  created_by_name?: string;
}

interface User {
  id: string;
  name: string | null;
  username: string;
  email: string | null;
  points: number;
  points_today: number;
  points_this_week: number;
  points_this_month: number;
  points_this_year: number;
}

type RoleContext = "admin" | "moderator" | "user";

export default function GroupPage({
  id,
  context,
}: {
  id: string;
  context: RoleContext;
}) {
  console.log("context in group page: ", context);
  const supabase = createClient();
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [timeFilter, setTimeFilter] = useState<
    "alltime" | "today" | "thisweek" | "thismonth" | "thisyear"
  >("alltime");
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<{
    id: string;
    name: string | null;
  } | null>(null);

  // Determine the field to order by based on the time filter
  const getOrderField = () => {
    switch (timeFilter) {
      case "today":
        return "points_today";
      case "thisweek":
        return "points_this_week";
      case "thismonth":
        return "points_this_month";
      case "thisyear":
        return "points_this_year";
      default:
        return "points";
    }
  };

  const leaveGroup = async () => {
    try {
      const { error } = await supabase
        .from("tbl_group_members")
        .delete()
        .eq("group_id", id)
        .eq("user_id", currentUserId);

      if (error) {
        toast.error("Error Leaving group");
      } else {
        toast.success("Successfully leaved from the group", {
          position: "top-center",
        });
        window.location.href = "/groups";
      }
    } catch {
      toast.error("Error leaving group");
    } finally {
      setIsLeaveDialogOpen(false);
    }
  };

  const deleteGroup = async () => {
    try {
      const { error } = await supabase
        .from("tbl_groups")
        .delete()
        .eq("group_id", id);

      if (error) {
        toast.error("Error deleting group");
      } else {
        toast.success("Group deleted successfully", { position: "top-center" });
        window.location.href = "/groups"; // Redirect to the groups page
      }
    } catch {
      toast.error("Error deleting group");
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  // Fetch group details
  const fetchGroupDetails = async () => {
    setLoading(true);
    try {
      const { data: groupData, error } = await supabase
        .from("tbl_groups")
        .select("*")
        .eq("group_id", id)
        .single();

      if (error) {
        toast.error("Error fetching group details");
      } else {
        // Fetch the name of the user who created the group
        const { data: creatorData, error: creatorError } = await supabase
          .from("tbl_users")
          .select("name")
          .eq("id", groupData.created_by)
          .single();

        if (creatorError) {
          toast.error("Error fetching creator details:");
        } else {
          setGroup({
            ...groupData,
            created_by_name: creatorData?.name || "Unknown",
          });
        }
      }
    } catch {
      toast.error("Error fetching group details:");
    } finally {
      setLoading(false);
    }
  };

  // Fetch group members with sorting
  const fetchGroupMembers = async () => {
    // setLoading(true);
    try {
      const orderField = getOrderField(); // Get the correct field to sort by
      const { data: memberData, error } = await supabase
        .from("tbl_group_members")
        .select("user_id")
        .eq("group_id", id);

      if (error) {
        toast.error("Error fetching group members:");
        return;
      }

      const userIds = memberData.map((member) => member.user_id);

      const { data: users, error: userError } = await supabase
        .from("tbl_users")
        .select(
          "id, name, username, email, points, points_today, points_this_week, points_this_month, points_this_year"
        )
        .in("id", userIds)
        .order(orderField, { ascending: false }); // Sort by the selected field

      if (userError) {
        toast.error("Error fetching users:");
      } else {
        setMembers(users || []);
      }
    } catch {
      toast.error("Error fetching group members:");
    } finally {
      // setLoading(false);
    }
  };

  // Add a new member to the group
  const addMember = async () => {
    setLoading(true);
    try {
      const { data: user, error } = await supabase
        .from("tbl_users")
        .select("id")
        .eq("email", newMemberEmail)
        .single();

      if (error || !user) {
        toast.error("User not found", { position: "top-center" });
        return;
      }

      const { error: addError } = await supabase
        .from("tbl_group_members")
        .insert({
          group_id: id,
          user_id: user.id,
        });

      if (addError) {
        toast.error("User Already added", { position: "top-center" });
      } else {
        fetchGroupMembers();
        fetchGroupDetails();
        setIsDialogOpen(false);
        setNewMemberEmail("");
      }
    } catch {
      toast.error("Error adding member:");
    } finally {
      setLoading(false);
    }
  };

  // Fetch current user ID
  const fetchCurrentUser = async () => {
    const { data: user } = await supabase.auth.getUser();
    setCurrentUserId(user?.user?.id || null);
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchGroupDetails();
    fetchGroupMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, timeFilter]);

  useEffect(() => {
    if (group?.created_by === currentUserId) {
      setIsOwner(true);
    }
  }, [group, currentUserId]);

  // Get points based on the selected time filter
  const getPoints = (user: User) => {
    switch (timeFilter) {
      case "today":
        return user.points_today;
      case "thisweek":
        return user.points_this_week;
      case "thismonth":
        return user.points_this_month;
      case "thisyear":
        return user.points_this_year;
      default:
        return user.points;
    }
  };

  const handleKickOut = (id: string, name: string | null) => {
    setSelectedMember({ id, name });
    setIsConfirmDialogOpen(true);
  };

  const confirmKickOut = async () => {
    if (!selectedMember) return;

    try {
      const { error } = await supabase
        .from("tbl_group_members")
        .delete()
        .eq("group_id", id)
        .eq("user_id", selectedMember.id);

      if (error) {
        toast.error("Error kicking out member");
      } else {
        toast.success(`${selectedMember.name || "Member"} has been removed`, {
          position: "top-center",
        });
        fetchGroupMembers();
        fetchGroupDetails();
      }
    } catch {
      toast.error("Error kicking out member");
    } finally {
      setIsConfirmDialogOpen(false);
      setSelectedMember(null);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="container mx-auto px-16 py-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Group Overview */}
        <div className="col-span-1">
          <div className="border rounded-xl bg-card relative">
            {loading ? (
              <div className="h-[80vh] flex items-center justify-center">
                <Loader2 className="animate-spin h-8 w-8 text-muted-foreground mx-auto" />
              </div>
            ) : (
              <>
                <div className="relative">
                  <Image
                    src="/wave.webp"
                    alt="Group Image"
                    width={500}
                    height={200}
                    className="rounded-lg object-cover mb-4"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-card/20 to-card pointer-events-none" />
                </div>
                <div className="px-6 pt-2 pb-8">
                  <h2 className="text-2xl font-bold text-primary mb-3">
                    {group?.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {group?.description || "No description available"}
                  </p>
                  <div className="mt-4">
                    <div className="grid grid-cols-2 border-b pb-3 mb-4 gap-6">
                      <div className="text-sm font-medium border-r">
                        Members
                        <div className="text-2xl">{group?.no_of_members}</div>
                      </div>
                      <div className="text-sm font-medium">
                        Total Points
                        <div className="text-2xl">{group?.points}</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      Created By
                      <div className="text-md">
                        {group?.created_by_name || "Unknown"}
                      </div>
                    </div>
                  </div>
                  {isOwner ? (
                    <div className="absolute top-5 right-5 flex gap-2">
                      <Button
                        variant="outline"
                        className="h-10 w-10 rounded-full bg-foreground text-background hover:bg-foreground/70 hover:text-background"
                        onClick={() => setIsDialogOpen(true)}
                      >
                        <UserRoundPlus />
                      </Button>
                      <Button
                        variant="destructive"
                        className="h-10 w-10 rounded-full"
                        onClick={() => setIsDeleteDialogOpen(true)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ) : (
                    <div className="absolute top-5 right-5 flex gap-2">
                      <Button
                        variant="outline"
                        className="h-10 w-10 rounded-full bg-foreground text-background hover:bg-foreground/70 hover:text-background"
                        onClick={() => setIsLeaveDialogOpen(true)}
                      >
                        <LogOut />
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Group Leaderboard */}
        <div className="col-span-2 min-h-full">
          <div className="border rounded-lg p-4 bg-card min-h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Leaderboard</h2>
              <Select
                value={timeFilter}
                onValueChange={(value) =>
                  setTimeFilter(value as typeof timeFilter)
                }
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Time Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alltime">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="thisweek">This Week</SelectItem>
                  <SelectItem value="thismonth">This Month</SelectItem>
                  <SelectItem value="thisyear">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                  {isOwner && (
                    <TableHead className="text-right">Action</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member, index) => (
                  <TableRow
                    key={member.id}
                    className={`h-12 ${
                      currentUserId === member.id ? "bg-background/50" : ""
                    }`}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{member.name || "Anonymous"}</TableCell>
                    <TableCell>@{member.username}</TableCell>
                    <TableCell className="text-right">
                      {getPoints(member)}
                    </TableCell>
                    {isOwner && (
                      <TableCell className="text-right">
                        {currentUserId !== member.id && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-5 h-5"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm6 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm6 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                                  />
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  handleKickOut(member.id, member.name)
                                }
                              >
                                <DoorOpen className="mr-2 h-4 w-4" />
                                Kick Out
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Add Member Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="p-10">
            <DialogHeader>
              <DialogTitle>Add Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Enter member's email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
              />
              <DialogFooter>
                <Button
                  onClick={addMember}
                  disabled={loading}
                  className="w-full mt-2"
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    "Add Member"
                  )}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* Confirm Kick Out Dialog */}
        <Dialog
          open={isConfirmDialogOpen}
          onOpenChange={setIsConfirmDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Kick Out</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to remove{" "}
              <span className="font-bold">
                {selectedMember?.name || "this member"}
              </span>{" "}
              from the group?
            </p>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsConfirmDialogOpen(false)}
              >
                No
              </Button>
              <Button variant="destructive" onClick={confirmKickOut}>
                Yes, Remove
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Leave Group</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to leave this group{" "}
              <span className="font-bold">{group?.name}</span>? This action
              cannot be undone.
            </p>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsLeaveDialogOpen(false)}
              >
                No
              </Button>
              <Button variant="default" onClick={leaveGroup}>
                Yes, Leave
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete Group</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to delete the group{" "}
              <span className="font-bold">{group?.name}</span>? This action
              cannot be undone.
            </p>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                No
              </Button>
              <Button variant="destructive" onClick={deleteGroup}>
                Yes, Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
