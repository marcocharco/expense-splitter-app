import { Expense } from "@/types";

export function calculateSettlementBalances({
  expenses,
}: {
  expenses: Expense[];
}): {
  userId: string;
  netBalance: number;
}[] {
  // used for settlements
  const balances = new Map<string, number>(); // user_id -> net_balance

  for (const expense of expenses) {
    const paidById = expense.paid_by.id;

    for (const split of expense.splits) {
      const userId = split.user.id;
      const amount = split.remaining_owing;

      if (userId !== paidById) {
        // payer gets owed money
        balances.set(
          paidById,
          Math.round(((balances.get(paidById) || 0) - amount) * 100) / 100
        );

        // split participant owes money
        balances.set(
          userId,
          Math.round(((balances.get(userId) || 0) + amount) * 100) / 100
        );
      }
    }
  }

  const balancesPayload = Array.from(balances.entries()).map(
    ([userId, netBalance]) => ({
      userId,
      netBalance,
    })
  );

  return balancesPayload;
}
