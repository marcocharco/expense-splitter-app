"use client";

import React from "react";
import { useUser } from "@/context/UserContext";

const Header = () => {
  const { user } = useUser();
  return (
    <h1>
      Welcome
      {user?.name && (
        <>
          ,&nbsp;<span className="text-main">{user?.name}</span>
        </>
      )}
    </h1>
  );
};

export default Header;
