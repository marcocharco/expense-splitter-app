import { Settlement } from "@/types";
import { createClient } from "@/utils/supabase/client";

export async function getGroupSettlements(groupId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("settlement")
    .select(
      `
      id,
      title,
      created_by:profile!created_by(id, name),
      status,
      participants:settlement_participant(user:profile(id, name), initial_balance, remaining_balance)
    `
    )
    .eq("group_id", groupId)
    .overrideTypes<Settlement[], { merge: false }>();

  // console.log(data);
  if (error) throw new Error(error.message);

  return data ?? null;
}
