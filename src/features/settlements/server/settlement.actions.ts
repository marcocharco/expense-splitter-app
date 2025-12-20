"use server";

import { createClient } from "@/utils/supabase/server";
import { logActivity } from "@/features/activity/server/activity.actions";

export async function insertSettlement({
  groupId,
  currentUser,
  title,
  selectedExpenseIds,
  balances,
}: {
  groupId: string;
  currentUser: string;
  title: string;
  selectedExpenseIds: string[];
  balances: { userId: string; netBalance: number }[];
}) {
  const supabase = await createClient();

  const { data: newSettlement, error } = await supabase.rpc(
    "start_settlement",
    {
      _group_id: groupId,
      _initiator: currentUser,
      _title: title,
      _expense_ids: selectedExpenseIds,
      _balances: balances,
    }
  );

  if (error) throw new Error(error.message);

  // Log activity
  try {
    if (newSettlement?.id) {
      await logActivity({
        groupId,
        actorId: currentUser,
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
  } catch (logError) {
    // Don't throw - activity logging shouldn't break main flow
    console.error("Failed to log settlement creation:", logError);
  }

  return newSettlement;
}
