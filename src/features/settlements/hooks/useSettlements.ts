"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getGroupSettlements } from "../queries/getGroupSettlements";
import { insertSettlement } from "../server/settlement.actions";

export function useSettlements(groupId: string) {
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["groupSettlements", groupId],
    queryFn: () => getGroupSettlements(groupId),
  });

  const startSettlement = useMutation({
    mutationFn: (values: {
      currentUser: string;
      title: string;
      selectedExpenseIds: string[];
      balances: { userId: string; netBalance: number }[];
    }) => insertSettlement({ ...values, groupId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["groupSettlements", groupId] });
      qc.invalidateQueries({ queryKey: ["groupExpenses", groupId] });
    },
  });

  return {
    settlements: data ?? [],
    isLoading,
    isError,
    startSettlement: startSettlement.mutateAsync,
    isStartingSettlement: startSettlement.isPending,
  };
}
