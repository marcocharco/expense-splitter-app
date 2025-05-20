import { createClient } from "@/utils/supabase/client";

export async function getUserGroups() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("group_member")
    .select("group:group_id(id, name, slug, members:profile(id, name))")
    .eq("user_id", user?.id);

  // console.log(data?.map((gm) => gm.group));

  if (error) throw new Error(error.message);
  return data.map((gm) => gm.group) ?? [];
}
