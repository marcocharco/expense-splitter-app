import { Expense } from "@/types";
import { toDomainExpense } from "@/features/expenses/utils/expenseMapper";
import { createClient } from "@/utils/supabase/server";

export async function getGroupExpenses(groupId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("expense")
    .select(
      `
      id,
      title,
      amount,
      date,
      group_id,
      settlement(id, status),
      split_type,
      category:expense_category (
        id, name, icon
      ),
      paid_by:profile!paid_by(id, name),
      splits:expense_split(user:profile!user_id(id, name), weight, initial_owing, remaining_owing),
      items:expense_item(
        id,
        title,
        amount,
        split_type,
        splits:expense_item_split(user:profile!user_id(id, name), weight)
      ),
      deleted_at
    `
    )
    .is("deleted_at", null)
    .eq("group_id", groupId)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })
    .overrideTypes<Expense[], { merge: false }>();

  if (error) {
    // console.error("error:", error);
    throw new Error(error.message);
  }

  return data.map(toDomainExpense) ?? null;
}
