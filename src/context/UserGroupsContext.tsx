"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

import { getUserGroups } from "@/lib/queries/getUserGroups";
import { Group } from "@/types";

const UserGroupsContext = createContext<Group[] | null>(null);

export const useUserGroups = () => useContext(UserGroupsContext);

export const UserGroupsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [groups, setGroups] = useState<Group[] | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      const data = await getUserGroups();

      if (data) {
        setGroups(data.map((d) => d));
      }
    };

    fetchGroups();
  }, []);

  return (
    <UserGroupsContext.Provider value={groups}>
      {children}
    </UserGroupsContext.Provider>
  );
};
