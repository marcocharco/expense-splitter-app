import { createClient } from "@/utils/supabase/client";

export async function getUserGroups() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("group")
    .select(" id, name, slug ");

  if (error) throw new Error(error.message);
  return data ?? [];
}
