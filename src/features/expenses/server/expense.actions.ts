"use server";

import { createClient } from "@/utils/supabase/server";
import {
  NewExpense,
  NewMultiItemExpense,
} from "@/features/expenses/types/expense";
import { logActivity } from "@/features/activity/server/activity.actions";
import { calculateChanges } from "@/features/activity/utils/calculateChanges";

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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  if (values.splitType === "even") {
    values.memberSplits.forEach((id) => (id.weight = 1));
  }

  const { data: newExpense, error } = await supabase.rpc("insert_expense", {
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

  // Log activity
  try {
    if (newExpense?.id) {
      await logActivity({
        groupId,
        actorId: user.id,
        activityType: "create_expense",
        entityType: "expense",
        entityId: newExpense.id,
        meta: {
          action: "created",
          expense: {
            title: newExpense.title,
            amount: newExpense.amount,
            paid_by: newExpense.paid_by.id,
            date: newExpense.date,
          },
        },
      });
    }
  } catch (logError) {
    // Don't throw - activity logging shouldn't break main flow
    console.error("Failed to log expense creation:", logError);
  }
}

export async function updateExpense(
  values: NewExpense,
  groupId: string,
  expenseId: string
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  if (values.splitType === "even") {
    values.memberSplits.forEach((id) => (id.weight = 1));
  }

  const { data: result, error } = await supabase.rpc("update_expense", {
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

  // Calculate changes and log activity
  try {
    if (result?.old && result?.new) {
      const changes = calculateChanges(
        result.old,
        {
          title: result.new.title,
          amount: result.new.amount,
          paid_by: result.new.paid_by.id,
          date: result.new.date,
          category_id: result.new.category?.id || null,
        },
        ["title", "amount", "paid_by", "date", "category_id"]
      );

      if (changes.length > 0) {
        await logActivity({
          groupId,
          actorId: user.id,
          activityType: "update_expense",
          entityType: "expense",
          entityId: expenseId,
          meta: {
            action: "updated",
            changes,
            expense: {
              id: expenseId,
              title: result.new.title,
            },
          },
        });
      }
    }
  } catch (logError) {
    // Don't throw - activity logging shouldn't break main flow
    console.error("Failed to log expense update:", logError);
  }
}

export async function deleteExpense(expenseId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data: deletedExpense, error } = await supabase.rpc(
    "delete_expense_soft",
    {
      p_expense_id: expenseId,
    }
  );

  if (error) throw new Error(error.message);

  // Log activity
  try {
    if (deletedExpense) {
      await logActivity({
        groupId: deletedExpense.group_id,
        actorId: user.id,
        activityType: "delete_expense",
        entityType: "expense",
        entityId: expenseId,
        meta: {
          action: "deleted",
          expense: {
            id: expenseId,
            title: deletedExpense.title,
            amount: deletedExpense.amount,
          },
        },
      });
    }
  } catch (logError) {
    // Don't throw - activity logging shouldn't break main flow
    console.error("Failed to log expense deletion:", logError);
  }
}

export async function insertMultiItemExpense(
  values: NewMultiItemExpense,
  groupId: string
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const processedItems = processMultiItemPayload(values.items);

  const { data: newExpense, error } = await supabase.rpc(
    "insert_expense_multi_item",
    {
      p_group_id: groupId,
      p_title: values.title,
      p_paid_by: values.paidBy,
      p_date: values.date,
      p_category_id: values.category === undefined ? null : values.category,
      p_items: processedItems,
    }
  );

  if (error) throw new Error(error.message);

  // Log activity
  try {
    if (newExpense?.id) {
      await logActivity({
        groupId,
        actorId: user.id,
        activityType: "create_expense",
        entityType: "expense",
        entityId: newExpense.id,
        meta: {
          action: "created",
          expense: {
            title: newExpense.title,
            amount: newExpense.amount,
            paid_by: newExpense.paid_by.id,
            date: newExpense.date,
          },
        },
      });
    }
  } catch (logError) {
    // Don't throw - activity logging shouldn't break main flow
    console.error("Failed to log multi-item expense creation:", logError);
  }
}

export async function updateMultiItemExpense(
  values: NewMultiItemExpense,
  groupId: string,
  expenseId: string
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const processedItems = processMultiItemPayload(values.items);

  const { data: result, error } = await supabase.rpc(
    "update_expense_multi_item",
    {
      p_expense_id: expenseId,
      p_group_id: groupId,
      p_title: values.title,
      p_paid_by: values.paidBy,
      p_date: values.date,
      p_category_id: values.category === undefined ? null : values.category,
      p_items: processedItems,
    }
  );

  if (error) {
    console.error("error:", error);
    throw new Error(error.message);
  }

  // Calculate changes and log activity
  try {
    if (result?.old && result?.new) {
      const changes = calculateChanges(
        result.old,
        {
          title: result.new.title,
          amount: result.new.amount,
          paid_by: result.new.paid_by,
          date: result.new.date,
          category_id: result.new.category_id || null,
        },
        ["title", "amount", "paid_by", "date", "category_id"]
      );

      if (changes.length > 0) {
        await logActivity({
          groupId,
          actorId: user.id,
          activityType: "update_expense",
          entityType: "expense",
          entityId: expenseId,
          meta: {
            action: "updated",
            changes,
            expense: {
              id: expenseId,
              title: result.new.title,
            },
          },
        });
      }
    }
  } catch (logError) {
    // Don't throw - activity logging shouldn't break main flow
    console.error("Failed to log multi-item expense update:", logError);
  }
}
