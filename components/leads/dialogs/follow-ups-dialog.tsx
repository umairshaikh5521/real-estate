"use client";

/**
 * Follow-ups Dialog Component
 * Apple-inspired design - Simple, Clear, Elegant
 * Shows latest follow-up + allows updates/new follow-ups
 */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  Phone,
  Mail,
  MessageSquare,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Check,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  useFollowUps,
  useCreateFollowUp,
  useUpdateFollowUp,
} from "@/hooks/use-leads";
import type { FollowUp } from "@/types/follow-ups";

interface FollowUpsDialogProps {
  leadId: string;
  leadName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const followUpSchema = z.object({
  scheduledDate: z.date(),
  scheduledTime: z.string().min(1, "Time is required"),
  type: z.enum(["call", "meeting", "email", "whatsapp"]),
  notes: z.string().optional(),
  reminder: z.boolean(),
});

type FollowUpFormData = z.infer<typeof followUpSchema>;

export function FollowUpsDialog({
  leadId,
  leadName,
  open,
  onOpenChange,
}: FollowUpsDialogProps) {
  const [mode, setMode] = useState<"view" | "new">("view");
  const [showAllFollowUps, setShowAllFollowUps] = useState(false);

  const { data: followUpsData } = useFollowUps(leadId);
  const createFollowUp = useCreateFollowUp();
  const updateFollowUp = useUpdateFollowUp();

  const followUps = followUpsData?.data?.followUps || [];
  const latestFollowUp = followUps[0];

  const form = useForm<FollowUpFormData>({
    resolver: zodResolver(followUpSchema),
    defaultValues: {
      scheduledDate: undefined,
      scheduledTime: "",
      type: "call",
      reminder: true,
      notes: "",
    },
  });

  // Reset to view mode when dialog opens
  useEffect(() => {
    if (open) {
      setMode("view");
      form.reset();
    }
  }, [open, form]);

  const onSubmit = async (data: FollowUpFormData) => {
    const [hours, minutes] = data.scheduledTime.split(":");
    const scheduledDate = new Date(data.scheduledDate);
    scheduledDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    await createFollowUp.mutateAsync({
      leadId,
      data: {
        type: data.type,
        scheduledAt: scheduledDate.toISOString(),
        notes: data.notes || "",
        reminder: data.reminder,
      },
    });

    form.reset();
    setMode("view");
  };

  const handleMarkComplete = async (followUp: FollowUp) => {
    await updateFollowUp.mutateAsync({
      followUpId: followUp.id,
      leadId,
      data: { status: "completed" },
    });
  };

  const handleCancel = async (followUp: FollowUp) => {
    await updateFollowUp.mutateAsync({
      followUpId: followUp.id,
      leadId,
      data: { status: "cancelled" },
    });
  };

  const getFollowUpIcon = (type: string) => {
    const iconProps = { className: "h-5 w-5" };
    switch (type) {
      case "call":
        return <Phone {...iconProps} />;
      case "meeting":
        return <CalendarIcon {...iconProps} />;
      case "email":
        return <Mail {...iconProps} />;
      case "whatsapp":
        return <MessageSquare {...iconProps} />;
      default:
        return <Clock {...iconProps} />;
    }
  };

  const getStatusBadge = (followUp: FollowUp) => {
    if (followUp.status === "completed") {
      return <Badge className="bg-green-500/10 text-green-700 border-green-200">Completed</Badge>;
    }
    if (followUp.status === "cancelled") {
      return <Badge variant="outline" className="text-gray-500">Cancelled</Badge>;
    }

    const scheduledDate = new Date(followUp.scheduledAt);
    const now = new Date();

    if (scheduledDate < now) {
      return <Badge className="bg-red-500/10 text-red-700 border-red-200">Overdue</Badge>;
    }
    return <Badge className="bg-amber-500/10 text-amber-700 border-amber-200">Pending</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold">
            Follow-ups
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {leadName}
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-4">
          {/* Latest Follow-up Section */}
          {latestFollowUp && mode === "view" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Latest Follow-up
                </h3>
              </div>

              <div className="rounded-lg border bg-card p-6 space-y-4">
                {/* Follow-up Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-3 rounded-full",
                      latestFollowUp.status === "completed" 
                        ? "bg-green-500/10" 
                        : latestFollowUp.status === "cancelled"
                        ? "bg-gray-500/10"
                        : "bg-blue-500/10"
                    )}>
                      {getFollowUpIcon(latestFollowUp.type)}
                    </div>
                    <div>
                      <p className="font-medium capitalize">
                        {latestFollowUp.type} Follow-up
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(latestFollowUp.scheduledAt), "PPp")}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(latestFollowUp)}
                </div>

                {/* Notes */}
                {latestFollowUp.notes && (
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Notes</Label>
                    <p className="text-sm bg-muted/50 rounded-md p-3">
                      {latestFollowUp.notes}
                    </p>
                  </div>
                )}

                {/* Actions - Only show for pending/overdue */}
                {latestFollowUp.status === "pending" && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => handleMarkComplete(latestFollowUp)}
                      disabled={updateFollowUp.isPending}
                      className="flex-1"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Mark Complete
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCancel(latestFollowUp)}
                      disabled={updateFollowUp.isPending}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Previous Follow-ups */}
          {followUps.length > 1 && mode === "view" && (
            <div className="space-y-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllFollowUps(!showAllFollowUps)}
                className="w-full justify-between text-muted-foreground hover:text-foreground"
              >
                <span className="text-sm font-medium">
                  Previous Follow-ups ({followUps.length - 1})
                </span>
                {showAllFollowUps ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>

              {showAllFollowUps && (
                <div className="space-y-3">
                  {followUps.slice(1).map((followUp) => (
                    <div
                      key={followUp.id}
                      className="rounded-md border bg-muted/30 p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-full bg-background">
                            {getFollowUpIcon(followUp.type)}
                          </div>
                          <div>
                            <p className="text-sm font-medium capitalize">
                              {followUp.type}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(followUp.scheduledAt), "PP")}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(followUp)}
                      </div>
                      {followUp.notes && (
                        <p className="text-xs text-muted-foreground bg-background rounded p-2">
                          {followUp.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* No Follow-ups */}
          {followUps.length === 0 && mode === "view" && (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="text-sm">No follow-ups scheduled yet</p>
              <p className="text-xs mt-1">Add your first follow-up below</p>
            </div>
          )}

          {/* Separator */}
          {mode === "view" && <Separator />}

          {/* New Follow-up Form */}
          {mode === "new" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2">
                <h3 className="text-base font-semibold">New Follow-up</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setMode("view");
                    form.reset();
                  }}
                  className="h-8 text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </Button>
              </div>

              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Type */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Type</Label>
                  <Select
                    value={form.watch("type")}
                    onValueChange={(value: "call" | "meeting" | "email" | "whatsapp") =>
                      form.setValue("type", value)
                    }
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="call">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>Call</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="meeting">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          <span>Meeting</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="email">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>Email</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="whatsapp">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          <span>WhatsApp</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full h-10 justify-start text-left font-normal shadow-none hover:shadow-none",
                            !form.watch("scheduledDate") && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {form.watch("scheduledDate") ? (
                            format(form.watch("scheduledDate"), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={form.watch("scheduledDate")}
                          onSelect={(date) => form.setValue("scheduledDate", date as Date)}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Time</Label>
                    <Input
                      type="time"
                      {...form.register("scheduledTime")}
                      className="w-full h-10"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Notes (Optional)</Label>
                  <Textarea
                    {...form.register("notes")}
                    placeholder="Add any additional details..."
                    rows={4}
                    className="resize-none"
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full h-10"
                  disabled={createFollowUp.isPending}
                >
                  {createFollowUp.isPending ? "Scheduling..." : "Schedule Follow-up"}
                </Button>
              </form>
            </div>
          )}
        </div>

        {/* Footer - Add New Button */}
        {mode === "view" && (
          <div className="pt-4 border-t">
            <Button
              onClick={() => setMode("new")}
              className="w-full h-10"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Follow-up
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
