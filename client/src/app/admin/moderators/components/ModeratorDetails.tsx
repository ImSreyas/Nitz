import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Moderator } from "@/lib/types/admin";

type ModeratorDetailsProps = {
  state: {
    isDialogOpen: boolean;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  };
  selectedModerator: Moderator | null;
};

export default function ModeratorDetails({
  state: { isDialogOpen, setIsDialogOpen },
  selectedModerator,
}: ModeratorDetailsProps) {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-h-[80vh] overflow-y-scroll no-scrollbar max-w-xl">
        <DialogHeader>
          <DialogTitle>Moderator Details</DialogTitle>
          <DialogClose />
        </DialogHeader>
        {selectedModerator && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Username */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Username
              </h3>
              <p className="text-base font-semibold">
                {selectedModerator.username}
              </p>
            </div>

            {/* Name */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Name
              </h3>
              <p className="text-base font-semibold">
                {selectedModerator.name || "N/A"}
              </p>
            </div>

            {/* Email */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Email
              </h3>
              <p className="text-base font-semibold">
                {selectedModerator.email || "N/A"}
              </p>
            </div>

            {/* Permission */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Permission
              </h3>
              <p className="text-base font-semibold">
                {selectedModerator.permission}
              </p>
            </div>

            {/* Problems Added */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Problems Added
              </h3>
              <p className="text-base font-semibold">
                {selectedModerator.problems_added}
              </p>
            </div>

            {/* Black Points */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Black Points
              </h3>
              <p className="text-base font-semibold">
                {selectedModerator.blackpoints}
              </p>
            </div>

            {/* Join Date */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Join Date
              </h3>
              <p className="text-base font-semibold">
                {new Date(selectedModerator.created_at).toLocaleDateString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }
                )}
              </p>
            </div>

            {/* Blocked Status */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Blocked
              </h3>
              <p className="text-base font-semibold">
                {selectedModerator.is_blocked ? "Yes" : "No"}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
