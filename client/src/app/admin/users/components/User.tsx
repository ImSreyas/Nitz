"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUsers, toggleUserBlock } from "@/lib/api/admin";
import {
  Ban,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  Filter,
  MoreHorizontal,
  Search,
  UserRoundPen,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import UserDetails from "./UserDetails";
import UpdateUser from "./UpdateUser";
import { type User } from "@/lib/types/admin";
import { exportUsersToCSV } from "@/utils/utils";
import { toast } from "sonner";

export default function User() {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<{
    column: "email" | "points" | "blackpoints" | null;
    order: "asc" | "desc" | null;
  }>({ column: null, order: null });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false); // State for block dialog
  const usersPerPage = 10;

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const result = await getUsers();
      if (result?.data?.success) {
        setUsers(result.data.data ?? []);
        setFilteredUsers(result.data.data ?? []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBlockUser = async () => {
    if (selectedUser) {
      try {
        const shouldBlock = !selectedUser.is_blocked;
        await toggleUserBlock(selectedUser.id, shouldBlock);
        toast.success(
          `User ${shouldBlock ? "blocked" : "unblocked"} successfully!`
        ); // Add toast notification
        fetchUsers(); // Refresh the user list
        setIsBlockDialogOpen(false); // Close the dialog
      } catch (error) {
        toast.error("Failed to toggle block status. Please try again.");
        console.error("Error toggling user block status:", error);
      }
    }
  };
  const handleOpenBlockDialog = (user: User) => {
    setSelectedUser(user);
    setIsBlockDialogOpen(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) =>
        user.username.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
  };

  const sortedUsers = React.useMemo(() => {
    if (sortOrder.column && sortOrder.order) {
      return [...filteredUsers].sort((a, b) => {
        const valueA = sortOrder.column ? a[sortOrder.column] || 0 : 0;
        const valueB = sortOrder.column ? b[sortOrder.column] || 0 : 0;

        if (sortOrder.order === "asc") {
          return valueA > valueB ? 1 : -1;
        } else if (sortOrder.order === "desc") {
          return valueA < valueB ? 1 : -1;
        }
        return 0;
      });
    }
    return filteredUsers;
  }, [filteredUsers, sortOrder]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const toggleSortOrder = (column: "email" | "points" | "blackpoints") => {
    setSortOrder((prevOrder) => {
      if (prevOrder.column === column) {
        return {
          column,
          order:
            prevOrder.order === "asc"
              ? "desc"
              : prevOrder.order === "desc"
              ? null
              : "asc",
        };
      }
      return { column, order: "asc" };
    });
  };

  const handleViewProfile = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleEditDetails = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">User Management</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => exportUsersToCSV(users)}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-8 w-[250px] md:w-[300px]"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filter
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span>Tier</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Status</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Join Date</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Activity</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border px-6 py-2 bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>
                <Button
                  size="sm"
                  className="my-1 flex items-center gap-2 bg-transparent text-muted-foreground hover:bg-transparent border"
                  onClick={() => toggleSortOrder("email")}
                >
                  Email
                  {sortOrder.column === "email" &&
                    sortOrder.order === "asc" && (
                      <ChevronUp className="h-4 w-4" />
                    )}
                  {sortOrder.column === "email" &&
                    sortOrder.order === "desc" && (
                      <ChevronDown className="h-4 w-4" />
                    )}
                </Button>
              </TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>
                <Button
                  size="sm"
                  className="my-1 flex items-center gap-2 bg-transparent text-muted-foreground hover:bg-transparent border"
                  onClick={() => toggleSortOrder("points")}
                >
                  Points
                  {sortOrder.column === "points" &&
                    sortOrder.order === "asc" && (
                      <ChevronUp className="h-4 w-4" />
                    )}
                  {sortOrder.column === "points" &&
                    sortOrder.order === "desc" && (
                      <ChevronDown className="h-4 w-4" />
                    )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  size="sm"
                  className="my-1 flex items-center gap-2 bg-transparent text-muted-foreground hover:bg-transparent border"
                  onClick={() => toggleSortOrder("blackpoints")}
                >
                  Black Points
                  {sortOrder.column === "blackpoints" &&
                    sortOrder.order === "asc" && (
                      <ChevronUp className="h-4 w-4" />
                    )}
                  {sortOrder.column === "blackpoints" &&
                    sortOrder.order === "desc" && (
                      <ChevronDown className="h-4 w-4" />
                    )}
                </Button>
              </TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Blocked</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array(10)
                  .fill(0)
                  .map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-6 w-8 bg-accent" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[120px] bg-accent" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[180px] bg-accent" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[80px] bg-accent" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[60px] bg-accent" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[60px] bg-accent" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[100px] bg-accent" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[80px] bg-accent" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[50px] bg-accent" />
                      </TableCell>
                    </TableRow>
                  ))
              : currentUsers.map((user, index) => (
                  <TableRow key={user.id + index}>
                    <TableCell className="font-medium">
                      {indexOfFirstUser + index + 1}
                    </TableCell>
                    <TableCell className="font-medium flex items-center">
                      {user.username}
                    </TableCell>
                    <TableCell className="px-4">{user.email}</TableCell>
                    <TableCell>
                      <div>{user.tier_name}</div>
                    </TableCell>
                    <TableCell className="px-4">{user.points}</TableCell>
                    <TableCell className="px-4">{user.blackpoints}</TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </TableCell>
                    <TableCell>
                      <div>{user.is_active ? "Active" : "InActive"}</div>
                    </TableCell>
                    <TableCell>
                      <div>{user.is_blocked ? "Yes" : "No"}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="px-3 py-2" align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleViewProfile(user)}
                          >
                            <Eye />
                            View profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditDetails(user)}
                          >
                            <UserRoundPen /> Edit details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleOpenBlockDialog(user)}
                            className={
                              user.is_blocked
                                ? "text-green-600"
                                : "text-destructive"
                            }
                          >
                            <Ban />
                            {user.is_blocked ? "Unblock user" : "Block user"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Showing <strong>{indexOfFirstUser + 1}</strong> to{" "}
          <strong>{Math.min(indexOfLastUser, filteredUsers.length)}</strong> of{" "}
          <strong>{filteredUsers.length}</strong> users
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Block/Unblock Dialog */}
      <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.is_blocked ? "Unblock User" : "Block User"}
            </DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to{" "}
            {selectedUser?.is_blocked ? "unblock" : "block"} this user?
          </p>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsBlockDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant={selectedUser?.is_blocked ? "default" : "destructive"}
              onClick={handleBlockUser}
            >
              {selectedUser?.is_blocked ? "Unblock" : "Block"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <UserDetails
        state={{ isDialogOpen, setIsDialogOpen }}
        selectedUser={selectedUser}
      />

      <UpdateUser
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        selectedUser={selectedUser}
        onUserUpdated={fetchUsers}
      />
    </div>
  );
}
