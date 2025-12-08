import { Expense, ExpenseItem } from "@/features/expenses/types/expense";
import { Member } from "@/features/users/types/user";

type toFormValuesProps = {
  expense: Expense;
  members: Member[];
};

export function toSingleItemFormValues({
  expense,
  members,
}: toFormValuesProps) {
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

export function toMultiItemFormValues({ expense, members }: toFormValuesProps) {
  return {
    title: expense.title,
    paidBy: expense.paid_by.id,
    date: expense.date,
    category: expense.category?.id,
    items:
      expense.items?.map((item) => ({
        title: item.title,
        amount: item.amount,
        splitType: item.split_type,
        selectedMembers: item.splits.map((s) => s.user.id),
        memberSplits: members.map((m) => ({
          userId: m.id,
          weight:
            item.splits.find((split) => split.user.id === m.id)?.weight ?? 0,
        })),
      })) ?? [],
  };
}

export function toDomainExpense(dbExpense: Expense): Expense {
  const totalWeight = dbExpense.splits.reduce(
    (sum, split) => sum + split.weight,
    0
  );

  // Process items if they exist (multi-item expense)
  const processedItems = dbExpense.items?.map((item): ExpenseItem => {
    const itemTotalWeight = item.splits.reduce(
      (sum, split) => sum + split.weight,
      0
    );

    return {
      ...item,
      splits: item.splits.map((split) => {
        const splitAmount = (item.amount * split.weight) / itemTotalWeight;

        return {
          user: {
            id: split.user.id,
            name: split.user.name,
          },
          weight: item.split_type === "even" ? 0 : split.weight,
          amount: splitAmount,
        };
      }),
    };
  });

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
    items: processedItems,
  };
}
