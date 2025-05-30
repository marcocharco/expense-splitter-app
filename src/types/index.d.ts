declare type SidebarProps = {
  user: User;
};

export type AuthFormParams = {
  email: string;
  password: string;
  name?: string;
};

export type Member = {
  id: string;
  name: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
};

export type Group = {
  id: string;
  name: string;
  slug: string;
  members: Member[];
  created_at?: string;
};

export type ExpenseSplit = {
  expense_id?: string;
  user: { id: string; name: string };
  amount: number;
};

export type Expense = {
  id: string;
  title: string;
  amount: number;
  paid_by: { id: string; name: string };
  date: string;
  category: { id: number; name: string; icon: string } | null;
  settlement_id: string | null;
  status: string;
  splits: ExpenseSplit[];
  split_type: SplitType;
};

export type SplitType = "even" | "percentage" | "shares" | "custom";

export type NewExpense = {
  amount: number;
  title: string;
  paidBy: string;
  date: string;
  splitType: SplitType;
  category?: number;
  memberSplits: { userId: string; split: number }[];
};
