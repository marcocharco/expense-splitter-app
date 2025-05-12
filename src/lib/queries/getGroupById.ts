import { createClient } from "@/utils/supabase/client";

export async function getGroupById(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("group")
    .select("id, name, slug")
    .eq("slug", slug)
    .single();

  if (error) throw new Error(error.message);
  console.log(data);
  return data;
}
