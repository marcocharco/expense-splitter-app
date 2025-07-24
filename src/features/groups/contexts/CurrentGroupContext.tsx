"use client";

import { Group } from "@/types";
import React, { createContext, useContext } from "react";

const CurrentGroupContext = createContext<Group | null>(null);

export const useCurrentGroup = () => useContext(CurrentGroupContext);

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
