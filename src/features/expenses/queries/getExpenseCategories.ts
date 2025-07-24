import { createClient } from "@/utils/supabase/client";

export async function getExpenseCategories(groupId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("expense_category")
    .select("id, name, icon, group_id")
    .eq("group_id", groupId);

  console.log(data);

  if (error) throw new Error(error.message);
  return data;
}
