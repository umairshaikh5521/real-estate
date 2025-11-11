"use client";

/**
 * Add Lead Dialog Component
 * Form to add a new lead
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateLead } from "@/hooks/use-leads";

const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  source: z.string().optional(),
  budget: z.string().optional(),
  notes: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface AddLeadDialogProps {
  children: React.ReactNode;
}

export function AddLeadDialog({ children }: AddLeadDialogProps) {
  const [open, setOpen] = useState(false);
  const createLead = useCreateLead();

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      source: "",
      budget: "",
      notes: "",
    },
  });

  const onSubmit = async (data: LeadFormData) => {
    try {
      await createLead.mutateAsync({
        name: data.name,
        email: data.email || undefined,
        phone: data.phone,
        budget: data.budget ? parseFloat(data.budget) : undefined,
        notes: data.notes || undefined,
      });

      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Failed to create lead:", error);
      // Error is handled by the hook's onError
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
          <DialogDescription>
            Enter the details of the new lead
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Name *</Label>
            <Input
              {...form.register("name")}
              placeholder="Enter lead name"
              className="h-10"
            />
            {form.formState.errors.name && (
              <p className="text-xs text-red-600">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Phone *</Label>
            <Input
              {...form.register("phone")}
              placeholder="+91 98765 43210"
              className="h-10"
            />
            {form.formState.errors.phone && (
              <p className="text-xs text-red-600">
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Email</Label>
            <Input
              {...form.register("email")}
              type="email"
              placeholder="email@example.com"
              className="h-10"
            />
            {form.formState.errors.email && (
              <p className="text-xs text-red-600">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Source */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Source</Label>
            <Select
              value={form.watch("source")}
              onValueChange={(value) => form.setValue("source", value)}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="social_media">Social Media</SelectItem>
                <SelectItem value="walk_in">Walk-in</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Budget (₹)</Label>
            <Input
              {...form.register("budget")}
              type="number"
              placeholder="5000000"
              className="h-10"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Notes</Label>
            <Textarea
              {...form.register("notes")}
              placeholder="Add any additional notes..."
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 h-10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createLead.isPending}
              className="flex-1 h-10"
            >
              {createLead.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Lead"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
