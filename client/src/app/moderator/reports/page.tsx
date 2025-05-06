"use client";

import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface Report {
  report_id: string;
  title: string;
  content: string;
  user_id: string;
  type: string;
  status: string;
  priority: number;
  created_at: string;
}

export default function ModeratorReports() {
  const supabase = createClientComponentClient();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Summary statistics
  const [totalReports, setTotalReports] = useState(0);
  const [pendingReports, setPendingReports] = useState(0);
  const [resolvedReports, setResolvedReports] = useState(0);
  const [reportsThisMonth, setReportsThisMonth] = useState(0);
  const [pendingReportsThisMonth, setPendingReportsThisMonth] = useState(0);
  const [resolvedReportsThisMonth, setResolvedReportsThisMonth] = useState(0);

  // Fetch summary statistics
  const fetchSummary = async () => {
    try {
      const { data: totalData, error: totalError } = await supabase
        .from("tbl_reports")
        .select("report_id", { count: "exact" });

      const { data: pendingData, error: pendingError } = await supabase
        .from("tbl_reports")
        .select("report_id", { count: "exact" })
        .eq("status", "pending");

      const { data: resolvedData, error: resolvedError } = await supabase
        .from("tbl_reports")
        .select("report_id", { count: "exact" })
        .eq("status", "resolved");

      const { data: monthData, error: monthError } = await supabase
        .from("tbl_reports")
        .select("report_id", { count: "exact" })
        .gte(
          "created_at",
          new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
          ).toISOString()
        );

      const { data: pendingMonthData, error: pendingMonthError } =
        await supabase
          .from("tbl_reports")
          .select("report_id", { count: "exact" })
          .eq("status", "pending")
          .gte(
            "created_at",
            new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              1
            ).toISOString()
          );

      const { data: resolvedMonthData, error: resolvedMonthError } =
        await supabase
          .from("tbl_reports")
          .select("report_id", { count: "exact" })
          .eq("status", "resolved")
          .gte(
            "created_at",
            new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              1
            ).toISOString()
          );

      if (
        totalError ||
        pendingError ||
        resolvedError ||
        monthError ||
        pendingMonthError ||
        resolvedMonthError
      ) {
        console.error("Error fetching summary statistics");
      } else {
        setTotalReports(totalData?.length || 0);
        setPendingReports(pendingData?.length || 0);
        setResolvedReports(resolvedData?.length || 0);
        setReportsThisMonth(monthData?.length || 0);
        setPendingReportsThisMonth(pendingMonthData?.length || 0);
        setResolvedReportsThisMonth(resolvedMonthData?.length || 0);
      }
    } catch (error) {
      console.error("Unexpected error fetching summary statistics:", error);
    }
  };

  // Fetch reports from the database
  const fetchReports = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("tbl_reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      if (typeFilter !== "all") {
        query = query.eq("type", typeFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching reports:", error);
      } else {
        setReports(data || []);
      }
    } catch (error) {
      console.error("Unexpected error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, typeFilter]);

  // Pagination logic
  const totalPages = Math.ceil(reports.length / itemsPerPage);
  const paginatedReports = reports.slice(
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
    <div className="px-12 py-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Total Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalReports}</p>
            <p className="text-sm text-muted-foreground">
              +{reportsThisMonth} this month
            </p>
          </CardContent>
        </Card>

        {/* Pending Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{pendingReports}</p>
            <p className="text-sm text-muted-foreground">
              +{pendingReportsThisMonth} this month
            </p>
          </CardContent>
        </Card>

        {/* Resolved Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Resolved Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{resolvedReports}</p>
            <p className="text-sm text-muted-foreground">
              +{resolvedReportsThisMonth} this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Reports Management</h2>
        <div className="flex items-center gap-2">
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reports</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="seen">Seen</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={typeFilter}
            onValueChange={(value) => setTypeFilter(value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="bug">Bug</SelectItem>
              <SelectItem value="problem mistake">Problem Mistake</SelectItem>
              <SelectItem value="incorrect answer">Incorrect Answer</SelectItem>
              <SelectItem value="suggestions">Suggestions</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reports Table */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedReports.length > 0 ? (
                paginatedReports.map((report) => (
                  <TableRow key={report.report_id} className="h-12">
                    <TableCell>
                      <Badge variant="outline">{report.type}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {report.title}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          report.status === "pending"
                            ? "outline"
                            : report.status === "resolved"
                            ? "default"
                            : report.status === "rejected"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(report.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    No reports found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to{" "}
          <strong>
            {Math.min(currentPage * itemsPerPage, reports.length)}
          </strong>{" "}
          of <strong>{reports.length}</strong> reports
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </Button>
          {renderPagination()}
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
    </div>
  );
}