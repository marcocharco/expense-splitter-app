import { createClient } from "@/utils/supabase/client";

export async function getUserProfile() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profile")
    .select()
    .eq("id", user?.id)
    .maybeSingle();

  // console.log(profile);
  if (error) throw new Error(error.message);
  return profile ?? null;
}
