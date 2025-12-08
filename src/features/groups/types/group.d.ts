import { Member } from "@/features/users/types/user";

export type Group = {
  id: string;
  name: string;
  slug: string;
  members: Member[];
  created_at?: string;
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

