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
  weight: number;
  initial_owing: number;
  remaining_owing: number;
};

export type Expense = {
  id: string;
  title: string;
  amount: number;
  paid_by: { id: string; name: string };
  date: string;
  category: { id: string; name: string; icon: string } | null;
  settlement?: { id: string; status: string };
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
  category?: string;
  memberSplits: { userId: string; weight: number }[];
};

export type Settlement = {
  id: string;
  title: string;
  created_by: {
    id: string;
    name: string;
  };
  status: "open" | "closed";
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
