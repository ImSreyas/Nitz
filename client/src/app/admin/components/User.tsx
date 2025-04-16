import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { getUsers } from "@/lib/api/admin";
import {
  Ban,
  Bell,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  UserRoundPen,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import UserDetails from "./UserDetails";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export type User = {
  id: string;
  name: string | null;
  username: string;
  email: string | null;
  blackpoints: number;
  points: number;
  points_today: number;
  points_this_week: number;
  points_this_month: number;
  points_this_year: number;
  tier_name: string; // e.g., "silver", "gold"
  is_active: boolean;
  completed_1vs1_matches: number;
  completed_problems: number;
  created_at: string; // ISO timestamp
};

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
  const usersPerPage = 10;

  const editUserSchema = z.object({
    name: z.string().min(0, "Name is required"),
    email: z.string().email("Invalid email address"),
    username: z.string().min(1, "Username is required"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof editUserSchema>>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
    },
  });

  useEffect(() => {
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
    fetchUsers();
  }, []);

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

  const handleUpdateUser = (updatedUser: User) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === updatedUser.id ? { ...user, ...updatedUser } : user
      )
    );
    setFilteredUsers((prevFilteredUsers) =>
      prevFilteredUsers.map((user) =>
        user.id === updatedUser.id ? { ...user, ...updatedUser } : user
      )
    );
  };

  const handleViewProfile = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleEditDetails = (user: User) => {
    setSelectedUser(user);
    setValue("name", user.name || "");
    setValue("email", user.email || "");
    setValue("username", user.username || "");
    setIsEditDialogOpen(true);
  };

  const onSubmit = (data: z.infer<typeof editUserSchema>) => {
    if (selectedUser) {
      const updatedUser = { ...selectedUser, ...data };
      handleUpdateUser(updatedUser);
      toast.success("User updated successfully!");
      setIsEditDialogOpen(false);
    }
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
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add User
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
                          <DropdownMenuItem>
                            <Bell />
                            Send notification
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className={
                              user.is_active
                                ? "text-destructive"
                                : "text-green-600"
                            }
                          >
                            <Ban />
                            {user.is_active ? "Block user" : "Unblock user"}
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

      <UserDetails
        state={{ isDialogOpen, setIsDialogOpen }}
        selectedUser={selectedUser}
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-scroll no-scrollbar max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit User Details</DialogTitle>
            <DialogClose />
          </DialogHeader>
          {selectedUser && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-4 flex flex-col gap-4"
            >
              {/* Username */}
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  {...register("username")}
                  placeholder="Enter username"
                  defaultValue={selectedUser.username}
                  className="w-full mt-1"
                />
              </div>

              {/* Name */}
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Enter name"
                  defaultValue={selectedUser.name || ""}
                  className="w-full mt-1"
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="Enter email"
                  defaultValue={selectedUser.email || ""}
                  className="w-full mt-1"
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="mt-2">
                <Button type="submit" className="w-full">
                  Update User
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
