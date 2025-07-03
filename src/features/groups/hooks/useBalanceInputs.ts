import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

export function useBalanceInputs(groupId: string) {
  const supabase = createClient();
  return useQuery({
    queryKey: ["groupBalances", groupId],
    queryFn: async () => {
      const {
        data: { expenses, payments },
        error,
      } = await supabase.rpc("get_unsettled_transactions", {
        _group_id: groupId,
      });

      if (error) {
        throw error;
      }

      return { expenses, payments };
    },
  });
}
