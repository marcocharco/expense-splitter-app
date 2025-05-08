declare interface GroupCardProps {
  $id: string;
  name: string;
  members: Member[];
}

declare type Member = {
  id: string;
  name: string;
};

declare interface SidebarProps {
  user: User;
}

declare type User = {
  $id: string;
  name: string;
};
