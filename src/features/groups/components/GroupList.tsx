"use client";

import GroupCard from "@/features/groups/components/GroupCard";
import { useUserGroups } from "@/features/groups/hooks/useUserGroups";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const GroupList = () => {
  const { groups } = useUserGroups();
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Your Groups</h2>
        <Link href="/new-group">
          <Button variant={"outline"}>New Group</Button>
        </Link>
      </div>

      {groups?.map((group) => (
        <GroupCard key={group.id} type="group" group={group} />
      ))}
    </div>
  );
};

export default GroupList;
