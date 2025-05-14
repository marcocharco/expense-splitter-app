import { createClient } from "@/utils/supabase/client";

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
      status,
      group_id,
      settlement_id,
      category:expense_category (
        name:name
      ),
      paid_by:profile!paid_by(id, name),
      splits:expense_split(user:profile(name), amount, split_type)
    `
    )
    .eq("group_id", groupId)
    .order("date", { ascending: false });

  // console.log(data);
  if (error) throw new Error(error.message);
  return data;
}
