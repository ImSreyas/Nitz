import { User } from "@/lib/types/admin";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const exportUsersToCSV = (users: User[]) => {
  const csvHeaders = [
    "ID",
    "Username",
    "Name",
    "Email",
    "Tier",
    "Points",
    "Black Points",
    "Status",
    "Join Date",
  ];
  const csvRows = users.map((user) => [
    user.id,
    user.username,
    user.name || "N/A",
    user.email || "N/A",
    user.tier_name,
    user.points,
    user.blackpoints,
    user.is_active ? "Active" : "Inactive",
    new Date(user.created_at).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
  ]);

  const csvContent = [
    csvHeaders.join(","),
    ...csvRows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "users.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
