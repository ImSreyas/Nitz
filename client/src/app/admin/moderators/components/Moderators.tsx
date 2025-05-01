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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getModerators,
  toggleModeratorBlock,
  getDashboardData,
} from "@/lib/api/admin";
import {
  Activity,
  Ban,
  ChevronDown,
  ChevronUp,
  Eye,
  Filter,
  MoreHorizontal,
  Search,
  Shield,
  UserRoundPen,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Moderator } from "@/lib/types/admin";
import ModeratorDetails from "./ModeratorDetails";
import { Separator } from "@/components/ui/separator";
import UpdateModerator from "./UpdateModerator"; // Import the new component

export default function Moderators() {
  const [isLoading, setIsLoading] = useState(false);
  const [moderators, setModerators] = useState<Moderator[]>([]);
  const [filteredModerators, setFilteredModerators] = useState<Moderator[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<{
    column: "email" | "permission" | "problems_added" | "blackpoints" | null;
    order: "asc" | "desc" | null;
  }>({ column: null, order: null });
  const [selectedModerator, setSelectedModerator] = useState<Moderator | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false); // State for block dialog
  const [totalProblems, setTotalProblems] = useState(0); // State for total problems
  const [problemsThisMonth, setProblemsThisMonth] = useState(0); // State for problems this month
  const moderatorsPerPage = 10;

  const fetchModerators = async () => {
    setIsLoading(true);
    try {
      const result = await getModerators();
      if (result?.data?.success) {
        setModerators(result.data.data ?? []);
        setFilteredModerators(result.data.data ?? []);
      }
    } catch (error) {
      console.error("Error fetching moderators:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const result = await getDashboardData();
      if (result?.data?.success) {
        const dashboardData = result.data.data;
        setTotalProblems(dashboardData.totalProblems || 0);
        setProblemsThisMonth(dashboardData.currentMonth.problems || 0);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchModerators();
    fetchDashboardData(); // Fetch dashboard data on component mount
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      setFilteredModerators(moderators);
    } else {
      const filtered = moderators.filter((moderator) =>
        moderator.username.toLowerCase().includes(query)
      );
      setFilteredModerators(filtered);
    }
  };

  const sortedModerators = React.useMemo(() => {
    if (sortOrder.column && sortOrder.order) {
      return [...filteredModerators].sort((a, b) => {
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
    return filteredModerators;
  }, [filteredModerators, sortOrder]);

  const indexOfLastModerator = currentPage * moderatorsPerPage;
  const indexOfFirstModerator = indexOfLastModerator - moderatorsPerPage;
  const currentModerators = sortedModerators.slice(
    indexOfFirstModerator,
    indexOfLastModerator
  );

  const totalPages = Math.ceil(filteredModerators.length / moderatorsPerPage);

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

  const toggleSortOrder = (
    column: "email" | "permission" | "problems_added" | "blackpoints"
  ) => {
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

  const handleViewProfile = (moderator: Moderator) => {
    setSelectedModerator(moderator);
    setIsDialogOpen(true);
  };

  const handleEditDetails = (moderator: Moderator) => {
    setSelectedModerator(moderator);
    setIsEditDialogOpen(true);
  };

  const handleBlockModerator = async () => {
    if (selectedModerator) {
      try {
        const shouldBlock = !selectedModerator.is_blocked; // Toggle the block status
        await toggleModeratorBlock(selectedModerator.id, shouldBlock);
        toast.success(
          `Moderator ${shouldBlock ? "blocked" : "unblocked"} successfully!`
        );
        fetchModerators(); // Refresh the moderator list
        setIsBlockDialogOpen(false); // Close the dialog
      } catch (error) {
        toast.error("Failed to toggle block status. Please try again.");
        console.error("Error toggling moderator block status:", error);
      }
    }
  };

  const handleOpenBlockDialog = (moderator: Moderator) => {
    setSelectedModerator(moderator);
    setIsBlockDialogOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Moderator Management</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Moderators
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {moderators ? moderators.length : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              +
              {moderators
                ? moderators.filter((mod) => {
                    const joinDate = new Date(mod.created_at);
                    const currentDate = new Date();
                    return (
                      joinDate.getMonth() === currentDate.getMonth() &&
                      joinDate.getFullYear() === currentDate.getFullYear()
                    );
                  }).length
                : 0}{" "}
              this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Problems
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProblems}</div>
            <p className="text-xs text-muted-foreground">
              +{problemsThisMonth} this month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search moderators..."
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
                <span>Permission</span>
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
              <TableHead>
                <Button
                  size="sm"
                  className="my-1 flex items-center gap-2 bg-transparent text-muted-foreground hover:bg-transparent border"
                  onClick={() => toggleSortOrder("permission")}
                >
                  Permission
                  {sortOrder.column === "permission" &&
                    sortOrder.order === "asc" && (
                      <ChevronUp className="h-4 w-4" />
                    )}
                  {sortOrder.column === "permission" &&
                    sortOrder.order === "desc" && (
                      <ChevronDown className="h-4 w-4" />
                    )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  size="sm"
                  className="my-1 flex items-center gap-2 bg-transparent text-muted-foreground hover:bg-transparent border"
                  onClick={() => toggleSortOrder("problems_added")}
                >
                  Problems Added
                  {sortOrder.column === "problems_added" &&
                    sortOrder.order === "asc" && (
                      <ChevronUp className="h-4 w-4" />
                    )}
                  {sortOrder.column === "problems_added" &&
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
                        <Skeleton className="h-6 w-[50px] bg-accent" />
                      </TableCell>
                    </TableRow>
                  ))
              : currentModerators.map((moderator, index) => (
                  <TableRow key={moderator.id + index}>
                    <TableCell className="font-medium">
                      {indexOfFirstModerator + index + 1}
                    </TableCell>
                    <TableCell className="font-medium flex items-center">
                      {moderator.username}
                    </TableCell>
                    <TableCell>{moderator.email}</TableCell>
                    <TableCell>{moderator.permission}</TableCell>
                    <TableCell>{moderator.problems_added}</TableCell>
                    <TableCell>{moderator.blackpoints}</TableCell>
                    <TableCell>
                      {new Date(moderator.created_at).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </TableCell>
                    <TableCell>
                      <div>{moderator.is_blocked ? "Yes" : "No"}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="p-2" align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleViewProfile(moderator)}
                          >
                            <Eye />
                            View profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditDetails(moderator)}
                          >
                            <UserRoundPen /> Edit details
                          </DropdownMenuItem>
                          <Separator className="my-1" />
                          <DropdownMenuItem
                            onClick={() => handleOpenBlockDialog(moderator)}
                            className={
                              moderator.is_blocked
                                ? "text-green-600"
                                : "text-destructive"
                            }
                          >
                            <Ban />
                            {moderator.is_blocked
                              ? "Unblock Moderator"
                              : "Block Moderator"}
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
          Showing <strong>{indexOfFirstModerator + 1}</strong> to{" "}
          <strong>
            {Math.min(indexOfLastModerator, filteredModerators.length)}
          </strong>{" "}
          of <strong>{filteredModerators.length}</strong> moderators
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

      <ModeratorDetails
        state={{ isDialogOpen, setIsDialogOpen }}
        selectedModerator={selectedModerator}
      />

      <UpdateModerator
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        selectedModerator={selectedModerator}
        onModeratorUpdated={fetchModerators}
      />

      {/* Block/Unblock Dialog */}
      <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedModerator?.is_blocked
                ? "Unblock Moderator"
                : "Block Moderator"}
            </DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to{" "}
            {selectedModerator?.is_blocked ? "unblock" : "block"} this
            moderator?
          </p>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsBlockDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant={
                selectedModerator?.is_blocked ? "default" : "destructive"
              }
              onClick={handleBlockModerator}
            >
              {selectedModerator?.is_blocked ? "Unblock" : "Block"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
