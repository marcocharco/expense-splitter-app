import { Payment } from "@/types";
import { createClient } from "@/utils/supabase/client";

export async function getGroupPayments(groupId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("payment")
    .select(
      `
      id,
      group_id,
      paid_by:profile!paid_by(id, name),
      paid_to:profile!paid_to(id, name),
      settlement(id, status, title),
      amount,
      date,
      expense_allocations:expense_payment(amount, expense(title, id))
    `
    )
    .eq("group_id", groupId)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })
    .overrideTypes<Payment[], { merge: false }>();

  // console.log(data);
  if (error) throw new Error(error.message);

  return data ?? null;
}
