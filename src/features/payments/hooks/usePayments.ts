"use client";

import {
  addNewExpensePayment,
  addNewSettlementPayment,
} from "@/features/payments/server/payment.actions";
import { getGroupPayments } from "@/features/payments/queries/getGroupPayments";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function usePayments(groupId: string) {
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["groupPayments", groupId],
    queryFn: () => getGroupPayments(groupId),
  });

  const addSettlementPayment = useMutation({
    mutationFn: (values: {
      paid_by: string;
      paid_to: string;
      amount: number;
      date: string;
      settlement_id?: string | null;
      note?: string | null;
    }) => addNewSettlementPayment({ ...values, groupId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["groupPayments", groupId] });
      qc.invalidateQueries({ queryKey: ["groupBalances", groupId] });
      qc.invalidateQueries({ queryKey: ["groupExpenses", groupId] });
    },
  });

  const addExpensePayment = useMutation({
    mutationFn: (values: {
      paid_by: string;
      paid_to: string;
      amount: number;
      date: string;
      note?: string;
      selectedExpenseSplits: { expenseId: string; splitAmount: number }[];
    }) => addNewExpensePayment({ ...values, groupId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["groupPayments", groupId] });
      qc.invalidateQueries({ queryKey: ["groupBalances", groupId] });
      qc.invalidateQueries({ queryKey: ["groupExpenses", groupId] });
    },
  });

  return {
    payments: data ?? [],
    isLoading,
    isError,
    addSettlementPayment: addSettlementPayment.mutateAsync,
    addExpensePayment: addExpensePayment.mutateAsync,
    isAddingSettlementPayment: addSettlementPayment.isPending,
    isAddingExpensePayment: addExpensePayment.isPending,
  };
}
