"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserProfile } from "../queries/getUserProfile";

export function useUser() {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
  });

  const setUser = (newUser: typeof user) => {
    queryClient.setQueryData(["userProfile"], newUser);
  };

  return {
    user,
    isLoading,
    isError,
    setUser,
  };
}
