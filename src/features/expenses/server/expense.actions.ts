"use server";

import { createClient } from "@/utils/supabase/server";
import {
  NewExpense,
  NewMultiItemExpense,
} from "@/features/expenses/types/expense";

// process multi-item expense inputs for RPC function
const processMultiItemPayload = (items: NewMultiItemExpense["items"]) => {
  return items.map((item) => ({
    title: item.title,
    amount: item.amount,
    split_type: item.splitType,
    splits: item.splits.map((split) => ({
      userId: split.userId,
      weight: item.splitType === "even" ? 1 : split.weight,
    })),
  }));
};

export async function insertExpense(values: NewExpense, groupId: string) {
  const supabase = await createClient();

  if (values.splitType === "even") {
    values.memberSplits.forEach((id) => (id.weight = 1));
  }

  const { error } = await supabase.rpc("insert_expense", {
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

export async function deleteExpense(expenseId: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("soft_delete_expense", {
    p_expense_id: expenseId,
  });

  if (error) throw new Error(error.message);
}

export async function insertMultiItemExpense(
  values: NewMultiItemExpense,
  groupId: string
) {
  const supabase = await createClient();

  const processedItems = processMultiItemPayload(values.items);

  const { error } = await supabase.rpc("insert_expense_multi_item", {
    p_group_id: groupId,
    p_title: values.title,
    p_paid_by: values.paidBy,
    p_date: values.date,
    p_category_id: values.category === undefined ? null : values.category,
    p_items: processedItems,
  });

  if (error) throw new Error(error.message);
}

export async function updateMultiItemExpense(
  values: NewMultiItemExpense,
  groupId: string,
  expenseId: string
) {
  const supabase = await createClient();

  const processedItems = processMultiItemPayload(values.items);

  const { error } = await supabase.rpc("update_expense_multi_item", {
    p_expense_id: expenseId,
    p_group_id: groupId,
    p_title: values.title,
    p_paid_by: values.paidBy,
    p_date: values.date,
    p_category_id: values.category === undefined ? null : values.category,
    p_items: processedItems,
  });

  if (error) {
    console.error("error:", error);
    throw new Error(error.message);
  }
}
