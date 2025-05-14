"use server";

import { createClient } from "@/utils/supabase/server";
import { NewExpense } from "@/types";
import { calculateSplitCosts } from "@/utils/splitCalculator";

type member_split = {
  user_id: string;
  percentage?: number;
  shares?: number;
  custom_amount?: number;
}[];

export async function addNewExpense(
  values: NewExpense,
  groupId: string,
  member_splits: member_split
) {
  const supabase = await createClient();

  // add expense to db
  const { data: expense, error } = await supabase
    .from("expense")
    .insert({
      group_id: groupId,
      title: values.title,
      amount: values.amount,
      paid_by: values.paid_by,
      category_id: values.category,
      date: values.date,
      split_type: values.split_type,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  // calculate splits
  const splits = calculateSplitCosts({
    type: values.split_type,
    total_amount: values.amount,
    member_splits: member_splits,
  });

  // add splits to db
  const { error: splitError } = await supabase.from("expense_split").insert(
    splits.map((split) => ({
      user_id: split.user_id,
      amount: split.amount,
      expense_id: expense.id,
    }))
  );

  if (splitError) throw new Error(splitError.message);
}
