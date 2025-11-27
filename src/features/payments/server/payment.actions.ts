"use server";

import { createClient } from "@/utils/supabase/server";

export async function insertSettlementPayment({
  groupId,
  paid_by,
  paid_to,
  amount,
  date,
  settlement_ids,
  note,
}: {
  groupId: string;
  paid_by: string;
  paid_to: string;
  amount: number;
  date: string;
  settlement_ids?: string[];
  note?: string | null;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("insert_payment_settlement", {
    _group_id: groupId,
    _paid_by: paid_by,
    _paid_to: paid_to,
    _amount: amount,
    _date: date,
    _settlement_ids: settlement_ids,
    _note: note,
  });

  if (error) throw new Error(error.message);

  return data ?? null;
}

export async function insertExpensePayment({
  groupId,
  paid_by,
  paid_to,
  amount,
  date,
  note,
  selectedExpenseSplits,
}: {
  groupId: string;
  paid_by: string;
  paid_to: string;
  amount: number;
  date: string;
  note?: string;
  selectedExpenseSplits: { expenseId: string; splitAmount: number }[];
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("insert_payment_expense", {
    _group_id: groupId,
    _paid_by: paid_by,
    _paid_to: paid_to,
    _amount: amount,
    _date: date,
    _note: note,
    _expenses: selectedExpenseSplits,
  });

  if (error) throw new Error(error.message);

  return data ?? null;
}
