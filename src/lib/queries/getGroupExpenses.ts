import { createClient } from "@/utils/supabase/client";

export async function getGroupExpenses(groupId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("expense")
    .select(
      "id, title, amount, paid_by, date, category_id, settlement_id, status"
    )
    .eq("group_id", groupId);

  if (error) throw new Error(error.message);
  // console.log("Get group expenses by GroupID: ", data);
  return data;
}
