import { Expense } from "@/features/expenses/types/expense";
import { toDomainExpense } from "@/features/expenses/utils/expenseMapper";
import { createClient } from "@/utils/supabase/client";

export async function getExpense(expenseId: string) {
  const supabase = createClient();

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
    .eq("id", expenseId)
    .single();

  if (error) throw new Error(error.message);
  if (!data) return null;

  return toDomainExpense(data as unknown as Expense);
}
