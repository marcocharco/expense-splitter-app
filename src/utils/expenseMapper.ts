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

export function toDomainExpense(db: Expense): Expense {
  const sumW = db.splits.reduce((s, r) => s + r.weight, 0);
  return {
    ...db,
    splits: db.splits.map((r) => ({
      user: { id: r.user.id, name: r.user.name },
      amount: (db.amount * r.weight) / sumW,
      weight: db.split_type === "even" ? 0 : r.weight,
    })),
  };
}
