import { Expense } from "@/types";

export type BalanceInputs = {
  expenses: {
    id: string;
    amount: number;
    split_type: "even" | "percentage" | "shares" | "custom";
    paid_by: string;
    settlement_id: string | null;
    settlement_status: "draft" | "open" | "closed" | null;
    splits: {
      user_id: string;
      weight: number;
    }[];
  }[];
  payments: {
    id: string;
    paid_by: string;
    paid_to: string;
    amount: number;
    settlement_id: string | null;
    settlement_status: "draft" | "open" | "closed" | null;
  }[];
};

export function calculateMemberBalances({ expenses, payments }: BalanceInputs) {
  const memberBalances = new Map<
    string, //userId
    { totalOwed: number; totalOwing: number; netOwing: number }
  >();

  expenses.forEach((expense) => {
    const splits = expense.splits;
    const currentExpense = memberBalances.get(expense.paid_by) || {
      totalOwed: 0,
      totalOwing: 0,
      netOwing: 0,
    };
    currentExpense.totalOwed += expense.amount;
    memberBalances.set(expense.paid_by, currentExpense);
    splits.forEach((split) => {
      const totalWeight = splits.reduce((sum, split) => sum + split.weight, 0);
      const splitAmount = (expense.amount * split.weight) / totalWeight;

      const currentSplit = memberBalances.get(split.user_id) || {
        totalOwed: 0,
        totalOwing: 0,
        netOwing: 0,
      };
      // remove paid by user's split from their total owed
      if (split.user_id === expense.paid_by) {
        currentSplit.totalOwed -= splitAmount;
      } else {
        currentSplit.totalOwing += splitAmount;
      }
      memberBalances.set(split.user_id, currentSplit);
    });
  });

  payments.forEach((payment) => {
    const paidByBalance = memberBalances.get(payment.paid_by) || {
      totalOwed: 0,
      totalOwing: 0,
      netOwing: 0,
    };
    paidByBalance.totalOwing -= payment.amount;
    memberBalances.set(payment.paid_by, paidByBalance);

    const paidToBalance = memberBalances.get(payment.paid_to) || {
      totalOwed: 0,
      totalOwing: 0,
      netOwing: 0,
    };
    paidToBalance.totalOwed -= payment.amount;
    memberBalances.set(payment.paid_to, paidToBalance);
  });

  // Ensure no negative owed/owing: transfer negatives to the other side
  memberBalances.forEach((balance) => {
    if (balance.totalOwed < 0) {
      balance.totalOwing += Math.abs(balance.totalOwed);
      balance.totalOwed = 0;
    }
    if (balance.totalOwing < 0) {
      balance.totalOwed += Math.abs(balance.totalOwing);
      balance.totalOwing = 0;
    }
    // positive net balance means the member owes money to the group
    // negative net balance means the member is owed money by the group
    balance.netOwing = balance.totalOwing - balance.totalOwed;
  });

  return memberBalances;
}

export function calculateNetBalances({ expenses }: { expenses: Expense[] }): {
  userId: string;
  netBalance: number;
}[] {
  // used for settlements
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
