"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Filter, Settings, Shuffle } from "lucide-react";

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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample problem data
const problems = [
  {
    id: 1,
    name: "Two Sum",
    difficulty: "Easy",
    status: "Solved",
    tags: ["Array", "Hash Table"],
  },
  {
    id: 2,
    name: "Add Two Numbers",
    difficulty: "Medium",
    status: "Attempted",
    tags: ["Linked List", "Math"],
  },
  {
    id: 3,
    name: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    status: "Unsolved",
    tags: ["String", "Sliding Window"],
  },
  {
    id: 4,
    name: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    status: "Unsolved",
    tags: ["Array", "Binary Search", "Divide and Conquer"],
  },
  {
    id: 5,
    name: "Longest Palindromic Substring",
    difficulty: "Medium",
    status: "Solved",
    tags: ["String", "Dynamic Programming"],
  },
  {
    id: 6,
    name: "ZigZag Conversion",
    difficulty: "Medium",
    status: "Unsolved",
    tags: ["String"],
  },
  {
    id: 7,
    name: "Reverse Integer",
    difficulty: "Medium",
    status: "Attempted",
    tags: ["Math"],
  },
  {
    id: 8,
    name: "String to Integer (atoi)",
    difficulty: "Medium",
    status: "Unsolved",
    tags: ["String", "Math"],
  },
  {
    id: 9,
    name: "Palindrome Number",
    difficulty: "Easy",
    status: "Solved",
    tags: ["Math"],
  },
  {
    id: 10,
    name: "Regular Expression Matching",
    difficulty: "Hard",
    status: "Unsolved",
    tags: ["String", "Dynamic Programming", "Recursion"],
  },
];

// All available tags from the problems
const allTags = Array.from(
  new Set(problems.flatMap((problem) => problem.tags))
).sort();

export default function CodingProblems() {
  const [filteredProblems, setFilteredProblems] = useState(problems);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Apply filters to problems
  const applyFilters = () => {
    let result = [...problems];

    // Apply search filter
    if (searchQuery) {
      result = result.filter((problem) =>
        problem.name.toLowerCase().includes(searchQuery.toLowerCase())
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

    // Apply tags filter
    if (selectedTags.length > 0) {
      result = result.filter((problem) =>
        selectedTags.some((tag) => problem.tags.includes(tag))
      );
    }

    setFilteredProblems(result);
  };

  // Handle filter changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setTimeout(applyFilters, 300);
  };

  const handleDifficultyChange = (value: string) => {
    setDifficultyFilter(value);
    setTimeout(applyFilters, 100);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setTimeout(applyFilters, 100);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => {
      const newTags = prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag];

      setTimeout(applyFilters, 100);
      return newTags;
    });
  };

  // Pick a random problem
  const pickRandomProblem = () => {
    const randomIndex = Math.floor(Math.random() * filteredProblems.length);
    const randomProblem = filteredProblems[randomIndex];

    // In a real app, you would navigate to the problem page
    alert(
      `Random problem selected: ${
        randomProblem?.name || "No problems match your filters"
      }`
    );
  };

  // Get badge color based on difficulty
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return (
          <div className="text-green-500 hover:text-green-600">
            {difficulty}
          </div>
        );
      case "Medium":
        return (
          <div className="text-yellow-500 hover:text-yellow-600">
            {difficulty}
          </div>
        );
      case "Hard":
        return (
          <div className="text-red-500 hover:text-red-600">{difficulty}</div>
        );
      default:
        return <div>{difficulty}</div>;
    }
  };

  // Get badge color based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Solved":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>
        );
      case "Attempted":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">{status}</Badge>
        );
      case "Unsolved":
        return <Badge variant="outline">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4">
      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search problems..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="max-w-xs"
          />

          <Select
            value={difficultyFilter}
            onValueChange={handleDifficultyChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="All">All Difficulties</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
                <SelectItem value="Complex">Complex</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Solved">Solved</SelectItem>
                <SelectItem value="Attempted">Attempted</SelectItem>
                <SelectItem value="Unsolved">Unsolved</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[180px] justify-between">
                <span>Tags</span>
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 max-h-[300px] overflow-y-auto no-scrollbar">
              <DropdownMenuGroup>
                {allTags.map((tag) => (
                  <DropdownMenuCheckboxItem
                    key={tag}
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          <Button onClick={pickRandomProblem}>
            <Shuffle className="h-4 w-4 mr-2" />
            Pick One
          </Button>
        </div>
      </div>

      {/* Problems Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">#</TableHead>
              <TableHead>Problem Name</TableHead>
              <TableHead className="w-[120px]">Difficulty</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProblems.length > 0 ? (
              filteredProblems.map((problem) => (
                <TableRow key={problem.id}>
                  <TableCell className="font-medium">{problem.id}.</TableCell>
                  <TableCell className="">
                    <Link
                      href={`/problem/${problem.id}`}
                      className="hover:text-primary block py-2"
                    >
                      {problem.name}
                    </Link>
                    {/* <div className="flex flex-wrap gap-1 mt-1">
                      {problem.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs rounded-sm text-primary">
                          {tag}
                        </Badge>
                      ))}
                    </div> */}
                  </TableCell>
                  <TableCell>
                    {getDifficultyBadge(problem.difficulty)}
                  </TableCell>
                  <TableCell>{problem.status}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  No problems match your filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
