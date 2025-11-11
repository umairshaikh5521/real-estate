"use client";

/**
 * Edit Lead Dialog Component
 * Form to edit existing lead
 */

import { useEffect } from "react";
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
import { useUpdateLead } from "@/hooks/use-leads";
import type { Lead } from "@/types/leads";

const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  status: z.string(),
  source: z.string().optional(),
  budget: z.string().optional(),
  notes: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface EditLeadDialogProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: (leadId: string, data: Record<string, unknown>) => Promise<void>;
}

export function EditLeadDialog({
  lead,
  open,
  onOpenChange,
  onUpdate,
}: EditLeadDialogProps) {
  const updateLead = useUpdateLead();

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      status: "new",
      source: "",
      budget: "",
      notes: "",
    },
  });

  // Update form when lead changes
  useEffect(() => {
    if (lead && open) {
      form.reset({
        name: lead.name,
        email: lead.email || "",
        phone: lead.phone,
        status: lead.status,
        source: lead.source || "",
        budget: lead.budget?.toString() || "",
        notes: lead.notes || "",
      });
    }
  }, [lead, open, form]);

  const onSubmit = async (data: LeadFormData) => {
    if (!lead) return;

    // Backend expects budget as string, not number
    const updateData: Record<string, unknown> = {
      name: data.name,
      email: data.email || undefined,
      phone: data.phone,
      status: data.status,
      budget: data.budget || undefined, // Keep as string
      notes: data.notes || undefined,
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    if (onUpdate) {
      await onUpdate(lead.id, updateData);
    } else {
      await updateLead.mutateAsync({
        leadId: lead.id,
        data: updateData as any, // Type assertion needed for flexible update
      });
    }

    onOpenChange(false);
  };

  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Lead</DialogTitle>
          <DialogDescription>
            Update lead information
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
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Status</Label>
            <Select
              value={form.watch("status")}
              onValueChange={(value) => form.setValue("status", value)}
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="negotiation">Negotiation</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
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
              onClick={() => onOpenChange(false)}
              className="flex-1 h-10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateLead.isPending}
              className="flex-1 h-10"
            >
              {updateLead.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Lead"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
