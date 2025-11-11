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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateProject } from "@/hooks/use-projects";
import { uploadFile, generateFilePath } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import { FileUpload } from "./file-upload";

const projectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters"),
  location: z.string().min(2, "Location is required"),
  description: z.string().optional(),
  type: z.string().min(1, "Please select a project type"),
  totalUnits: z.number().min(1, "Total units must be at least 1"),
  availableUnits: z.number().min(0, "Available units cannot be negative"),
  status: z.enum(["planning", "active", "completed", "on-hold"]),
  priceRangeMin: z.string().optional(),
  priceRangeMax: z.string().optional(),
  amenities: z.string().optional(),
  image: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface AddProjectDialogProps {
  children: React.ReactNode;
}

export function AddProjectDialog({ children }: AddProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const createProject = useCreateProject();

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      location: "",
      description: "",
      type: "",
      totalUnits: 0,
      availableUnits: 0,
      status: "planning",
      priceRangeMin: "",
      priceRangeMax: "",
      amenities: "",
      image: "",
    },
  });

  const onSubmit = async (data: ProjectFormData) => {
    setIsUploading(true);
    try {
      // Upload image to Supabase Storage if provided
      let imageUrl: string | undefined = undefined;
      
      if (data.image && data.image.startsWith("blob:")) {
        // Convert blob URL to file and upload
        const response = await fetch(data.image);
        const blob = await response.blob();
        const file = new File([blob], "project-image.jpg", { type: blob.type });
        
        const filePath = generateFilePath(file.name);
        imageUrl = await uploadFile("project-images", filePath, file);
      }

      // Parse amenities from comma-separated string
      const amenitiesArray = data.amenities
        ? data.amenities.split(",").map((a) => a.trim()).filter(Boolean)
        : [];

      // Create project via API
      await createProject.mutateAsync({
        name: data.name,
        location: data.location,
        description: data.description || undefined,
        status: data.status,
        totalUnits: data.totalUnits,
        availableUnits: data.availableUnits,
        priceRangeMin: data.priceRangeMin || undefined,
        priceRangeMax: data.priceRangeMax || undefined,
        images: imageUrl ? [imageUrl] : undefined,
        amenities: amenitiesArray.length > 0 ? amenitiesArray : undefined,
      });

      // Reset form and close dialog
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const isLoading = createProject.isPending || isUploading;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Project Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Green Valley Residency" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location *</FormLabel>
                  <FormControl>
                    <Input placeholder="Baner, Pune" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the project..."
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type and Status - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Apartments">Apartments</SelectItem>
                        <SelectItem value="Condos">Condos</SelectItem>
                        <SelectItem value="Plots">Plots</SelectItem>
                        <SelectItem value="Villas">Villas</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="on-hold">On Hold</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Total Units and Available Units - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="totalUnits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Units *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="100"
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

              <FormField
                control={form.control}
                name="availableUnits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Units *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="80"
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
            </div>

            {/* Price Range - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priceRangeMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Price (₹)</FormLabel>
                    <FormControl>
                      <Input placeholder="5000000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priceRangeMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Price (₹)</FormLabel>
                    <FormControl>
                      <Input placeholder="10000000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Amenities */}
            <FormField
              control={form.control}
              name="amenities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amenities</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Gym, Pool, Parking (comma-separated)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Image</FormLabel>
                  <FormControl>
                    <FileUpload
                      value={field.value}
                      onChange={field.onChange}
                      accept="image/*"
                      maxSize={5 * 1024 * 1024} // 5MB
                      placeholder="Upload project image"
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
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
