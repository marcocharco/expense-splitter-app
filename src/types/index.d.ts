declare interface GroupCardProps {
  $id: string;
  name: string;
  slug: string;
  members: Member[];
}

declare interface SidebarProps {
  user: User;
}

declare interface SignUpParams {
  name?: string;
  email: string;
  password: string;
}

declare interface GroupsPageProps {
  groups: Group[];
}

declare type Member = {
  id: string;
  name: string;
};

declare type User = {
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
