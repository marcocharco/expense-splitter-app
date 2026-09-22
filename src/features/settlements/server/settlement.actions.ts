"use server";

import { createClient } from "@/utils/supabase/server";
import { safeLogActivity } from "@/features/activity/utils/safeLogActivity";

export async function insertSettlement({
  groupId,
  title,
  selectedExpenseIds,
  balances,
}: {
  groupId: string;
  title: string;
  selectedExpenseIds: string[];
  balances: { userId: string; netBalance: number }[];
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data: newSettlement, error } = await supabase.rpc(
    "start_settlement",
    {
      _group_id: groupId,
      _initiator: user.id,
      _title: title,
      _expense_ids: selectedExpenseIds,
      _balances: balances,
    }
  );

  if (error) throw new Error(error.message);

  if (newSettlement?.id) {
    await safeLogActivity({
      groupId,
      actorId: user.id,
      activityType: "create_settlement",
      entityType: "settlement",
      entityId: newSettlement.id,
      meta: {
        action: "created",
        settlement: {
          id: newSettlement.id,
          title: newSettlement.title,
          expense_count: newSettlement.expense_count,
        },
      },
    });
  }

  return newSettlement;
}
