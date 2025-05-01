import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Moderator } from "@/lib/types/admin";
import { toast } from "sonner";
import { updateModerator } from "@/lib/api/admin"; 

const editModeratorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(1, "Username is required"),
  blackpoints: z
    .number()
    .min(0, "Blackpoints must be a non-negative number")
    .optional(),
});

export default function UpdateModerator({
  isEditDialogOpen,
  setIsEditDialogOpen,
  selectedModerator,
  onModeratorUpdated,
}: {
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedModerator: Moderator | null;
  onModeratorUpdated: () => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof editModeratorSchema>>({
    resolver: zodResolver(editModeratorSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      blackpoints: 0,
    },
  });

  React.useEffect(() => {
    if (selectedModerator) {
      setValue("name", selectedModerator.name || "");
      setValue("email", selectedModerator.email || "");
      setValue("username", selectedModerator.username || "");
      setValue("blackpoints", selectedModerator.blackpoints || 0);
    }
  }, [selectedModerator, setValue]);

  const onSubmit = async (data: z.infer<typeof editModeratorSchema>) => {
    if (selectedModerator) {
      try {
        const response = await updateModerator(selectedModerator.id, data); // Call the updateModerator API
        if (response.data.success) {
          toast.success("Moderator updated successfully!");
          onModeratorUpdated();
          setIsEditDialogOpen(false);
        }
      } catch (error) {
        toast.error("Failed to update moderator. Please try again.");
        console.error("Error updating moderator:", error);
      }
    }
  };

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="max-h-[80vh] overflow-y-scroll no-scrollbar max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Moderator Details</DialogTitle>
          <DialogClose />
        </DialogHeader>
        {selectedModerator && (
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
                defaultValue={selectedModerator.username}
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
                defaultValue={selectedModerator.name || ""}
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
                defaultValue={selectedModerator.blackpoints || 0}
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
                defaultValue={selectedModerator.email || ""}
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
                Update Moderator
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
