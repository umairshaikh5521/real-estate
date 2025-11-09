"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUpload } from "./file-upload";
import { Project } from "@/types";

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  type: z.string().min(1, "Please select a project type"),
  totalUnits: z.number().min(1, "Total units must be at least 1"),
  status: z.string().min(1, "Please select a status"),
  completion: z.string().min(1, "Completion date is required"),
  address: z.string().min(1, "Address is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(1, "Pincode is required"),
  image: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface AddProjectDialogProps {
  children: React.ReactNode;
  onProjectAdd?: (
    project: Omit<Project, "id" | "soldUnits" | "unitStatus">
  ) => void;
}

export function AddProjectDialog({
  children,
  onProjectAdd,
}: AddProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      type: "",
      totalUnits: 0,
      status: "",
      completion: "",
      address: "",
      state: "",
      pincode: "",
      image: "",
    },
  });

  const watchedStatus = form.watch("status");

  const onSubmit = async (data: ProjectFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Process the form data to match the Project type
      const processedData = {
        name: data.name,
        location: data.address, // Use address as location
        developer: "TBD", // Default developer
        type: data.type as Project["type"],
        status: data.status as Project["status"],
        totalUnits: data.totalUnits,
        availableUnits: data.totalUnits, // Default available units to total units
        priceRange: "TBD", // Default price range
        completion: 0, // Default completion to 0
        expectedCompletion: data.completion, // Use completion date as expected completion
        amenities: [], // Default empty amenities
        image: data.image || "/placeholder-project.jpg",
      };

      onProjectAdd?.(processedData);
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error adding project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Project Name - Full Width */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Project Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type and Total Units - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Apartment" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Apartment">Apartment</SelectItem>
                        <SelectItem value="Condos">Condos</SelectItem>
                        <SelectItem value="Plots">Plots</SelectItem>
                        <SelectItem value="Bungalows">Bungalows</SelectItem>
                        <SelectItem value="Townhouse">Townhouse</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalUnits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Units</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1001"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status and Completion - Side by Side */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Under Construction" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Upcoming">Upcoming</SelectItem>
                        <SelectItem value="Under Construction">
                          Under Construction
                        </SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="completion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {watchedStatus === "Completed"
                        ? "Completed on"
                        : "Completion"}
                    </FormLabel>
                    <FormControl>
                      <Input type="date" placeholder="30 Jul 2026" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address - Full Width */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Project Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* State and Pincode - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="Maharashtra" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode</FormLabel>
                    <FormControl>
                      <Input placeholder="411019" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* File Upload */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FileUpload
                      value={field.value}
                      onChange={field.onChange}
                      accept="image/*"
                      maxSize={10 * 1024 * 1024} // 10MB
                      placeholder="Upload an image here"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Buttons */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="secondary"
                size={"lg"}
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size={"lg"}
                variant={"accent"}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
