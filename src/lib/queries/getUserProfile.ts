import { createClient } from "@/utils/supabase/client";

export async function getUserProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile, error } = await supabase
    .from("profile")
    .select()
    .eq("id", user?.id)
    .single();

  if (error) throw new Error(error.message);
  return profile ?? [];
}
