"use client";

import { useActivities } from "../hooks/useActivities";
import { formatActivityMessage } from "../utils/formatActivityMessage";
import { Activity } from "@/features/activity/types/activity";

export function ActivityLog({ groupId }: { groupId: string }) {
  const { activities, isLoading } = useActivities(groupId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Loading activity log...</p>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">No activity yet</p>
      </div>
    );
  }

  // Group activities by date
  const grouped = activities.reduce((acc, activity) => {
    const date = new Date(activity.created_at).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([date, dateActivities]) => (
        <div key={date}>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            {formatDateGroup(date)}
          </h3>
          <div className="space-y-2">
            {dateActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="text-sm">{formatActivityMessage(activity)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatRelativeTime(activity.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function formatDateGroup(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60)
    return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
  if (diffHours < 24)
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  if (diffDays < 7)
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

