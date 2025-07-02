import { Expense, Member } from "@/types";

type toFormValuesProps = {
  expense: Expense;
  members: Member[];
};
export function toFormValues({ expense, members }: toFormValuesProps) {
  return {
    amount: expense.amount,
    title: expense.title,
    paidBy: expense.paid_by.id,
    date: expense.date,
    category: expense.category?.id,
    splitType: expense.split_type,
    selectedMembers: expense.splits.map((s) => s.user.id),
    memberSplits: members.map((m) => ({
      userId: m.id,
      weight:
        expense.splits.find((split) => split.user.id === m.id)?.weight ?? 0,
    })),
  };
}

export function toDomainExpense(dbExpense: Expense): Expense {
  const totalWeight = dbExpense.splits.reduce(
    (sum, split) => sum + split.weight,
    0
  );

  return {
    ...dbExpense,
    splits: dbExpense.splits.map((split) => {
      const splitAmount = (dbExpense.amount * split.weight) / totalWeight;

      return {
        user: {
          id: split.user.id,
          name: split.user.name,
        },
        amount: splitAmount,
        weight: dbExpense.split_type === "even" ? 0 : split.weight,
        initial_owing: split.initial_owing,
        remaining_owing: split.remaining_owing,
      };
    }),
  };
}
