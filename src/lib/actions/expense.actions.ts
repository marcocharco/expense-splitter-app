"use server";

import { createClient } from "@/utils/supabase/server";
import { NewExpense } from "@/types";
import { calculateSplitCosts } from "@/utils/splitCalculator";

export async function addNewExpense(values: NewExpense, groupId: string) {
  const supabase = await createClient();

  const splits = calculateSplitCosts({
    type: values.splitType,
    totalAmount: values.amount,
    memberSplits: values.memberSplits,
  });

  const { data: expense, error } = await supabase.rpc(
    "add_expense_with_splits",
    {
      group_id: groupId,
      title: values.title,
      amount: values.amount,
      paid_by: values.paidBy,
      category_id: values.category === "" ? null : values.category,
      date: values.date,
      split_type: values.splitType,
      splits: splits,
    }
  );

  if (error) throw new Error(error.message);

  return expense; // new expense as object
}
