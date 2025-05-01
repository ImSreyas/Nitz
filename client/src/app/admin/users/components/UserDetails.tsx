import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { type User } from "@/lib/types/admin";

type UserDetailsProps = {
  state: {
    isDialogOpen: boolean;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  };
  selectedUser: User | null;
};

export default function UserDetails({
  state: { isDialogOpen, setIsDialogOpen },
  selectedUser,
}: UserDetailsProps) {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-h-[80vh] overflow-y-scroll no-scrollbar max-w-xl">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogClose />
        </DialogHeader>
        {selectedUser && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Username */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Username
              </h3>
              <p className="text-base font-semibold">{selectedUser.username}</p>
            </div>

            {/* Name */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Name
              </h3>
              <p className="text-base font-semibold">
                {selectedUser.name || "N/A"}
              </p>
            </div>

            {/* Email */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Email
              </h3>
              <p className="text-base font-semibold">
                {selectedUser.email || "N/A"}
              </p>
            </div>

            {/* Tier */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Tier
              </h3>
              <div>{selectedUser.tier_name}</div>
            </div>

            {/* Points */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Points
              </h3>
              <p className="text-base font-semibold">{selectedUser.points}</p>
            </div>

            {/* Black Points */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Black Points
              </h3>
              <p className="text-base font-semibold">
                {selectedUser.blackpoints}
              </p>
            </div>

            {/* Points Today */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Points Today
              </h3>
              <p className="text-base font-semibold">
                {selectedUser.points_today}
              </p>
            </div>

            {/* Points This Week */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Points This Week
              </h3>
              <p className="text-base font-semibold">
                {selectedUser.points_this_week}
              </p>
            </div>

            {/* Points This Month */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Points This Month
              </h3>
              <p className="text-base font-semibold">
                {selectedUser.points_this_month}
              </p>
            </div>

            {/* Points This Year */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Points This Year
              </h3>
              <p className="text-base font-semibold">
                {selectedUser.points_this_year}
              </p>
            </div>

            {/* Status */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Status
              </h3>
              <div className="text-base">
                {selectedUser.is_active ? "Active" : "Inactive"}
              </div>
            </div>

            {/* Completed Matches */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Completed Matches
              </h3>
              <p className="text-base font-semibold">
                {selectedUser.completed_1vs1_matches}
              </p>
            </div>

            {/* Completed Problems */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Completed Problems
              </h3>
              <p className="text-base font-semibold">
                {selectedUser.completed_problems}
              </p>
            </div>

            {/* Join Date */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Join Date
              </h3>
              <p className="text-base font-semibold">
                {new Date(selectedUser.created_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
