import { createClient } from "@/utils/supabase/server";

export async function getGroupBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("group")
    .select("id, name, slug, members:profile(id, name)")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  // console.log("Get group data by slug: ", data);
  return data;
}
