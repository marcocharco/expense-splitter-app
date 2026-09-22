import { useMemo } from "react";
import { Expense, ExpenseSplit } from "@/features/expenses/types/expense";
import { Settlement } from "@/features/settlements/types/settlement";
import { formatCurrency } from "@/utils/formatCurrency";

export function usePayableExpenses(
  expenses: Expense[],
  paidBy: string,
  paidTo: string
) {
  return useMemo(() => {
    return expenses.filter((expense) => {
      const payerSplit = expense.splits.find((s) => s.user.id === paidBy);
      return (
        expense.paid_by.id === paidTo &&
        payerSplit &&
        expense.settlement === null &&
        payerSplit.remaining_owing > 0
      );
    });
  }, [expenses, paidBy, paidTo]);
}

export function usePayableExpenseItems(payableExpenses: Expense[], paidBy: string) {
  return useMemo(() => {
    return [...payableExpenses].reverse().map((expense) => {
      const split = expense.splits.find((s: ExpenseSplit) => s.user.id === paidBy);
      return {
        id: expense.id,
        label: `${expense.title} - Owes ${formatCurrency(split?.remaining_owing || 0)}`,
      };
    });
  }, [payableExpenses, paidBy]);
}

export function usePayableSettlements(
  settlements: Settlement[],
  paidBy: string,
  paidTo: string
) {
  return useMemo(() => {
    return settlements.filter((settlement) => {
      const paidToParticipant = settlement.participants.find((p) => p.user.id === paidTo);
      const paidByParticipant = settlement.participants.find((p) => p.user.id === paidBy);
      return (
        paidToParticipant &&
        paidByParticipant &&
        paidToParticipant.remaining_balance < 0 &&
        paidByParticipant.remaining_balance > 0
      );
    });
  }, [settlements, paidBy, paidTo]);
}
