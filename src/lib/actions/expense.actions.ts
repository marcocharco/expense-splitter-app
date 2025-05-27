"use server";

import { createClient } from "@/utils/supabase/server";
import { NewExpense } from "@/types";
import { calculateSplitCosts } from "@/utils/splitCalculator";

export async function addNewExpense(values: NewExpense, groupId: string) {
  const supabase = await createClient();

  // add expense to db
  const { data: expense, error } = await supabase
    .from("expense")
    .insert({
      group_id: groupId,
      title: values.title,
      amount: values.amount,
      paid_by: values.paidBy,
      category_id: values.category === "" ? null : values.category,
      date: values.date,
      split_type: values.splitType,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  // calculate splits
  const splits = calculateSplitCosts({
    type: values.splitType,
    totalAmount: values.amount,
    memberSplits: values.memberSplits,
  });

  // add splits to db
  const { error: splitError } = await supabase.from("expense_split").insert(
    splits.map((split) => ({
      user_id: split.userId,
      amount: split.amount,
      expense_id: expense.id,
    }))
  );

  if (splitError) throw new Error(splitError.message);
}
