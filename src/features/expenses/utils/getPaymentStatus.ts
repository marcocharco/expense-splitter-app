import { Expense } from "@/features/expenses/types/expense";

export function getPaymentStatus(expense: Expense): string {
  if (expense.settlement) {
    if (expense.settlement.status === "closed") return "Paid";
    return "In Settlement";
  }

  const total = expense.splits.filter(
    (s) => expense.paid_by.id !== s.user.id
  ).length;
  const paid = expense.splits.filter(
    (s) => s.remaining_owing === 0 && s.initial_owing > 0
  ).length;

  if (paid === total) return "Paid";
  return `${paid}/${total} Paid`;
}
