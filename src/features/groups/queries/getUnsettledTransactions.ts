import { createClient } from "@/utils/supabase/client";

export async function getUnsettledTransactions(groupId: string) {
  const supabase = createClient();

  const {
    data: { expenses, payments },
    error,
  } = await supabase.rpc("get_unsettled_transactions", {
    _group_id: groupId,
  });

  if (error) {
    throw error;
  }

  return { expenses, payments };
}
