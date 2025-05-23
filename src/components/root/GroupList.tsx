"use client";

import GroupCard from "./GroupCard";
import { useUserGroups } from "@/context/UserGroupsContext";

const GroupList = () => {
  const { groups } = useUserGroups();
  return (
    <div className="flex w-full flex-col gap-4">
      {groups?.map((group) => (
        <GroupCard
          key={group.id}
          $id={group.id}
          name={group.name}
          slug={group.slug}
          members={group.members}
        />
      ))}
    </div>
  );
};

export default GroupList;
