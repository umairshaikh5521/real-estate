"use client";

/**
 * Activity Timeline Component
 * Shows chronological activity history for a lead
 */

import { format, formatDistanceToNow } from "date-fns";
import {
  Clock,
  User,
  Phone,
  Calendar,
  Mail,
  MessageSquare,
  CheckCircle,
  Edit,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useActivities, useFollowUps } from "@/hooks/use-leads";
import type { Activity } from "@/types/activities";
import type { FollowUp } from "@/types/follow-ups";
import { cn } from "@/lib/utils";

interface ActivityTimelineProps {
  leadId: string;
}

export function ActivityTimeline({ leadId }: ActivityTimelineProps) {
  const { data: activitiesData, isLoading: activitiesLoading } = useActivities(leadId);
  const { data: followUpsData, isLoading: followUpsLoading } = useFollowUps(leadId);

  const activities = activitiesData?.data?.activities || [];
  const followUps = followUpsData?.data?.followUps || [];

  const isLoading = activitiesLoading || followUpsLoading;

  // Get activity icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "lead_created":
        return <User className="h-4 w-4" />;
      case "lead_updated":
        return <Edit className="h-4 w-4" />;
      case "follow_up_scheduled":
        return <Calendar className="h-4 w-4" />;
      case "follow_up_completed":
        return <CheckCircle className="h-4 w-4" />;
      case "status_changed":
        return <FileText className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Get activity color
  const getActivityColor = (type: string) => {
    switch (type) {
      case "lead_created":
        return "bg-blue-500";
      case "lead_updated":
        return "bg-purple-500";
      case "follow_up_scheduled":
        return "bg-yellow-500";
      case "follow_up_completed":
        return "bg-green-500";
      case "status_changed":
        return "bg-indigo-500";
      default:
        return "bg-gray-500";
    }
  };

  // Get follow-up icon
  const getFollowUpIcon = (type: string) => {
    switch (type) {
      case "call":
        return <Phone className="h-4 w-4" />;
      case "meeting":
        return <User className="h-4 w-4" />;
      case "email":
        return <Mail className="h-4 w-4" />;
      case "whatsapp":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getFollowUpStatus = (followUp: FollowUp) => {
    if (followUp.status === "completed") {
      return { label: "Completed", color: "badge-green" };
    }
    if (followUp.status === "cancelled") {
      return { label: "Cancelled", color: "badge-red" };
    }
    
    const scheduledDate = new Date(followUp.scheduledAt);
    const now = new Date();
    
    if (scheduledDate < now) {
      return { label: "Overdue", color: "badge-red" };
    }
    return { label: "Pending", color: "badge-yellow" };
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Combine activities and follow-ups
  const timelineItems = [
    ...activities.map((activity) => ({
      type: "activity" as const,
      data: activity,
      timestamp: new Date(activity.createdAt),
    })),
    ...followUps.map((followUp) => ({
      type: "followup" as const,
      data: followUp,
      timestamp: new Date(followUp.scheduledAt),
    })),
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Activity Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        {timelineItems.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No activities yet</p>
          </div>
        ) : (
          <div className="relative space-y-6">
            {/* Vertical line */}
            <div className="absolute left-5 top-5 bottom-5 w-px bg-border" />

            {timelineItems.map((item) => {
              if (item.type === "activity") {
                const activity = item.data as Activity;
                return (
                  <div key={`activity-${activity.id}`} className="relative flex gap-4">
                    {/* Icon */}
                    <div
                      className={cn(
                        "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white",
                        getActivityColor(activity.activityType)
                      )}
                    >
                      {getActivityIcon(activity.activityType)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-1 pt-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {activity.user && (
                          <span className="font-medium">{activity.user.fullName}</span>
                        )}
                        <span>•</span>
                        <span title={format(new Date(activity.createdAt), "PPpp")}>
                          {formatDistanceToNow(new Date(activity.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              } else {
                const followUp = item.data as FollowUp;
                const status = getFollowUpStatus(followUp);
                return (
                  <div key={`followup-${followUp.id}`} className="relative flex gap-4">
                    {/* Icon */}
                    <div
                      className={cn(
                        "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                        followUp.status === "completed"
                          ? "bg-green-500 text-white"
                          : followUp.status === "cancelled"
                          ? "bg-gray-400 text-white"
                          : "bg-yellow-500 text-white"
                      )}
                    >
                      {getFollowUpIcon(followUp.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-2 pt-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium capitalize">
                          {followUp.type} Follow-up
                        </p>
                        <Badge variant="outline" className={cn("text-xs", status.color)}>
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {followUp.status === "completed" ? "Completed" : "Scheduled for"}{" "}
                        {format(new Date(followUp.scheduledAt), "PPp")}
                      </p>
                      {followUp.notes && (
                        <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
                          {followUp.notes}
                        </p>
                      )}
                    </div>
                  </div>
                );
              }
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
