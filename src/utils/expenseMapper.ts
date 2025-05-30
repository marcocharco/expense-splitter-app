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
      split:
        expense.splits.find((split) => split.user.id === m.id)?.amount ?? 0,
    })),
  };
}
