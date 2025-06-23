"use server";

import { createClient } from "@/utils/supabase/server";

export async function addNewSettlementPayment({
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

  const { data, error } = await supabase.rpc("add_settlement_payment", {
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

export async function addNewExpensePayment({
  groupId,
  paid_by,
  paid_to,
  amount,
  note,
  selectedExpenseSplits,
}: {
  groupId: string;
  paid_by: string;
  paid_to: string;
  amount: number;
  note?: string;
  selectedExpenseSplits: { expenseId: string; splitAmount: number }[];
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("add_expense_payment", {
    _group_id: groupId,
    _paid_by: paid_by,
    _paid_to: paid_to,
    _amount: amount,
    _note: note,
    _expenses: selectedExpenseSplits,
  });

  if (error) throw new Error(error.message);

  return data ?? null;
}
