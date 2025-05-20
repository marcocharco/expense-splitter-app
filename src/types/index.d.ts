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
  $id: string;
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
  category: { name: string; icon: string } | null;
  settlement_id: string | null;
  status: string;
  splits: ExpenseSplit[];
  split_type: SplitType;
};

export type SplitType = "Even" | "Percentage" | "Shares" | "Custom";

export type NewExpense = {
  amount: number;
  title: string;
  paid_by: string;
  date: string;
  split_type: SplitType;
  category?: string;
  // splits: NewSplit[];
};

export type NewSplit = {
  expense_id: string;
  user_id: string;
  split_amount: number;
  split_type: string;
};
