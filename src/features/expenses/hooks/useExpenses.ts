"use client";

import {
  addNewExpense,
  updateExpense,
  softDeleteExpense,
  addMultiItemExpense as addMultiItemExpenseAction,
  updateMultiItemExpense,
} from "@/features/expenses/server/expense.actions";
import { getGroupExpenses } from "@/features/expenses/queries/getGroupExpenses";
import { NewExpense, NewMultiItemExpense } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useExpenses(groupId: string) {
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["groupExpenses", groupId],
    queryFn: () => getGroupExpenses(groupId),
  });

  const addExpense = useMutation({
    mutationFn: (values: NewExpense) => addNewExpense(values, groupId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["groupExpenses", groupId] });
      qc.invalidateQueries({ queryKey: ["groupBalances", groupId] });
    },
  });

  const editExpense = useMutation({
    mutationFn: ({
      values,
      expenseId,
    }: {
      values: NewExpense;
      expenseId: string;
    }) => updateExpense(values, groupId, expenseId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["groupExpenses", groupId] });
      qc.invalidateQueries({ queryKey: ["groupBalances", groupId] });
    },
  });

  const deleteExpense = useMutation({
    mutationFn: ({ expenseId }: { expenseId: string }) =>
      softDeleteExpense(expenseId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["groupExpenses", groupId] });
      qc.invalidateQueries({ queryKey: ["groupBalances", groupId] });
    },
  });

  const addMultiItemExpense = useMutation({
    mutationFn: (values: NewMultiItemExpense) =>
      addMultiItemExpenseAction(values, groupId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["groupExpenses", groupId] });
      qc.invalidateQueries({ queryKey: ["groupBalances", groupId] });
    },
  });

  const editMultiItemExpense = useMutation({
    mutationFn: ({
      values,
      expenseId,
    }: {
      values: NewMultiItemExpense;
      expenseId: string;
    }) => updateMultiItemExpense(values, groupId, expenseId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["groupExpenses", groupId] });
      qc.invalidateQueries({ queryKey: ["groupBalances", groupId] });
    },
  });

  return {
    expenses: data ?? [],
    isLoading,
    isError,
    addExpense: addExpense.mutateAsync,
    editExpense: editExpense.mutateAsync,
    deleteExpense: deleteExpense.mutateAsync,
    isAddingExpense: addExpense.isPending,
    isEditingExpense: editExpense.isPending,
    isDeletingExpense: deleteExpense.isPending,
    addMultiItemExpense: addMultiItemExpense.mutateAsync,
    editMultiItemExpense: editMultiItemExpense.mutateAsync,
    isAddingMultiItemExpense: addMultiItemExpense.isPending,
    isEditingMultiItemExpense: editMultiItemExpense.isPending,
  };
}
