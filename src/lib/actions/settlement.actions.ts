"use server";

import { createClient } from "@/utils/supabase/server";

export async function createSettlementDraft({
  groupId,
  expenseIds,
  userId,
  title,
}: {
  groupId: string;
  expenseIds: string[];
  userId: string;
  title: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("start_settlement", {
    _group_id: groupId,
    _expense_ids: expenseIds,
    _initiator: userId,
    _title: title,
  });

  if (error) throw new Error(error.message);

  return data as { start_settlement: string };
}
