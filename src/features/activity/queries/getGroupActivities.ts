import { createClient } from "@/utils/supabase/client";
import { Activity } from "@/features/activity/types/activity";

export async function getGroupActivities(groupId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("activity")
    .select(
      `
      id,
      group_id,
      actor_id,
      activity_type,
      entity_type,
      entity_id,
      target_user_id,
      meta,
      created_at,
      actor:profile!actor_id(id, name)
    `
    )
    .eq("group_id", groupId)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw new Error(error.message);

  return (data as Activity[]) ?? [];
}

