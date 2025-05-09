import { createClient } from "@/utils/supabase/server";

export async function getUserGroups() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("groups").select(" id, name ");

  if (error) throw new Error(error.message);
  return data ?? [];
}
