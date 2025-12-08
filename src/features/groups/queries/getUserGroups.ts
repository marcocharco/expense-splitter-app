import { Group } from "@/features/groups/types/group";
import { createClient } from "@/utils/supabase/client";

export async function getUserGroups() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is not authenticated, return empty array
  if (!user?.id) {
    return [] as Group[];
  }

  const { data, error } = await supabase
    .from("group_member")
    .select("group:group_id(id, name, slug, members:profile(id, name))")
    .eq("user_id", user?.id);

  // TODO: Sort by most recent update

  if (error) throw new Error(error.message);
  return (data ?? []).flatMap((gm) => gm.group) as Group[];
}
