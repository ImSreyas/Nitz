import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect } from "react";
import { updateUser } from "@/lib/api/admin"; // Import the updateUser API

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
  tier_name: string; // e.g., "silver", "gold"
  is_active: boolean;
  completed_1vs1_matches: number;
  completed_problems: number;
  created_at: string; // ISO timestamp
};

export default function UpdateUser({
  isEditDialogOpen,
  setIsEditDialogOpen,
  selectedUser,
  onUserUpdated,
}: {
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedUser: User | null;
  onUserUpdated: () => void;
}) {
  // Zod schema for validation
  const editUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    username: z.string().min(1, "Username is required"),
    blackpoints: z
      .number()
      .min(0, "Blackpoints must be a non-negative number")
      .optional(),
  });

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof editUserSchema>>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      blackpoints: 0,
    },
  });

  // Pre-fill form fields when the dialog opens
  useEffect(() => {
    if (selectedUser) {
      setValue("name", selectedUser.name || "");
      setValue("email", selectedUser.email || "");
      setValue("username", selectedUser.username || "");
      setValue("blackpoints", selectedUser.blackpoints || 0);
    }
  }, [selectedUser, setValue]);

  // Submit handler
  const onSubmit = async (data: z.infer<typeof editUserSchema>) => {
    if (selectedUser) {
      try {
        const response = await updateUser(selectedUser.id, data); // Call the updateUser API
        if (response.data.success) toast.success("User updated successfully!");
        onUserUpdated();
        setIsEditDialogOpen(false);
      } catch (error) {
        toast.error("Failed to update user. Please try again.");
        console.error("Error updating user:", error);
      }
    }
  };

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="max-h-[80vh] overflow-y-scroll no-scrollbar max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit User Details</DialogTitle>
          <DialogClose />
        </DialogHeader>
        {selectedUser && (
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
                defaultValue={selectedUser.username}
                className="w-full mt-1"
                disabled
              />
            </div>

            {/* Name */}
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Enter name"
                defaultValue={selectedUser.name || ""}
                className="w-full mt-1"
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Blackpoints */}
            <div>
              <Label htmlFor="blackpoints">Blackpoints</Label>
              <Input
                id="blackpoints"
                type="number"
                {...register("blackpoints", { valueAsNumber: true })}
                placeholder="Enter blackpoints"
                defaultValue={selectedUser.blackpoints || 0}
                className="w-full mt-1"
              />
              {errors.blackpoints && (
                <p className="text-sm text-destructive mt-1">
                  {errors.blackpoints.message}
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
                defaultValue={selectedUser.email || ""}
                className="w-full mt-1"
                disabled
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
                Update User
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
