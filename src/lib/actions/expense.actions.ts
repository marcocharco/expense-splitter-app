"use server";

import { createClient } from "@/utils/supabase/server";
import { NewExpense } from "@/types";

export async function addNewExpense(values: NewExpense, groupId: string) {
  const supabase = await createClient();

  if (values.splitType === "even") {
    values.memberSplits.forEach((id) => (id.weight = 1));
  }

  const { error } = await supabase.rpc("add_expense_with_splits", {
    group_id: groupId,
    title: values.title,
    amount: values.amount,
    paid_by: values.paidBy,
    category_id: values.category === undefined ? null : values.category,
    date: values.date,
    split_type: values.splitType,
    splits: values.memberSplits,
  });

  if (error) throw new Error(error.message);
}

export async function updateExpense(
  values: NewExpense,
  groupId: string,
  expenseId: string
) {
  const supabase = await createClient();

  if (values.splitType === "even") {
    values.memberSplits.forEach((id) => (id.weight = 1));
  }

  const { error } = await supabase.rpc("update_expense", {
    _expense_id: expenseId,
    _group_id: groupId,
    _title: values.title,
    _amount: values.amount,
    _paid_by: values.paidBy,
    _category_id: values.category === undefined ? null : values.category,
    _date: values.date,
    _split_type: values.splitType,
    _splits: values.memberSplits,
  });

  if (error) throw new Error(error.message);
}
