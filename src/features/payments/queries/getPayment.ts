import { Payment } from "@/features/payments/types/payment";
import { createClient } from "@/utils/supabase/client";

export async function getPayment(paymentId: string) {
  const supabase = createClient();

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
    .eq("id", paymentId)
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as Payment;
}
