declare interface GroupCardProps {
  $id: string;
  name: string;
  // members: Member[];
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
};
