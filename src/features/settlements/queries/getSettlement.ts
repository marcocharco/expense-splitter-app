import { Settlement } from "@/features/settlements/types/settlement";
import { createClient } from "@/utils/supabase/client";

export async function getSettlement(settlementId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("settlement")
    .select(
      `
      id,
      title,
      status,
      created_at,
      created_by:profile!created_by(id, name),
      participants:settlement_participant(user:profile(id, name), initial_balance, remaining_balance)
    `
    )
    .eq("id", settlementId)
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as Settlement;
}
