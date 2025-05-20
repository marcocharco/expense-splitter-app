"use client";

import { getUserProfile } from "@/lib/queries/getUserProfile";
import { User } from "@/types";
import { useContext, createContext, useEffect, useState } from "react";

const UserContext = createContext<User | null>(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getUserProfile().then(setUser);
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
