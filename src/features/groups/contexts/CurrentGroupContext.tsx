"use client";

import { Group } from "@/features/groups/types/group";
import React, { createContext, useContext } from "react";

const CurrentGroupContext = createContext<Group | null>(null);

export const useCurrentGroup = (): Group => {
  const group = useContext(CurrentGroupContext);

  if (!group) {
    throw new Error(
      "useCurrentGroup must be used within CurrentGroupProvider with a valid group"
    );
  }

  return group;
};

export const CurrentGroupProvider = ({
  group,
  children,
}: {
  group: Group;
  children: React.ReactNode;
}) => {
  return (
    <CurrentGroupContext.Provider value={group}>
      {children}
    </CurrentGroupContext.Provider>
  );
};
