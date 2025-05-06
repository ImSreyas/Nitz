"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface User {
  id: string;
  name: string | null;
  username: string;
  points: number;
  points_today: number;
  points_this_week: number;
  points_this_month: number;
  points_this_year: number;
  tier: number | null;
  completed_problems: number;
  completed_1vs1_matches: number;
}

export default function LeaderBoard() {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [timeFilter, setTimeFilter] = useState<
    "alltime" | "today" | "thisweek" | "thismonth" | "thisyear"
  >("alltime");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchUser = async () => {
      const user = await supabase.auth.getUser();
      const id = user.data?.user?.id;
      if (id) {
        setUserId(id);
      }
    };
    fetchUser();
  }, [supabase]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("tbl_users")
        .select(
          "id, name, username, points, points_today, points_this_week, points_this_month, points_this_year, tier, completed_problems, completed_1vs1_matches"
        )
        .order(getOrderField(), { ascending: false });

      if (error) {
        console.error("Error fetching leaderboard:", error);
      } else {
        setFilteredUsers(data || []);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Button>
        );
      }
    } else {
      if (currentPage > 2) {
        pages.push(
          <Button
            key={1}
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(1)}
          >
            1
          </Button>
        );
        if (currentPage > 3) {
          pages.push(
            <span key="start-ellipsis" className="px-2 text-muted-foreground">
              ...
            </span>
          );
        }
      }

      for (
        let i = Math.max(1, currentPage - 1);
        i <= Math.min(totalPages, currentPage + 1);
        i++
      ) {
        pages.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Button>
        );
      }

      if (currentPage < totalPages - 1) {
        if (currentPage < totalPages - 2) {
          pages.push(
            <span key="end-ellipsis" className="px-2 text-muted-foreground">
              ...
            </span>
          );
        }
        pages.push(
          <Button
            key={totalPages}
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </Button>
        );
      }
    }

    return pages;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <Select
          value={timeFilter}
          onValueChange={(value) => setTimeFilter(value as typeof timeFilter)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Time" />
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

      {loading ? (
        <div className="flex justify-center items-center py-10 min-h-80">
          <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
        </div>
      ) : (
        <div className="border px-6 py-4 rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead className="text-right">Points</TableHead>
                <TableHead className="text-right">Completed Problems</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user, index) => (
                  <TableRow
                    key={user.id}
                    className={`h-12 ${userId === user.id ? "bg-card" : ""}`}
                  >
                    <TableCell>
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell>{user.name || "Anonymous"}</TableCell>
                    <TableCell>@{user.username}</TableCell>
                    <TableCell className="text-right">
                      {getPoints(user)}
                    </TableCell>
                    <TableCell className="text-right">
                      {user.completed_problems}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    No users found for the selected time period.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex gap-2 justify-end items-center mt-4">
        <div className="flex items-center gap-2">{renderPagination()}</div>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );

  function getPoints(user: User) {
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
  }
}
