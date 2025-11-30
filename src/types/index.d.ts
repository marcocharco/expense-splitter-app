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

export type SplitType = "even" | "percentage" | "shares" | "custom";

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

export type SettlementStatus = "open" | "closed";

export type Settlement = {
  id: string;
  title: string;
  created_by: {
    id: string;
    name: string;
  };
  status: SettlementStatus;
  participants: {
    user: {
      id: string;
      name: string;
    };
    initial_balance: number;
    remaining_balance: number;
  }[];
};

export type Payment = {
  id: string;
  group_id: string;
  paid_by: {
    id: string;
    name: string;
  };
  paid_to: {
    id: string;
    name: string;
  };
  settlement: {
    id: string;
    status: string;
    title: string;
  } | null;
  amount: number;
  date: string;
  expense_allocations: {
    amount: number;
    expense: {
      id: string;
      title: string;
    };
  }[];
};

export type GroupInvitation = {
  id: string;
  group_id: string;
  group_name: string;
  group_slug: string;
  invited_by_name: string;
  invited_by_id: string;
  email: string;
  token: string;
  created_at: string;
};

export type NewGroup = {
  title: string;
  memberEmails: string[];
};
