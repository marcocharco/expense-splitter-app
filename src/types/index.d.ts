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
};

export type Group = {
  id: string;
  name: string;
  slug: string;
  group_member: Member[];
  created_at?: string;
};

export type Expense = {
  id: string;
  title: string;
  amount: number;
  paid_by: { id: string; name: string };
  date: string;
  category_id: { name: string };
  settlement_id: string;
  status: string;
};
