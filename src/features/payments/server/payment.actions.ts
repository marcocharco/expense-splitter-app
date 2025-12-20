"use server";

import { createClient } from "@/utils/supabase/server";
import { logActivity } from "@/features/activity/server/activity.actions";

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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data: result, error } = await supabase.rpc(
    "insert_payment_settlement",
    {
      _group_id: groupId,
      _paid_by: paid_by,
      _paid_to: paid_to,
      _amount: amount,
      _date: date,
      _settlement_ids: settlement_ids,
      _note: note,
    }
  );

  if (error) throw new Error(error.message);

  // Log activity
  try {
    if (result && result.payment_ids && result.payment_ids.length > 0) {
      const mainPaymentId = result.payment_ids[0];
      const targets = result.applied_settlements.map((s: any) => ({
        type: "settlement" as const,
        id: s.id,
        amount: s.amount,
        title: s.title,
      }));

      await logActivity({
        groupId,
        actorId: user.id,
        activityType: "create_payment",
        entityType: "payment",
        entityId: mainPaymentId,
        targetUserId: paid_to,
        meta: {
          action: "created",
          payment: {
            id: mainPaymentId,
            amount: result.total_amount,
            paid_by: result.paid_by,
            paid_to: result.paid_to,
            type: "settlement",
          },
          targets: targets.length > 0 ? targets : undefined,
        },
      });
    }
  } catch (logError) {
    // Don't throw - activity logging shouldn't break main flow
    console.error("Failed to log settlement payment:", logError);
  }

  return result ?? null;
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data: result, error } = await supabase.rpc("insert_payment_expense", {
    _group_id: groupId,
    _paid_by: paid_by,
    _paid_to: paid_to,
    _amount: amount,
    _date: date,
    _note: note,
    _expenses: selectedExpenseSplits,
  });

  if (error) throw new Error(error.message);

  // Log activity
  try {
    if (result && result.payment_id) {
      const paymentId = result.payment_id;
      const targets = result.applied_expenses.map((e: any) => ({
        type: "expense" as const,
        id: e.id,
        amount: e.amount,
        title: e.title,
      }));

      await logActivity({
        groupId,
        actorId: user.id,
        activityType: "create_payment",
        entityType: "payment",
        entityId: paymentId,
        targetUserId: paid_to,
        meta: {
          action: "created",
          payment: {
            id: paymentId,
            amount: result.total_amount,
            paid_by: result.paid_by,
            paid_to: result.paid_to,
            type: "expense",
          },
          targets,
        },
      });

      // Also log individual "pay_expense" activities for each expense being paid
      for (const e of result.applied_expenses) {
        await logActivity({
          groupId,
          actorId: user.id,
          activityType: "pay_expense",
          entityType: "expense",
          entityId: e.id,
          targetUserId: paid_to,
          meta: {
            action: "payment_applied",
            payment: {
              id: paymentId,
              amount: e.amount,
              paid_by: result.paid_by,
              paid_to: result.paid_to,
            },
            expense: {
              id: e.id,
              title: e.title,
            },
            allocations: [
              {
                expense_id: e.id,
                amount: e.amount,
              },
            ],
          },
        });
      }
    }
  } catch (logError) {
    // Don't throw - activity logging shouldn't break main flow
    console.error("Failed to log expense payment:", logError);
  }

  return result ?? null;
}
