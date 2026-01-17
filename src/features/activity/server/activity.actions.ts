
import { createClient } from "@/utils/supabase/server";
import {
  ActivityType,
  EntityType,
  ActivityMeta,
} from "@/features/activity/types/activity";

export async function logActivity({
  groupId,
  actorId,
  activityType,
  entityType,
  entityId,
  targetUserId,
  meta,
}: {
  groupId: string;
  actorId: string;
  activityType: ActivityType;
  entityType: EntityType;
  entityId: string;
  targetUserId?: string | null;
  meta: ActivityMeta;
}) {
  const supabase = await createClient();

  const { error } = await supabase.from("activity").insert({
    group_id: groupId,
    actor_id: actorId,
    activity_type: activityType,
    entity_type: entityType,
    entity_id: entityId,
    target_user_id: targetUserId || null,
    meta: meta as Record<string, unknown>,
  });

  if (error) {
    // Log error but don't throw - activity logging shouldn't break main flow
    console.error("Failed to log activity:", error);
  }
}
