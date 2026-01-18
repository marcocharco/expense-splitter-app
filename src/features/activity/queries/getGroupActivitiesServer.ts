import { createClient } from "@/utils/supabase/server";
import { Activity } from "@/features/activity/types/activity";

export async function getGroupActivities(groupId: string) {
  const supabase = await createClient();

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

  type RawActivityResponse = Omit<Activity, "actor"> & {
    actor: { id: string; name: string } | { id: string; name: string }[] | null;
  };

  const activities = (data as RawActivityResponse[])?.map((activity) => ({
    ...activity,
    actor: Array.isArray(activity.actor) ? activity.actor[0] : activity.actor,
  }));

  return (activities as Activity[]) ?? [];
}
