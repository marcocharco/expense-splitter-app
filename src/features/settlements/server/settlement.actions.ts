"use server";

import { createClient } from "@/utils/supabase/server";

export async function insertSettlement({
  groupId,
  currentUser,
  title,
  selectedExpenseIds,
  balances,
}: {
  groupId: string;
  currentUser: string;
  title: string;
  selectedExpenseIds: string[];
  balances: { userId: string; netBalance: number }[];
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("start_settlement", {
    _group_id: groupId,
    _initiator: currentUser,
    _title: title,
    _expense_ids: selectedExpenseIds,
    _balances: balances,
  });

  if (error) throw new Error(error.message);

  return data as { start_settlement: string };
}
