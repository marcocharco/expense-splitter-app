"use server";

import { Expense } from "@/types";
import { calculateMemberBalances } from "@/utils/groupBalanceCalculator";
import { createClient } from "@/utils/supabase/server";

export async function startNewSettlement({
  groupId,
  selectedExpenses,
  initiator, //user.id
  title,
}: {
  groupId: string;
  selectedExpenses: Expense[];
  initiator: string;
  title: string;
}) {
  const supabase = await createClient();

  const selectedExpenseIds = selectedExpenses.map((expense) => expense.id);

  const balances = calculateMemberBalances({ expenses: selectedExpenses });

  const balancesPayload = Array.from(balances.entries()).map(
    ([user_id, balance]) => ({
      user_id,
      net_balance: balance.netOwing,
    })
  );

  const { data, error } = await supabase.rpc("start_settlement", {
    _group_id: groupId,
    _initiator: initiator,
    _title: title,
    _expense_ids: selectedExpenseIds,
    _balances: balancesPayload,
  });

  if (error) throw new Error(error.message);

  return data as { start_settlement: string };
}
