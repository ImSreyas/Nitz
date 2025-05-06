import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, FileText, Shield, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getDashboardData } from "@/lib/api/admin";
import { toast } from "sonner";

export default function Overview() {
  const [dashboardData, setDashboardData] = useState<{
    totalUsers: number;
    totalModerators: number;
    totalProblems: number;
    totalReports: number;
    currentMonth: {
      users: number;
      moderators: number;
      problems: number;
      reports: number;
    };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getDashboardData();
        if (response && response.data.success)
          setDashboardData(response.data.data);
        else toast.error("Error fetching dashboard data");
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 px-10">
        {/* Total Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "Loading..." : dashboardData?.totalUsers || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              +{dashboardData?.currentMonth.users || 0} this month
            </p>
          </CardContent>
        </Card>

        {/* Total Moderators */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Moderators
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "Loading..." : dashboardData?.totalModerators || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              +{dashboardData?.currentMonth.moderators || 0} this month
            </p>
          </CardContent>
        </Card>

        {/* Total Problems */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Problems
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "Loading..." : dashboardData?.totalProblems || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              +{dashboardData?.currentMonth.problems || 0} this month
            </p>
          </CardContent>
        </Card>

        {/* Total Reports */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "Loading..." : dashboardData?.totalReports || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              +{dashboardData?.currentMonth.reports || 0} this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder for charts */}
      {/* <div className="grid grid-cols-3 mt-6 gap-4">
        <UserChart />
        <ModeratorChart />
      </div> */}
    </div>
  );
}
