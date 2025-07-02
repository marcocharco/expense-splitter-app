import { createClient } from "@/utils/supabase/client";

export async function getExpenseCategories() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("expense_category")
    .select("id, name, icon");

  if (error) throw new Error(error.message);
  return data;
}
