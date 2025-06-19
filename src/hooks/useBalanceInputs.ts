import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

export function useBalanceInputs(groupId: string) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["balance-inputs", groupId],
    queryFn: async () => {
      const { data: expenses, error: expenseError } = await supabase.rpc(
        "get_unsettled_expenses",
        { _group_id: groupId }
      );

      const { data: payments, error: paymentError } = await supabase.rpc(
        "get_unsettled_payments",
        { _group_id: groupId }
      );

      if (expenseError || paymentError) {
        throw expenseError || paymentError;
      }

      return { expenses, payments };
    },
  });
}
