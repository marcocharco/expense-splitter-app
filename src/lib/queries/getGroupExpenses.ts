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
      category_id,
      settlement_id,
      paid_by:profile(id, name)
    `
    )
    .eq("group_id", groupId)
    .order("date", { ascending: false });

  // console.log(data);
  if (error) throw new Error(error.message);
  return data;
}
