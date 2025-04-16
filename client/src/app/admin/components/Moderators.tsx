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
import { getModerators } from "@/lib/api/admin";
import {
  Activity,
  ChevronDown,
  ChevronUp,
  Clock,
  Eye,
  Filter,
  MoreHorizontal,
  Plus,
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
  tier_name: string;
  is_active: boolean;
  completed_1vs1_matches: number;
  completed_problems: number;
  created_at: string;
  permission?: string;
  problems_added?: number;
};

export default function Moderators() {
  const [isLoading, setIsLoading] = useState(false);
  const [moderators, setModerators] = useState<User[]>([]);
  const [filteredModerators, setFilteredModerators] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<{
    column: "email" | "permission" | "problems_added" | "blackpoints" | null;
    order: "asc" | "desc" | null;
  }>({ column: null, order: null });
  const [selectedModerator, setSelectedModerator] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const moderatorsPerPage = 10;

  const editModeratorSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    username: z.string().min(1, "Username is required"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof editModeratorSchema>>({
    resolver: zodResolver(editModeratorSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
    },
  });

  useEffect(() => {
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
    fetchModerators();
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

  const handleUpdateModerator = (updatedModerator: User) => {
    setModerators((prevModerators) =>
      prevModerators.map((moderator) =>
        moderator.id === updatedModerator.id
          ? { ...moderator, ...updatedModerator }
          : moderator
      )
    );
    setFilteredModerators((prevFilteredModerators) =>
      prevFilteredModerators.map((moderator) =>
        moderator.id === updatedModerator.id
          ? { ...moderator, ...updatedModerator }
          : moderator
      )
    );
  };

  const handleViewProfile = (moderator: User) => {
    setSelectedModerator(moderator);
    setIsDialogOpen(true);
  };

  const handleEditDetails = (moderator: User) => {
    setSelectedModerator(moderator);
    setValue("name", moderator.name || "");
    setValue("email", moderator.email || "");
    setValue("username", moderator.username || "");
    setIsEditDialogOpen(true);
  };

  const onSubmit = (data: z.infer<typeof editModeratorSchema>) => {
    if (selectedModerator) {
      const updatedModerator = { ...selectedModerator, ...data };
      handleUpdateModerator(updatedModerator);
      toast.success("Moderator updated successfully!");
      setIsEditDialogOpen(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Moderator Management</h2>
        <Button size="sm" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Moderator
        </Button>
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
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Problems Reviewed
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-muted-foreground">
              +128 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Response Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2 hours</div>
            <p className="text-xs text-muted-foreground">
              -0.5 from last month
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
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
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

      <UserDetails
        state={{ isDialogOpen, setIsDialogOpen }}
        selectedUser={selectedModerator}
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-scroll no-scrollbar max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Moderator Details</DialogTitle>
            <DialogClose />
          </DialogHeader>
          {selectedModerator && (
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
                  defaultValue={selectedModerator.username}
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
                  defaultValue={selectedModerator.name || ""}
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
                  defaultValue={selectedModerator.email || ""}
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
                  Update Moderator
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
