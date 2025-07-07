import { useQuery } from "@tanstack/react-query";
import { getUnsettledTransactions } from "@/features/groups/queries/getUnsettledTransactions";

export function useBalanceInputs(groupId: string) {
  return useQuery({
    queryKey: ["groupBalances", groupId],
    queryFn: () => getUnsettledTransactions(groupId),
  });
}
