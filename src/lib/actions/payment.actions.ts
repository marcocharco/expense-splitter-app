"use server";

import { createClient } from "@/utils/supabase/server";

export async function addNewPayment({
  groupId,
  paid_by,
  paid_to,
  amount,
  settlement_id,
  note,
}: {
  groupId: string;
  paid_by: string;
  paid_to: string;
  amount: number;
  settlement_id?: string | null;
  note?: string | null;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("add_payment", {
    _group_id: groupId,
    _paid_by: paid_by,
    _paid_to: paid_to,
    _amount: amount,
    _settlement_id: settlement_id,
    _note: note,
  });

  if (error) throw new Error(error.message);

  return data ?? null;
}
