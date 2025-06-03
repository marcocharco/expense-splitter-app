import { Expense } from "@/types";
import { toDomainExpense } from "@/utils/expenseMapper";
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
      settlement_id,
      split_type,
      category:expense_category (
        id, name, icon
      ),
      paid_by:profile!paid_by(id, name),
      splits:expense_split(user:profile(id, name), weight)
    `
    )
    .eq("group_id", groupId)
    .order("date", { ascending: false })
    .overrideTypes<Expense[], { merge: false }>();

  // console.log(data);
  if (error) throw new Error(error.message);

  return data.map(toDomainExpense) ?? null;
}
