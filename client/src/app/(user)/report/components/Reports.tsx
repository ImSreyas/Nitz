"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

// Zod schema for form validation
const reportSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.string().min(1, "Type is required"),
  content: z.string().min(1, "Content is required"),
});

type ReportFormValues = z.infer<typeof reportSchema>;

interface Report {
  report_id: string;
  title: string;
  content: string;
  type: string;
  status: string;
  priority: number;
  created_at: string;
}

export default function Reports() {
  const supabase = createClient();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: "",
      type: "bug",
      content: "",
    },
  });

  // Fetch reports for the current user
  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      const userId = user?.user?.id;

      if (!userId) {
        toast.error("User not authenticated");
        return;
      }

      const { data: reportsData, error } = await supabase
        .from("tbl_reports")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Error fetching reports");
      } else {
        setReports(reportsData || []);
      }
    } catch {
      toast.error("Unexpected error fetching reports");
    } finally {
      setLoading(false);
    }
  };

  // Add a new report
  const addReport = async (data: ReportFormValues) => {
    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      const userId = user?.user?.id;

      if (!userId) {
        toast.error("User not authenticated");
        return;
      }

      const { error } = await supabase.from("tbl_reports").insert({
        title: data.title,
        content: data.content,
        type: data.type,
        user_id: userId,
      });

      if (error) {
        toast.error("Error adding report");
      } else {
        toast.success("Report added successfully");
        reset(); // Reset the form
        fetchReports(); // Refresh the reports list
      }
    } catch {
      toast.error("Unexpected error adding report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mx-auto px-16 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Create New Report */}
      <div className="col-span-1">
        <div className="border rounded-lg p-6 bg-card shadow-md">
          <h2 className="text-xl font-bold mb-4">Create New Report</h2>
          <form onSubmit={handleSubmit(addReport)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input
                type="text"
                placeholder="Enter report title"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <Select
                value={undefined}
                defaultValue="bug"
                onValueChange={(value) =>
                  reset({ ...getValues(), type: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">Bug</SelectItem>
                  <SelectItem value="problem mistake">
                    Problem Mistake
                  </SelectItem>
                  <SelectItem value="incorrect answer">
                    Incorrect Answer
                  </SelectItem>
                  <SelectItem value="suggestions">Suggestions</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.type.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Content</label>
              <Textarea
                placeholder="Enter report content"
                {...register("content")}
                rows={8}
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.content.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full !mt-5"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                "Submit Report"
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Existing Reports */}
      <div className="col-span-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          {loading ? (
            <div className="col-span-full flex justify-center items-center">
              <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
            </div>
          ) : reports.length > 0 ? (
            reports.map((report) => (
              <Card key={report.report_id} className="border shadow-md h-fit">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">
                    {report.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Type: {report.type}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    Status: {report.status}
                  </p>
                  <p className="text-sm text-muted-foreground mt-4">
                    {report.content}
                  </p>
                  <p className="text-xs text-muted-foreground mt-4">
                    Created At: {new Date(report.created_at).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="flex items-center justify-center col-span-full text-center text-muted-foreground bg-card rounded-lg h-full">
              <div>No reports found.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
