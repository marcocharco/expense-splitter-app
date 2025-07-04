"use client";

import { User } from "@/types";
import { useContext, createContext, useState } from "react";

type userContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const UserContext = createContext<userContextType | null>(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within an UserProvider");
  }
  return context;
};

export const UserProvider = ({
  initialUser,
  children,
}: {
  initialUser: User | null;
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(initialUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
