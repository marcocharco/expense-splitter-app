import { SettlementStatus } from "@/features/settlements/types/settlement";

export type SplitType = "even" | "percentage" | "shares" | "custom";

export type Expense = {
  id: string;
  title: string;
  amount: number;
  paid_by: { id: string; name: string };
  date: string;
  category: { id: string; name: string; icon: string } | null;
  settlement?: { id: string; status: SettlementStatus };
  splits: ExpenseSplit[];
  split_type: SplitType;
  items?: ExpenseItem[]; // Present for multi-item expenses
};

export type ExpenseSplit = {
  expense_id?: string;
  user: { id: string; name: string };
  amount: number;
  weight: number;
  initial_owing: number;
  remaining_owing: number;
};

export type ExpenseItem = {
  id: string;
  title: string;
  amount: number;
  split_type: SplitType;
  splits: ExpenseItemSplit[];
};

export type ExpenseItemSplit = {
  user: { id: string; name: string };
  weight: number;
  amount: number;
};

export type NewExpense = {
  amount: number;
  title: string;
  paidBy: string;
  date: string;
  splitType: SplitType;
  category?: string;
  memberSplits: { userId: string; weight: number }[];
};

export type NewMultiItemExpense = {
  title: string;
  paidBy: string;
  date: string;
  category?: string;
  items: {
    title: string;
    amount: number;
    splitType: SplitType;
    splits: { userId: string; weight: number }[];
  }[];
};

