import { Expense } from "@/types";
import { formatCurrency } from "@/utils/formatCurrency";

export type ExpenseUserStatus =
  | { type: "owed"; amount: number; text: string }
  | { type: "owes"; amount: number; text: string }
  | { type: "paid"; amount: number; text: string }
  | { type: "paid_share"; amount: number; text: string }
  | { type: "not_involved"; amount: 0; text: string }
  | { type: "no_cost"; amount: number; text: string };

export function getExpenseUserStatus(
  expense: Expense,
  currentUserId: string
): ExpenseUserStatus {
  const userSplit = expense.splits.find(
    (split) => split.user.id === currentUserId
  );
  const isPayer = expense.paid_by.id === currentUserId;

  if (!userSplit && !isPayer) {
    return { type: "not_involved", amount: 0, text: "Not involved" };
  }

  if (isPayer) {
    const totalOwedToUser = expense.splits
      .filter((split) => split.user.id !== currentUserId)
      .reduce((sum, split) => sum + split.remaining_owing, 0);

    if (totalOwedToUser > 0) {
      return {
        type: "owed",
        amount: totalOwedToUser,
        text: `You're owed ${formatCurrency(totalOwedToUser)}`,
      };
    }

    const totalInitiallyOwedToUser = expense.splits
      .filter((split) => split.user.id !== currentUserId)
      .reduce((sum, split) => sum + split.initial_owing, 0);

    return {
      type: "paid",
      amount: totalInitiallyOwedToUser,
      text: `You were paid ${formatCurrency(totalInitiallyOwedToUser)}`,
    };
  }

  if (userSplit && userSplit.remaining_owing > 0) {
    return {
      type: "owes",
      amount: userSplit.remaining_owing,
      text: `You owe ${formatCurrency(userSplit.remaining_owing)}`,
    };
  }

  if (userSplit && userSplit.initial_owing > 0) {
    return {
      type: "paid_share",
      amount: userSplit.initial_owing,
      text: `You paid ${formatCurrency(userSplit.initial_owing)}`,
    };
  }

  return {
    type: "no_cost",
    amount: 0,
    text: "No cost to you",
  };
}


