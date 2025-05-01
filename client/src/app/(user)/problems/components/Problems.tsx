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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getProblemsList } from "@/lib/api/common";
import { useRouter } from "next/navigation";

// Define the Problem type
interface Problem {
  id: string;
  problem_number: number;
  title: string;
  difficulty: "beginner" | "easy" | "medium" | "hard" | "complex";
  problem_type: string;
  competition_mode: string;
  topics: string[];
  problem_statement: string;
  constraints: string;
  time_limit: string;
  memory_limit: string;
  input_format: string;
  output_format: string;
  moderator_id: string;
  created_at: string;
  is_deleted: boolean;
  blackpoints: number;
  publish_status: boolean;
  status: "pending" | "completed" | "unsolved";
  moderator_name: string;
  moderator_username: string;
}

export default function CodingProblems() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const router = useRouter();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch problems from the API
  const fetchProblems = async () => {
    try {
      const response = await getProblemsList();
      if (response?.data?.success) {
        const fetchedProblems: Problem[] = response.data.data;

        // Apply initial filters based on the conditions
        const filtered = fetchedProblems.filter(
          (problem) =>
            problem.problem_type === "coding" &&
            problem.competition_mode === "general" &&
            !problem.is_deleted &&
            problem.blackpoints < 12 &&
            problem.publish_status
        );

        // Duplicate the same 3 questions 33 times
        const duplicatedProblems: Problem[] = Array(33)
          .fill(null)
          .flatMap((_, index) =>
            filtered.map((problem) => ({
              ...problem,
              problem_number: problem.problem_number + index * 100,
            }))
          );

        setProblems(duplicatedProblems);
        setFilteredProblems(duplicatedProblems);
      }
    } catch (error) {
      console.error("Error fetching problems:", error);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleProblemClick = (problemId: string) => {
    router.push(`/problems/${problemId}`);
  }

  // Apply filters to problems
  const applyFilters = () => {
    let result = [...problems];

    // Apply search filter
    if (searchQuery) {
      result = result.filter((problem) =>
        problem.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply difficulty filter
    if (difficultyFilter !== "All") {
      result = result.filter(
        (problem) => problem.difficulty === difficultyFilter
      );
    }

    // Apply status filter
    if (statusFilter !== "All") {
      result = result.filter((problem) => problem.status === statusFilter);
    }

    setFilteredProblems(result);
    setCurrentPage(1); // Reset to the first page after filtering
  };

  // Handle filter changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    applyFilters();
  };

  const handleDifficultyChange = (value: string) => {
    setDifficultyFilter(value);
    applyFilters();
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    applyFilters();
  };

  // Function to get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "text-green-500";
      case "easy":
        return "text-blue-500";
      case "medium":
        return "text-yellow-500";
      case "hard":
        return "text-orange-500";
      case "complex":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const paginatedProblems = filteredProblems.slice(
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
    <div className="container mx-auto px-4">
      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Search problems..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="max-w-xs"
        />

        <Select value={difficultyFilter} onValueChange={handleDifficultyChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Difficulties</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
            <SelectItem value="complex">Complex</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="unsolved">Unsolved</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Problems Table */}
      <div className="border px-6 py-4 rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px] px-5">#</TableHead>
              <TableHead>Problem Title</TableHead>
              <TableHead className="w-[120px]">Difficulty</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProblems.length > 0 ? (
              paginatedProblems.map((problem) => (
                <TableRow key={problem.problem_number} onClick={() => handleProblemClick(problem.id)} className="hover:cursor-pointer">
                  <TableCell className="font-medium px-5">
                    {problem.problem_number}.
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{problem.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {problem.topics.join(", ")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-md text-xs border font-medium ${getDifficultyColor(
                        problem.difficulty
                      )}`}
                    >
                      {problem.difficulty}
                    </span>
                  </TableCell>
                  <TableCell className="capitalize">{problem.status}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No problems match your filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

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
}
