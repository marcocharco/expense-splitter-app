"use client";
import { useUserGroups } from "@/context/UserGroupsContext";
import { CurrentGroupProvider } from "@/context/CurrentGroupContext";
import { useParams } from "next/navigation";

export default function GroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const params = useParams();
  const groups = useUserGroups();
  const groupFromContext = groups?.find((g) => g.slug === params.slug);

  if (!groups) return;

  //   const group = groupFromContext || getGroupBySlug(params.id as string);
  const group = groupFromContext;

  if (!group) return <div>Group not found</div>;

  return <CurrentGroupProvider group={group}>{children}</CurrentGroupProvider>;
}
