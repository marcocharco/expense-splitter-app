import { createClient } from "@/utils/supabase/server";

export async function getGroupBySlug(slug: string) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("group")
    .select("id, name, slug, members:profile(id, name)")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  // console.log("Get group data by slug: ", data);

  // Sort members to put current user first
  if (data && data.members && user) {
    data.members.sort((a, b) => {
      if (a.id === user.id) return -1;
      if (b.id === user.id) return 1;
      return 0;
    });
  }
  return data;
}
