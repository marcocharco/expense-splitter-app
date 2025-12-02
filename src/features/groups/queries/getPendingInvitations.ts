import { createClient } from "@/utils/supabase/client";
import { GroupInvitation } from "@/types";

export async function getPendingInvitations(): Promise<GroupInvitation[]> {
  const supabase = createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase.rpc(
    "get_pending_invitations_for_user"
  );

  if (error) {
    console.error("Error fetching pending invitations:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw new Error(error.message || "Failed to fetch pending invitations");
  }

  return (data || []) as GroupInvitation[];
}
