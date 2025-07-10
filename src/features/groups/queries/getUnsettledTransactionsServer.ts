import { createClient } from "@/utils/supabase/server";

export async function getUnsettledTransactions(groupId: string) {
  const supabase = await createClient();

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
