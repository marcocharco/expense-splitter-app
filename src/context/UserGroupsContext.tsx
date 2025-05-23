"use client";

import { createContext, useContext, useState } from "react";
import { Group } from "@/types";

type userGroupsContextType = {
  groups: Group[];
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
};

const UserGroupsContext = createContext<userGroupsContextType | null>(null);

export const useUserGroups = () => {
  const context = useContext(UserGroupsContext);
  if (!context) throw new Error("must be used within UserGroupsProvider");
  return context;
};

export const UserGroupsProvider = ({
  initialGroups,
  children,
}: {
  initialGroups: Group[];
  children: React.ReactNode;
}) => {
  const [groups, setGroups] = useState<Group[]>(initialGroups);

  return (
    <UserGroupsContext.Provider value={{ groups, setGroups }}>
      {children}
    </UserGroupsContext.Provider>
  );
};
