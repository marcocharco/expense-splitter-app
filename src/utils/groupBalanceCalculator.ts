import { Expense } from "@/types";

export function calculateMemberBalances({ expenses }: { expenses: Expense[] }) {
  //total owe and owed for each member of a group
  const memberBalances = new Map<
    string, //userId
    { totalOwed: number; totalOwing: number; netOwing: number }
  >();

  expenses.forEach((expense) => {
    const splits = expense.splits;
    const currentExpense = memberBalances.get(expense.paid_by.id) || {
      totalOwed: 0,
      totalOwing: 0,
      netOwing: 0,
    };
    currentExpense.totalOwed += expense.amount;
    memberBalances.set(expense.paid_by.id, currentExpense);
    splits.forEach((split) => {
      const currentSplit = memberBalances.get(split.user.id) || {
        totalOwed: 0,
        totalOwing: 0,
        netOwing: 0,
      };
      // remove paid by user's split from their total owed
      if (split.user.id === expense.paid_by.id) {
        currentSplit.totalOwed -= split.amount;
      } else {
        currentSplit.totalOwing += split.amount;
      }
      memberBalances.set(split.user.id, currentSplit);
    });
  });

  // positive net balance means the member owes money to the group
  // negative net balance means the member is owed money by the group
  memberBalances.forEach((balance) => {
    balance.netOwing = balance.totalOwing - balance.totalOwed;
  });

  return memberBalances;
}

export function calculateNetBalances({ expenses }: { expenses: Expense[] }): {
  userId: string;
  netBalance: number;
}[] {
  const balances = new Map<string, number>(); // user_id -> net_balance

  for (const expense of expenses) {
    const paidById = expense.paid_by.id;

    for (const split of expense.splits) {
      const userId = split.user.id;
      const amount = split.amount;

      if (userId !== paidById) {
        // payer gets owed money
        balances.set(paidById, (balances.get(paidById) || 0) - amount);

        // split participant owes money
        balances.set(userId, (balances.get(userId) || 0) + amount);
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
