"use server";

import { createClient } from "@/utils/supabase/server";
import { NewExpense } from "@/types";
import { toDomainExpense } from "@/utils/expenseMapper";

export async function addNewExpense(values: NewExpense, groupId: string) {
  const supabase = await createClient();

  if (values.splitType === "even") {
    values.memberSplits.forEach((id) => (id.weight = 1));
  }

  const { data: expense, error } = await supabase.rpc(
    "add_expense_with_splits",
    {
      group_id: groupId,
      title: values.title,
      amount: values.amount,
      paid_by: values.paidBy,
      category_id: values.category === undefined ? null : values.category,
      date: values.date,
      split_type: values.splitType,
      splits: values.memberSplits,
    }
  );

  if (error) throw new Error(error.message);

  return toDomainExpense(expense); // new expense as object
}
